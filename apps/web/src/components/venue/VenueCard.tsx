import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Users, Star, Heart, Wifi, Car, Utensils, Music } from 'lucide-react';

export interface Venue {
  id: string;
  name: string;
  location: string;
  city: string;
  area: string;
  price: {
    min: number;
    max: number;
  };
  capacity: {
    min: number;
    max: number;
  };
  rating: number;
  reviewCount: number;
  images: string[];
  venueType: string;
  amenities: string[];
  description: string;
  featured?: boolean;
}

interface VenueCardProps {
  venue: Venue;
  onViewDetails?: (venue: Venue) => void;
  onToggleFavorite?: (venueId: string) => void;
  isFavorite?: boolean;
}

const amenityIcons: Record<string, React.ReactNode> = {
  wifi: <Wifi className="h-4 w-4" />,
  parking: <Car className="h-4 w-4" />,
  catering: <Utensils className="h-4 w-4" />,
  music: <Music className="h-4 w-4" />,
};

export const VenueCard: React.FC<VenueCardProps> = ({
  venue,
  onViewDetails,
  onToggleFavorite,
  isFavorite = false,
}) => {
  const formatPrice = (min: number, max: number) => {
    if (min === max) return `$${min.toLocaleString()}`;
    return `$${min.toLocaleString()} - $${max.toLocaleString()}`;
  };

  const formatCapacity = (min: number, max: number) => {
    if (min === max) return `${min} guests`;
    return `${min} - ${max} guests`;
  };

  return (
    <Card className="group overflow-hidden hover:shadow-elegant transition-all duration-300 hover:-translate-y-1">
      <div className="relative">
        <div className="aspect-[4/3] overflow-hidden">
          <img
            src={venue.images[0]}
            alt={venue.name}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
        
        {/* Favorite Button */}
        <button
          onClick={() => onToggleFavorite?.(venue.id)}
          className="absolute top-3 right-3 p-2 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white transition-colors"
        >
          <Heart
            className={`h-4 w-4 ${
              isFavorite ? 'fill-rose-gold text-rose-gold' : 'text-gray-600'
            }`}
          />
        </button>

        {/* Featured Badge */}
        {venue.featured && (
          <div className="absolute top-3 left-3">
            <Badge className="bg-gradient-to-r from-rose-gold to-primary text-white">
              Featured
            </Badge>
          </div>
        )}

        {/* Rating */}
        <div className="absolute bottom-3 left-3">
          <div className="flex items-center space-x-1 bg-white/90 backdrop-blur-sm rounded-md px-2 py-1">
            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
            <span className="text-xs font-medium">{venue.rating}</span>
            <span className="text-xs text-muted-foreground">({venue.reviewCount})</span>
          </div>
        </div>
      </div>

      <CardContent className="p-4">
        <div className="space-y-3">
          {/* Header */}
          <div>
            <h3 className="font-semibold text-lg line-clamp-1">{venue.name}</h3>
            <div className="flex items-center text-sm text-muted-foreground mt-1">
              <MapPin className="h-3 w-3 mr-1" />
              <span className="line-clamp-1">{venue.location}, {venue.city}</span>
            </div>
          </div>

          {/* Venue Type */}
          <Badge variant="secondary" className="w-fit">
            {venue.venueType}
          </Badge>

          {/* Description */}
          <p className="text-sm text-muted-foreground line-clamp-2">
            {venue.description}
          </p>

          {/* Amenities */}
          <div className="flex items-center space-x-2">
            {venue.amenities.slice(0, 4).map((amenity) => (
              <div
                key={amenity}
                className="flex items-center justify-center w-8 h-8 rounded-full bg-rose-gold-light text-primary"
                title={amenity}
              >
                {amenityIcons[amenity.toLowerCase()] || (
                  <span className="text-xs">{amenity[0]}</span>
                )}
              </div>
            ))}
            {venue.amenities.length > 4 && (
              <span className="text-xs text-muted-foreground">
                +{venue.amenities.length - 4} more
              </span>
            )}
          </div>

          {/* Capacity & Price */}
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center text-muted-foreground">
              <Users className="h-3 w-3 mr-1" />
              <span>{formatCapacity(venue.capacity.min, venue.capacity.max)}</span>
            </div>
            <div className="font-semibold text-primary">
              {formatPrice(venue.price.min, venue.price.max)}
            </div>
          </div>

          {/* Action Button */}
          <Button
            variant="elegant"
            className="w-full"
            onClick={() => onViewDetails?.(venue)}
          >
            View Details
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};