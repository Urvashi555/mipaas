import type { Product } from '@/data/products';

/** The response shape your backend should return. */
export type Finding = {
  label: string;
  confidence: number; // 0 to 100
  box?: { x: number; y: number; w: number; h: number }; // 0 to 1, relative to the image
};

export type AnalysisResult = {
  priority: 'urgent' | 'review' | 'routine';
  findings: Finding[];
  impression: string;
  heatmapUrl?: string; // optional overlay image
  processingSeconds?: number;
};

const API_URL = process.env.NEXT_PUBLIC_API_URL;

/** True while no backend address is set (sample results are shown). */
export const isDemo = !API_URL;

/**
 * Sends the image to the backend.
 * Request:  POST {API_URL}/analyze   (multipart form: "image" file, "product" slug)
 * Response: JSON matching AnalysisResult above
 */
export async function analyzeImage(file: File, product: Product): Promise<AnalysisResult> {
  if (!API_URL) return mockResult(file, product);

  const body = new FormData();
  body.append('image', file);
  body.append('product', product.slug);

  const res = await fetch(`${API_URL}/analyze`, { method: 'POST', body });
  if (!res.ok) throw new Error(`The server returned an error (${res.status}). Please try again.`);
  return (await res.json()) as AnalysisResult;
}

// ---- Sample results for demo mode (delete once the backend is live) ----
function seeded(seed: number) {
  return () => {
    seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
    return seed / 4294967296;
  };
}

async function mockResult(file: File, product: Product): Promise<AnalysisResult> {
  await new Promise((r) => setTimeout(r, 2000));
  const rand = seeded(file.size + file.name.length * 31);
  const findings: Finding[] = product.detects
    .slice(0, 5)
    .map((label) => {
      const confidence = Math.round(8 + rand() * 88);
      return {
        label,
        confidence,
        box: { x: 0.15 + rand() * 0.45, y: 0.15 + rand() * 0.45, w: 0.2, h: 0.2 },
      };
    })
    .sort((a, b) => b.confidence - a.confidence);
  const top = findings[0].confidence;
  return {
    priority: top >= 75 ? 'urgent' : top >= 50 ? 'review' : 'routine',
    findings,
    impression: `Sample impression: ${findings[0].label.toLowerCase()} suspected (${top}%). Please review the marked area.`,
    processingSeconds: 2.1,
  };
}