import { Link } from "wouter";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-neutral-200 py-6 mt-auto">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-neutral-500 text-sm">© {new Date().getFullYear()} SCloud Search. All rights reserved.</p>
          </div>
          <div className="flex space-x-6">
            <a href="#" className="text-neutral-500 hover:text-primary text-sm">Terms</a>
            <a href="#" className="text-neutral-500 hover:text-primary text-sm">Privacy</a>
            <a href="#" className="text-neutral-500 hover:text-primary text-sm">Contact</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
