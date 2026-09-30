'use client';

import { useEffect, useRef, useState } from 'react';
import type { Product } from '@/data/products';
import { analyzeImage, isDemo, type AnalysisResult } from '@/lib/api';

type Status = 'idle' | 'ready' | 'analysing' | 'done' | 'error';

const PRIORITY = {
  urgent: { text: 'Urgent', cls: 'bg-[#FF7869]/20 text-[#FF9A8D] border-[#FF7869]/40' },
  review: { text: 'Needs review', cls: 'bg-[#FFB86B]/20 text-[#FFC98F] border-[#FFB86B]/40' },
  routine: { text: 'Routine', cls: 'bg-[#7BD88F]/20 text-[#9BE6AB] border-[#7BD88F]/40' },
};

function Step({ n, label, active, done }: { n: number; label: string; active: boolean; done: boolean }) {
  return (
    <div className="flex items-center gap-2.5">
      <span
        className={`grid h-7 w-7 place-items-center rounded-full text-xs font-bold ${
          done ? 'bg-[#00DCCE] text-[#0A1823]' : active ? 'bg-white text-[#0A1823]' : 'bg-white/10 text-gray-400'
        }`}
      >
        {done ? '✓' : n}
      </span>
      <span className={`text-sm font-medium ${active || done ? 'text-white' : 'text-gray-400'}`}>{label}</span>
    </div>
  );
}

export default function ImageAnalyzer({ product }: { product: Product }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [url, setUrl] = useState<string | null>(null);
  const [status, setStatus] = useState<Status>('idle');
  const [drag, setDrag] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [impression, setImpression] = useState('');
  const [showMarks, setShowMarks] = useState(true);

  useEffect(() => () => { if (url) URL.revokeObjectURL(url); }, [url]);

  function pick(f?: File | null) {
    if (!f) return;
    if (!f.type.startsWith('image/')) {
      setError('Please choose a PNG or JPG image.');
      return;
    }
    if (f.size > 20 * 1024 * 1024) {
      setError('This file is larger than 20 MB. Please choose a smaller image.');
      return;
    }
    setError('');
    setResult(null);
    setFile(f);
    setUrl(URL.createObjectURL(f));
    setStatus('ready');
  }

  async function run() {
    if (!file) return;
    setStatus('analysing');
    setError('');
    try {
      const r = await analyzeImage(file, product);
      setResult(r);
      setImpression(r.impression);
      setStatus('done');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong. Please try again.');
      setStatus('error');
    }
  }

  function reset() {
    setFile(null);
    setUrl(null);
    setResult(null);
    setError('');
    setStatus('idle');
    if (inputRef.current) inputRef.current.value = '';
  }

  function download() {
    if (!result || !file) return;
    const text = [
      `${product.name} – ${product.subtitle}`,
      `File: ${file.name}`,
      `Date: ${new Date().toLocaleString()}`,
      `Priority: ${PRIORITY[result.priority].text}`,
      '',
      'Findings',
      ...result.findings.map((f) => `- ${f.label}: ${f.confidence}%`),
      '',
      'Impression',
      impression,
    ].join('\n');
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([text], { type: 'text/plain' }));
    a.download = `${product.slug}-report.txt`;
    a.click();
    URL.revokeObjectURL(a.href);
  }

  const busy = status === 'analysing';

  return (
    <div>
      {/* Progress */}
      <div className="mb-6 flex flex-wrap items-center gap-x-8 gap-y-3">
        <Step n={1} label="Upload image" active={status === 'idle'} done={status !== 'idle'} />
        <Step n={2} label="Analyse" active={status === 'ready' || busy || status === 'error'} done={status === 'done'} />
        <Step n={3} label="View report" active={status === 'done'} done={false} />
        {isDemo && (
          <span className="ml-auto rounded-full border border-[#FFB86B]/40 bg-[#FFB86B]/10 px-3 py-1 text-xs font-semibold text-[#FFC98F]">
            Demo mode · sample results
          </span>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        {/* Image panel */}
        <section className="lg:col-span-3 rounded-2xl border border-white/10 bg-[#0A1823] p-4 sm:p-6" aria-label="Image upload">
          {!url ? (
            <div
              role="button"
              tabIndex={0}
              onClick={() => inputRef.current?.click()}
              onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && inputRef.current?.click()}
              onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
              onDragLeave={() => setDrag(false)}
              onDrop={(e) => { e.preventDefault(); setDrag(false); pick(e.dataTransfer.files?.[0]); }}
              className={`flex min-h-[420px] cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed px-6 text-center transition-colors ${
                drag ? 'border-[#00DCCE] bg-[#00DCCE]/10' : 'border-white/20 hover:border-white/40 hover:bg-white/[0.03]'
              }`}
            >
              <div className="grid h-16 w-16 place-items-center rounded-2xl" style={{ background: `${product.accent}22` }}>
                <svg viewBox="0 0 24 24" className="h-8 w-8" fill="none" stroke={product.accent} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M12 16V4M7 9l5-5 5 5M4 16v3a1 1 0 001 1h14a1 1 0 001-1v-3" />
                </svg>
              </div>
              <p className="mt-5 text-lg font-semibold">Drop your {product.accepts.toLowerCase()} here</p>
              <p className="mt-1 text-sm text-gray-400">or click to browse · PNG or JPG · up to 20 MB</p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-4">
              <div className="relative inline-block max-w-full overflow-hidden rounded-xl bg-black">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={url} alt="Uploaded scan" className="block max-h-[520px] w-auto max-w-full" />

                {status === 'done' && showMarks && result && (
                  <div className="pointer-events-none absolute inset-0">
                    {result.heatmapUrl && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={result.heatmapUrl} alt="" className="absolute inset-0 h-full w-full object-fill opacity-60 mix-blend-screen" />
                    )}
                    {result.findings.filter((f) => f.box && f.confidence >= 50).map((f) => (
                      <div
                        key={f.label}
                        className="absolute rounded-md border-2 border-dashed"
                        style={{
                          left: `${f.box!.x * 100}%`,
                          top: `${f.box!.y * 100}%`,
                          width: `${f.box!.w * 100}%`,
                          height: `${f.box!.h * 100}%`,
                          borderColor: product.accent,
                          background: `${product.accent}22`,
                        }}
                      >
                        <span className="absolute -top-6 left-0 whitespace-nowrap rounded px-1.5 py-0.5 text-[11px] font-semibold text-[#0A1823]" style={{ background: product.accent }}>
                          {f.label} {f.confidence}%
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {busy && (
                  <div className="absolute inset-0 grid place-items-center bg-[#0A1823]/75 backdrop-blur-[2px]">
                    <div className="text-center">
                      <div className="mx-auto h-11 w-11 animate-spin rounded-full border-4 border-white/20 border-t-[#00DCCE]" />
                      <p className="mt-3 text-sm font-medium">Analysing your image…</p>
                    </div>
                  </div>
                )}
              </div>

              <p className="max-w-full truncate text-sm text-gray-400">{file?.name}</p>

              <div className="flex flex-wrap justify-center gap-3">
                <button
                  onClick={run}
                  disabled={busy}
                  className="rounded-full bg-[#FF7869] px-7 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#ff6857] disabled:opacity-50"
                >
                  {status === 'done' || status === 'error' ? 'Analyse again' : 'Generate report'}
                </button>
                <button onClick={reset} disabled={busy} className="rounded-full border border-white/25 px-7 py-3 text-sm font-semibold hover:bg-white/10 disabled:opacity-50">
                  Choose another image
                </button>
              </div>

              {status === 'done' && (
                <label className="flex cursor-pointer items-center gap-2 text-sm text-gray-300">
                  <input type="checkbox" checked={showMarks} onChange={(e) => setShowMarks(e.target.checked)} />
                  Show highlighted areas
                </label>
              )}
            </div>
          )}

          <input ref={inputRef} type="file" accept="image/*" hidden onChange={(e) => pick(e.target.files?.[0])} />
          {error && (
            <div role="alert" className="mt-4 rounded-xl border border-[#FF7869]/40 bg-[#FF7869]/10 px-4 py-3 text-sm text-[#FFB0A6]">
              {error}
            </div>
          )}
        </section>

        {/* Report panel */}
        <section className="lg:col-span-2 rounded-2xl border border-white/10 bg-[#0A1823] p-4 sm:p-6" aria-label="Report">
          <h2 className="mb-4 text-lg font-semibold">Report</h2>

          {status !== 'done' || !result ? (
            <div className="rounded-xl border border-white/10 bg-white/[0.02] px-6 py-12 text-center">
              {busy ? (
                <div className="space-y-3" aria-live="polite">
                  <div className="mx-auto h-4 w-2/3 animate-pulse rounded bg-white/10" />
                  <div className="mx-auto h-4 w-5/6 animate-pulse rounded bg-white/10" />
                  <div className="mx-auto h-4 w-1/2 animate-pulse rounded bg-white/10" />
                </div>
              ) : (
                <p className="text-sm text-gray-400">
                  Your report will appear here once you upload an image and choose <span className="text-white">Generate report</span>.
                </p>
              )}
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex flex-wrap items-center gap-3">
                <span className={`rounded-full border px-3 py-1 text-sm font-semibold ${PRIORITY[result.priority].cls}`}>
                  {PRIORITY[result.priority].text}
                </span>
                {result.processingSeconds !== undefined && (
                  <span className="text-sm text-gray-400">Analysed in {result.processingSeconds}s</span>
                )}
              </div>

              <div>
                <h3 className="mb-3 text-sm font-semibold text-gray-300">Findings</h3>
                <div className="space-y-4">
                  {result.findings.map((f) => (
                    <div key={f.label}>
                      <div className="mb-1.5 flex justify-between text-sm">
                        <span className="text-gray-200">{f.label}</span>
                        <span className="font-semibold">{f.confidence}%</span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-white/10">
                        <div className="h-full rounded-full" style={{ width: `${f.confidence}%`, background: f.confidence >= 50 ? product.accent : '#5d7383' }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label htmlFor="impression" className="mb-2 block text-sm font-semibold text-gray-300">
                  Impression (editable)
                </label>
                <textarea
                  id="impression"
                  rows={5}
                  value={impression}
                  onChange={(e) => setImpression(e.target.value)}
                  className="w-full rounded-xl border border-white/15 bg-white/5 p-3 text-sm text-white focus:border-[#00DCCE] focus:outline-none"
                />
              </div>

              <div className="flex flex-wrap gap-3">
                <button onClick={download} className="rounded-full bg-[#00DCCE] px-6 py-2.5 text-sm font-semibold text-[#0A1823] hover:brightness-110">
                  Download report
                </button>
                <button onClick={() => window.print()} className="rounded-full border border-white/25 px-6 py-2.5 text-sm font-semibold hover:bg-white/10">
                  Print
                </button>
              </div>

              <p className="text-xs text-gray-500">AI output supports, but does not replace, a clinician&apos;s judgement.</p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}