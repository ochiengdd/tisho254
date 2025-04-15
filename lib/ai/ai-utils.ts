import { wrapLanguageModel } from "ai";
import { openai } from "@ai-sdk/openai";
import { anthropic } from "@ai-sdk/anthropic";
import { groq } from "@ai-sdk/groq";
import { xai } from "@ai-sdk/xai";
import { deepseek } from "@ai-sdk/deepseek";
import { google } from "@ai-sdk/google";
import { LanguageModelV1Middleware } from "ai";

export const customMiddleware: LanguageModelV1Middleware = {};

type ModelProvider =
  | "openai"
  | "anthropic"
  | "groq"
  | "xai"
  | "deepseek"
  | "google"
  | "perplexity";

// Helper to determine provider from model ID
function getProviderFromModelId(modelId: string): ModelProvider {
  if (modelId.startsWith("gpt")) return "openai";
  if (modelId.startsWith("claude")) return "anthropic";
  if (
    modelId.startsWith("llama") ||
    modelId.startsWith("meta-llama") ||
    modelId.startsWith("gemma")
  )
    return "groq";
  if (modelId.startsWith("grok")) return "xai";
  if (modelId.startsWith("deepseek")) return "deepseek";
  if (modelId.startsWith("gemini")) return "google";
  return "openai"; // fallback
}

/**
 * Get model instance based on provider and model name
 */
function getModelInstance(
  provider: ModelProvider,
  modelName: string,
  options: any = {}
) {
  switch (provider) {
    case "openai":
      return openai(modelName);
    case "anthropic":
      return anthropic(modelName);
    case "groq":
      return groq(modelName);
    case "xai":
      return xai(modelName);
    case "deepseek":
      return deepseek(modelName);
    case "google":
      return google(modelName, {
        useSearchGrounding: options.useSearchGrounding,
        dynamicRetrievalConfig: options.dynamicRetrievalConfig,
      });
    default:
      throw new Error(`Unsupported provider: ${provider}`);
  }
}

/**
 * Creates a customized AI model instance with specific settings
 */
export function customModel(modelId: string, options?: any) {
  const provider = getProviderFromModelId(modelId);
  console.log(
    `Creating model instance for ${modelId} using ${provider} provider`,
    options
  );

  // Get provider-specific options
  const providerOptions = options?.[provider] || {};

  const modelInstance = getModelInstance(
    provider,
    modelId,
    providerOptions
  ) as any;

  // Only wrap the model if there's actual middleware defined
  if (Object.keys(customMiddleware).length > 0) {
    console.log(`Wrapping model ${modelId} with custom middleware.`);
    return wrapLanguageModel({
      model: modelInstance,
      middleware: customMiddleware,
    });
  }

  console.log(`Returning raw model instance for ${modelId} (no middleware).`);
  return modelInstance;
}
