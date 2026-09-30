'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';

type Card = {
  title: string;
  subtitle: string;
  points: string[];
  buttonText: string;
  accent: string;
  bgImage: string;
  modal: {
    heading: string;
    intro: string;
    items: { title: string; text: string }[];
    ctaText: string;
    ctaHref: string;
  };
};

const cards: Card[] = [
  {
    title: 'The problem we are solving:',
    subtitle: ' Faster reading of medical images',
    points: [
      'Chest X-rays are one of the most common scans, and reading each one takes a radiologist time.',
      'Urgent cases can wait in the same queue as routine ones.',
      'Clinics in smaller towns often have no radiologist on site.',
    ],
    buttonText: 'Explore Our Impact',
    accent: '#FF7869',
    bgImage: '/hero/xray.jpg',
    modal: {
      heading: 'The impact we are aiming for',
      intro:
        'MiPAAS is a student project. These are the goals we designed it around, not results we have already measured.',
      items: [
        { title: 'Faster triage', text: 'Rank scans by urgency so serious cases are read first.' },
        { title: 'Wider access', text: 'Give clinics without a radiologist a quick second opinion to work from.' },
        { title: 'Less repetitive work', text: 'Draft the report so doctors spend their time reviewing, not typing.' },
        { title: 'Results you can check', text: 'Highlighted areas show where the AI looked, so nothing is a black box.' },
      ],
      ctaText: 'See our products',
      ctaHref: '/products',
    },
  },
  {
    title: 'What MiPAAS offers:',
    subtitle: ' AI support for doctors, not a replacement',
    points: [
      'Upload an X-ray, CT or MRI image and get a report in seconds.',
      'Highlighted areas show where the AI looked, so results can be checked.',
      'Urgent scans are ranked first, and a doctor always reviews the final report.',
    ],
    buttonText: 'See How It Works',
    accent: '#00DCCE',
    bgImage: '/hero/doctor.jpg',
    modal: {
      heading: 'How MiPAAS works',
      intro: 'Three steps from scan to report.',
      items: [
        { title: '1. Upload', text: 'Choose a product, then drop in a PNG or JPG scan.' },
        { title: '2. Analyse', text: 'The AI scores each possible finding and marks the areas it looked at.' },
        { title: '3. Review', text: 'A draft report appears. The doctor edits it, downloads it or prints it.' },
      ],
      ctaText: 'Try it now',
      ctaHref: '/products/mixr',
    },
  },
];

function Modal({ card, onClose }: { card: Card; onClose: () => void }) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const { modal } = card;

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
        aria-labelledby="impact-modal-title"
        onClick={(e) => e.stopPropagation()}
        className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-white/15 bg-[#0A1823] p-6 shadow-2xl sm:p-8"
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

        <span className="block h-1 w-12 rounded-full" style={{ background: card.accent }} />
        <h3
          id="impact-modal-title"
          className="mt-4 pr-10 text-2xl font-bold text-white sm:text-3xl"
          style={{ fontFamily: "'Josefin Sans', sans-serif" }}
        >
          {modal.heading}
        </h3>
        <p className="mt-2 text-gray-300 leading-relaxed">{modal.intro}</p>

        <ul className="mt-6 space-y-4">
          {modal.items.map((item) => (
            <li key={item.title} className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
              <div className="font-semibold text-white">{item.title}</div>
              <p className="mt-1 text-sm leading-relaxed text-gray-300">{item.text}</p>
            </li>
          ))}
        </ul>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href={modal.ctaHref}
            onClick={onClose}
            className="inline-flex items-center justify-center rounded-full bg-[#FF7869] px-7 py-3 text-sm font-semibold text-white transition-all hover:bg-[#ff6554] hover:shadow-[0_0_20px_rgba(255,120,105,0.4)]"
          >
            {modal.ctaText}
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

export default function ImpactSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="impact" className="w-full py-16 md:py-24 bg-[#0F2332] scroll-mt-28">
      <div className="mx-auto max-w-[81rem] px-6 md:px-8 xl:px-0">
        {/* Three shared rows (heading / button / box) so both columns line up */}
        <div className="grid grid-cols-1 gap-x-10 gap-y-14 md:grid-cols-2 md:grid-rows-[auto_auto_1fr] md:gap-y-6 lg:gap-x-14 w-full">
          {cards.map((card, i) => (
            <div
              key={card.title}
              className="flex flex-col gap-6 md:row-span-3 md:[display:grid] md:[grid-template-rows:subgrid] md:gap-y-6"
            >
              {/* Row 1: heading */}
              <h2 className="text-2xl sm:text-3xl lg:text-[40px] leading-[1.15] font-semibold tracking-tight">
                <span className="text-[#D9DBDD]">{card.title}</span>
                <span className="text-[#81878D]">{card.subtitle}</span>
              </h2>

              {/* Row 2: button */}
              <div>
                <button
                  type="button"
                  onClick={() => setOpenIndex(i)}
                  aria-haspopup="dialog"
                  className="bg-[#FF7869] text-white rounded-full px-8 py-3 text-sm font-medium hover:bg-[#ff6554] hover:shadow-[0_0_20px_rgba(255,120,105,0.4)] transition-all cursor-pointer inline-flex items-center justify-center"
                >
                  {card.buttonText}
                </button>
              </div>

              {/* Row 3: one box per column with a faded photo behind the points */}
              <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#0A1823] shadow-xl">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={card.bgImage}
                  alt=""
                  aria-hidden="true"
                  className="absolute inset-0 h-full w-full object-cover opacity-40"
                />
                {/* Navy layer keeps the text readable over the photo */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#0A1823]/85 via-[#0A1823]/75 to-[#0A1823]/85" />

                <ul className="relative z-10 flex h-full flex-col justify-center divide-y divide-white/15 p-6 sm:p-8">
                  {card.points.map((point, n) => (
                    <li key={point} className="flex items-start gap-4 py-5 first:pt-0 last:pb-0">
                      <span
                        className="grid h-9 w-9 flex-none place-items-center rounded-full text-sm font-bold text-[#0A1823]"
                        style={{ background: card.accent }}
                        aria-hidden="true"
                      >
                        {n + 1}
                      </span>
                      <p className="text-base sm:text-lg leading-relaxed text-gray-100">{point}</p>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>

      {openIndex !== null && <Modal card={cards[openIndex]} onClose={() => setOpenIndex(null)} />}
    </section>
  );
}