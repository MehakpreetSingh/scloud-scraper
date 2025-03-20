import { Link } from "wouter";

export default function Header() {
  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/">
          <a className="flex items-center">
            <span className="material-icons text-primary text-3xl mr-2">cloud</span>
            <h1 className="text-xl font-medium text-neutral-800">SCloud Search</h1>
          </a>
        </Link>
        <div className="hidden md:block">
          <Link href="/how-it-works">
            <a className="text-primary hover:text-opacity-80 text-sm mr-4">How It Works</a>
          </Link>
          <Link href="/about">
            <a className="text-primary hover:text-opacity-80 text-sm">About</a>
          </Link>
        </div>
      </div>
    </header>
  );
}
