'use client';

// What the platform detects and supports (no partner logos)
const capabilityTags = [
  'Pneumonia Detection',
  'Tuberculosis Screening',
  'Pleural Effusion',
  'Pneumothorax',
  'Cardiomegaly',
  'Lung Nodule Detection',
  'Atelectasis',
  'Consolidation',
  'Grad-CAM Heatmaps',
  'DICOM Support',
  'Deep Learning Models',
  'Instant Triage',
];

// Replaces the FDA / CE / GDPR / HIPAA badges
const trustBadges = [
  {
    name: 'DICOM Compatible',
    icon: (
      <path d="M4 6h16M4 12h16M4 18h10" strokeLinecap="round" />
    ),
  },
  {
    name: 'Explainable AI',
    icon: (
      <>
        <circle cx="11" cy="11" r="6" />
        <path d="M20 20l-4.5-4.5" strokeLinecap="round" />
      </>
    ),
  },
  {
    name: 'Privacy First',
    icon: (
      <>
        <rect x="5" y="11" width="14" height="9" rx="2" />
        <path d="M8 11V8a4 4 0 0 1 8 0v3" />
      </>
    ),
  },
  {
    name: 'Radiologist in the Loop',
    icon: (
      <>
        <circle cx="12" cy="8" r="4" />
        <path d="M4 21c1-4 4-6 8-6s7 2 8 6" strokeLinecap="round" />
      </>
    ),
  },
];

export default function PartnersSection() {
  return (
    <section className="bg-[#0A1823] py-8 overflow-hidden">
      {/* Tag slider */}
      <div className="relative mx-auto max-w-7xl overflow-hidden py-4">
        {/* Left & Right gradient fade masks */}
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 sm:w-36 bg-gradient-to-r from-[#0A1823] to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 sm:w-36 bg-gradient-to-l from-[#0A1823] to-transparent" />

        <div className="flex w-max items-center animate-marquee hover:[animation-play-state:paused]">
          {[...capabilityTags, ...capabilityTags].map((name, i) => (
            <div
              key={i}
              className="mx-6 flex h-14 items-center justify-center px-4 rounded-xl border border-white/10 bg-white/[0.03] text-sm font-medium text-gray-300 whitespace-nowrap hover:border-white/25 hover:text-white transition-all shadow-sm"
            >
              {name}
            </div>
          ))}
        </div>
      </div>

      {/* Divider */}
      <div className="mx-auto max-w-[81rem] h-[1px] w-full bg-gradient-to-r from-transparent via-[#C0CCDA]/25 to-transparent my-6" />

      {/* Trust badges */}
      <div className="mx-auto w-full max-w-4xl px-6 py-4">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 items-center justify-center">
          {trustBadges.map((badge) => (
            <div
              key={badge.name}
              className="flex items-center justify-center gap-2.5 h-12 px-3 rounded-xl border border-white/15 bg-white/5 text-sm font-semibold text-gray-200 hover:border-[#00DCCE]/50 hover:text-white transition-colors"
            >
              <svg
                viewBox="0 0 24 24"
                className="h-5 w-5 flex-none text-[#00DCCE]"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                aria-hidden="true"
              >
                {badge.icon}
              </svg>
              <span className="whitespace-nowrap">{badge.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}