"use client";

import { useState } from "react";
import { TshirtPrintingClient } from "@/components/(apps)/tshirt-printing/tshirt-printing-client";
import { getSession } from "@/lib/db/cached-queries";
import Login from "@/components/(apps)/input/login";
import AppInfo from "./info";

export default function TshirtPrintingPage() {
  return (
    <section className="relative min-h-screen">
      <div className="flex flex-col md:flex-row items-start no-scrollbar">
        <div className="w-full md:w-2/3 no-scrollbar">
          <TshirtPrintingClient />
        </div>
        <div className="w-full md:w-1/3 no-scrollbar">
          <AppInfo />
        </div>
      </div>
    </section>
  );
} 