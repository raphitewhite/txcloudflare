import Image from "next/image";
import Link from "next/link";

const navItems = ["Get started", "Advertise", "Learn", "Support"];

export function Navbar() {
  return (
    <nav className="flex items-center justify-between border-b border-slate-200 px-4 py-4 sm:px-8 lg:px-12" style={{ backgroundColor: '#f5f6f6' }}>
      <div className="flex items-center gap-8">
        <Link href="/" className="flex items-center">
          <Image src="/logo-meta.svg" alt="Meta" width={60} height={20} className="h-5 w-auto" />
        </Link>
        <div className="hidden items-center gap-8 text-sm font-medium text-slate-700 lg:flex">
          {navItems.map((item) => (
            <Link key={item} href="#" className="hover:text-slate-900 transition-colors">
              {item}
            </Link>
          ))}
        </div>
      </div>
      <div className="flex items-center gap-4">
        <button
          type="button"
          className="rounded-full p-2 text-slate-600 transition hover:bg-slate-100"
          aria-label="Search"
        >
          <Image src="/ic_search.svg" alt="Search" width={24} height={24} />
        </button>
        <button
          type="button"
          className="relative rounded-full p-2 text-slate-600 transition hover:bg-slate-100"
          aria-label="Profile"
        >
          <Image src="/ic_user.svg" alt="Profile" width={24} height={24} />
          <span className="absolute right-1 top-1 h-2.5 w-2.5 rounded-full bg-green-500 ring-2 ring-white" />
        </button>
      </div>
    </nav>
  );
}
