'use client';
import { useState } from 'react';
import Link from 'next/link';
import { ChevronDown, Menu, X, Globe } from 'lucide-react';

// "/#impact" (with the leading slash) works from any page, not only the home page
const navLinks = [
  { label: 'Products', hasDropdown: true, href: '/products' },
  { label: 'Impact', hasDropdown: false, href: '/#impact' },
  { label: 'Evidence', hasDropdown: false, href: '/#evidence' },
  { label: 'Insights', hasDropdown: false, href: '/#insights' },
  { label: 'Contact Us', hasDropdown: false, href: '/#contact' },
];

const productDropdown = [
  { label: 'MiXR – Chest X-Ray AI', href: '/products/mixr' },
  { label: 'MiER – Emergency Radiology AI', href: '/products/mier' },
  { label: 'MiLung – Lung Cancer AI', href: '/products/milung' },
  { label: 'MiStroke – Stroke Care AI', href: '/products/mistroke' },
  { label: 'MiTrack – TB Monitoring', href: '/products/mitrack' },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [productOpen, setProductOpen] = useState(false);

  return (
    <nav className="relative z-40 bg-[#0A1823] px-6 py-5 md:px-8">
      <div className="mx-auto max-w-[81rem] xl:px-0">
        <div className="relative flex w-full items-center justify-between">
          {/* Logo */}
          <Link className="flex cursor-pointer items-center gap-2.5 flex-shrink-0" href="/">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-[#00DCCE] to-[#008280] flex items-center justify-center shadow-md">
              <span className="text-white font-bold text-sm tracking-wider">M</span>
            </div>
            <span className="text-white font-bold text-xl tracking-tight">MiPAAS</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden items-center gap-10 lg:flex">
            {/* Links */}
            <div className="flex items-center gap-8 font-medium">
              {navLinks.map((link) => (
                <div key={link.label} className="relative">
                  {link.hasDropdown ? (
                    <div
                      className="relative"
                      onMouseEnter={() => setProductOpen(true)}
                      onMouseLeave={() => setProductOpen(false)}
                    >
                      <Link
                        href={link.href}
                        className="inline-flex items-center gap-1.5 text-sm text-white hover:text-[#00DCCE] transition-colors focus:outline-none py-1 cursor-pointer"
                      >
                        {link.label}
                        <ChevronDown
                          className={`h-4 w-4 transition-transform duration-200 ${productOpen ? 'rotate-180' : ''}`}
                        />
                      </Link>
                      {productOpen && (
                        /* pt-2 (not margin) keeps the hover area connected, so the menu doesn't close on the way down */
                        <div className="absolute top-full left-0 pt-2 z-50">
                          <div className="w-72 rounded-xl bg-[#0A1823] border border-white/10 p-3 shadow-2xl">
                            {productDropdown.map((item) => (
                              <Link
                                key={item.label}
                                href={item.href}
                                onClick={() => setProductOpen(false)}
                                className="block px-3 py-2 text-sm text-gray-300 hover:text-[#00DCCE] rounded-lg hover:bg-white/5 transition-colors whitespace-nowrap"
                              >
                                {item.label}
                              </Link>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <Link
                      href={link.href}
                      className="text-sm text-white hover:text-[#00DCCE] transition-colors py-1"
                    >
                      {link.label}
                    </Link>
                  )}
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex items-center gap-4 flex-shrink-0">
              <Link
                href="/#contact"
                className="rounded-full border border-[#29333E] bg-gradient-to-r from-[#FF7869] to-[#98AED9] bg-clip-text px-5 py-2 text-sm font-medium text-transparent hover:ring-2 hover:ring-[#29333E]/50 transition-all whitespace-nowrap cursor-pointer"
              >
                Reach out to us
              </Link>
              <div className="flex items-center gap-2 rounded-xl bg-[#091927] px-3.5 py-2 text-white text-sm cursor-pointer hover:bg-[#0f2332] transition-colors border border-white/10 whitespace-nowrap">
                <Globe className="h-4 w-4 text-[#00DCCE]" />
                <span>Global</span>
                <ChevronDown className="h-3.5 w-3.5 text-gray-400" />
              </div>
            </div>
          </div>

          {/* Mobile hamburger */}
          <button
            type="button"
            className="text-white lg:hidden p-2 rounded-lg hover:bg-white/5"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>
      </div>

      {/* Mobile menu modal */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 bg-[#0A1823] p-6 flex flex-col justify-between overflow-y-auto">
          <div>
            <div className="flex items-center justify-between pb-6 border-b border-white/10">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-[#00DCCE] to-[#008280] flex items-center justify-center">
                  <span className="text-white font-bold text-sm">M</span>
                </div>
                <span className="text-white font-bold text-xl">MiPAAS</span>
              </div>
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                className="text-white p-2 hover:bg-white/10 rounded-lg"
                aria-label="Close menu"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="flex flex-col gap-1 mt-6">
              {navLinks.map((link) => (
                <div key={link.label}>
                  <Link
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="block text-lg text-white hover:text-[#00DCCE] py-2 transition-colors border-b border-white/5"
                  >
                    {link.label}
                  </Link>

                  {/* Product pages listed under "Products" on mobile */}
                  {link.hasDropdown && (
                    <div className="ml-4 mb-2 flex flex-col">
                      {productDropdown.map((item) => (
                        <Link
                          key={item.label}
                          href={item.href}
                          onClick={() => setMobileOpen(false)}
                          className="py-2 text-base text-gray-300 hover:text-[#00DCCE] transition-colors"
                        >
                          {item.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-3 pt-6 mt-6 border-t border-white/10">
            <Link
              href="/#contact"
              onClick={() => setMobileOpen(false)}
              className="w-full text-center rounded-full border border-[#29333E] bg-gradient-to-r from-[#FF7869] to-[#98AED9] bg-clip-text py-3 text-sm font-medium text-transparent cursor-pointer"
            >
              Reach out to us
            </Link>
            <div className="flex items-center justify-center gap-2 rounded-xl bg-[#091927] py-3 text-white text-sm">
              <Globe className="h-4 w-4 text-[#00DCCE]" />
              <span>Global</span>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
