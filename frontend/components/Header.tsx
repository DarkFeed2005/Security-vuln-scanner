import Image from 'next/image';
import Link from 'next/link';

export default function Header() {
  return (
    <header className="bg-slate-900/50 backdrop-blur-lg border-b border-white/10">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition">
            <Image
              src="/logo.png"
              alt="Logo"
              width={40}
              height={40}
              className="rounded-lg"
            />
            <span className="text-white font-bold text-xl">
              VulnScanner
            </span>
          </Link>
          
          <nav className="flex gap-6">
            <Link href="/scan" className="text-gray-300 hover:text-white transition">
              Scanner
            </Link>
            <Link href="/about" className="text-gray-300 hover:text-white transition">
              About
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}