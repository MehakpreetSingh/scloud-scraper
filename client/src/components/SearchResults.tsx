import { SearchResult } from "@/types";
import FileCard from "@/components/FileCard";

interface SearchResultsProps {
  isLoading: boolean;
  searchResults: SearchResult[];
  hasError: boolean;
  errorMessage: string;
  handleDownloadClick: (file: SearchResult) => void;
}

export default function SearchResults({ 
  isLoading, 
  searchResults, 
  hasError, 
  errorMessage,
  handleDownloadClick 
}: SearchResultsProps) {
  
  // If there's an error, show the error message
  if (hasError) {
    return (
      <div className="bg-error/10 border border-error/30 text-error rounded-lg p-4 mb-6 flex items-start">
        <span className="material-icons mr-2 flex-shrink-0">error</span>
        <div>
          <h3 className="font-medium">Error fetching results</h3>
          <p className="text-sm">{errorMessage || "Unable to connect to the search service. Please try again later."}</p>
        </div>
      </div>
    );
  }
  
  // If loading, show loading indicator
  if (isLoading) {
    return (
      <div className="text-center py-12 flex flex-col items-center justify-center">
        <div className="animate-spin h-10 w-10 border-4 border-neutral-200 border-t-primary rounded-full mb-4"></div>
        <p className="text-neutral-500">Searching for files...</p>
      </div>
    );
  }
  
  // If no results, show empty state
  if (searchResults.length === 0) {
    return (
      <div className="text-center py-12">
        <span className="material-icons text-neutral-300 text-5xl mb-2">search</span>
        <h3 className="text-lg font-medium text-neutral-800 mb-1">Search for files</h3>
        <p className="text-neutral-500 text-sm max-w-md mx-auto">
          Enter a search term above to find files. Try searching for movies, music, books or software.
        </p>
      </div>
    );
  }
  
  // If there are results, show them
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium text-neutral-800">
          <span>{searchResults.length}</span> results found
        </h3>
        <div className="text-sm text-neutral-500">
          Sorted by relevance
        </div>
      </div>
      
      {/* Results Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {searchResults.map((result, index) => (
          <FileCard 
            key={`${result.name}-${index}`}
            file={result}
            onDownloadClick={() => handleDownloadClick(result)}
          />
        ))}
      </div>
    </div>
  );
}
