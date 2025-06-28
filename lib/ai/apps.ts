export interface App {
  href: string;
  title: string;
  shortTitle: string;
  shortDesc: string;
  tags: string[];
  features: string[];
  useCases: string[];
  techStack: string[];
  image: string;
  simpleFeatures: string[];
}

export const apps = [
  {
    href: "/apps/image-ai",
    title: "Multi-Model AI Image Generator",
    shortTitle: "Image AI",
    shortDesc: "Generate high-quality images using various AI models",
    tags: ["Replicate", "SDXL", "Flux", "Recraft V3", "Multi-Model"],
    image:
      "https://images.unsplash.com/photo-1554147090-e1221a04a025?q=80&w=2648&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    description:
      "Generate high-quality images using various state-of-the-art models through Replicate and the Vercel AI SDK. Choose from models like SDXL, Flux, Recraft V3, and more for perfect results.",
    features: [
      "Multiple AI model support (SDXL, Flux, Recraft V3, and more)",
      "High-quality image generation",
      "Customizable prompts and parameters",
      "Real-time generation with progress tracking",
      "Image history and management",
      "User authentication and credit system",
    ],
    useCases: [
      "Creative content generation",
      "Marketing materials",
      "Social media content",
      "Product visualization",
      "Art and design projects",
      "Prototype and concept visualization",
    ],
    techStack: [
      "Next.js 14",
      "React",
      "TypeScript",
      "Supabase",
      "Tailwind CSS",
      "shadcn/ui",
      "Vercel AI SDK",
      "Replicate",
      "Cloudflare R2 Storage",
    ],
    simpleFeatures: [
      "Generate images using multiple AI models",
      "Choose from SDXL, Flux, Recraft V3, and more",
      "Save and manage your generated images",
      "Customize prompts for perfect results",
    ],
  },
];
