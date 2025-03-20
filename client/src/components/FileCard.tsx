import { SearchResult } from "@/types";
import { getFileIcon } from "@/lib/fileTypeIcons";

interface FileCardProps {
  file: SearchResult;
  onDownloadClick: () => void;
}

export default function FileCard({ file, onDownloadClick }: FileCardProps) {
  // Get icon based on file name
  const icon = getFileIcon(file.name);
  
  return (
    <div className="bg-white rounded-lg shadow-sm border border-neutral-200 overflow-hidden hover:shadow-md transition-shadow">
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          {/* File Type Icon */}
          <span className="material-icons text-neutral-500 mr-2">
            {icon}
          </span>
          {/* File Size */}
          <span className="text-xs bg-neutral-100 text-neutral-500 px-2 py-1 rounded-full">
            {file.size}
          </span>
        </div>
        
        {/* File Name */}
        <h4 className="text-neutral-800 font-medium mb-3 line-clamp-2 min-h-[3rem]">
          {file.name}
        </h4>
        
        {/* Download Button */}
        <button
          onClick={onDownloadClick}
          className="block w-full bg-primary hover:bg-primary/90 text-white text-center py-2 rounded-lg transition-colors flex items-center justify-center"
        >
          <span className="material-icons text-sm mr-1">download</span>
          <span>Download</span>
        </button>
      </div>
    </div>
  );
}
