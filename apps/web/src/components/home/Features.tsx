// Features.tsx
"use client";
import { Building, CalendarCheck2, Sparkles } from "lucide-react";

const features = [
  {
    icon: <CalendarCheck2 className="h-8 w-8 text-primary" />,
    title: "Instant Booking",
    description: "Book your venue online with real-time availability and instant confirmation."
  },
  {
    icon: <Building className="h-8 w-8 text-primary" />,
    title: "Verified Listings",
    description: "All venues are verified for authenticity, quality, and transparency."
  },
  {
    icon: <Sparkles className="h-8 w-8 text-primary" />,
    title: "Elegant Experience",
    description: "A smooth, elegant interface with curated filters and stunning designs."
  }
];

export function Features() {
  return (
    <section className="py-16 bg-background border-t">
      <div className="container px-4 mx-auto">
        <div className="grid gap-12 md:grid-cols-3 text-center">
          {features.map((f, i) => (
            <div key={i} className="space-y-4">
              <div className="flex justify-center">{f.icon}</div>
              <h3 className="text-xl font-semibold">{f.title}</h3>
              <p className="text-muted-foreground">{f.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}