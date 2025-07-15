export interface Venue {
  id: string;
  name: string;
  city: string;
  area: string;
  location: string;
  venueType: string;
  price: {
    min: number;
    max: number;
  };
  capacity: {
    min: number;
    max: number;
  };
  amenities: string[];
}
