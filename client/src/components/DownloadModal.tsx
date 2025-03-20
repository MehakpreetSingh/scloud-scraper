import { useState, useEffect } from "react";
import { SearchResult } from "@/types";
import { fetchDownloadLink } from "@/lib/api";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface DownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
  file: SearchResult;
}

export default function DownloadModal({ isOpen, onClose, file }: DownloadModalProps) {
  const [downloadLink, setDownloadLink] = useState("");
  const [isDownloading, setIsDownloading] = useState(true);
  const [downloadError, setDownloadError] = useState(false);
  
  useEffect(() => {
    if (isOpen && file) {
      getDownloadLink();
    }
    // Reset state when modal closes
    return () => {
      setDownloadLink("");
      setIsDownloading(true);
      setDownloadError(false);
    };
  }, [isOpen, file]);
  
  const getDownloadLink = async () => {
    setIsDownloading(true);
    setDownloadError(false);
    
    try {
      const link = await fetchDownloadLink(file.link);
      setDownloadLink(link);
      
      // Automatically initiate download if we have a valid link
      if (link) {
        window.open(link, "_blank");
      } else {
        throw new Error("Failed to get download link");
      }
    } catch (error) {
      console.error("Download error:", error);
      setDownloadError(true);
    } finally {
      setIsDownloading(false);
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Starting Download</DialogTitle>
        </DialogHeader>
        
        <div className="p-5">
          {/* Loading State */}
          {isDownloading && (
            <div className="flex flex-col items-center justify-center text-center py-4">
              <div className="animate-spin h-10 w-10 border-4 border-neutral-200 border-t-primary rounded-full mb-4"></div>
              <p className="text-neutral-800 font-medium">Preparing your download</p>
              <p className="text-neutral-500 text-sm mt-2">This may take a few moments...</p>
            </div>
          )}
          
          {/* Success State */}
          {!isDownloading && !downloadError && downloadLink && (
            <div className="text-center py-4">
              <span className="material-icons text-success text-5xl mb-2">check_circle</span>
              <p className="text-neutral-800 font-medium">Your download is ready!</p>
              <p className="text-neutral-500 text-sm mt-2 mb-4">
                If your download doesn't start automatically, click the button below.
              </p>
              <a
                href={downloadLink}
                className="inline-block bg-primary hover:bg-primary/90 text-white text-center py-2 px-6 rounded-lg transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                Download Now
              </a>
            </div>
          )}
          
          {/* Error State */}
          {downloadError && (
            <div className="text-center py-4">
              <span className="material-icons text-error text-5xl mb-2">error</span>
              <p className="text-neutral-800 font-medium">Download failed</p>
              <p className="text-neutral-500 text-sm mt-2 mb-4">
                There was a problem preparing your download. Please try again later.
              </p>
              <Button 
                onClick={onClose}
                className="bg-primary hover:bg-primary/90 text-white py-2 px-6 rounded-lg transition-colors"
              >
                Close
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
