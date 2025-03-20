import { Card, CardContent } from "@/components/ui/card";

export default function HowItWorks() {
  return (
    <main className="container mx-auto px-4 py-8 flex-grow">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold text-neutral-800 mb-6 text-center">How SCloud Search Works</h2>
        
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-6">
              <div className="flex items-start">
                <span className="material-icons text-primary text-2xl mr-3">search</span>
                <div>
                  <h3 className="text-lg font-semibold mb-1">1. Search for Files</h3>
                  <p className="text-neutral-600">
                    Enter your search term in the search box. You can search for movies, music, books, software, or any other types of files you're looking for.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <span className="material-icons text-primary text-2xl mr-3">list</span>
                <div>
                  <h3 className="text-lg font-semibold mb-1">2. Browse Results</h3>
                  <p className="text-neutral-600">
                    Our system will search across multiple sources and present you with relevant results. Each result shows the file name and size to help you find what you need.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <span className="material-icons text-primary text-2xl mr-3">download</span>
                <div>
                  <h3 className="text-lg font-semibold mb-1">3. Download Files</h3>
                  <p className="text-neutral-600">
                    When you find the file you want, simply click the Download button. We'll prepare the download link and your file will begin downloading automatically.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <span className="material-icons text-primary text-2xl mr-3">security</span>
                <div>
                  <h3 className="text-lg font-semibold mb-1">Security & Privacy</h3>
                  <p className="text-neutral-600">
                    We don't track your searches or downloads. Our service is designed to be simple and privacy-focused, giving you access to the files you need without unnecessary data collection.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
