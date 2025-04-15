// Define constants for provider logos
const LOGO_OPENAI = "/providers/openai.webp";
const LOGO_ANTHROPIC = "/providers/anthropic.jpeg";
const LOGO_META = "/providers/meta.jpeg";
const LOGO_GOOGLE = "/providers/google.svg";
const LOGO_XAI = "/providers/xai.png";
const LOGO_DEEPSEEK = "/providers/deepseek.png";

// Define the model interface with all possible properties
interface ModelInfo {
  name: string;
  logo: string;
  vision?: boolean;
  searchGrounding?: boolean;
  citations?: boolean;
}

// Define the model display object with proper typing
export const AI_MODEL_DISPLAY: Record<string, ModelInfo> = {
  "gpt-4.1": {
    name: "GPT-4.1",
    logo: LOGO_OPENAI,
    vision: true,
  },
  "gpt-4.1-mini": {
    name: "GPT-4.1 mini",
    logo: LOGO_OPENAI,
    vision: true,
  },
  "gpt-4.1-nano": {
    name: "GPT-4.1 nano",
    logo: LOGO_OPENAI,
    vision: true,
  },
  "gpt-4o-mini": {
    name: "GPT-4o mini",
    logo: LOGO_OPENAI,
    vision: true,
  },
  "gpt-4o": {
    name: "GPT-4o",
    logo: LOGO_OPENAI,
    vision: true,
  },
  "claude-3-7-sonnet-latest": {
    name: "Claude 3.7 Sonnet",
    logo: LOGO_ANTHROPIC,
    vision: true,
  },
  "claude-3-5-haiku-latest": {
    name: "Claude 3.5 Haiku",
    logo: LOGO_ANTHROPIC,
    vision: false,
  },
  "claude-3-5-sonnet-20241022": {
    name: "Claude 3.5 Sonnet",
    logo: LOGO_ANTHROPIC,
    vision: true,
  },
  "meta-llama/llama-4-scout-17b-16e-instruct": {
    name: "Llama 4 Scout",
    logo: LOGO_META,
    vision: true,
  },
  "llama-3.3-70b-versatile": {
    name: "Llama 3.3 70B",
    logo: LOGO_META,
    vision: false,
  },
  "gemini-2.5-pro-exp-03-25": {
    name: "Gemini 2.5 Pro",
    logo: LOGO_GOOGLE,
    vision: true,
    searchGrounding: true,
  },
  "gemini-2.0-flash-001": {
    name: "Gemini 2.0 Flash",
    logo: LOGO_GOOGLE,
    vision: true,
    searchGrounding: true,
  },
  "grok-3-fast-beta": {
    name: "Grok 3",
    logo: LOGO_XAI,
    vision: false,
  },
  "grok-3-mini-fast-beta": {
    name: "Grok 3 Mini",
    logo: LOGO_XAI,
    vision: false,
  },
  "deepseek-chat": {
    name: "DeepSeek Chat",
    logo: LOGO_DEEPSEEK,
    vision: false,
  },
} as const;

// Get model IDs from the display object
export const AI_MODELS = Object.keys(AI_MODEL_DISPLAY) as Array<
  keyof typeof AI_MODEL_DISPLAY
>;

// Type for model IDs
export type AIModel = keyof typeof AI_MODEL_DISPLAY;

// Type for model display info
export type AIModelDisplayInfo = ModelInfo & {
  id: AIModel;
};

// List of models with their display info
export const availableModels: AIModelDisplayInfo[] = AI_MODELS.map((model) => ({
  id: model as AIModel,
  ...AI_MODEL_DISPLAY[model],
}));
