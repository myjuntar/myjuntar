"use client";
import { Button } from "@/components/ui/button";
import { mockVenues } from "@/data/mockVenues";
import { useMemo, useState } from "react";
import { FilterOptions } from "../venue/FilterPanel";
import { Input } from "../ui/input";
import { Search } from "lucide-react";

export function HeroSection() {
  const [filters, setFilters] = useState<FilterOptions>({
    searchQuery: '',
    area: '',
    city: '',
    venueType: '',
    priceRange: [50000, 2000000],
    capacityRange: [50, 2000],
    amenities: [],
  });
  const [searchQuery, setSearchQuery] = useState('');
  const handleQuickSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setFilters(prev => ({
      ...prev,
      searchQuery
    }));
  };

  const resetFilters = () => {
    setFilters({
      searchQuery: '',
      area: '',
      city: '',
      venueType: '',
      priceRange: [50000, 2000000],
      capacityRange: [50, 2000],
      amenities: [],
    });
    setSearchQuery('');
  };

  return (
    <section className="relative bg-gradient-to-br from-rose-gold-light via-champagne to-blush py-20">
      <div className="container mx-auto px-4 text-center">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="space-y-4">
            <h1 className="text-4xl md:text-6xl font-bold">
              Find Your
              <span className="block bg-gradient-to-r from-rose-gold to-primary bg-clip-text text-transparent">
                Perfect Wedding Venue
              </span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Discover stunning venues for your special day. From intimate gardens to grand ballrooms,
              we help you find the perfect setting for your dream wedding.
            </p>
          </div>

          {/* Quick Search */}
          <div className="max-w-2xl mx-auto">
            <form onSubmit={handleQuickSearch} className="flex space-x-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  placeholder="Search by venue name or location..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-12 text-base"
                />
              </div>
              <Button type="submit" variant="elegant" size="lg">
                Search
              </Button>
            </form>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{mockVenues.length}+</div>
              <div className="text-sm text-muted-foreground">Venues</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">50+</div>
              <div className="text-sm text-muted-foreground">Cities</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">4.8</div>
              <div className="text-sm text-muted-foreground">Avg Rating</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">1000+</div>
              <div className="text-sm text-muted-foreground">Happy Couples</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}