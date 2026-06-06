"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const links = [
  { href: "/", label: "Home" },
  { href: "/upload", label: "Upload" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/notifications", label: "Notifications" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <nav className="border-b bg-white sticky top-0 z-10">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="font-bold text-lg text-indigo-600">
          SmartSub
        </Link>
        {/* Desktop links */}
        <div className="hidden sm:flex gap-6">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`text-sm font-medium transition-colors ${
                pathname === l.href ? "text-indigo-600" : "text-gray-600 hover:text-gray-900"
              }`}
            >
              {l.label}
            </Link>
          ))}
        </div>
        {/* Mobile hamburger */}
        <button onClick={() => setOpen(!open)} className="sm:hidden p-2 text-gray-600" aria-label="Menu">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            {open
              ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            }
          </svg>
        </button>
      </div>
      {/* Mobile menu */}
      {open && (
        <div className="sm:hidden border-t px-4 py-2 space-y-1 bg-white">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className={`block py-2 text-sm font-medium ${
                pathname === l.href ? "text-indigo-600" : "text-gray-600"
              }`}
            >
              {l.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}
