// CTA.tsx
"use client";
import { Button } from "@/components/ui/button";
import { HeartHandshake } from "lucide-react";

export function CTA() {
  return (
    <section className="bg-gradient-to-br from-blush to-rose-gold-light py-16 text-center">
      <div className="container px-4 mx-auto space-y-6">
        <div className="flex justify-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-rose-gold">
            <HeartHandshake className="h-8 w-8 text-white" />
          </div>
        </div>
        <h2 className="text-3xl font-bold bg-gradient-to-r from-rose-gold to-primary bg-clip-text text-transparent">
          Ready to Make Your Wedding Dream Come True?
        </h2>
        <p className="text-muted-foreground max-w-xl mx-auto">
          Find your dream venue or showcase your space to thousands of happy couples.
        </p>
        <div className="flex justify-center space-x-4">
          <Button variant="elegant" size="lg">
            Get Started
          </Button>
          <Button variant="outline" size="lg">
            Talk to Support
          </Button>
        </div>
      </div>
    </section>
  );
}
