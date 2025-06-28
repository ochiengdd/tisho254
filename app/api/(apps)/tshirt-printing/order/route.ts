import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/utils/supabase/server";

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient();
    
    // Get the order data from the request body
    const orderData = await request.json();
    
    const {
      prompt,
      imageUrl,
      tshirtColor,
      quantity,
      material,
      size,
      deliveryLocation,
      phoneNumber,
    } = orderData;

    // Validate required fields
    if (!prompt || !imageUrl || !tshirtColor || !quantity || !material || !size || !deliveryLocation || !phoneNumber) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Calculate total price
    const materialPrices = {
      cotton: 25,
      polyester: 20,
      premium: 35,
    };
    
    const basePrice = materialPrices[material as keyof typeof materialPrices] || 25;
    const quantityDiscount = quantity >= 5 ? 0.1 : 0;
    const totalPrice = basePrice * quantity * (1 - quantityDiscount);

    // Save order to database
    const { data, error } = await supabase
      .from("tshirt_orders")
      .insert([
        {
          prompt,
          image_url: imageUrl,
          tshirt_color: tshirtColor,
          quantity,
          material,
          size,
          delivery_location: deliveryLocation,
          phone_number: phoneNumber,
          total_price: totalPrice,
          status: "pending",
          created_at: new Date().toISOString(),
        },
      ])
      .select();

    if (error) {
      console.error("Database error:", error);
      return NextResponse.json(
        { error: "Failed to save order" },
        { status: 500 }
      );
    }

    // Here you could also:
    // 1. Send email notification to admin
    // 2. Send SMS to customer
    // 3. Integrate with payment gateway
    // 4. Send to order management system

    return NextResponse.json({
      success: true,
      orderId: data[0].id,
      message: "Order submitted successfully",
    });

  } catch (error) {
    console.error("Order submission error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 