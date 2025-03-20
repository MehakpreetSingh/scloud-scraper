# SCloud Ninja Search API

This is a REST API service that provides search functionality for the SCloud website. It allows users to search for files and retrieve direct download links.

## API Endpoints

### Root Endpoint

- **URL**: `/`
- **Method**: `GET`
- **Description**: Returns information about the API and available endpoints.
- **Response**:
  ```json
  {
    "message": "SCloud Search API",
    "version": "1.0.0",
    "endpoints": [
      {
        "path": "/api/search",
        "method": "GET",
        "description": "Search for files",
        "parameters": [
          {
            "name": "search",
            "type": "string",
            "required": true,
            "description": "Search query"
          }
        ]
      },
      {
        "path": "/api/history",
        "method": "GET",
        "description": "Get search history",
        "parameters": [
          {
            "name": "limit",
            "type": "number",
            "required": false,
            "description": "Maximum number of history items to return (default: 10)"
          }
        ]
      },
      {
        "path": "/api/download",
        "method": "POST",
        "description": "Get download link for a file",
        "parameters": [
          {
            "name": "link",
            "type": "string",
            "required": true,
            "description": "File link from search results"
          }
        ]
      },
      {
        "path": "/api/download/:linkId",
        "method": "GET",
        "description": "Get download link for a file by ID",
        "parameters": [
          {
            "name": "linkId",
            "type": "string",
            "required": true,
            "description": "File ID from search results"
          }
        ]
      }
    ]
  }
  ```

### Search Endpoint

- **URL**: `/api/search`
- **Method**: `GET`
- **URL Parameters**: 
  - `search=[string]` - The search query for finding files.
- **Description**: Searches for files matching the provided query.
- **Success Response**:
  - **Code**: 200
  - **Content Example**:
    ```json
    {
      "query": "sample query",
      "count": 2,
      "results": [
        {
          "name": "sample file.mp4",
          "size": "100 MB",
          "link": "abc123def456",
          "fileType": "video"
        },
        {
          "name": "another sample.pdf",
          "size": "5 MB",
          "link": "xyz789",
          "fileType": "pdf"
        }
      ]
    }
    ```
- **Error Response**:
  - **Code**: 400
  - **Content**: 
    ```json
    {
      "error": "Search query is required",
      "message": "Please provide a search term using the 'search' query parameter"
    }
    ```
  OR
  - **Code**: 500
  - **Content**: 
    ```json
    {
      "error": "Failed to fetch search results",
      "message": "Error message details"
    }
    ```

### Download Link Endpoint (POST)

- **URL**: `/api/download`
- **Method**: `POST`
- **Data Parameters**:
  ```json
  {
    "link": "file_id_or_full_url"
  }
  ```
- **Description**: Retrieves the direct download link for a specific file.
- **Success Response**:
  - **Code**: 200
  - **Content Example**:
    ```json
    {
      "url": "https://direct-download-url.com/file.mp4",
      "filename": "file.mp4",
      "success": true
    }
    ```
- **Error Response**:
  - **Code**: 400
  - **Content**: 
    ```json
    {
      "error": "Link is required",
      "message": "Please provide a 'link' parameter in the request body"
    }
    ```
  OR
  - **Code**: 404
  - **Content**: 
    ```json
    {
      "error": "Download link not found",
      "message": "Unable to extract download link from the provided URL"
    }
    ```
  OR
  - **Code**: 500
  - **Content**: 
    ```json
    {
      "error": "Failed to fetch download link",
      "message": "Error message details",
      "success": false
    }
    ```

### Download Link Endpoint (GET)

- **URL**: `/api/download/:linkId`
- **Method**: `GET`
- **URL Parameters**:
  - `linkId=[string]` - The file ID from search results.
- **Description**: Alternative endpoint to retrieve direct download link for a specific file.
- **Success Response**:
  - **Code**: 200
  - **Content Example**:
    ```json
    {
      "url": "https://direct-download-url.com/file.mp4",
      "filename": "file.mp4",
      "success": true
    }
    ```
- **Error Response**:
  - **Code**: 400
  - **Content**: 
    ```json
    {
      "error": "Link ID is required",
      "message": "Please provide a linkId as part of the URL"
    }
    ```
  OR
  - **Code**: 404/500
  - **Content**: Similar to the POST endpoint.

## File Types

The API categorizes files into the following types based on their extensions:

- `video`: mp4, mkv, avi, mov, wmv, flv, webm
- `audio`: mp3, wav, ogg, flac, aac, m4a
- `image`: jpg, jpeg, png, gif, bmp, svg, webp
- `pdf`: pdf
- `document`: doc, docx
- `spreadsheet`: xls, xlsx, csv
- `presentation`: ppt, pptx
- `archive`: zip, rar, 7z, tar, gz
- `subtitle`: srt, sub, sbv, vtt
- `code`: html, css, js, ts, jsx, tsx, php, py, java, c, cpp, cs
- `other`: Any other file type

## Usage Examples

### Search for files

```bash
curl -X GET "http://localhost:5000/api/search?search=sample+query"
```

### Get download link (POST)

```bash
curl -X POST "http://localhost:5000/api/download" \
  -H "Content-Type: application/json" \
  -d '{"link": "abc123def456"}'
```

### Get download link (GET)

```bash
curl -X GET "http://localhost:5000/api/download/abc123def456"
```

## Notes

- All endpoints return JSON responses (except errors, which might return plain text).
- The API handles URL encoding/decoding automatically.
- For search results, the `link` field contains the ID part of the URL, not the full URL.
- When using the download endpoints, you can provide either the full URL or just the ID part.