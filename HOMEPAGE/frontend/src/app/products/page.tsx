import Link from 'next/link';
import type { Metadata } from 'next';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { products } from '@/data/products';

export const metadata: Metadata = { title: 'Products | MiPAAS' };

export default function ProductsPage() {
  return (
    <>
      
      <Navbar />
      <main className="bg-[#0E273A] text-white">
        <div className="mx-auto max-w-[81rem] px-6 py-14 md:px-8 lg:py-20 xl:px-0">
          <h1 className="mb-4 text-4xl font-bold tracking-tight lg:text-6xl" style={{ fontFamily: "'Josefin Sans', sans-serif" }}>
            Our products
          </h1>
          <p className="mb-10 max-w-2xl text-lg text-gray-300">Choose a product, upload a scan and get a report.</p>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {products.map((p) => (
              <Link
                key={p.slug}
                href={`/products/${p.slug}`}
                className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition-colors hover:border-white/30 hover:bg-white/[0.06]"
              >
                <div className="mb-5 grid h-12 w-12 place-items-center rounded-xl text-lg font-bold" style={{ background: `${p.accent}22`, color: p.accent }}>
                  {p.name.slice(2, 3)}
                </div>
                <div className="text-2xl font-bold" style={{ fontFamily: "'Josefin Sans', sans-serif" }}>{p.name}</div>
                <div className="mb-3 text-gray-300">{p.subtitle}</div>
                <p className="text-sm leading-relaxed text-gray-400">{p.description}</p>
                <div className="mt-4 text-sm font-semibold" style={{ color: p.accent }}>Upload a scan</div>
              </Link>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}