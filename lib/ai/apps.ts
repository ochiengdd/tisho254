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
    href: "/apps/tshirt-printing",
    title: "AI-Powered T-shirt Printing Service",
    shortTitle: "T-shirt Printing",
    shortDesc: "Create custom t-shirts with AI-generated designs",
    tags: ["AI Design", "Custom Printing", "E-commerce", "Multi-Model"],
    image:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=2680&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    description:
      "Create custom t-shirts with AI-generated designs. Simply describe what you want, and we'll print it on high-quality t-shirts delivered to your door.",
    features: [
      "AI-powered design generation",
      "Custom t-shirt printing",
      "Multiple color and size options",
      "Bulk order discounts",
      "Fast delivery service",
      "Quality materials",
    ],
    useCases: [
      "Personal custom t-shirts",
      "Event merchandise",
      "Business branding",
      "Gift items",
      "Fashion statements",
    ],
    techStack: [
      "Next.js",
      "TypeScript",
      "Tailwind CSS",
      "Supabase",
      "Replicate AI",
      "Stripe Payments",
    ],
    simpleFeatures: [
      "AI Design Generation",
      "Custom T-shirt Printing",
      "Fast Delivery",
    ],
  },
  {
    href: "/apps/image-ai",
    title: "Multi-Model AI Image Generator",
    shortTitle: "Image AI",
    shortDesc: "Generate high-quality images using various AI models",
    tags: ["Replicate", "SDXL", "Flux", "Recraft V3", "Multi-Model"],
    image:
      "https://images.unsplash.com/photo-1554147090-e1221a04a025?q=80&w=2648&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    description:
      "Generate high-quality images using various state-of-the-art models including SDXL, Flux, and Recraft V3. Create stunning visuals for any purpose.",
    features: [
      "Multiple AI models (SDXL, Flux, Recraft V3)",
      "High-quality image generation",
      "Custom prompt engineering",
      "Image history and management",
      "Batch generation",
      "Export in multiple formats",
    ],
    useCases: [
      "Digital art creation",
      "Marketing materials",
      "Social media content",
      "Product mockups",
      "Creative projects",
    ],
    techStack: [
      "Next.js",
      "TypeScript",
      "Tailwind CSS",
      "Supabase",
      "Replicate API",
      "Cloudflare Images",
    ],
    simpleFeatures: [
      "Multi-Model Generation",
      "High-Quality Output",
      "Easy Export",
    ],
  },
];
