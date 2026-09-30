'use client';
import { useState } from 'react';
import Link from 'next/link';

const pathways = [
  {
    id: 'chest-xray',
    title: 'Faster Reading of Chest X-rays',
    description:
      'MiXR looks at a chest X-ray and scores possible findings such as pneumonia, pleural effusion and signs of tuberculosis. Highlighted areas show where it looked, and urgent scans move to the top of the list.',
    bg: 'bg-gradient-to-br from-[#0F2332] to-[#98AED9]/40',
    image: '/hero/xray.jpg',
    accentColor: '#98AED9',
    label: 'Chest X-ray',
    href: '/products/mixr',
    buttonText: 'Try MiXR',
  },
  {
    id: 'stroke',
    title: 'Quicker Checks of Brain Scans in Stroke',
    description:
      'MiStroke reviews head CT and MRI images for signs of bleeding or blocked blood flow and flags urgent cases, so the care team can decide on treatment sooner.',
    bg: 'bg-gradient-to-br from-[#008280] to-[#0E273A]',
    image: '/hero/mri.jpg',
    accentColor: '#00DCCE',
    label: 'Stroke Care',
    href: '/products/mistroke',
    buttonText: 'Try MiStroke',
  },
  {
    id: 'doctor-review',
    title: 'AI Drafts the Report, the Doctor Decides',
    description:
      'Every result comes with a draft report that the doctor can edit, download or print. MiPAAS supports the clinician\u2019s judgement and never replaces it.',
    bg: 'bg-gradient-to-br from-[#008280] to-[#0A1823]',
    image: '/hero/doctor.jpg',
    accentColor: '#00DCCE',
    label: 'Doctor in the Loop',
    href: '/products',
    buttonText: 'See all products',
  },
];

export default function PathwaysSection() {
  const [activeCard, setActiveCard] = useState(0);

  return (
    <section id="products" className="bg-[#0F2332] py-16 md:py-24 scroll-mt-28">
      <div className="mx-auto max-w-[81rem] px-6 md:px-8 xl:px-0">
        <h2 className="text-center text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-[#01DCBE] to-[#98AED9] bg-clip-text text-transparent pb-8 md:pb-14">
          Transforming Healthcare Pathways with AI
        </h2>

        {/* Mobile vertical stack */}
        <div className="flex flex-col gap-6 md:hidden">
          {pathways.map((card) => (
            <div
              key={card.id}
              className={`rounded-2xl overflow-hidden relative min-h-[460px] ${card.bg} border border-white/10 flex flex-col justify-end p-6 shadow-xl`}
            >
              {/* Background image */}
              <div className="absolute inset-0 z-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={card.image}
                  alt=""
                  className="w-full h-full object-cover opacity-60"
                  onError={(e) => { (e.currentTarget as HTMLElement).style.display = 'none'; }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0F2332] via-[#0F2332]/60 to-transparent" />
              </div>

              <div className="relative z-10 flex flex-col gap-3">
                <span
                  className="w-fit text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-full bg-white/10 backdrop-blur-md"
                  style={{ color: card.accentColor }}
                >
                  {card.label}
                </span>
                <h3 className="text-white text-xl font-bold leading-snug">
                  {card.title}
                </h3>
                <p className="text-sm text-gray-300 leading-relaxed">
                  {card.description}
                </p>
                <Link
                  href={card.href}
                  className="mt-3 rounded-full border border-white/80 px-6 py-2.5 text-xs font-semibold text-white hover:bg-white hover:text-[#0F2332] transition-colors w-fit"
                >
                  {card.buttonText}
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop interactive accordion */}
        <div className="hidden md:flex gap-4 w-full h-[520px] lg:h-[620px]">
          {pathways.map((card, i) => {
            const isActive = activeCard === i;
            return (
              <div
                key={card.id}
                onMouseEnter={() => setActiveCard(i)}
                onFocus={() => setActiveCard(i)}
                style={{
                  flex: isActive ? 2.2 : 1,
                  transition: 'flex 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                }}
                className={`relative rounded-2xl overflow-hidden cursor-pointer ${card.bg} border border-white/10 shadow-xl group`}
              >
                {/* Background image */}
                <div className="absolute inset-0 z-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={card.image}
                    alt=""
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    style={{ opacity: isActive ? 0.75 : 0.45 }}
                    onError={(e) => { (e.currentTarget as HTMLElement).style.display = 'none'; }}
                  />
                  <div
                    className="absolute inset-0 bg-gradient-to-t from-[#0A1823] via-[#0A1823]/50 to-transparent"
                    style={{ opacity: isActive ? 0.9 : 0.7 }}
                  />
                </div>

                {/* Card content */}
                <div className="relative z-10 h-full p-8 lg:p-10 flex flex-col justify-end">
                  <div className="flex flex-col gap-3">
                    <span
                      className="w-fit text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-full bg-white/10 backdrop-blur-md"
                      style={{ color: card.accentColor }}
                    >
                      {card.label}
                    </span>

                    <h3 className="text-white text-xl lg:text-2xl xl:text-3xl font-bold leading-tight">
                      {card.title}
                    </h3>

                    {/* Smooth disclosure for description */}
                    <div
                      className="overflow-hidden transition-all duration-500"
                      style={{
                        maxHeight: isActive ? '220px' : '0px',
                        opacity: isActive ? 1 : 0,
                      }}
                    >
                      <p className="text-sm lg:text-base text-gray-300 leading-relaxed pt-2">
                        {card.description}
                      </p>
                      <Link
                        href={card.href}
                        tabIndex={isActive ? 0 : -1}
                        className="mt-5 inline-block rounded-full border border-white px-7 py-2.5 text-sm font-semibold text-white hover:bg-white hover:text-[#008280] transition-colors"
                      >
                        {card.buttonText}
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}