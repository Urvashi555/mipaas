'use client';

import { useEffect, useRef } from 'react';

type Pt = [number, number]; // [lon, lat]

// Simplified outlines, just enough to make recognisable dotted landmasses
const INDIA: Pt[] = [[68,23],[72,21],[73,16],[77,8],[80,13],[80,16],[87,21],[89,22],[92,25],[97,28],[95,29],[88,27],[81,30],[78,35],[75,37],[74,32],[71,28],[70,24]];
const LAND: Pt[][] = [
  [[-17,21],[-10,30],[-6,36],[10,37],[20,32],[32,31],[35,28],[43,12],[51,12],[48,4],[40,-3],[40,-15],[35,-25],[32,-29],[20,-35],[17,-30],[12,-17],[13,-6],[9,4],[-8,4],[-17,14]],
  [[-10,36],[-9,43],[-2,44],[-5,48],[2,51],[8,54],[10,58],[5,62],[15,69],[28,71],[40,67],[40,55],[30,46],[28,41],[22,37],[12,38],[5,43],[-5,36]],
  [[28,41],[40,55],[40,67],[60,70],[80,73],[110,77],[140,72],[170,69],[180,65],[160,58],[143,52],[140,45],[130,42],[122,40],[122,30],[120,22],[108,20],[106,10],[100,2],[104,1],[98,8],[98,16],[95,17],[88,22],[80,8],[73,16],[68,24],[57,25],[57,22],[52,16],[43,13],[35,28],[35,32],[36,36],[28,37]],
  [[-168,66],[-140,70],[-120,70],[-95,72],[-80,73],[-65,60],[-55,52],[-67,45],[-76,38],[-81,31],[-80,25],[-84,30],[-90,29],[-97,26],[-98,20],[-88,16],[-83,9],[-78,8],[-92,14],[-105,20],[-110,24],[-115,30],[-124,40],[-125,49],[-135,58],[-150,60],[-165,60]],
  [[-78,8],[-72,12],[-62,10],[-50,0],[-35,-6],[-40,-22],[-48,-28],[-58,-38],[-65,-42],[-68,-52],[-73,-50],[-72,-30],[-70,-18],[-81,-5],[-80,0]],
  [[114,-22],[122,-18],[130,-12],[137,-12],[142,-11],[146,-19],[153,-26],[150,-37],[141,-38],[131,-31],[116,-35],[114,-26]],
];

function inside(p: Pt, poly: Pt[]) {
  let c = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const [xi, yi] = poly[i];
    const [xj, yj] = poly[j];
    if (yi > p[1] !== yj > p[1] && p[0] < ((xj - xi) * (p[1] - yi)) / (yj - yi) + xi) c = !c;
  }
  return c;
}

type Dot = { lon: number; lat: number; kind: 0 | 1 | 2 }; // 0 ocean, 1 land, 2 India

function buildDots(): Dot[] {
  const dots: Dot[] = [];
  for (let lat = -80; lat <= 80; lat += 2.6) {
    const step = 2.6 / Math.max(Math.cos((lat * Math.PI) / 180), 0.15);
    for (let lon = -180; lon < 180; lon += step) {
      const p: Pt = [lon, lat];
      const kind = inside(p, INDIA) ? 2 : LAND.some((poly) => inside(p, poly)) ? 1 : 0;
      dots.push({ lon: (lon * Math.PI) / 180, lat: (lat * Math.PI) / 180, kind });
    }
  }
  return dots;
}

const PHOTOS = [
  { src: '/hero/xray.jpg', label: 'Chest X-ray', cap: 'top-3 left-3' },
  { src: '/hero/ct.jpg', label: 'CT scan', cap: 'top-3 right-3' },
  { src: '/hero/mri.jpg', label: 'Brain MRI', cap: 'bottom-3 left-3' },
  { src: '/hero/doctor.jpg', label: 'Doctor review', cap: 'bottom-3 right-3' },
];

export default function HeroSection() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const S = 600;
    const R = 250;
    const C = S / 2;
    const tilt = 0.38;
    const dots = buildDots();
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const indiaLon = (78 * Math.PI) / 180;
    const indiaLat = (22 * Math.PI) / 180;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = S * dpr;
    canvas.height = S * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const project = (lon: number, lat: number, l0: number) => {
      const dl = lon - l0;
      const z = Math.sin(tilt) * Math.sin(lat) + Math.cos(tilt) * Math.cos(lat) * Math.cos(dl);
      const x = Math.cos(lat) * Math.sin(dl);
      const y = Math.cos(tilt) * Math.sin(lat) - Math.sin(tilt) * Math.cos(lat) * Math.cos(dl);
      return { x: C + x * R, y: C - y * R, z };
    };

    let raf = 0;
    const start = performance.now();

    const draw = (now: number) => {
      const t = (now - start) / 1000;
      // Full continuous revolution (about 18 seconds per turn), starting with India facing front
      const l0 = reduce ? indiaLon : indiaLon + t * 0.35;
      ctx.clearRect(0, 0, S, S);

      // Dark sphere: mostly opaque so photos only show faintly behind it
      const body = ctx.createRadialGradient(C - 80, C - 90, 30, C, C, R);
      body.addColorStop(0, 'rgba(10,52,84,0.82)');
      body.addColorStop(0.6, 'rgba(6,30,50,0.86)');
      body.addColorStop(1, 'rgba(3,14,26,0.92)');
      ctx.beginPath();
      ctx.arc(C, C, R, 0, Math.PI * 2);
      ctx.fillStyle = body;
      ctx.fill();

      // Dots (far side is hidden)
      for (const d of dots) {
        const p = project(d.lon, d.lat, l0);
        if (p.z <= 0) continue;
        const depth = 0.35 + 0.65 * p.z;
        let r = 1.1 * depth;
        if (d.kind === 0) ctx.fillStyle = `rgba(152,174,217,${0.2 * depth})`;
        else if (d.kind === 1) {
          r = 2 * depth;
          ctx.fillStyle = `rgba(0,220,206,${0.9 * depth})`;
        } else {
          r = 2.8 * depth;
          ctx.fillStyle = `rgba(255,120,105,${Math.min(1, 1.15 * depth)})`;
        }
        ctx.beginPath();
        ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
        ctx.fill();
      }

      // India marker: pulse ring + label (only while India faces the viewer)
      const ip = project(indiaLon, indiaLat, l0);
      if (ip.z > 0.15) {
        const ph = (t % 2) / 2;
        const a = Math.min(1, (ip.z - 0.15) * 4);
        ctx.globalAlpha = a;
        ctx.beginPath();
        ctx.arc(ip.x, ip.y, 8 + ph * 34, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(255,120,105,${0.8 * (1 - ph)})`;
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(ip.x, ip.y, 5, 0, Math.PI * 2);
        ctx.fillStyle = '#fff';
        ctx.fill();

        ctx.strokeStyle = 'rgba(255,255,255,0.85)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(ip.x + 5, ip.y - 5);
        ctx.lineTo(ip.x + 34, ip.y - 34);
        ctx.lineTo(ip.x + 60, ip.y - 34);
        ctx.stroke();
        ctx.fillStyle = '#fff';
        ctx.font = '600 16px system-ui, sans-serif';
        ctx.fillText('India', ip.x + 38, ip.y - 40);
        ctx.globalAlpha = 1;
      }

      // Atmosphere rim
      const rim = ctx.createRadialGradient(C, C, R * 0.86, C, C, R * 1.08);
      rim.addColorStop(0, 'rgba(0,220,206,0)');
      rim.addColorStop(0.75, 'rgba(0,220,206,0.22)');
      rim.addColorStop(1, 'rgba(0,220,206,0)');
      ctx.beginPath();
      ctx.arc(C, C, R * 1.08, 0, Math.PI * 2);
      ctx.fillStyle = rim;
      ctx.fill();
      ctx.beginPath();
      ctx.arc(C, C, R, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(0,220,206,0.6)';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      if (!reduce) raf = requestAnimationFrame(draw);
    };

    raf = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <section className=" text-white overflow-hidden">
      <div className="mx-auto max-w-[81rem] px-6 md:px-8 xl:px-0">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12 items-center min-h-[580px] py-12">
          {/* Left content */}
          <div className="flex flex-col space-y-8 lg:col-span-2 z-10">
            <h1
              className="text-left text-4xl sm:text-5xl lg:text-[52px] xl:text-[68px] leading-[1.08] tracking-tight"
              style={{ fontFamily: "'Josefin Sans', sans-serif", fontWeight: 700 }}
            >
              <div>India&apos;s</div>
              <div>Most Emerging</div>
              <div className="text-white">Healthcare AI</div>
            </h1>

            <div>
              <a
                href="#contact"
                className="bg-[#FF7869] text-white rounded-full px-8 py-3.5 text-sm font-semibold tracking-wide hover:shadow-[0_0_20px_rgba(255,120,105,0.5)] hover:bg-[#ff6857] transition-all duration-300 cursor-pointer inline-flex items-center justify-center"
              >
                Contact Us
              </a>
            </div>
          </div>

          {/* Right side: 2x2 photos with even gaps, globe sits on top */}
          <div className="lg:col-span-3 w-full">
            <div className="relative w-full h-[360px] sm:h-[450px] lg:h-[550px] rounded-2xl overflow-hidden  shadow-2xl">
              {/* Photo grid: 20px outer padding, 20px gap between photos */}
              <div className="absolute inset-0 p-5 grid grid-cols-2 grid-rows-2 gap-5">
                {PHOTOS.map((p) => (
                  <div key={p.label} className="relative overflow-hidden rounded-xl border border-white/15">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={p.src} alt={p.label} className="absolute inset-0 w-full h-full object-cover" />
                    {/* Navy tint */}
                    <div className="absolute inset-0 bg-[#0A2A3D]/35" />
                    <span className={`absolute ${p.cap} z-10 text-xs sm:text-sm font-semibold text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]`}>
                      {p.label}
                    </span>
                  </div>
                ))}
              </div>

              {/* Globe layer: its own layer above the photos, centred */}
              <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none">
                <canvas
                  ref={canvasRef}
                  className="block"
                  style={{ height: '92%', width: 'auto', aspectRatio: '1 / 1', flexShrink: 0 }}
                  role="img"
                  aria-label="Rotating globe with India highlighted"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}