"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

interface TshirtMockupProps {
  imageUrl: string;
  color: string;
  onColorChange: (color: string) => void;
}

const TSHIRT_COLORS = [
  { name: "White", value: "white", bg: "bg-white", border: "border-gray-300" },
  { name: "Black", value: "black", bg: "bg-gray-900", border: "border-gray-700" },
  { name: "Navy", value: "navy", bg: "bg-blue-900", border: "border-blue-700" },
  { name: "Gray", value: "gray", bg: "bg-gray-500", border: "border-gray-400" },
  { name: "Red", value: "red", bg: "bg-red-600", border: "border-red-500" },
  { name: "Green", value: "green", bg: "bg-green-600", border: "border-green-500" },
];

export function TshirtMockup({ imageUrl, color, onColorChange }: TshirtMockupProps) {
  const [selectedSize, setSelectedSize] = useState("M");

  const sizes = ["XS", "S", "M", "L", "XL", "XXL"];

  return (
    <div className="space-y-6">
      {/* T-shirt Mockup */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* T-shirt Display */}
            <div className="flex-1">
              <h3 className="text-lg font-semibold mb-4">Your Design Preview</h3>
              <div className="relative w-full max-w-md mx-auto">
                {/* T-shirt Shape */}
                <div className="relative">
                  {/* T-shirt outline */}
                  <svg
                    viewBox="0 0 300 400"
                    className="w-full h-auto"
                    style={{
                      filter: color === "black" ? "drop-shadow(0 4px 8px rgba(0,0,0,0.3))" : "drop-shadow(0 4px 8px rgba(0,0,0,0.1))"
                    }}
                  >
                    {/* T-shirt body */}
                    <path
                      d="M50 100 L50 350 L250 350 L250 100 L200 80 L150 60 L100 80 Z"
                      fill={color}
                      stroke={color === "white" ? "#d1d5db" : "#374151"}
                      strokeWidth="2"
                    />
                    {/* Sleeves */}
                    <path
                      d="M50 100 L30 120 L30 180 L50 160 Z"
                      fill={color}
                      stroke={color === "white" ? "#d1d5db" : "#374151"}
                      strokeWidth="2"
                    />
                    <path
                      d="M250 100 L270 120 L270 180 L250 160 Z"
                      fill={color}
                      stroke={color === "white" ? "#d1d5db" : "#374151"}
                      strokeWidth="2"
                    />
                    {/* Neck */}
                    <ellipse
                      cx="150"
                      cy="90"
                      rx="25"
                      ry="15"
                      fill={color}
                      stroke={color === "white" ? "#d1d5db" : "#374151"}
                      strokeWidth="2"
                    />
                  </svg>
                  
                  {/* Generated Image Overlay */}
                  {imageUrl && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-32 h-32 rounded-lg overflow-hidden border-2 border-gray-300">
                        <img
                          src={imageUrl}
                          alt="Generated design"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Color and Size Selection */}
            <div className="flex-1 space-y-6">
              {/* Color Selection */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Choose T-shirt Color</h3>
                <div className="grid grid-cols-3 gap-3">
                  {TSHIRT_COLORS.map((tshirtColor) => (
                    <Button
                      key={tshirtColor.value}
                      variant="outline"
                      onClick={() => onColorChange(tshirtColor.value)}
                      className={`h-16 relative ${
                        color === tshirtColor.value
                          ? "ring-2 ring-blue-500 ring-offset-2"
                          : ""
                      }`}
                    >
                      <div
                        className={`w-full h-full rounded ${tshirtColor.bg} ${tshirtColor.border} border-2`}
                      />
                      {color === tshirtColor.value && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Check className="h-6 w-6 text-white drop-shadow-lg" />
                        </div>
                      )}
                      <span className="absolute bottom-1 left-1 text-xs font-medium text-gray-700">
                        {tshirtColor.name}
                      </span>
                    </Button>
                  ))}
                </div>
              </div>

              {/* Size Selection */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Choose Size</h3>
                <div className="grid grid-cols-6 gap-2">
                  {sizes.map((size) => (
                    <Button
                      key={size}
                      variant={selectedSize === size ? "default" : "outline"}
                      onClick={() => setSelectedSize(size)}
                      className="h-12"
                    >
                      {size}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Size Guide */}
              <Card className="bg-gray-50">
                <CardContent className="p-4">
                  <h4 className="font-semibold mb-2">Size Guide</h4>
                  <div className="text-sm text-gray-600 space-y-1">
                    <div>XS: 32-34" chest</div>
                    <div>S: 34-36" chest</div>
                    <div>M: 38-40" chest</div>
                    <div>L: 42-44" chest</div>
                    <div>XL: 46-48" chest</div>
                    <div>XXL: 50-52" chest</div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 