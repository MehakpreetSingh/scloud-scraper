/**
 * Get Material Icon name based on file extension
 */
export function getFileIcon(filename: string): string {
  const extension = getFileExtension(filename).toLowerCase();
  
  // Video files
  if (['mp4', 'mkv', 'avi', 'mov', 'wmv', 'flv', 'webm'].includes(extension)) {
    return 'videocam';
  }
  
  // Audio files
  if (['mp3', 'wav', 'ogg', 'flac', 'aac', 'm4a'].includes(extension)) {
    return 'music_note';
  }
  
  // Image files
  if (['jpg', 'jpeg', 'png', 'gif', 'bmp', 'svg', 'webp'].includes(extension)) {
    return 'image';
  }
  
  // Document files
  if (['pdf'].includes(extension)) {
    return 'picture_as_pdf';
  }
  
  if (['doc', 'docx'].includes(extension)) {
    return 'description';
  }
  
  if (['xls', 'xlsx', 'csv'].includes(extension)) {
    return 'table_chart';
  }
  
  if (['ppt', 'pptx'].includes(extension)) {
    return 'slideshow';
  }
  
  // Archive files
  if (['zip', 'rar', '7z', 'tar', 'gz'].includes(extension)) {
    return 'folder_zip';
  }
  
  // Subtitle files
  if (['srt', 'sub', 'sbv', 'vtt'].includes(extension)) {
    return 'subtitles';
  }
  
  // Code files
  if (['html', 'css', 'js', 'ts', 'jsx', 'tsx', 'php', 'py', 'java', 'c', 'cpp', 'cs'].includes(extension)) {
    return 'code';
  }
  
  // Default icon for other file types
  return 'insert_drive_file';
}

/**
 * Extract file extension from filename
 */
function getFileExtension(filename: string): string {
  // Check if the filename contains a dot
  const lastDotIndex = filename.lastIndexOf('.');
  if (lastDotIndex === -1) return '';
  
  // Return the extension (everything after the last dot)
  return filename.substring(lastDotIndex + 1);
}
