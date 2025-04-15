/**
 * Chat API Route Handler
 * This file manages the chat functionality, including message processing, document creation,
 * web information retrieval, and credit system management.
 *
 * Main Features:
 * 1. Process chat messages between user and AI
 * 2. Create and update documents based on chat interactions
 * 3. Browse the internet for information
 * 4. Save chat history and manage chat sessions
 * 5. Credit System Management:
 *    - Track and manage user credits
 *    - Handle premium vs free model access
 *    - Control access to premium features
 *    - Automatic credit deduction
 *
 * Credit System Flow:
 * 1. Check user's available credits
 * 2. Validate feature access based on credits
 * 3. Calculate costs for:
 *    - Premium AI models
 *    - Web browsing feature
 * 4. Deduct credits for premium usage
 * 5. Return credit status in response
 *
 * Available Endpoints:
 * - POST /api/chat: Process new messages, generate AI responses, handle credits
 * - DELETE /api/chat?id={chatId}: Delete an entire chat session
 */

import {
  convertToCoreMessages,
  CoreMessage,
  Message,
  createDataStreamResponse,
  streamText,
  CoreUserMessage,
  generateText,
  StepResult,
} from "ai";
import { createClient } from "@/lib/utils/supabase/server";
import { getChatById } from "@/lib/db/cached-queries";
import {
  saveChat,
  saveMessages,
  deleteChatById,
  reduceUserCredits,
} from "@/lib/db/mutations";
import { MessageRole } from "@/lib/types/supabase";
import {
  generateUUID,
  getMostRecentUserMessage,
  sanitizeResponseMessages,
} from "@/lib/ai/chat";
import { createSystemPrompt } from "@/app/(apps)/chat/prompt";
import { createTools, allTools, ToolsReturn } from "@/app/(apps)/chat/tools/";
import { customModel } from "@/lib/ai/ai-utils";
import { getUserCreditsQuery } from "@/lib/db/queries/general";
import {
  canUseConfiguration,
  FREE_MODELS,
} from "@/app/(apps)/chat/usage-limits";
import { AIModel } from "@/lib/ai/models";

/**
 * Configuration Settings
 * - maxDuration: Maximum time (in seconds) allowed for API response
 * - customMiddleware: Custom settings for the AI model behavior
 */
export const maxDuration = 60;

/**
 * Generates a title for a new chat based on the user's first message
 * @param message - The first message from the user
 * @returns A generated title (max 80 characters)
 */
async function generateTitleFromUserMessage({
  message,
  modelId = "gpt-4o-mini",
}: {
  message: CoreUserMessage;
  modelId?: string;
}) {
  console.log("Generating title using model:", modelId);
  const { text: title } = await generateText({
    model: customModel(modelId),
    system: `\n
    - you will generate a short title based on the first message a user begins a conversation with
    - ensure it is not more than 80 characters long
    - the title should be a summary of the user's message
    - do not use quotes or colons`,
    prompt: JSON.stringify(message),
  });

  return title;
}

/**
 * Gets the current authenticated user
 * @throws Error if user is not authenticated
 */
async function getUser() {
  const supabase = createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    throw new Error("Unauthorized");
  }

  return user;
}

/**
 * Formats message content for database storage based on message type
 * Handles different message formats:
 * - User messages: Stored as plain text
 * - Tool messages: Stored as formatted tool results
 * - Assistant messages: Stored as text and tool calls
 */
function formatMessageContent(message: CoreMessage): string {
  // For user messages, store as plain text
  if (message.role === "user") {
    return typeof message.content === "string"
      ? message.content
      : JSON.stringify(message.content);
  }

  // For tool messages, format as array of tool results
  if (message.role === "tool") {
    return JSON.stringify(
      message.content.map((content) => ({
        type: content.type || "tool-result",
        toolCallId: content.toolCallId,
        toolName: content.toolName,
        result: content.result,
      }))
    );
  }

  // For assistant messages, format as array of text and tool calls
  if (message.role === "assistant") {
    if (typeof message.content === "string") {
      return JSON.stringify([{ type: "text", text: message.content }]);
    }

    return JSON.stringify(
      message.content.map((content: any) => {
        // Handle text content type
        if (content.type === "text" && typeof content.text === "string") {
          return {
            type: "text",
            text: content.text,
          };
        }

        // Handle tool_call content with explicit type checking
        if (typeof content.type === "string" && content.type.includes("tool")) {
          // Create a basic structure that doesn't depend on specific property names
          const toolCall = {
            type: "tool-call",
            toolCallId: undefined as string | undefined,
            toolName: "" as string,
            args: {} as Record<string, any>,
          };

          // Try to fill in the values from various possible structures
          if (typeof content.id === "string") toolCall.toolCallId = content.id;
          else if (typeof content.toolCallId === "string")
            toolCall.toolCallId = content.toolCallId;

          if (typeof content.name === "string")
            toolCall.toolName = content.name;
          else if (typeof content.toolName === "string")
            toolCall.toolName = content.toolName;

          if (typeof content.input === "object" && content.input !== null)
            toolCall.args = content.input;
          else if (typeof content.args === "object" && content.args !== null)
            toolCall.args = content.args;

          return toolCall;
        }

        // Default fallback for any other content type
        return {
          type: typeof content.type === "string" ? content.type : "unknown",
          content: JSON.stringify(content),
        };
      })
    );
  }

  return "";
}

/**
 * Main POST Handler
 * Processes incoming chat messages and generates AI responses
 *
 * Flow:
 * 1. Validates user authentication
 * 2. Creates or retrieves chat session
 * 3. Checks credit balance and feature access
 * 4. Processes message with AI
 * 5. Handles tool interactions (documents, internet)
 * 6. Manages credit deductions for premium features
 * 7. Saves chat history
 *
 * Credit Headers:
 * Returns 'x-credit-usage' with:
 * - cost: Credits used
 * - remaining: Available balance
 * - features: Premium features accessed
 *
 * @param request Contains chat ID, messages, and feature settings
 */
export async function POST(request: Request) {
  const {
    id,
    messages,
    selectedModelId,
    isBrowseEnabled,
  }: {
    id: string;
    messages: Array<Message>;
    selectedModelId?: string;
    isBrowseEnabled: boolean;
  } = await request.json();

  console.log("Chat route params:", {
    id,
    selectedModelId,
    isBrowseEnabled,
    messageCount: messages.length,
  });

  const user = await getUser();

  if (!user?.email) {
    return new Response("Unauthorized", { status: 401 });
  }

  // Get the most recent user message for title generation
  const coreMessages = convertToCoreMessages(messages);
  const userMessage = getMostRecentUserMessage(coreMessages);

  if (!userMessage || userMessage.role !== "user") {
    return new Response("No user message found", { status: 400 });
  }

  const supabase = createClient();
  const credits = await getUserCreditsQuery(supabase, user.id);
  // Declare streamingData early, before the try block
  // const streamingData = new StreamData(); // Deprecated

  // Initial chat title logic (outside the main streaming response)
  let initialChatTitle = "New Chat";
  let isNewChat = false;

  try {
    // Chat title generation logic
    const chat = await getChatById(id);

    if (!chat) {
      const title = await generateTitleFromUserMessage({
        message: userMessage as CoreUserMessage,
        modelId: selectedModelId,
      });
      await saveChat({ id, userId: user.id, title });
      // Append chatReady signal AFTER saving the chat
      // streamingData.append({ chatReady: true }); // Moved to createDataStreamResponse
      initialChatTitle = title;
      isNewChat = true;
    } else if (chat.user_id !== user.id) {
      return new Response("Unauthorized", { status: 401 });
    } else if (chat.title === "New Chat") {
      // Update the title if it's still the default
      const title = await generateTitleFromUserMessage({
        message: userMessage as CoreUserMessage,
        modelId: selectedModelId,
      });
      await supabase
        .from("chats")
        .update({ title })
        .eq("id", id)
        .eq("user_id", user.id);
    }

    // Save the initial user message immediately
    await saveMessages({
      chatId: id,
      messages: [
        {
          id: generateUUID(),
          chat_id: id,
          role: userMessage.role as MessageRole,
          content: formatMessageContent(userMessage),
          created_at: new Date().toISOString(),
        },
      ],
    });

    const modelToUse = selectedModelId || "gpt-4o-mini";

    // Filter tools based on isBrowseEnabled
    const activeTools = isBrowseEnabled
      ? allTools
      : allTools.filter((tool) => tool !== "browseInternet");

    console.log("Active tools:", activeTools);

    // Credit check and usage
    const usageCheck = canUseConfiguration(credits, {
      modelId: selectedModelId as AIModel,
      isBrowseEnabled,
    });

    if (!usageCheck.canUse) {
      return new Response(
        JSON.stringify({
          error: "Insufficient credits",
          message: usageCheck.reason,
        }),
        { status: 402, headers: { "Content-Type": "application/json" } }
      );
    }

    // Calculate headers before creating the response stream
    const headers: Record<string, string> = {};
    if (usageCheck.requiredCredits > 0) {
      try {
        await reduceUserCredits(user.email!, usageCheck.requiredCredits);
        const updatedCredits = await getUserCreditsQuery(supabase, user.id);
        const creditUsageData = {
          cost: usageCheck.requiredCredits,
          remaining: updatedCredits,
          features: [
            !FREE_MODELS.includes(selectedModelId as any)
              ? "Premium Model"
              : null,
            isBrowseEnabled ? "Web Browsing" : null,
          ].filter(Boolean),
        };
        headers["x-credit-usage"] = JSON.stringify(creditUsageData);
      } catch (creditError) {
        console.error(
          "Failed to reduce credits or fetch updated count:",
          creditError
        );
        headers["x-credit-error"] = "Failed to process credits";
      }
    }

    // --- Start createDataStreamResponse ---
    return createDataStreamResponse({
      async execute(dataStream) {
        // Write initial chat state if it's a new chat
        if (isNewChat) {
          dataStream.writeData({ chatReady: true });
        }

        // Handle response (works for both premium and free features)
        const resultPromise = streamText({
          model: customModel(modelToUse),
          system: createSystemPrompt(isBrowseEnabled),
          messages: coreMessages,
          maxSteps: 5,
          experimental_toolCallStreaming: true,
          experimental_activeTools: activeTools,
          tools: createTools(dataStream, user.id, modelToUse, isBrowseEnabled), // Pass dataStream
          experimental_telemetry: {
            isEnabled: true,
            functionId: "stream-text",
          },
        });

        // Use the SDK's helper to merge the main stream with the data stream
        resultPromise.mergeIntoDataStream(dataStream);

        // Await the completion of the streamText operation to access final results
        const finalResult = await resultPromise;

        // --- Logic moved from onFinish ---
        if (user && user.id && finalResult) {
          try {
            // Get messages from the response
            // Access steps from the resolved finalResult, awaiting the steps promise
            const resolvedSteps = await finalResult.steps;
            const responseMessages = resolvedSteps.flatMap(
              (step: StepResult<ToolsReturn>) => step.response?.messages || [] // Use StepResult type
            );

            const responseMessagesWithoutIncompleteToolCalls =
              sanitizeResponseMessages(responseMessages);

            // --- DE-DUPLICATION START ---
            const uniqueMessagesMap = new Map<string, any>();
            responseMessagesWithoutIncompleteToolCalls.forEach((message) => {
              // Format content first to create a reliable unique key
              const formattedContent = formatMessageContent(message);
              const uniqueKey = `${message.role}-${JSON.stringify(
                formattedContent
              )}`;

              if (!uniqueMessagesMap.has(uniqueKey)) {
                // Generate ID only for unique messages before adding to map
                const messageId = generateUUID();
                uniqueMessagesMap.set(uniqueKey, {
                  id: messageId, // Use the generated ID
                  chat_id: id,
                  role: message.role as MessageRole,
                  content: formattedContent, // Use the pre-formatted content
                  created_at: new Date().toISOString(),
                });
              }
            });

            // Extract the unique message objects from the map
            const finalMessagesToSave = Array.from(uniqueMessagesMap.values());

            // Update annotation logic to correctly associate annotations with the final unique messages
            finalMessagesToSave.forEach((msg) => {
              if (msg.role === "assistant") {
                dataStream.writeMessageAnnotation({
                  messageIdFromServer: msg.id, // Use the ID from the unique message object
                });
              }
            });
            // --- DE-DUPLICATION END ---

            // Save only the unique messages
            await saveMessages({
              chatId: id,
              messages: finalMessagesToSave,
            });
          } catch (error) {
            console.error("Failed to save chat:", error);
            // Optionally write an error annotation to the stream
            dataStream.writeMessageAnnotation({
              type: "error",
              message: "Failed to save chat history.",
            });
          }
        }
        // --- End logic moved from onFinish ---
      },
      headers: headers,
      onError: (error) => {
        console.error("Error during data stream generation:", error);
        // Return a generic error message or customize based on the error
        return `An error occurred: ${
          error instanceof Error ? error.message : "Unknown stream error"
        }`;
      },
    });
    // --- End createDataStreamResponse ---
  } catch (error) {
    console.error("Error in chat route:", error);
    // This catch block might need adjustment as the main logic is now within createDataStreamResponse
    // For now, let's keep the existing fallback for 'Chat ID already exists'
    if (error instanceof Error && error.message === "Chat ID already exists") {
      // This case should be less likely now with the check moved up, but keep as fallback
      console.warn(
        "Caught 'Chat ID already exists' outside main stream logic - check flow."
      );
      return new Response("Conflict: Chat ID potentially already exists", {
        status: 409,
      });
    } else {
      // For other errors caught *before* createDataStreamResponse
      return new Response("Internal Server Error", { status: 500 });
    }
  }
}

/**
 * DELETE Handler
 * Removes an entire chat session and its messages
 *
 * Security:
 * - Verifies user ownership of chat
 * - Only allows deletion of user's own chats
 *
 * @param request Contains chat ID to delete
 */
export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return new Response("Not Found", { status: 404 });
  }

  const user = await getUser();

  try {
    const chat = await getChatById(id);

    if (!chat) {
      return new Response("Chat not found", { status: 404 });
    }

    if (chat.user_id !== user.id) {
      return new Response("Unauthorized", { status: 401 });
    }

    await deleteChatById(id, user.id);

    return new Response("Chat deleted", { status: 200 });
  } catch (error) {
    console.error("Error deleting chat:", error);
    return new Response("An error occurred while processing your request", {
      status: 500,
    });
  }
}
