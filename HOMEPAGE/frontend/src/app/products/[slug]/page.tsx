import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ImageAnalyzer from '@/components/ImageAnalyzer';
import { products, getProduct } from '@/data/products';

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const p = getProduct(slug);
  return { title: p ? `${p.name} – ${p.subtitle} | MiPAAS` : 'Product | MiPAAS' };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const p = getProduct(slug);
  if (!p) notFound();

  return (
    <>
      
      <Navbar />
      <main className="bg-[#0E273A] text-white">
        <div className="mx-auto max-w-[81rem] px-6 py-10 md:px-8 lg:py-14 xl:px-0">
          <Link href="/products" className="text-sm text-gray-300 hover:text-white">← All products</Link>

          <header className="mb-8 mt-4 max-w-3xl">
            <span className="inline-block rounded-full px-4 py-1.5 text-xs font-semibold" style={{ background: `${p.accent}22`, color: p.accent }}>
              {p.category}
            </span>
            <h1 className="mt-4 text-4xl font-bold tracking-tight lg:text-5xl" style={{ fontFamily: "'Josefin Sans', sans-serif" }}>
              {p.name}: {p.subtitle}
            </h1>
            <p className="mt-3 text-lg leading-relaxed text-gray-300">{p.description}</p>
          </header>

          <ImageAnalyzer product={p} />

          <div className="mt-10">
            <h2 className="mb-4 text-lg font-semibold">What {p.name} looks for</h2>
            <div className="flex flex-wrap gap-3">
              {p.detects.map((d) => (
                <span key={d} className="rounded-full border border-white/15 bg-white/[0.04] px-4 py-2 text-sm text-gray-200">{d}</span>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}