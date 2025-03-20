import { FormEvent } from "react";
import { Button } from "@/components/ui/button";

interface SearchFormProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  handleSearch: (query: string) => void;
  isLoading: boolean;
}

export default function SearchForm({ searchQuery, setSearchQuery, handleSearch, isLoading }: SearchFormProps) {
  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    handleSearch(searchQuery);
  };
  
  return (
    <form onSubmit={onSubmit} className="relative mb-8">
      <div className="flex flex-col md:flex-row gap-2">
        <div className="relative flex-grow">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <span className="material-icons text-neutral-500">search</span>
          </span>
          <input
            type="text"
            name="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for files, movies, music, documents..."
            className="w-full pl-10 pr-4 py-3 bg-white border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
          {/* Loading indicator */}
          {isLoading && (
            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
              <div className="animate-spin h-5 w-5 rounded-full border-2 border-neutral-200 border-t-primary"></div>
            </div>
          )}
        </div>
        <Button 
          type="submit" 
          disabled={isLoading || !searchQuery.trim()}
          className="bg-primary hover:bg-primary/90 text-white font-medium py-3 px-6 rounded-lg transition-colors"
        >
          <span>Search</span>
        </Button>
      </div>
    </form>
  );
}
