'use client';
import { useState } from 'react';
import { X, ArrowRight } from 'lucide-react';

export default function AnnouncementBar() {
  const [visible, setVisible] = useState(true);
  if (!visible) return null;

  return (
    <div className="bg-[#008280] sticky top-0 z-50">
      <div className="relative mx-auto max-w-[81rem] px-6 sm:px-8 xl:px-0 overflow-hidden">
        <a
          href="#evidence"
          className="group flex flex-row items-center justify-center gap-3 sm:gap-4 py-2.5 sm:py-3.5 pr-8"
        >
          <div className="flex-shrink-0 flex justify-center items-center">
            <span className="rounded-full bg-[#00DCCE] px-2.5 py-0.5 text-[10px] sm:text-xs font-bold text-[#008280]">
              NEW
            </span>
          </div>

          <div className="flex justify-center items-center min-w-0">
            <p className="cursor-pointer text-center text-xs sm:text-sm text-gray-100 lg:text-base font-medium truncate">
              MiPAAS Recognized Among TIME&apos;s 100 Most Innovative AI Platforms of 2025
            </p>
          </div>

          <div className="flex-shrink-0 flex justify-center items-center">
            <div className="flex h-5 w-5 items-center justify-center rounded-full bg-white transition-transform duration-300 group-hover:translate-x-1">
              <ArrowRight className="h-3 w-3 text-[#008280]" />
            </div>
          </div>
        </a>

        <button
          type="button"
          onClick={() => setVisible(false)}
          aria-label="Close announcement"
          className="absolute right-4 top-1/2 -translate-y-1/2 z-50 h-5 w-5 flex items-center justify-center text-white/80 hover:text-white transition-colors cursor-pointer"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
