
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface RestaurantSearchFilterProps {
  selectedCity: string;
  onCityChange: (city: string) => void;
  searchTerm: string;
  onSearchChange: (term: string) => void;
  cities: string[];
}

const RestaurantSearchFilter = ({
  selectedCity,
  onCityChange,
  searchTerm,
  onSearchChange,
  cities
}: RestaurantSearchFilterProps) => {
  return (
    <div className="flex gap-4 mb-4">
      <Select value={selectedCity} onValueChange={onCityChange}>
        <SelectTrigger className="w-48">
          <SelectValue placeholder="Select City" />
        </SelectTrigger>
        <SelectContent>
          {cities.map(city => (
            <SelectItem key={city} value={city}>{city}</SelectItem>
          ))}
        </SelectContent>
      </Select>
      
      <Input
        placeholder="Search By Restaurant Name"
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        className="flex-1"
      />
    </div>
  );
};

export default RestaurantSearchFilter;
