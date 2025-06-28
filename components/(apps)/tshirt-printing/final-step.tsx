"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CheckCircle, Phone, Truck, CreditCard } from "lucide-react";

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

interface FinalStepProps {
  order: TshirtOrder;
  onSubmit: (phoneNumber: string) => void;
}

const MATERIALS = [
  { value: "cotton", label: "100% Cotton", price: 25 },
  { value: "polyester", label: "Polyester Blend", price: 20 },
  { value: "premium", label: "Premium Cotton", price: 35 },
];

export function FinalStep({ order, onSubmit }: FinalStepProps) {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const selectedMaterial = MATERIALS.find(m => m.value === order.material) || MATERIALS[0];
  const basePrice = selectedMaterial.price;
  const quantityDiscount = order.quantity >= 5 ? 0.1 : 0;
  const totalPrice = basePrice * order.quantity * (1 - quantityDiscount);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber.trim()) {
      alert("Please enter your phone number");
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(phoneNumber);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Order Summary */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <CheckCircle className="h-5 w-5 text-green-500" />
            <h3 className="text-lg font-semibold">Order Summary</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Design Preview */}
            <div>
              <h4 className="font-medium mb-3">Your Design</h4>
              <div className="bg-gray-100 rounded-lg p-4">
                <img
                  src={order.imageUrl}
                  alt="Generated design"
                  className="w-full h-32 object-cover rounded"
                />
                <p className="text-sm text-gray-600 mt-2">{order.prompt}</p>
              </div>
            </div>

            {/* Order Details */}
            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Order Details</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Color:</span>
                    <span className="capitalize">{order.tshirtColor}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Size:</span>
                    <span>{order.size}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Quantity:</span>
                    <span>{order.quantity}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Material:</span>
                    <span>{selectedMaterial.label}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Delivery:</span>
                    <span>{order.deliveryLocation}</span>
                  </div>
                </div>
              </div>

              {/* Price */}
              <div className="bg-blue-50 p-3 rounded">
                <div className="flex justify-between font-semibold">
                  <span>Total:</span>
                  <span>${totalPrice.toFixed(2)}</span>
                </div>
                {order.quantity >= 5 && (
                  <p className="text-xs text-green-600 mt-1">10% bulk discount applied</p>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Phone Number Collection */}
      <Card>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="phone" className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                Phone Number
              </Label>
              <Input
                id="phone"
                type="tel"
                placeholder="Enter your phone number (e.g., +254 700 000 000)"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="mt-2"
                required
              />
              <p className="text-sm text-gray-500 mt-1">
                We'll contact you to confirm your order and arrange payment.
              </p>
            </div>

            <Button
              type="submit"
              disabled={!phoneNumber.trim() || isSubmitting}
              className="w-full bg-green-600 hover:bg-green-700"
            >
              {isSubmitting ? (
                "Submitting Order..."
              ) : (
                <>
                  <CreditCard className="mr-2 h-4 w-4" />
                  Print Now - Submit Order
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* What Happens Next */}
      <Card className="bg-green-50 border-green-200">
        <CardContent className="p-6">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <Truck className="h-5 w-5 text-green-600" />
            What Happens Next?
          </h3>
          <div className="space-y-3 text-sm">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center text-green-600 font-semibold text-xs">
                1
              </div>
              <div>
                <span className="font-medium">Order Confirmation:</span>
                <p className="text-gray-600">We'll call you within 24 hours to confirm your order details.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center text-green-600 font-semibold text-xs">
                2
              </div>
              <div>
                <span className="font-medium">Payment:</span>
                <p className="text-gray-600">Pay via M-Pesa, bank transfer, or cash on delivery.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center text-green-600 font-semibold text-xs">
                3
              </div>
              <div>
                <span className="font-medium">Production:</span>
                <p className="text-gray-600">Your t-shirts will be printed within 3-5 business days.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center text-green-600 font-semibold text-xs">
                4
              </div>
              <div>
                <span className="font-medium">Delivery:</span>
                <p className="text-gray-600">Free delivery to your location within 2-3 days.</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 