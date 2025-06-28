"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Sparkles, Loader2 } from "lucide-react";

interface PromptInputProps {
  onSubmit: (prompt: string) => void;
  isLoading: boolean;
}

const SUGGESTIONS = [
  "Lion in sunglasses wearing a crown",
  "Space cat riding a rocket",
  "Vintage robot playing guitar",
  "Dragon with rainbow wings",
  "Cyberpunk samurai warrior",
  "Steampunk owl with gears",
  "Neon jellyfish in deep sea",
  "Retro gaming controller art",
  "Abstract geometric patterns",
  "Minimalist mountain landscape",
];

export function PromptInput({ onSubmit, isLoading }: PromptInputProps) {
  const [prompt, setPrompt] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim() && !isLoading) {
      onSubmit(prompt.trim());
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setPrompt(suggestion);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="prompt" className="block text-sm font-medium text-gray-700 mb-2">
                Describe your t-shirt design
              </label>
              <Textarea
                id="prompt"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="e.g., A majestic lion wearing sunglasses and a crown, digital art style"
                className="min-h-[120px] resize-none"
                disabled={isLoading}
              />
              <p className="text-sm text-gray-500 mt-2">
                Be specific about the style, colors, and details you want in your design.
              </p>
            </div>

            <Button
              type="submit"
              disabled={!prompt.trim() || isLoading}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating Design...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Generate T-shirt Design
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Design Suggestions */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Popular Design Ideas</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {SUGGESTIONS.map((suggestion, index) => (
            <Button
              key={index}
              variant="outline"
              onClick={() => handleSuggestionClick(suggestion)}
              className="text-left h-auto p-3 text-sm"
              disabled={isLoading}
            >
              {suggestion}
            </Button>
          ))}
        </div>
      </div>

      {/* Tips */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-4">
          <h4 className="font-semibold text-blue-900 mb-2">💡 Design Tips</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Be specific about the art style (e.g., "digital art", "watercolor", "minimalist")</li>
            <li>• Mention colors you want to include</li>
            <li>• Describe the mood or feeling you want to convey</li>
            <li>• Consider the t-shirt background when describing your design</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
} 