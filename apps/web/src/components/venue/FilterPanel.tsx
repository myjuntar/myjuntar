import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { X, Filter, Search } from 'lucide-react';

export interface FilterOptions {
  searchQuery: string;
  area: string;
  city: string;
  venueType: string;
  priceRange: [number, number];
  capacityRange: [number, number];
  amenities: string[];
}

interface FilterPanelProps {
  filters: FilterOptions;
  onFiltersChange: (filters: FilterOptions) => void;
  onReset: () => void;
  className?: string;
}

const venueTypes = [
  'Hotel/Resort',
  'Banquet Hall',
  'Garden/Outdoor',
  'Palace/Heritage',
  'Beach Resort',
  'Farm House',
  'Club/Restaurant',
  'Convention Center',
];

const areas = [
  'North Delhi',
  'South Delhi',
  'East Delhi',
  'West Delhi',
  'Central Delhi',
  'Gurgaon',
  'Noida',
  'Faridabad',
  'Ghaziabad',
];

const cities = [
  'Delhi',
  'Mumbai',
  'Bangalore',
  'Chennai',
  'Hyderabad',
  'Pune',
  'Kolkata',
  'Ahmedabad',
  'Jaipur',
  'Lucknow',
];

const amenitiesList = [
  'WiFi',
  'Parking',
  'Catering',
  'Music System',
  'AC/Climate Control',
  'Decoration',
  'Photography',
  'Valet Parking',
  'Bridal Room',
  'Guest Rooms',
  'Swimming Pool',
  'Garden/Lawn',
];

export const FilterPanel: React.FC<FilterPanelProps> = ({
  filters,
  onFiltersChange,
  onReset,
  className,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const updateFilter = (key: keyof FilterOptions, value: any) => {
    onFiltersChange({
      ...filters,
      [key]: value,
    });
  };

  const toggleAmenity = (amenity: string) => {
    const newAmenities = filters.amenities.includes(amenity)
      ? filters.amenities.filter((a) => a !== amenity)
      : [...filters.amenities, amenity];
    updateFilter('amenities', newAmenities);
  };

  const removeAmenity = (amenity: string) => {
    updateFilter('amenities', filters.amenities.filter((a) => a !== amenity));
  };

  const hasActiveFilters = 
    filters.searchQuery ||
    filters.area ||
    filters.city ||
    filters.venueType ||
    filters.priceRange[0] > 50000 ||
    filters.priceRange[1] < 2000000 ||
    filters.capacityRange[0] > 50 ||
    filters.capacityRange[1] < 2000 ||
    filters.amenities.length > 0;

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <Filter className="h-5 w-5" />
            <span>Filter Venues</span>
          </CardTitle>
          <div className="flex items-center space-x-2">
            {hasActiveFilters && (
              <Button variant="ghost" size="sm" onClick={onReset}>
                Reset
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="md:hidden"
            >
              {isExpanded ? 'Hide' : 'Show'}
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className={`space-y-6 ${!isExpanded ? 'hidden md:block' : ''}`}>
        {/* Search */}
        <div className="space-y-2">
          <Label htmlFor="search">Search Venues</Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="search"
              placeholder="Venue name, location..."
              value={filters.searchQuery}
              onChange={(e) => updateFilter('searchQuery', e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Location Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>City</Label>
            <Select value={filters.city || 'all'} onValueChange={(value) => updateFilter('city', value === 'all' ? '' : value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select city" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Cities</SelectItem>
                {cities.map((city) => (
                  <SelectItem key={city} value={city}>
                    {city}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Area</Label>
            <Select value={filters.area || 'all'} onValueChange={(value) => updateFilter('area', value === 'all' ? '' : value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select area" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Areas</SelectItem>
                {areas.map((area) => (
                  <SelectItem key={area} value={area}>
                    {area}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Venue Type */}
        <div className="space-y-2">
          <Label>Venue Type</Label>
          <Select value={filters.venueType || 'all'} onValueChange={(value) => updateFilter('venueType', value === 'all' ? '' : value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select venue type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              {venueTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Price Range */}
        <div className="space-y-4">
          <Label>Price Range</Label>
          <div className="px-2">
            <Slider
              value={filters.priceRange}
              onValueChange={(value) => updateFilter('priceRange', value as [number, number])}
              max={2000000}
              min={50000}
              step={25000}
              className="w-full"
            />
          </div>
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>₹{filters.priceRange[0].toLocaleString()}</span>
            <span>₹{filters.priceRange[1].toLocaleString()}</span>
          </div>
        </div>

        {/* Capacity Range */}
        <div className="space-y-4">
          <Label>Guest Capacity</Label>
          <div className="px-2">
            <Slider
              value={filters.capacityRange}
              onValueChange={(value) => updateFilter('capacityRange', value as [number, number])}
              max={2000}
              min={50}
              step={50}
              className="w-full"
            />
          </div>
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>{filters.capacityRange[0]} guests</span>
            <span>{filters.capacityRange[1]} guests</span>
          </div>
        </div>

        {/* Amenities */}
        <div className="space-y-4">
          <Label>Amenities</Label>
          
          {/* Selected Amenities */}
          {filters.amenities.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {filters.amenities.map((amenity) => (
                <Badge
                  key={amenity}
                  variant="secondary"
                  className="flex items-center space-x-1"
                >
                  <span>{amenity}</span>
                  <button
                    onClick={() => removeAmenity(amenity)}
                    className="ml-1 hover:text-destructive"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          )}

          {/* Amenities Grid */}
          <div className="grid grid-cols-2 gap-2">
            {amenitiesList.map((amenity) => (
              <div key={amenity} className="flex items-center space-x-2">
                <Checkbox
                  id={amenity}
                  checked={filters.amenities.includes(amenity)}
                  onCheckedChange={() => toggleAmenity(amenity)}
                />
                <Label
                  htmlFor={amenity}
                  className="text-sm font-normal cursor-pointer"
                >
                  {amenity}
                </Label>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};