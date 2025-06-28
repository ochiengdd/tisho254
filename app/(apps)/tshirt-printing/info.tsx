"use client";

import { AppInfoTemplate } from "@/components/(apps)/dashboard/app-info-template";

export default function TshirtPrintingInfo() {
  return (
    <AppInfoTemplate
      heroImage="https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=2680&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
      heroTitle="AI-Powered T-shirt Printing Service"
      heroDescription="Create custom t-shirts with AI-generated designs. Simply describe what you want, and we'll print it on high-quality t-shirts delivered to your door."
      features={[
        {
          icon: "🎨",
          title: "AI Design Generation",
          description:
            "Generate unique t-shirt designs using AI. Just describe what you want and watch your idea come to life.",
          hours: "25+ hours",
        },
        {
          icon: "👕",
          title: "Custom T-shirt Printing",
          description:
            "High-quality printing on premium materials with multiple color and size options.",
          hours: "15+ hours",
        },
        {
          icon: "🚚",
          title: "Fast Delivery",
          description:
            "Quick turnaround times with reliable shipping to your doorstep.",
          hours: "10+ hours",
        },
      ]}
    />
  );
} 