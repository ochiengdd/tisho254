"use client";

import { useState } from "react";
import { PromptInput } from "./prompt-input";
import { TshirtMockup } from "./tshirt-mockup";
import { CheckoutForm } from "./checkout-form";
import { FinalStep } from "./final-step";
import { useImageGeneration } from "@/lib/hooks/use-image-generation";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";

type Step = "prompt" | "mockup" | "checkout" | "final";

interface TshirtOrder {
  prompt: string;
  imageUrl: string;
  tshirtColor: string;
  quantity: number;
  material: string;
  size: string;
  deliveryLocation: string;
  phoneNumber: string;
}

export function TshirtPrintingClient() {
  const [currentStep, setCurrentStep] = useState<Step>("prompt");
  const [order, setOrder] = useState<TshirtOrder>({
    prompt: "",
    imageUrl: "",
    tshirtColor: "white",
    quantity: 1,
    material: "cotton",
    size: "M",
    deliveryLocation: "",
    phoneNumber: "",
  });

  const { images, isLoading, startGeneration } = useImageGeneration();

  const handlePromptSubmit = async (prompt: string) => {
    setOrder(prev => ({ ...prev, prompt }));
    await startGeneration(prompt, ["replicate"], { replicate: "sdxl" });
    if (images.length > 0) {
      setOrder(prev => ({ ...prev, imageUrl: images[0].image }));
      setCurrentStep("mockup");
    }
  };

  const handleColorChange = (color: string) => {
    setOrder(prev => ({ ...prev, tshirtColor: color }));
  };

  const handleCheckoutSubmit = (checkoutData: Partial<TshirtOrder>) => {
    setOrder(prev => ({ ...prev, ...checkoutData }));
    setCurrentStep("final");
  };

  const handleFinalSubmit = async (phoneNumber: string) => {
    const finalOrder = { ...order, phoneNumber };
    setOrder(finalOrder);
    
    // Save order to backend
    try {
      const response = await fetch("/api/tshirt-printing/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(finalOrder),
      });
      
      if (response.ok) {
        alert("Order submitted successfully! We'll contact you soon.");
        // Reset to start
        setCurrentStep("prompt");
        setOrder({
          prompt: "",
          imageUrl: "",
          tshirtColor: "white",
          quantity: 1,
          material: "cotton",
          size: "M",
          deliveryLocation: "",
          phoneNumber: "",
        });
      }
    } catch (error) {
      console.error("Error submitting order:", error);
      alert("Error submitting order. Please try again.");
    }
  };

  const goBack = () => {
    if (currentStep === "mockup") setCurrentStep("prompt");
    else if (currentStep === "checkout") setCurrentStep("mockup");
    else if (currentStep === "final") setCurrentStep("checkout");
  };

  const goNext = () => {
    if (currentStep === "prompt" && order.imageUrl) setCurrentStep("mockup");
    else if (currentStep === "mockup") setCurrentStep("checkout");
    else if (currentStep === "checkout") setCurrentStep("final");
  };

  return (
    <div className="min-h-screen bg-background py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {["prompt", "mockup", "checkout", "final"].map((step, index) => (
                <div key={step} className="flex items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      currentStep === step
                        ? "bg-primary text-primary-foreground"
                        : index < ["prompt", "mockup", "checkout", "final"].indexOf(currentStep)
                        ? "bg-green-500 text-white"
                        : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    {index + 1}
                  </div>
                  {index < 3 && (
                    <div
                      className={`w-16 h-1 mx-2 ${
                        index < ["prompt", "mockup", "checkout", "final"].indexOf(currentStep)
                          ? "bg-green-500"
                          : "bg-gray-200"
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
            <div className="text-sm text-gray-600">
              Step {["prompt", "mockup", "checkout", "final"].indexOf(currentStep) + 1} of 4
            </div>
          </div>
        </div>

        {/* Step Content */}
        <div className="space-y-8">
          {currentStep === "prompt" && (
            <div>
              <h2 className="text-2xl font-bold mb-4">Create Your T-shirt Design</h2>
              <PromptInput onSubmit={handlePromptSubmit} isLoading={isLoading} />
            </div>
          )}

          {currentStep === "mockup" && order.imageUrl && (
            <div>
              <h2 className="text-2xl font-bold mb-4">Customize Your T-shirt</h2>
              <TshirtMockup
                imageUrl={order.imageUrl}
                color={order.tshirtColor}
                onColorChange={handleColorChange}
              />
            </div>
          )}

          {currentStep === "checkout" && (
            <div>
              <h2 className="text-2xl font-bold mb-4">Order Details</h2>
              <CheckoutForm
                order={order}
                onSubmit={handleCheckoutSubmit}
              />
            </div>
          )}

          {currentStep === "final" && (
            <div>
              <h2 className="text-2xl font-bold mb-4">Complete Your Order</h2>
              <FinalStep
                order={order}
                onSubmit={handleFinalSubmit}
              />
            </div>
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8">
          <Button
            variant="outline"
            onClick={goBack}
            disabled={currentStep === "prompt"}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          
          <Button
            onClick={goNext}
            disabled={
              (currentStep === "prompt" && !order.imageUrl) ||
              currentStep === "final"
            }
            className="flex items-center gap-2"
          >
            {currentStep === "final" ? "Complete" : "Next"}
            {currentStep !== "final" && <ArrowRight className="h-4 w-4" />}
          </Button>
        </div>
      </div>
    </div>
  );
} 