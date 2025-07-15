"use client"
import React, { useState, useMemo } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { VenueCard } from '@/components/venue/VenueCard';
import { FilterPanel, FilterOptions } from '@/components/venue/FilterPanel';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { mockVenues } from '@/data/mockVenues';
import { Star, MapPin, ArrowRight } from 'lucide-react';

const Venues = () => {
  const [filters, setFilters] = useState<FilterOptions>({
    searchQuery: '',
    area: '',
    city: '',
    venueType: '',
    priceRange: [50000, 2000000],
    capacityRange: [50, 2000],
    amenities: [],
  });

  const [favoriteVenues, setFavoriteVenues] = useState<string[]>([]);

  // Filter venues based on current filters
  const filteredVenues = useMemo(() => {
    return mockVenues.filter((venue) => {
      if (filters.searchQuery && !venue.name.toLowerCase().includes(filters.searchQuery.toLowerCase()) &&
        !venue.location.toLowerCase().includes(filters.searchQuery.toLowerCase())) {
        return false;
      }
      if (filters.city && venue.city !== filters.city) return false;
      if (filters.area && venue.area !== filters.area) return false;
      if (filters.venueType && venue.venueType !== filters.venueType) return false;
      if (venue.price.min > filters.priceRange[1] || venue.price.max < filters.priceRange[0]) return false;
      if (venue.capacity.min > filters.capacityRange[1] || venue.capacity.max < filters.capacityRange[0]) return false;
      if (filters.amenities.length > 0 && !filters.amenities.every(amenity => venue.amenities.includes(amenity))) return false;
      return true;
    });
  }, [filters]);

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
  };

  const toggleFavorite = (venueId: string) => {
    setFavoriteVenues(prev =>
      prev.includes(venueId)
        ? prev.filter(id => id !== venueId)
        : [...prev, venueId]
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Header */}
      <section className="bg-gradient-to-r from-rose-gold-light to-champagne py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold">
              Browse
              <span className="block bg-gradient-to-r from-rose-gold to-primary bg-clip-text text-transparent">
                Wedding Venues
              </span>
            </h1>
            <p className="text-xl text-muted-foreground">
              Discover the perfect venue for your special day from our curated collection of stunning locations.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Filters Sidebar */}
            <div className="lg:col-span-1">
              <FilterPanel
                filters={filters}
                onFiltersChange={setFilters}
                onReset={resetFilters}
                className="sticky top-4"
              />
            </div>

            {/* Venues Grid */}
            <div className="lg:col-span-3 space-y-6">
              {/* Results Header */}
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <h2 className="text-2xl font-bold">
                    {filteredVenues.length} Venues Found
                  </h2>
                  <p className="text-muted-foreground">
                    Perfect venues for your dream wedding
                  </p>
                </div>

                {/* Featured Badge */}
                <Badge variant="secondary" className="hidden md:flex items-center space-x-1">
                  <Star className="h-3 w-3" />
                  <span>Featured First</span>
                </Badge>
              </div>

              {/* Venues Grid */}
              {filteredVenues.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredVenues.map((venue) => (
                    <VenueCard
                      key={venue.id}
                      venue={venue}
                      onViewDetails={(venue) => {
                        console.log('View details for:', venue.name);
                        // Navigate to venue details page (will be implemented later)
                      }}
                      onToggleFavorite={toggleFavorite}
                      isFavorite={favoriteVenues.includes(venue.id)}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-muted rounded-full mb-4">
                    <MapPin className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">No venues found</h3>
                  <p className="text-muted-foreground mb-4">
                    Try adjusting your filters or search criteria
                  </p>
                  <Button variant="outline" onClick={resetFilters}>
                    Reset Filters
                  </Button>
                </div>
              )}

              {/* Load More */}
              {filteredVenues.length > 0 && (
                <div className="text-center pt-8">
                  <Button variant="outline" size="lg">
                    Load More Venues
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Venues