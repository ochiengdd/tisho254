"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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

interface CheckoutFormProps {
  order: TshirtOrder;
  onSubmit: (data: Partial<TshirtOrder>) => void;
}

const MATERIALS = [
  { value: "cotton", label: "100% Cotton", price: 25 },
  { value: "polyester", label: "Polyester Blend", price: 20 },
  { value: "premium", label: "Premium Cotton", price: 35 },
];

const DELIVERY_LOCATIONS = [
  "Nairobi, Kenya",
  "Mombasa, Kenya",
  "Kisumu, Kenya",
  "Nakuru, Kenya",
  "Eldoret, Kenya",
  "Other (specify)",
];

export function CheckoutForm({ order, onSubmit }: CheckoutFormProps) {
  const [formData, setFormData] = useState({
    quantity: order.quantity,
    material: order.material,
    size: order.size,
    deliveryLocation: order.deliveryLocation,
  });
  const [customLocation, setCustomLocation] = useState("");
  const [totalPrice, setTotalPrice] = useState(0);

  const selectedMaterial = MATERIALS.find(m => m.value === formData.material) || MATERIALS[0];

  useEffect(() => {
    const basePrice = selectedMaterial.price;
    const quantityDiscount = formData.quantity >= 5 ? 0.1 : 0; // 10% discount for 5+ items
    const total = basePrice * formData.quantity * (1 - quantityDiscount);
    setTotalPrice(total);
  }, [formData.quantity, formData.material]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalDeliveryLocation = formData.deliveryLocation === "Other (specify)" 
      ? customLocation 
      : formData.deliveryLocation;
    
    onSubmit({
      ...formData,
      deliveryLocation: finalDeliveryLocation,
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Order Summary */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-3">Order Summary</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Design:</span>
                  <span className="font-medium">{order.prompt}</span>
                </div>
                <div className="flex justify-between">
                  <span>Color:</span>
                  <span className="font-medium capitalize">{order.tshirtColor}</span>
                </div>
                <div className="flex justify-between">
                  <span>Size:</span>
                  <span className="font-medium">{formData.size}</span>
                </div>
              </div>
            </div>

            {/* Quantity */}
            <div>
              <Label htmlFor="quantity">Quantity</Label>
              <div className="flex items-center gap-4 mt-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setFormData(prev => ({ ...prev, quantity: Math.max(1, prev.quantity - 1) }))}
                >
                  -
                </Button>
                <Input
                  id="quantity"
                  type="number"
                  min="1"
                  max="50"
                  value={formData.quantity}
                  onChange={(e) => setFormData(prev => ({ ...prev, quantity: parseInt(e.target.value) || 1 }))}
                  className="w-20 text-center"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setFormData(prev => ({ ...prev, quantity: prev.quantity + 1 }))}
                >
                  +
                </Button>
              </div>
              {formData.quantity >= 5 && (
                <p className="text-sm text-green-600 mt-1">🎉 10% discount applied for bulk order!</p>
              )}
            </div>

            {/* Material Selection */}
            <div>
              <Label>Material</Label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-2">
                {MATERIALS.map((material) => (
                  <Card
                    key={material.value}
                    className={`cursor-pointer transition-all ${
                      formData.material === material.value
                        ? "ring-2 ring-blue-500 bg-blue-50"
                        : "hover:bg-gray-50"
                    }`}
                    onClick={() => setFormData(prev => ({ ...prev, material: material.value }))}
                  >
                    <CardContent className="p-4">
                      <div className="font-medium">{material.label}</div>
                      <div className="text-sm text-gray-600">${material.price} each</div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Size Selection */}
            <div>
              <Label>Size</Label>
              <div className="grid grid-cols-6 gap-2 mt-2">
                {["XS", "S", "M", "L", "XL", "XXL"].map((size) => (
                  <Button
                    key={size}
                    type="button"
                    variant={formData.size === size ? "default" : "outline"}
                    onClick={() => setFormData(prev => ({ ...prev, size }))}
                    className="h-12"
                  >
                    {size}
                  </Button>
                ))}
              </div>
            </div>

            {/* Delivery Location */}
            <div>
              <Label htmlFor="delivery">Delivery Location</Label>
              <Select
                value={formData.deliveryLocation}
                onValueChange={(value) => setFormData(prev => ({ ...prev, deliveryLocation: value }))}
              >
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="Select delivery location" />
                </SelectTrigger>
                <SelectContent>
                  {DELIVERY_LOCATIONS.map((location) => (
                    <SelectItem key={location} value={location}>
                      {location}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              {formData.deliveryLocation === "Other (specify)" && (
                <Input
                  placeholder="Enter your location"
                  value={customLocation}
                  onChange={(e) => setCustomLocation(e.target.value)}
                  className="mt-2"
                />
              )}
            </div>

            {/* Price Summary */}
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-4">
                <h3 className="font-semibold mb-3">Price Breakdown</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Base Price ({selectedMaterial.label}):</span>
                    <span>${selectedMaterial.price} × {formData.quantity}</span>
                  </div>
                  {formData.quantity >= 5 && (
                    <div className="flex justify-between text-green-600">
                      <span>Bulk Discount (10%):</span>
                      <span>-${(selectedMaterial.price * formData.quantity * 0.1).toFixed(2)}</span>
                    </div>
                  )}
                  <div className="border-t pt-2">
                    <div className="flex justify-between font-semibold text-lg">
                      <span>Total:</span>
                      <span>${totalPrice.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Button type="submit" className="w-full">
              Continue to Final Step
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
} 