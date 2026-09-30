'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';


const IMAGES = {
  featured: 'https://t4.ftcdn.net/jpg/05/05/10/61/360_F_505106152_xWHMoW0DmIxVHuczIQZeATHfYj3rPghd.jpg', // large card, top left (works best as a tall or square photo)
  roadmap: 'https://img.magnific.com/free-photo/unrecognizable-doctor-extending-digital-tab-anonymous-patient-fill-questionnaire_1098-19318.jpg?semt=ais_hybrid&w=740&q=80', // small card, top right (wide photo)
  blog: 'https://media.istockphoto.com/id/1976099664/photo/artificial-intelligence-processor-concept-ai-big-data-array.jpg?s=612x612&w=0&k=20&c=rTtWP9ywxZM_BygzURikdoWRHnO4ohD73Z-RDAg_u8M=', // blog card, bottom right (tall or square photo works well)
};

const blog = {
  label: 'Blog',
  title: 'How AI Can Help Read Chest X-rays Faster',
  intro:
    'Chest X-rays are one of the most common medical scans. Here is how AI can support the people who read them.',
  sections: [
    {
      heading: 'The problem',
      text: 'Every chest X-ray needs a trained person to read it. When many scans arrive at once, an urgent case can end up waiting behind routine ones. In smaller clinics there may be no radiologist on site at all.',
    },
    {
      heading: 'What AI can do',
      text: 'An AI model can screen each image as soon as it is uploaded. It scores possible findings, such as pneumonia or pleural effusion, and moves the scans that look most serious to the top of the list.',
    },
    {
      heading: 'Showing its work',
      text: 'A score on its own is hard to trust. Highlighted areas on the image show where the AI looked, so a doctor can quickly agree or disagree with the result.',
    },
    {
      heading: 'The doctor decides',
      text: 'AI is a support tool, not a replacement. It prepares a draft report, and the doctor reviews, edits and signs it.',
    },
  ],
  ctaText: 'Try MiXR',
  ctaHref: '/products/mixr',
};

/* Shows the image if a link is set, otherwise a light placeholder box */
function ImageSlot({ src, alt, slotName, className = '' }: { src: string; alt: string; slotName: string; className?: string }) {
  const [failed, setFailed] = useState(false);
  const show = src && !failed;

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {show ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt={alt} onError={() => setFailed(true)} className="absolute inset-0 h-full w-full object-cover" />
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 border-2 border-dashed border-slate-300 bg-slate-100 p-4 text-center">
          <svg viewBox="0 0 24 24" className="h-8 w-8 text-slate-400" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <rect x="3" y="4" width="18" height="16" rx="2" />
            <circle cx="9" cy="10" r="1.6" />
            <path d="M21 16l-5-5-8 8" />
          </svg>
          <p className="text-xs font-semibold text-slate-600">Image goes here</p>
          <p className="text-[11px] text-slate-500">
            {failed ? 'The link could not be loaded. Check ' : 'Paste a link in '}
            <code className="rounded bg-slate-200 px-1 text-slate-700">IMAGES.{slotName}</code>
          </p>
        </div>
      )}
    </div>
  );
}

function BlogModal({ onClose }: { onClose: () => void }) {
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement | null;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);

    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
      previouslyFocused?.focus();
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="blog-modal-title"
        onClick={(e) => e.stopPropagation()}
        className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-white/15 bg-[#0A1823] p-6 text-white shadow-2xl sm:p-8"
      >
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 rounded-lg p-2 text-gray-300 hover:bg-white/10 hover:text-white"
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>

        <span className="inline-block rounded-full bg-[#00DCCE]/10 px-3 py-1 text-xs font-semibold text-[#00DCCE]">
          {blog.label}
        </span>
        <h3
          id="blog-modal-title"
          className="mt-4 pr-10 text-2xl font-bold sm:text-3xl"
          style={{ fontFamily: "'Josefin Sans', sans-serif" }}
        >
          {blog.title}
        </h3>
        <p className="mt-3 text-lg leading-relaxed text-gray-300">{blog.intro}</p>

        <div className="mt-6 space-y-5">
          {blog.sections.map((s) => (
            <div key={s.heading}>
              <h4 className="text-lg font-semibold text-white">{s.heading}</h4>
              <p className="mt-1 leading-relaxed text-gray-300">{s.text}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href={blog.ctaHref}
            onClick={onClose}
            className="inline-flex items-center justify-center rounded-full bg-[#FF7869] px-7 py-3 text-sm font-semibold text-white transition-all hover:bg-[#ff6554] hover:shadow-[0_0_20px_rgba(255,120,105,0.4)]"
          >
            {blog.ctaText}
          </Link>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-white/25 px-7 py-3 text-sm font-semibold text-white hover:bg-white/10"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default function DevelopmentsSection() {
  const [blogOpen, setBlogOpen] = useState(false);

  return (
    <section id="evidence" className="w-full bg-[#0F2332] py-16 md:py-24 scroll-mt-28">
      <div className="mx-auto max-w-[81rem] px-6 md:px-8 xl:px-0">
        <h2 className="text-center text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-[#01DCBE] to-[#98AED9] bg-clip-text text-transparent pb-8 md:pb-12">
          Explore Our Latest Developments
        </h2>

        {/* Row 1: Featured (2/3) + Roadmap (1/3) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Card 1: project update */}
          <div className="lg:col-span-2 bg-white rounded-2xl p-6 sm:p-10 flex flex-col sm:flex-row gap-8 justify-between shadow-xl overflow-hidden relative">
            <div className="sm:w-1/2 flex flex-col justify-between gap-6 z-10">
              <div>
                <span className="inline-block text-xs uppercase tracking-wider font-semibold text-[#0B6E78] bg-[#0B6E78]/10 px-3 py-1 rounded-full mb-3">
                  Project Update
                </span>
                <h3 className="text-[#0F2332] text-2xl sm:text-3xl font-semibold leading-snug mb-3">
                  MiXR: Upload a Chest X-ray and Get a Draft Report
                </h3>
                <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                  Our first tool is ready to try. Upload a scan, see the findings ranked by confidence, check the highlighted areas and edit the draft report.
                </p>
              </div>

              <div>
                <p className="text-slate-500 text-xs sm:text-sm leading-relaxed mb-5">
                  Built by the MiPAAS student team
                </p>
                <div className="flex flex-wrap gap-3">
                  <Link
                    href="/products/mixr"
                    className="inline-block rounded-full bg-[#FF7869] text-white hover:bg-[#ff6554] px-7 py-2.5 text-sm font-semibold transition-all cursor-pointer"
                  >
                    Try MiXR
                  </Link>
                  <Link
                    href="/products"
                    className="inline-block rounded-full border border-[#0F2332]/30 text-[#0F2332] hover:bg-[#0F2332] hover:text-white px-7 py-2.5 text-sm font-semibold transition-all cursor-pointer"
                  >
                    All products
                  </Link>
                </div>
              </div>
            </div>

            <ImageSlot
              src={IMAGES.featured}
              alt="MiXR chest X-ray analysis"
              slotName="featured"
              className="sm:w-1/2 h-[260px] sm:h-auto rounded-xl shadow-md"
            />
          </div>

          {/* Card 2: roadmap (keeps id="insights" so the navbar link still works) */}
          <div id="insights" className="bg-white rounded-2xl p-6 flex flex-col justify-between gap-6 shadow-xl scroll-mt-28">
            <div className="flex flex-col gap-4">
              <ImageSlot
                src={IMAGES.roadmap}
                alt="Roadmap"
                slotName="roadmap"
                className="h-44 rounded-xl"
              />

              <div className="flex items-center gap-2 text-xs text-slate-500">
                <span className="text-[#0B6E78] font-semibold">Roadmap</span>
                <span>•</span>
                <span>Coming next</span>
              </div>

              <h4 className="text-[#0F2332] text-lg font-semibold leading-snug">
                Next step: connecting a trained AI model to the report screens
              </h4>
              <p className="text-sm leading-relaxed text-slate-600">
                The upload and report screens are ready and currently show sample results. Once the model is connected, real findings will replace them.
              </p>
            </div>

            <Link
              href="/products"
              className="w-full text-center rounded-full border border-[#0F2332]/30 text-[#0F2332] hover:bg-[#0F2332] hover:text-white py-2.5 text-xs font-semibold transition-all cursor-pointer"
            >
              See the products
            </Link>
          </div>
        </div>

        {/* Row 2: Team (1/3) + Blog (2/3) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Card 3: team */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 flex flex-col justify-between shadow-xl">
            <div>
              <span className="text-xs uppercase tracking-wider font-semibold text-[#0B6E78] bg-[#0B6E78]/10 px-3 py-1 rounded-full">
                Our Team
              </span>
              <h4 className="text-[#0F2332] text-xl font-bold mt-4 mb-2">
                Meet the MiPAAS team
              </h4>
              <p className="text-slate-600 text-sm leading-relaxed">
                We are students building AI tools that support doctors in reading medical images. Feedback from clinicians, teachers and mentors helps us improve.
              </p>
            </div>

            <div className="pt-6 border-t border-slate-200 mt-6 flex items-center justify-between">
              <span className="text-xs text-slate-500">Questions or feedback?</span>
              <Link href="/#contact" className="text-xs font-semibold text-[#0B6E78] hover:underline">
                Contact us &rarr;
              </Link>
            </div>
          </div>

          {/* Card 4: blog (image on one side, text on the other) */}
          <div className="lg:col-span-2 flex flex-col sm:flex-row overflow-hidden rounded-2xl bg-white shadow-xl">
            <ImageSlot
              src={IMAGES.blog}
              alt="Blog"
              slotName="blog"
              className="h-[220px] sm:h-auto sm:min-h-[320px] sm:w-2/5"
            />
            <div className="flex flex-1 flex-col justify-center p-6 sm:p-10">
              <span className="mb-3 w-fit rounded-full bg-[#0B6E78]/10 px-3 py-1 text-xs font-semibold text-[#0B6E78]">
                {blog.label}
              </span>
              <h3 className="text-[#0F2332] text-xl sm:text-2xl lg:text-3xl font-bold mb-2">
                {blog.title}
              </h3>
              <p className="mb-5 text-sm sm:text-base leading-relaxed text-slate-600">{blog.intro}</p>
              <button
                type="button"
                onClick={() => setBlogOpen(true)}
                aria-haspopup="dialog"
                className="w-fit cursor-pointer rounded-full bg-[#FF7869] px-7 py-2.5 text-sm font-semibold text-white transition-all hover:bg-[#ff6554]"
              >
                Read The Full Blog
              </button>
            </div>
          </div>
        </div>
      </div>

      {blogOpen && <BlogModal onClose={() => setBlogOpen(false)} />}
    </section>
  );
}