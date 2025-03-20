import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import SearchForm from "@/components/SearchForm";
import SearchResults from "@/components/SearchResults";
import DownloadModal from "@/components/DownloadModal";
import { SearchResult } from "@/types";
import { searchFiles } from "@/lib/api";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  
  // Download modal state
  const [showModal, setShowModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState<SearchResult | null>(null);
  
  // Get search parameter from URL
  const [location] = useLocation();
  const urlSearchParams = new URLSearchParams(location.split('?')[1] || '');
  const urlSearchQuery = urlSearchParams.get("search") || "";
  
  useEffect(() => {
    if (urlSearchQuery) {
      setSearchQuery(urlSearchQuery);
      handleSearch(urlSearchQuery);
    }
  }, [urlSearchQuery]);
  
  const handleSearch = async (query: string) => {
    if (!query.trim() || isLoading) return;
    
    setIsLoading(true);
    setHasError(false);
    
    try {
      const results = await searchFiles(query);
      setSearchResults(results);
      
      // Update URL with search parameter
      const url = new URL(window.location.href);
      url.searchParams.set("search", query);
      window.history.pushState({}, "", url.toString());
    } catch (error) {
      setHasError(true);
      setErrorMessage(error instanceof Error ? error.message : "An unknown error occurred");
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleDownloadClick = (file: SearchResult) => {
    setSelectedFile(file);
    setShowModal(true);
  };
  
  return (
    <main className="container mx-auto px-4 py-8 flex-grow">
      <div className="max-w-3xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-neutral-800 mb-2">Find and download files instantly</h2>
          <p className="text-neutral-500 max-w-lg mx-auto">Search across SCloud's extensive catalog of files, documents, media, and more.</p>
        </div>
        
        {/* Search Form */}
        <SearchForm 
          searchQuery={searchQuery} 
          setSearchQuery={setSearchQuery} 
          handleSearch={handleSearch} 
          isLoading={isLoading} 
        />
        
        {/* Search Results */}
        <SearchResults 
          isLoading={isLoading}
          searchResults={searchResults}
          hasError={hasError}
          errorMessage={errorMessage}
          handleDownloadClick={handleDownloadClick}
        />
      </div>
      
      {/* Download Modal */}
      {showModal && selectedFile && (
        <DownloadModal 
          isOpen={showModal} 
          onClose={() => setShowModal(false)} 
          file={selectedFile} 
        />
      )}
    </main>
  );
}
