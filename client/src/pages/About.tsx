import { Card, CardContent } from "@/components/ui/card";

export default function About() {
  return (
    <main className="container mx-auto px-4 py-8 flex-grow">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold text-neutral-800 mb-6 text-center">About SCloud Search</h2>
        
        <Card>
          <CardContent className="pt-6">
            <p className="mb-4">
              SCloud Search is a powerful file search engine that allows you to find and download various types of files from across the web. Our service aggregates content from multiple sources to provide you with comprehensive search results.
            </p>
            
            <h3 className="text-xl font-semibold mb-3">Our Mission</h3>
            <p className="mb-4">
              Our mission is to make file discovery and access simple and efficient for everyone. We strive to provide a clean, user-friendly interface that makes finding what you're looking for as easy as possible.
            </p>
            
            <h3 className="text-xl font-semibold mb-3">Disclaimer</h3>
            <p className="mb-4">
              SCloud Search is a search engine that indexes files from third-party sources. We do not host any content ourselves. We respect copyright laws and expect our users to do the same. Please only download content that you have the legal right to access.
            </p>
            
            <h3 className="text-xl font-semibold mb-3">Contact Us</h3>
            <p>
              If you have any questions, concerns, or feedback, please don't hesitate to reach out to us through the Contact link in the footer.
            </p>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
