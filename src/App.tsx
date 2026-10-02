import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  ArrowLeft,
  Camera,
  RotateCcw,
  Share2,
  Download,
  RotateCw,
  Image as ImageIcon,
  Smartphone,
  Check,
  Copy,
  X,
  Upload,
  Sparkles,
  Edit3,
  Layers,
  Palette,
  Sliders,
  ImagePlus,
  Wand2,
  BookOpen,
  Volume2,
  VolumeX,
  Trash2,
  Stamp,
  Bookmark,
  BookmarkPlus
} from 'lucide-react';

export type FrameModeId = 'stamp-landscape' | 'stamp-portrait' | 'stamp-square' | 'star-cluster' | 'wish-stars' | 'souvenir-dots';

export interface FrameMode {
  id: FrameModeId;
  name: string;
  sub: string;
  icon: string;
  defaultDate: string;
  defaultTime: string;
  datePrefix?: string;
  dateColor?: string;
  datePosition: 'top-left' | 'bottom-center' | 'bottom-left';
  paperToneId: string;
  watermark: string;
  quote?: string;
}

export const FRAME_MODES: FrameMode[] = [
  {
    id: 'stamp-landscape',
    name: 'Stamp, landscape',
    sub: 'Prangko horizontal klasik 17×11 gerigi',
    icon: '🏷️',
    defaultDate: '27.09',
    defaultTime: '14:28',
    datePosition: 'top-left',
    paperToneId: 'linen',
    watermark: '✻stampo'
  },
  {
    id: 'stamp-portrait',
    name: 'Stamp, portrait',
    sub: 'Prangko vertikal portrait 11×15 gerigi',
    icon: '📇',
    defaultDate: '28.09',
    defaultTime: '16:42',
    datePosition: 'top-left',
    paperToneId: 'linen',
    watermark: '✻stampo'
  },
  {
    id: 'stamp-square',
    name: 'Stamp, square',
    sub: 'Prangko bujur sangkar renda pink',
    icon: '🌸',
    defaultDate: '11.08',
    defaultTime: '20:03',
    datePosition: 'bottom-center',
    paperToneId: 'blush',
    watermark: '✻stampo'
  },
  {
    id: 'star-cluster',
    name: 'Star cluster',
    sub: 'Gugusan konstelasi bintang gemerlap',
    icon: '✨',
    defaultDate: '19.08',
    defaultTime: '01:41',
    datePrefix: '★ ',
    dateColor: '#F7A6BC',
    datePosition: 'bottom-left',
    paperToneId: 'linen',
    watermark: '✻stampo'
  },
  {
    id: 'wish-stars',
    name: 'Wish constellation',
    sub: 'Taburan bintang dengan tipografi wish',
    icon: '⭐',
    defaultDate: '10.02',
    defaultTime: '10:20',
    dateColor: '#E0BC52',
    datePosition: 'bottom-left',
    paperToneId: 'linen',
    watermark: '✻stampo'
  },
  {
    id: 'souvenir-dots',
    name: 'Souvenir polka dots',
    sub: 'Jendela lingkaran & kutipan souvenir',
    icon: '🫧',
    defaultDate: '10.02',
    defaultTime: '10:20',
    dateColor: '#E0BC52',
    datePosition: 'bottom-left',
    paperToneId: 'sage',
    quote: 'some feelings are only visiting, but they always leave a souvenir',
    watermark: '✻stampo'
  }
];

export interface PhotoFilter {
  id: string;
  name: string;
  category: string;
  css: string;
  previewBg: string;
}

export const PHOTO_FILTERS: PhotoFilter[] = [
  { id: 'warm-sepia', name: 'Warm Sepia', category: 'Vintage', css: 'sepia(0.55) contrast(1.08) saturate(1.15) brightness(0.98)', previewBg: '#D8B88C' },
  { id: 'bw-classic', name: 'B&W Classic', category: 'Mono', css: 'grayscale(1) contrast(1.15) brightness(1.02)', previewBg: '#707070' },
  { id: 'high-contrast', name: 'High Contrast', category: 'Bold', css: 'contrast(1.42) saturate(1.18) brightness(0.98)', previewBg: '#3E322A' },
  { id: 'vintage-film', name: 'Vintage Film', category: 'Vintage', css: 'sepia(0.35) contrast(1.12) brightness(0.96) saturate(1.25)', previewBg: '#C29B38' },
  { id: 'golden-hour', name: 'Golden Hour', category: 'Warm', css: 'sepia(0.38) saturate(1.48) brightness(1.06) hue-rotate(-12deg)', previewBg: '#E5A65E' },
  { id: 'muted-pastel', name: 'Muted Pastel', category: 'Soft', css: 'saturate(0.72) brightness(1.08) contrast(0.92)', previewBg: '#E2C4C9' },
  { id: 'tokyo-fade', name: 'Tokyo Fade', category: 'Soft', css: 'contrast(0.88) brightness(1.14) saturate(0.82) sepia(0.12)', previewBg: '#B8C5D6' },
  { id: 'noir-grain', name: 'Deep Noir', category: 'Mono', css: 'grayscale(1) contrast(1.58) brightness(0.88)', previewBg: '#222222' },
  { id: 'kodak-portra', name: 'Kodak Portra', category: 'Analog', css: 'saturate(1.22) contrast(1.06) sepia(0.18) brightness(1.02)', previewBg: '#D99B72' },
  { id: 'rose-blush', name: 'Rosé Blush', category: 'Warm', css: 'sepia(0.22) saturate(1.28) hue-rotate(-22deg) brightness(1.04)', previewBg: '#EFA4B8' },
  { id: 'summer-90s', name: 'Summer 90s', category: 'Retro', css: 'saturate(1.38) contrast(1.12) sepia(0.22) brightness(1.06)', previewBg: '#F2BE42' },
  { id: 'nordic-chill', name: 'Nordic Chill', category: 'Cool', css: 'saturate(0.78) hue-rotate(188deg) brightness(1.04) contrast(1.05)', previewBg: '#8DA4B8' },
  { id: 'emerald-green', name: 'Emerald', category: 'Vivid', css: 'saturate(1.24) hue-rotate(24deg) contrast(1.12) brightness(0.97)', previewBg: '#5B8C6D' },
  { id: 'cyber-noir', name: 'Cool Noir', category: 'Cool', css: 'contrast(1.28) saturate(0.68) hue-rotate(180deg) brightness(0.96)', previewBg: '#516E89' },
  { id: 'soft-glow', name: 'Soft Glow', category: 'Soft', css: 'brightness(1.14) contrast(0.94) saturate(1.12)', previewBg: '#FDF6E2' },
  { id: 'retro-sunset', name: 'Retro Sunset', category: 'Retro', css: 'sepia(0.48) saturate(1.55) hue-rotate(-16deg) contrast(1.14)', previewBg: '#DE7052' },
  { id: 'moody-forest', name: 'Moody Forest', category: 'Vivid', css: 'contrast(1.22) saturate(1.18) hue-rotate(36deg) brightness(0.92)', previewBg: '#3B5944' },
  { id: 'velvet-night', name: 'Velvet Night', category: 'Dramatic', css: 'contrast(1.32) brightness(0.86) saturate(1.24) hue-rotate(220deg)', previewBg: '#443850' },
  { id: 'silver-mono', name: 'Silver Tone', category: 'Mono', css: 'grayscale(0.92) contrast(1.26) brightness(1.06) sepia(0.08)', previewBg: '#A6A6A6' },
  { id: 'original', name: 'Original', category: 'Natural', css: 'none', previewBg: '#EFECE6' }
];

export type TextureId = 'linen' | 'aged-crease' | 'crumpled' | 'film' | 'canvas' | 'parchment' | 'washi' | 'kraft' | 'watercolor' | 'newsprint' | 'none' | 'custom';

export interface TextureOption {
  id: TextureId;
  name: string;
  desc: string;
  icon: string;
}

export const TEXTURE_OPTIONS: TextureOption[] = [
  { id: 'linen', name: 'Linen Kertas', desc: 'Serat katun hangat alami', icon: '📜' },
  { id: 'aged-crease', name: 'Vintage Aged (Lipatan)', desc: 'Kertas antik usang dengan noda teh & bekas lipatan', icon: '✉️' },
  { id: 'crumpled', name: 'Kertas Kusut (Crumpled)', desc: 'Lipatan kusut artistik dengan kontur realistis', icon: '📃' },
  { id: 'washi', name: 'Washi Jepang', desc: 'Kertas beras serat murbei handmade', icon: '🎋' },
  { id: 'kraft', name: 'Vintage Kraft', desc: 'Kardus daur ulang berserat padat', icon: '📦' },
  { id: 'watercolor', name: 'Cat Air (Cold Press)', desc: 'Permukaan kertas bergelombang artistik', icon: '🎨' },
  { id: 'parchment', name: 'Parchment Kuno', desc: 'Kertas manuskrip serat antik', icon: '📄' },
  { id: 'film', name: 'Film 35mm Grain', desc: 'Grain retro analog alami', icon: '🎞️' },
  { id: 'canvas', name: 'Kanvas Seni', desc: 'Tekstur anyaman kain kanvas halus', icon: '🖼️' },
  { id: 'newsprint', name: 'Koran Halftone', desc: 'Cetak titik koran vintage retro', icon: '📰' },
  { id: 'none', name: 'Polos (Smooth)', desc: 'Bersih tanpa tekstur grain', icon: '⚪' },
  { id: 'custom', name: 'Unggah Sendiri', desc: 'Pilih tekstur foto dari galeri Anda', icon: '📁' }
];

// ---------------------------------------------------------------------------
// FEATURE 5: ARTISANAL PAPER TONES
// ---------------------------------------------------------------------------
export interface PaperTone {
  id: string;
  name: string;
  sub: string;
  bgTop: string;
  bgCard: string;
  border: string;
  text: string;
  subText: string;
  previewBg: string;
}

export const PAPER_TONES: PaperTone[] = [
  { id: 'linen', name: 'Warm Linen', sub: 'Kertas linen hangat alami', bgTop: '#F8F6F0', bgCard: '#FAF8F3', border: '#DFD8CC', text: '#3A332C', subText: '#78716C', previewBg: '#FAF8F3' },
  { id: 'kraft', name: 'Vintage Kraft', sub: 'Kertas daur ulang berserat', bgTop: '#E6DCBF', bgCard: '#ECE2C8', border: '#D4C4A3', text: '#3A2E1F', subText: '#6E5D48', previewBg: '#ECE2C8' },
  { id: 'sage', name: 'Botanical Sage', sub: 'Nuansa hijau daun lembut', bgTop: '#E8ECE4', bgCard: '#EFF4EC', border: '#CFDAC9', text: '#26382B', subText: '#5B6F60', previewBg: '#EFF4EC' },
  { id: 'blush', name: 'Rosé Blush', sub: 'Kertas merah muda pastel', bgTop: '#FAF0F3', bgCard: '#FDF4F7', border: '#EBD4DC', text: '#452632', subText: '#7E5362', previewBg: '#FDF4F7' },
  { id: 'charcoal', name: 'Dark Slate', sub: 'Kertas hitam arang minimalis', bgTop: '#242322', bgCard: '#2C2B29', border: '#464340', text: '#F2EDE4', subText: '#A8A095', previewBg: '#2C2B29' }
];

// ---------------------------------------------------------------------------
// FEATURE 3: PHILATELY SCRAPBOOK JOURNAL (ALBUM)
// ---------------------------------------------------------------------------
export interface JournalItem {
  id: string;
  date: string;
  time: string;
  location: string;
  timestamp: number;
  photoUrl: string | null;
  filterId: string;
  textureId: string;
  paperToneId: string;
  labelNote: string;
  watermarkText: string;
}

export const DEFAULT_JOURNAL_ITEMS: JournalItem[] = [
  {
    id: 'journal-1',
    date: '28.09',
    time: '14:28',
    location: 'Jardin du Palais · Paris',
    timestamp: Date.now() - 3600000 * 2,
    photoUrl: null,
    filterId: 'warm-sepia',
    textureId: 'linen',
    paperToneId: 'linen',
    labelNote: 'le café de l’après-midi',
    watermarkText: '✻stampo'
  },
  {
    id: 'journal-2',
    date: '26.09',
    time: '17:15',
    location: 'Kyoto Gyoen · Kyoto',
    timestamp: Date.now() - 86400000 * 2,
    photoUrl: null,
    filterId: 'kodak-portra',
    textureId: 'film',
    paperToneId: 'sage',
    labelNote: 'autumn green moss',
    watermarkText: '✻stampo'
  },
  {
    id: 'journal-3',
    date: '22.09',
    time: '09:40',
    location: 'Navigli Canal · Milano',
    timestamp: Date.now() - 86400000 * 5,
    photoUrl: null,
    filterId: 'summer-90s',
    textureId: 'parchment',
    paperToneId: 'blush',
    labelNote: 'morning espresso & brioche',
    watermarkText: '✻stampo'
  }
];

// ---------------------------------------------------------------------------
// FEATURE 6: ANALOG TACTILE AUDIO ENGINE (Zero external dependencies)
// ---------------------------------------------------------------------------
export function playTactileSound(type: 'shutter' | 'click' | 'stamp' | 'rustle', enabled: boolean = true) {
  if (!enabled || typeof window === 'undefined') return;
  try {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    const t = ctx.currentTime;

    if (type === 'shutter') {
      // 1. Shutter blade snap
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = 'triangle';
      osc1.frequency.setValueAtTime(160, t);
      osc1.frequency.exponentialRampToValueAtTime(30, t + 0.07);
      gain1.gain.setValueAtTime(0.5, t);
      gain1.gain.exponentialRampToValueAtTime(0.001, t + 0.07);
      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.start(t);
      osc1.stop(t + 0.07);

      // 2. Film winder gear click
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = 'square';
      osc2.frequency.setValueAtTime(520, t + 0.09);
      osc2.frequency.exponentialRampToValueAtTime(80, t + 0.17);
      gain2.gain.setValueAtTime(0.28, t + 0.09);
      gain2.gain.exponentialRampToValueAtTime(0.001, t + 0.17);
      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.start(t + 0.09);
      osc2.stop(t + 0.17);
    } else if (type === 'stamp') {
      // Rubber cancellation stamp thud
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(140, t);
      osc.frequency.exponentialRampToValueAtTime(38, t + 0.12);
      gain.gain.setValueAtTime(0.65, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.12);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(t);
      osc.stop(t + 0.12);
    } else if (type === 'rustle') {
      // Gentle crisp paper rustle / deckle edge tear
      const bufferSize = Math.floor(ctx.sampleRate * 0.05);
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;
      const bq = ctx.createBiquadFilter();
      bq.type = 'bandpass';
      bq.frequency.setValueAtTime(1600, t);
      bq.Q.setValueAtTime(1.8, t);
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.18, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.05);
      noise.connect(bq);
      bq.connect(gain);
      gain.connect(ctx.destination);
      noise.start(t);
      noise.stop(t + 0.05);
    } else {
      // Mechanical tactile tap / card tilt
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(540, t);
      osc.frequency.exponentialRampToValueAtTime(110, t + 0.035);
      gain.gain.setValueAtTime(0.2, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.035);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(t);
      osc.stop(t + 0.035);
    }
  } catch {
    // Audio context may be restricted by autoplay policy
  }
}

export function CafeSceneSvg({ isCrop = false, filterCss = 'none' }: { isCrop?: boolean; filterCss?: string }) {
  return (
    <svg
      viewBox={isCrop ? "75 18 245 155" : "0 0 400 300"}
      className="w-full h-full object-cover pointer-events-none select-none"
      style={{ filter: filterCss }}
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <linearGradient id="wallWarmWash" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#F5EFE3" />
          <stop offset="60%" stopColor="#EADECB" />
          <stop offset="100%" stopColor="#DDD0BC" />
        </linearGradient>
        <pattern id="ginghamCheck" width="8" height="8" patternUnits="userSpaceOnUse">
          <rect width="8" height="8" fill="#F7F1E6" />
          <rect width="4" height="8" fill="#C54848" opacity="0.85" />
          <rect width="8" height="4" fill="#C54848" opacity="0.85" />
          <rect width="4" height="4" fill="#8E2A2A" />
        </pattern>
        <linearGradient id="timberWood" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#6C4C34" />
          <stop offset="50%" stopColor="#5A3D28" />
          <stop offset="100%" stopColor="#4A311F" />
        </linearGradient>
      </defs>

      {/* 1. Stucco Wall Base */}
      <rect width="400" height="300" fill="url(#wallWarmWash)" />

      {/* 2. Left Wooden Kiosk */}
      <rect x="0" y="30" width="185" height="230" fill="url(#timberWood)" />
      {/* Wood plank horizontal seams */}
      {[50, 70, 90, 110, 130, 150, 170, 190, 210, 230, 250].map((y) => (
        <line key={y} x1="0" y1={y} x2="185" y2={y} stroke="#3D2919" strokeWidth="1.2" opacity="0.75" />
      ))}
      {/* Roof / Awning */}
      <polygon points="0,20 195,20 205,42 0,42" fill="#315040" />
      <line x1="0" y1="42" x2="205" y2="42" stroke="#223A2D" strokeWidth="2" />

      {/* Window Opening */}
      <rect x="12" y="65" width="160" height="95" rx="3" fill="#1C1612" />
      {/* Interior back shelf */}
      <line x1="12" y1="95" x2="172" y2="95" stroke="#4D3523" strokeWidth="2" />
      <rect x="25" y="80" width="12" height="15" rx="2" fill="#D7BEA2" opacity="0.7" />
      <rect x="42" y="78" width="10" height="17" rx="2" fill="#CBB295" opacity="0.7" />
      <rect x="135" y="82" width="15" height="13" rx="3" fill="#E6D3BE" opacity="0.6" />
      {/* Silhouette of barista inside */}
      <circle cx="95" cy="100" r="14" fill="#0D0907" />
      <path d="M 75 160 C 75 125, 115 125, 115 160 Z" fill="#0D0907" />

      {/* Potted plant on outside corner */}
      <rect x="12" y="145" width="18" height="15" rx="2" fill="#BA6749" />
      <circle cx="21" cy="140" r="10" fill="#3D634C" />
      <circle cx="27" cy="142" r="7" fill="#4B7A5C" />
      <circle cx="15" cy="138" r="8" fill="#588B6A" />

      {/* 3. Right Courtyard: Two Arched Turquoise-Green French Doors */}
      {/* Door 1 (Left Arch) */}
      <rect x="210" y="38" width="105" height="215" rx="52" fill="#285947" />
      <rect x="218" y="48" width="89" height="200" rx="44" fill="#36705B" />
      {/* Panes inside Door 1 */}
      <rect x="226" y="58" width="73" height="185" rx="36" fill="#FBF8EF" opacity="0.9" />
      <line x1="262" y1="58" x2="262" y2="243" stroke="#285947" strokeWidth="2.5" />
      <line x1="226" y1="100" x2="299" y2="100" stroke="#285947" strokeWidth="2" />
      <line x1="226" y1="140" x2="299" y2="140" stroke="#285947" strokeWidth="2" />
      <line x1="226" y1="180" x2="299" y2="180" stroke="#285947" strokeWidth="2" />

      {/* Door 2 (Right Arch) */}
      <rect x="330" y="38" width="85" height="215" rx="42" fill="#285947" />
      <rect x="338" y="48" width="70" height="200" rx="35" fill="#36705B" />
      <rect x="345" y="58" width="56" height="185" rx="28" fill="#FBF8EF" opacity="0.9" />
      <line x1="330" y1="100" x2="400" y2="100" stroke="#285947" strokeWidth="2" />
      <line x1="330" y1="140" x2="400" y2="140" stroke="#285947" strokeWidth="2" />
      <line x1="330" y1="180" x2="400" y2="180" stroke="#285947" strokeWidth="2" />

      {/* Warm wall sconce lamp between doors */}
      <path d="M 195 72 L 202 72 L 202 85" stroke="#3D2E24" strokeWidth="2" fill="none" />
      <ellipse cx="202" cy="85" rx="6" ry="8" fill="#F8DE96" />
      <ellipse cx="202" cy="85" rx="14" ry="16" fill="#FCE59F" opacity="0.25" />

      {/* 4. Tables and Chairs */}
      {/* Table 1 (Left): Red & White Gingham Checkered Tablecloth */}
      <path d="M 68 155 C 68 140, 92 140, 92 155 L 92 185 L 68 185 Z" fill="none" stroke="#FFFFFF" strokeWidth="1.8" />
      <line x1="80" y1="140" x2="80" y2="185" stroke="#FFFFFF" strokeWidth="1.2" />
      <rect x="52" y="172" width="80" height="52" rx="3" fill="url(#ginghamCheck)" stroke="#B33E3E" strokeWidth="1" />
      <ellipse cx="78" cy="225" rx="16" ry="6" fill="none" stroke="#FFFFFF" strokeWidth="1.8" />
      <path d="M 62 225 C 62 205, 94 205, 94 225" fill="none" stroke="#FFFFFF" strokeWidth="1.8" />
      <line x1="62" y1="225" x2="60" y2="265" stroke="#FFFFFF" strokeWidth="1.5" />
      <line x1="94" y1="225" x2="96" y2="265" stroke="#FFFFFF" strokeWidth="1.5" />

      {/* Table 2 (Center-Right): Round Bistro Table with Draped White Tablecloth */}
      <path d="M 232 215 C 232 195, 258 195, 258 215" fill="none" stroke="#FFFFFF" strokeWidth="1.8" />
      <line x1="245" y1="195" x2="245" y2="245" stroke="#FFFFFF" strokeWidth="1.2" />
      <path d="M 315 210 C 315 192, 340 192, 340 210" fill="none" stroke="#FFFFFF" strokeWidth="1.8" />
      <line x1="327" y1="192" x2="327" y2="245" stroke="#FFFFFF" strokeWidth="1.2" />

      {/* Large Round White Table */}
      <ellipse cx="290" cy="235" rx="55" ry="20" fill="#FAF8F3" stroke="#E2DACD" strokeWidth="1.5" />
      <path d="M 235 235 C 235 275, 345 275, 345 235 Z" fill="#F5F2EB" />
      <ellipse cx="290" cy="235" rx="48" ry="16" fill="#FFFFFF" />

      {/* Front Chair */}
      <path d="M 188 238 C 188 215, 218 215, 218 238" fill="none" stroke="#FFFFFF" strokeWidth="2" />
      <line x1="203" y1="215" x2="203" y2="265" stroke="#FFFFFF" strokeWidth="1.4" />
      <ellipse cx="203" cy="242" rx="16" ry="6" fill="none" stroke="#FFFFFF" strokeWidth="1.8" />
      <line x1="188" y1="242" x2="185" y2="285" stroke="#FFFFFF" strokeWidth="1.5" />
      <line x1="218" y1="242" x2="221" y2="285" stroke="#FFFFFF" strokeWidth="1.5" />

      {/* Subtle Warm Sunlight & Analog Grain Wash */}
      <rect width="400" height="300" fill="#FCE9C2" opacity="0.1" />
    </svg>
  );
}

/**
 * Generate an authentic classic postage stamp SVG path with prominent, deeply serrated
 * semicircular bite notches (gerigi prangko otentik yang jelas, tajam, dan berkarakter)
 * carved inwards along all 4 perimeter edges.
 *
 * @param w Total stamp width
 * @param h Total stamp height
 * @param r Radius of semicircular bite notch (default ~3.8px for prominent gerigi)
 * @param numH Number of notches along horizontal edges
 * @param numV Number of notches along vertical edges
 */
export function getStampPath(
  w: number,
  h: number,
  r?: number,
  numH?: number,
  numV?: number
): string {
  // Target cycle ~12.5px to 13.5px per perforation tooth+notch cycle for classic philatelic proportions
  const targetPitch = 13.0;
  const countH = numH !== undefined ? numH : Math.max(3, Math.round((w - 10) / targetPitch));
  const countV = numV !== undefined ? numV : Math.max(3, Math.round((h - 10) / targetPitch));

  // Semicircular bite notch radius: 3.0px to 3.5px gives prominent, deeply scalloped teeth
  let notchR = r !== undefined ? r : Math.min(4.2, Math.max(2.8, (w / (countH * 2.2 + 2))));

  // Ensure teeth between notches have healthy width (~4.5px - 7px)
  if ((w - countH * 2 * notchR) / (countH + 1) < 2.8) {
    notchR = Math.max(2.4, (w - (countH + 1) * 2.8) / (2 * countH));
  }
  if ((h - countV * 2 * notchR) / (countV + 1) < 2.8) {
    notchR = Math.max(2.4, (h - (countV + 1) * 2.8) / (2 * countV));
  }

  const toothW = (w - countH * 2 * notchR) / (countH + 1);
  const toothH = (h - countV * 2 * notchR) / (countV + 1);

  let d = `M 0 0 `;

  // Top edge (L -> R): Semicircle bites DOWN into positive Y (inside stamp, sweep 0)
  let curX = 0;
  for (let i = 0; i < countH; i++) {
    curX += toothW;
    d += `L ${curX.toFixed(2)} 0 `;
    curX += 2 * notchR;
    d += `A ${notchR.toFixed(2)} ${notchR.toFixed(2)} 0 0 0 ${curX.toFixed(2)} 0 `;
  }
  d += `L ${w} 0 `;

  // Right edge (T -> B): Semicircle bites LEFT into x < w (inside stamp, sweep 0)
  let curY = 0;
  for (let i = 0; i < countV; i++) {
    curY += toothH;
    d += `L ${w} ${curY.toFixed(2)} `;
    curY += 2 * notchR;
    d += `A ${notchR.toFixed(2)} ${notchR.toFixed(2)} 0 0 0 ${w} ${curY.toFixed(2)} `;
  }
  d += `L ${w} ${h} `;

  // Bottom edge (R -> L): Semicircle bites UP into y < h (inside stamp, sweep 0)
  curX = w;
  for (let i = 0; i < countH; i++) {
    curX -= toothW;
    d += `L ${curX.toFixed(2)} ${h} `;
    curX -= 2 * notchR;
    d += `A ${notchR.toFixed(2)} ${notchR.toFixed(2)} 0 0 0 ${curX.toFixed(2)} ${h} `;
  }
  d += `L 0 ${h} `;

  // Left edge (B -> T): Semicircle bites RIGHT into x > 0 (inside stamp, sweep 0)
  curY = h;
  for (let i = 0; i < countV; i++) {
    curY -= toothH;
    d += `L 0 ${curY.toFixed(2)} `;
    curY -= 2 * notchR;
    d += `A ${notchR.toFixed(2)} ${notchR.toFixed(2)} 0 0 0 0 ${curY.toFixed(2)} `;
  }
  d += `L 0 0 Z`;

  return d;
}

/**
 * Generate a 5-point star SVG path
 */
export function getStarPath(cx: number, cy: number, r: number): string {
  const points: string[] = [];
  const innerR = r * 0.42;
  for (let i = 0; i < 10; i++) {
    const angle = (i * Math.PI) / 5 - Math.PI / 2;
    const rad = i % 2 === 0 ? r : innerR;
    const x = cx + rad * Math.cos(angle);
    const y = cy + rad * Math.sin(angle);
    points.push(`${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`);
  }
  return points.join(' ') + ' Z';
}

export const STAR_CLUSTER_POINTS = [
  // Top-half (340 x 226.66) spread out constellation with airy clearance (never clumped)
  // Row 1 (y: 34)
  { cx: 50, cy: 34, r: 10 },
  { cx: 170, cy: 30, r: 13 },
  { cx: 290, cy: 35, r: 10 },
  { cx: 110, cy: 40, r: 4.5 },
  { cx: 230, cy: 38, r: 4.5 },

  // Row 2 (y: 82)
  { cx: 96, cy: 82, r: 11 },
  { cx: 244, cy: 80, r: 11.5 },
  { cx: 42, cy: 90, r: 4.5 },
  { cx: 298, cy: 88, r: 4.5 },

  // Row 3 (y: 126) - Center
  { cx: 50, cy: 126, r: 11 },
  { cx: 170, cy: 122, r: 14 },
  { cx: 290, cy: 128, r: 10.5 },
  { cx: 112, cy: 130, r: 4.5 },
  { cx: 228, cy: 128, r: 4.5 },

  // Row 4 (y: 170)
  { cx: 98, cy: 170, r: 10.5 },
  { cx: 242, cy: 168, r: 11.5 },
  { cx: 44, cy: 178, r: 4.5 },
  { cx: 296, cy: 176, r: 4.5 },

  // Row 5 (y: 198) - Bottom of top-half
  { cx: 52, cy: 198, r: 9.5 },
  { cx: 170, cy: 196, r: 12 },
  { cx: 288, cy: 198, r: 10 },
  { cx: 112, cy: 196, r: 4.5 },
  { cx: 228, cy: 196, r: 4.5 }
];

export const WISH_STARS = [
  // Top-half (340 x 226.66) airy wish constellation with typewriter labels
  // Row 1 (y: 35)
  { cx: 50, cy: 35, r: 10, text: 'wish' },
  { cx: 170, cy: 30, r: 11, text: '' },
  { cx: 275, cy: 35, r: 9.5, text: 'wish' },
  { cx: 115, cy: 38, r: 4.5, text: '' },
  { cx: 225, cy: 38, r: 4.5, text: '' },

  // Row 2 (y: 84)
  { cx: 105, cy: 84, r: 10.5, text: 'wish' },
  { cx: 235, cy: 82, r: 10, text: 'wish' },
  { cx: 45, cy: 90, r: 4.5, text: '' },
  { cx: 295, cy: 88, r: 4.5, text: '' },

  // Row 3 (y: 128) - Center
  { cx: 50, cy: 128, r: 9.5, text: '' },
  { cx: 168, cy: 126, r: 12, text: 'wish' },
  { cx: 275, cy: 128, r: 9.5, text: '' },
  { cx: 110, cy: 134, r: 4.5, text: '' },
  { cx: 222, cy: 132, r: 4.5, text: '' },

  // Row 4 (y: 172)
  { cx: 105, cy: 172, r: 10, text: 'wish' },
  { cx: 235, cy: 170, r: 10.5, text: 'wish' },
  { cx: 45, cy: 178, r: 4.5, text: '' },
  { cx: 295, cy: 176, r: 4.5, text: '' },

  // Row 5 (y: 200)
  { cx: 52, cy: 200, r: 9.5, text: 'wish' },
  { cx: 170, cy: 198, r: 11, text: '' },
  { cx: 278, cy: 200, r: 9.5, text: 'wish' }
];

export const SOUVENIR_DOTS = [
  // Top-half (340 x 226.66) rhythmic polka dots framing the center quote
  // Row 1 (y = 28)
  { cx: 46, cy: 28, r: 11 },
  { cx: 108, cy: 28, r: 10 },
  { cx: 170, cy: 28, r: 11.5 },
  { cx: 232, cy: 28, r: 10 },
  { cx: 294, cy: 28, r: 11 },

  // Row 2 (y = 70)
  { cx: 76, cy: 70, r: 10 },
  { cx: 140, cy: 68, r: 10.5 },
  { cx: 200, cy: 68, r: 10.5 },
  { cx: 264, cy: 70, r: 10 },

  // Row 3 (y = 116) - Flanking quote
  { cx: 42, cy: 116, r: 11.5 },
  { cx: 298, cy: 116, r: 11.5 },

  // Row 4 (y = 162)
  { cx: 76, cy: 162, r: 10 },
  { cx: 140, cy: 164, r: 10.5 },
  { cx: 200, cy: 164, r: 10.5 },
  { cx: 264, cy: 162, r: 10 },

  // Row 5 (y = 202)
  { cx: 46, cy: 202, r: 11 },
  { cx: 108, cy: 202, r: 10 },
  { cx: 170, cy: 202, r: 11.5 },
  { cx: 232, cy: 202, r: 10 },
  { cx: 294, cy: 202, r: 11 }
];

export default function App() {
  // Screen views: 'result' | 'camera' | 'developing'
  const [screen, setScreen] = useState<'result' | 'camera' | 'developing'>('result');
  const [frameModeIndex, setFrameModeIndex] = useState(0);
  const [cameraTab, setCameraTab] = useState<'frame' | 'filter'>('frame');
  const [activeModal, setActiveModal] = useState<
    'none' | 'share' | 'feedback' | 'edit-label' | 'texture' | 'edit-watermark' | 'filter' | 'paper-tone' | 'album' | 'save-choice' | 'frame'
  >('none');
  const [isAnimationActive, setIsAnimationActive] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);
  const [labelNote, setLabelNote] = useState('');
  const [watermarkText, setWatermarkText] = useState('✻stampo');
  const [showWatermark, setShowWatermark] = useState(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  // FEATURE 6: ANALOG TACTILE AUDIO TOGGLE
  const [soundEnabled, setSoundEnabled] = useState(true);

  // FEATURE 5: ARTISANAL PAPER TONES
  const [selectedPaperToneId, setSelectedPaperToneId] = useState<string>('linen');
  const selectedPaperTone = PAPER_TONES.find((p) => p.id === selectedPaperToneId) || PAPER_TONES[0];

  // 20 Photo Filters state (applied before placed on scrapbook collage)
  const [selectedFilterId, setSelectedFilterId] = useState<string>('warm-sepia');
  const selectedFilter = PHOTO_FILTERS.find((f) => f.id === selectedFilterId) || PHOTO_FILTERS[0];

  // Texture state: allows choosing presets or uploading own texture
  const [selectedTexture, setSelectedTexture] = useState<TextureId>('linen');
  const [textureOpacity, setTextureOpacity] = useState<number>(45);
  const [customTextureUrl, setCustomTextureUrl] = useState<string | null>(null);
  const customTextureInputRef = useRef<HTMLInputElement>(null);

  // FEATURE 3: PHILATELY SCRAPBOOK JOURNAL (ALBUM) STATE
  const [journalEntries, setJournalEntries] = useState<JournalItem[]>(() => {
    try {
      const saved = localStorage.getItem('stampo_journal');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // fallback
    }
    return DEFAULT_JOURNAL_ITEMS;
  });

  useEffect(() => {
    try {
      localStorage.setItem('stampo_journal', JSON.stringify(journalEntries));
    } catch {
      // localStorage error handling
    }
  }, [journalEntries]);

  const saveToJournal = () => {
    const newItem: JournalItem = {
      id: `journal-${Date.now()}`,
      date: capturedMeta.date,
      time: capturedMeta.time,
      location: capturedMeta.location,
      timestamp: Date.now(),
      photoUrl: capturedPhotoUrl,
      filterId: selectedFilterId,
      textureId: selectedTexture,
      paperToneId: selectedPaperToneId,
      labelNote: labelNote,
      watermarkText: watermarkText
    };
    setJournalEntries((prev) => [newItem, ...prev]);
    playTactileSound('stamp', soundEnabled);
    showToast('Tersimpan di Album Prangko! 📔');
  };

  const loadFromJournal = (item: JournalItem) => {
    setCapturedPhotoUrl(item.photoUrl);
    setStampPhotoUrl(item.photoUrl);
    setSelectedFilterId(item.filterId);
    setSelectedTexture(item.textureId as any);
    setSelectedPaperToneId(item.paperToneId);
    setLabelNote(item.labelNote);
    setWatermarkText(item.watermarkText);
    setCapturedMeta((prev) => ({
      ...prev,
      date: item.date,
      time: item.time,
      location: item.location
    }));
    setActiveModal('none');
    setScreen('result');
    playTactileSound('stamp', soundEnabled);
    wobbleCard();
    showToast(`Prangko ${item.date} dibuka di kartu ✨`);
  };

  const deleteFromJournal = (id: string) => {
    setJournalEntries((prev) => prev.filter((item) => item.id !== id));
    playTactileSound('click', soundEnabled);
    showToast('Prangko dihapus dari album');
  };

  // Camera & Media
  const [cameraActive, setCameraActive] = useState(false);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [flashActive, setFlashActive] = useState(false);
  const [capturedPhotoUrl, setCapturedPhotoUrl] = useState<string | null>(null);
  const [stampPhotoUrl, setStampPhotoUrl] = useState<string | null>(null);

  const [capturedMeta, setCapturedMeta] = useState({
    date: '27.09',
    time: '14:28',
    location: 'Jardin du Palais · Paris',
    stampNo: '№ 402'
  });

  // Developing screen state
  const [devProgress, setDevProgress] = useState(0);
  const [pixelBlink, setPixelBlink] = useState(false);

  // 3D Card Tilt & Spin Physics
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef<{ x: number; y: number; rx: number; ry: number }>({ x: 0, y: 0, rx: 0, ry: 0 });
  const cardRef = useRef<HTMLDivElement>(null);

  // DOM Refs
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const currentFrame = FRAME_MODES[frameModeIndex];

  // Synthesize camera shutter sound
  const playShutterSound = useCallback(() => {
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(850, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.08);
      gain.gain.setValueAtTime(0.35, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.08);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.08);

      setTimeout(() => {
        try {
          const osc2 = ctx.createOscillator();
          const gain2 = ctx.createGain();
          osc2.type = 'sine';
          osc2.frequency.setValueAtTime(260, ctx.currentTime);
          osc2.frequency.exponentialRampToValueAtTime(50, ctx.currentTime + 0.09);
          gain2.gain.setValueAtTime(0.25, ctx.currentTime);
          gain2.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.09);
          osc2.connect(gain2);
          gain2.connect(ctx.destination);
          osc2.start();
          osc2.stop(ctx.currentTime + 0.09);
        } catch {
          // ignore
        }
      }, 65);
    } catch {
      // ignore
    }
  }, []);

  // Camera Management
  const startCamera = useCallback(async () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: facingMode,
          width: { ideal: 1280 },
          height: { ideal: 960 }
        },
        audio: false
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setCameraActive(true);
    } catch {
      setCameraActive(false);
    }
  }, [facingMode]);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
  }, []);

  useEffect(() => {
    if (screen === 'camera') {
      startCamera();
    } else {
      stopCamera();
    }
    return () => {
      stopCamera();
    };
  }, [screen, startCamera, stopCamera]);

  // Mascot Blinking Animation
  useEffect(() => {
    if (screen === 'developing') {
      const interval = setInterval(() => {
        setPixelBlink((prev) => !prev);
      }, 380);
      return () => clearInterval(interval);
    }
  }, [screen]);

  // Floating Animation loop
  useEffect(() => {
    if (!isAnimationActive) return;
    let frame = 0;
    const interval = setInterval(() => {
      frame += 0.05;
      setRotateX(Math.sin(frame) * 6);
      setRotateY(Math.cos(frame) * 7);
    }, 30);
    return () => clearInterval(interval);
  }, [isAnimationActive]);

  // Shutter Capture
  const handleShutter = () => {
    playShutterSound();
    setFlashActive(true);
    setTimeout(() => setFlashActive(false), 200);

    const now = new Date();
    const formattedDate = `${String(now.getDate()).padStart(2, '0')}.${String(now.getMonth() + 1).padStart(2, '0')}`;
    const formattedTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    let photoDataUrl: string | null = null;
    let stampDataUrl: string | null = null;

    if (cameraActive && videoRef.current) {
      try {
        const video = videoRef.current;
        const vw = video.videoWidth || 1280;
        const vh = video.videoHeight || 960;
        // Viewfinder is strictly 4:3 (aspect-[4/3] with object-cover)
        // Crop the video stream to exact 4:3 before saving so what the user sees is what is saved
        const targetRatio = 4 / 3;
        const vidRatio = vw / vh;
        let cropW = vw;
        let cropH = vh;
        let cropX = 0;
        let cropY = 0;

        if (vidRatio > targetRatio) {
          // Video is wider than 4:3 (e.g. 16:9 mobile sensor) -> crop left & right
          cropW = vh * targetRatio;
          cropX = (vw - cropW) / 2;
        } else {
          // Video is taller than 4:3 -> crop top & bottom
          cropH = vw / targetRatio;
          cropY = (vh - cropH) / 2;
        }

        const canvas = document.createElement('canvas');
        canvas.width = Math.round(cropW);
        canvas.height = Math.round(cropH);
        const ctx = canvas.getContext('2d');
        if (ctx) {
          if (facingMode === 'user') {
            ctx.translate(canvas.width, 0);
            ctx.scale(-1, 1);
          }
          ctx.drawImage(video, cropX, cropY, cropW, cropH, 0, 0, canvas.width, canvas.height);
          photoDataUrl = canvas.toDataURL('image/jpeg', 0.94);

          // Extract the exact Center Area framed by the camera viewfinder stamp guide!
          // Guide overlay in viewfinder is centered:
          // Stamp Landscape guide: 178 / 350 = 50.8% width, 106 / 262.5 = 40.3% height
          // Stamp Portrait guide: 110 / 350 = 31.4% width, 150 / 262.5 = 57.1% height
          // Stamp Square guide: 132 / 350 = 37.7% width, 132 / 262.5 = 50.3% height
          let stampRelW = 0.52;
          let stampRelH = 0.42;
          if (currentFrame.id === 'stamp-portrait') {
            stampRelW = 0.33;
            stampRelH = 0.58;
          } else if (currentFrame.id === 'stamp-square') {
            stampRelW = 0.40;
            stampRelH = 0.52;
          }

          const stampCropW = canvas.width * stampRelW;
          const stampCropH = canvas.height * stampRelH;
          const stampCropX = (canvas.width - stampCropW) / 2;
          const stampCropY = (canvas.height - stampCropH) / 2;

          const stampCanvas = document.createElement('canvas');
          stampCanvas.width = Math.round(stampCropW);
          stampCanvas.height = Math.round(stampCropH);
          const stampCtx = stampCanvas.getContext('2d');
          if (stampCtx) {
            stampCtx.drawImage(
              canvas,
              stampCropX,
              stampCropY,
              stampCropW,
              stampCropH,
              0,
              0,
              stampCanvas.width,
              stampCanvas.height
            );
            stampDataUrl = stampCanvas.toDataURL('image/jpeg', 0.94);
          }
        }
      } catch (e) {
        console.error('Camera canvas capture error', e);
      }
    }

    setCapturedPhotoUrl(photoDataUrl);
    setStampPhotoUrl(stampDataUrl || photoDataUrl);
    setCapturedMeta({
      date: formattedDate,
      time: formattedTime,
      location: 'Atelier Stempels · Paris',
      stampNo: `№ ${Math.floor(100 + Math.random() * 900)}`
    });

    stopCamera();
    setScreen('developing');
    setDevProgress(0);

    let p = 0;
    const timer = setInterval(() => {
      p += 15;
      setDevProgress(Math.min(p, 100));
      if (p >= 100) {
        clearInterval(timer);
        setTimeout(() => {
          setScreen('result');
          wobbleCard();
        }, 300);
      }
    }, 170);
  };

  // Upload from Gallery
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const resultUrl = event.target?.result as string;
        const now = new Date();
        const formattedDate = `${String(now.getDate()).padStart(2, '0')}.${String(now.getMonth() + 1).padStart(2, '0')}`;
        const formattedTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

        setCapturedPhotoUrl(resultUrl);
        setStampPhotoUrl(resultUrl);
        setCapturedMeta({
          date: formattedDate,
          time: formattedTime,
          location: file.name.replace(/\.[^/.]+$/, '').slice(0, 24) || 'Analog Memory',
          stampNo: `№ ${Math.floor(100 + Math.random() * 900)}`
        });

        stopCamera();
        setScreen('developing');
        setDevProgress(0);

        let p = 0;
        const timer = setInterval(() => {
          p += 18;
          setDevProgress(Math.min(p, 100));
          if (p >= 100) {
            clearInterval(timer);
            setTimeout(() => {
              setScreen('result');
              wobbleCard();
            }, 300);
          }
        }, 160);
      };
      reader.readAsDataURL(file);
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  // Helper to draw an image onto canvas without stretching (object-fit: cover equivalent)
  const drawImageCover = (
    ctx: CanvasRenderingContext2D,
    img: HTMLImageElement,
    dx: number,
    dy: number,
    dw: number,
    dh: number
  ) => {
    const imgRatio = img.naturalWidth / img.naturalHeight;
    const targetRatio = dw / dh;
    let sx = 0;
    let sy = 0;
    let sw = img.naturalWidth;
    let sh = img.naturalHeight;

    if (imgRatio > targetRatio) {
      // Source image is wider than target area -> crop left and right
      sw = img.naturalHeight * targetRatio;
      sx = (img.naturalWidth - sw) / 2;
    } else {
      // Source image is taller than target area -> crop top and bottom
      sh = img.naturalWidth / targetRatio;
      sy = (img.naturalHeight - sh) / 2;
    }

    ctx.drawImage(img, sx, sy, sw, sh, dx, dy, dw, dh);
  };

  // Real Save (Canvas download - Exact 3:4 Instagram Ratio: 1200 x 1600 matching reference image)
  const handleSaveToDevice = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 1200;
    canvas.height = 1600;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 1. Fill entire 1200x1600 card background with paper tone (50/50 split postcard for all frames)
    ctx.fillStyle = selectedPaperTone.bgCard;
    ctx.fillRect(0, 0, 1200, 1600);

    const topBg = currentFrame.id === 'stamp-square' ? '#FCE5EB' : currentFrame.id === 'souvenir-dots' ? '#EFF4EC' : selectedPaperTone.bgTop;
    ctx.fillStyle = topBg;
    ctx.fillRect(0, 0, 1200, 800);

    const finalize = (imgElement?: HTMLImageElement, stampImgElement?: HTMLImageElement) => {
      const activeStampImg = stampImgElement || imgElement;

      // 2. Render Top Half Frame Elements (Height: 800px)
      if (currentFrame.id === 'stamp-landscape') {
        // Landscape Stamp (414 x 260)
        const stampW = 414;
        const stampH = 260;
        const stampX = 393;
        const stampY = 270;
        const miniStampPath = new Path2D(getStampPath(stampW, stampH, 7.8, 17, 11));

        // Timestamp above stamp
        ctx.fillStyle = selectedPaperTone.text;
        ctx.font = 'bold 30px "Space Mono", monospace';
        ctx.textAlign = 'left';
        ctx.fillText(`${capturedMeta.date} · ${capturedMeta.time}`, stampX, stampY - 24);

        ctx.save();
        ctx.translate(stampX, stampY);
        ctx.shadowColor = 'rgba(0, 0, 0, 0.18)';
        ctx.shadowBlur = 18;
        ctx.shadowOffsetY = 6;
        ctx.fillStyle = '#FFFFFF';
        ctx.fill(miniStampPath);
        ctx.shadowColor = 'transparent';

        const margin = 17;
        const innerW = stampW - 2 * margin;
        const innerH = stampH - 2 * margin;

        ctx.save();
        ctx.beginPath();
        ctx.rect(margin, margin, innerW, innerH);
        ctx.clip();

        if (activeStampImg) {
          ctx.save();
          if (selectedFilter.css !== 'none') ctx.filter = selectedFilter.css;
          drawImageCover(ctx, activeStampImg, margin, margin, innerW, innerH);
          ctx.restore();
        } else {
          ctx.fillStyle = '#E2D6BF';
          ctx.fillRect(margin, margin, innerW, innerH);
          ctx.fillStyle = '#264D3B';
          ctx.beginPath();
          ctx.arc(margin + 200, margin + 120, 60, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();

        ctx.strokeStyle = '#DDD5C7';
        ctx.lineWidth = 1.5;
        ctx.strokeRect(margin, margin, innerW, innerH);

        ctx.strokeStyle = '#D4CBBC';
        ctx.lineWidth = 2;
        ctx.stroke(miniStampPath);
        ctx.restore();
      } else if (currentFrame.id === 'stamp-portrait') {
        // Portrait Stamp (280 x 370)
        const stampW = 280;
        const stampH = 370;
        const stampX = (1200 - stampW) / 2;
        const stampY = 170;
        const portraitStampPath = new Path2D(getStampPath(stampW, stampH, 7.5, 11, 15));

        // Timestamp above stamp
        ctx.fillStyle = selectedPaperTone.text;
        ctx.font = 'bold 30px "Space Mono", monospace';
        ctx.textAlign = 'left';
        ctx.fillText(`${capturedMeta.date} · ${capturedMeta.time}`, stampX, stampY - 24);

        ctx.save();
        ctx.translate(stampX, stampY);
        ctx.shadowColor = 'rgba(0, 0, 0, 0.18)';
        ctx.shadowBlur = 18;
        ctx.shadowOffsetY = 6;
        ctx.fillStyle = '#FFFFFF';
        ctx.fill(portraitStampPath);
        ctx.shadowColor = 'transparent';

        const margin = 17;
        const innerW = stampW - 2 * margin;
        const innerH = stampH - 2 * margin;

        ctx.save();
        ctx.beginPath();
        ctx.rect(margin, margin, innerW, innerH);
        ctx.clip();

        if (activeStampImg) {
          ctx.save();
          if (selectedFilter.css !== 'none') ctx.filter = selectedFilter.css;
          drawImageCover(ctx, activeStampImg, margin, margin, innerW, innerH);
          ctx.restore();
        } else {
          ctx.fillStyle = '#E2D6BF';
          ctx.fillRect(margin, margin, innerW, innerH);
          ctx.fillStyle = '#264D3B';
          ctx.beginPath();
          ctx.arc(margin + 120, margin + 160, 60, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();

        ctx.strokeStyle = '#DDD5C7';
        ctx.lineWidth = 1.5;
        ctx.strokeRect(margin, margin, innerW, innerH);

        ctx.strokeStyle = '#D4CBBC';
        ctx.lineWidth = 2;
        ctx.stroke(portraitStampPath);
        ctx.restore();
      } else if (currentFrame.id === 'stamp-square') {
        // Square Stamp (360 x 360)
        const stampSize = 360;
        const stampX = (1200 - stampSize) / 2;
        const stampY = 220;
        const sqPath = new Path2D(getStampPath(stampSize, stampSize, 7.5, 13, 13));

        ctx.save();
        ctx.translate(stampX, stampY);
        ctx.shadowColor = 'rgba(60, 25, 35, 0.18)';
        ctx.shadowBlur = 20;
        ctx.shadowOffsetY = 6;
        ctx.fillStyle = '#FFFFFF';
        ctx.fill(sqPath);
        ctx.shadowColor = 'transparent';

        const margin = 17;
        const innerSize = stampSize - 2 * margin;

        ctx.save();
        ctx.beginPath();
        ctx.rect(margin, margin, innerSize, innerSize);
        ctx.clip();

        if (activeStampImg) {
          ctx.save();
          if (selectedFilter.css !== 'none') ctx.filter = selectedFilter.css;
          drawImageCover(ctx, activeStampImg, margin, margin, innerSize, innerSize);
          ctx.restore();
        } else {
          ctx.fillStyle = '#FCE5EB';
          ctx.fillRect(margin, margin, innerSize, innerSize);
        }
        ctx.restore();

        ctx.strokeStyle = '#E8BCC8';
        ctx.lineWidth = 1.5;
        ctx.strokeRect(margin, margin, innerSize, innerSize);

        ctx.strokeStyle = '#E2AEBC';
        ctx.lineWidth = 2;
        ctx.stroke(sqPath);
        ctx.restore();

        // Timestamp centered below stamp
        ctx.fillStyle = '#5A454C';
        ctx.font = 'bold 30px "Space Mono", monospace';
        ctx.textAlign = 'center';
        ctx.fillText(`${capturedMeta.date} · ${capturedMeta.time}`, 600, stampY + stampSize + 55);
      } else if (currentFrame.id === 'star-cluster') {
        // Star Cluster Top-Half Cutouts (340 x 226.66 scaled to 1200 x 800)
        const scale = 1200 / 340;

        ctx.save();
        ctx.scale(scale, scale);
        ctx.beginPath();
        STAR_CLUSTER_POINTS.forEach((pt) => {
          const sp = new Path2D(getStarPath(pt.cx, pt.cy, pt.r));
          ctx.fill(sp);
        });
        ctx.clip();

        if (activeStampImg) {
          ctx.save();
          if (selectedFilter.css !== 'none') ctx.filter = selectedFilter.css;
          drawImageCover(ctx, activeStampImg, 0, 0, 340, 226.666667);
          ctx.restore();
        } else {
          ctx.fillStyle = '#E8DEC8';
          ctx.fillRect(0, 0, 340, 226.666667);
        }
        ctx.restore();

        // Star outlines
        ctx.save();
        ctx.scale(scale, scale);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.92)';
        ctx.lineWidth = 0.9;
        STAR_CLUSTER_POINTS.forEach((pt) => {
          ctx.stroke(new Path2D(getStarPath(pt.cx, pt.cy, pt.r)));
        });
        ctx.restore();

        // Timestamp in top half (pink)
        ctx.fillStyle = '#F7A6BC';
        ctx.font = 'bold 30px "Space Mono", monospace';
        ctx.textAlign = 'left';
        ctx.fillText(`★ ${capturedMeta.date} · ${capturedMeta.time}`, 55, 755);
      } else if (currentFrame.id === 'wish-stars') {
        // Wish Constellation Top-Half Cutouts (340 x 226.66 scaled to 1200 x 800)
        const scale = 1200 / 340;

        ctx.save();
        ctx.scale(scale, scale);
        ctx.beginPath();
        WISH_STARS.forEach((pt) => {
          const sp = new Path2D(getStarPath(pt.cx, pt.cy, pt.r));
          ctx.fill(sp);
        });
        ctx.clip();

        if (activeStampImg) {
          ctx.save();
          if (selectedFilter.css !== 'none') ctx.filter = selectedFilter.css;
          drawImageCover(ctx, activeStampImg, 0, 0, 340, 226.666667);
          ctx.restore();
        } else {
          ctx.fillStyle = '#E8DEC8';
          ctx.fillRect(0, 0, 340, 226.666667);
        }
        ctx.restore();

        // Star outlines and typewriter 'wish' labels
        ctx.save();
        ctx.scale(scale, scale);
        ctx.strokeStyle = 'rgba(0, 0, 0, 0.28)';
        ctx.lineWidth = 0.85;
        ctx.fillStyle = '#5A5044';
        ctx.font = '9.5px monospace';
        WISH_STARS.forEach((pt) => {
          ctx.stroke(new Path2D(getStarPath(pt.cx, pt.cy, pt.r)));
          if (pt.text) ctx.fillText(pt.text, pt.cx + pt.r + 3, pt.cy + 3);
        });
        ctx.restore();

        // Timestamp in top half (gold)
        ctx.fillStyle = '#E0BC52';
        ctx.font = 'bold 30px "Space Mono", monospace';
        ctx.textAlign = 'left';
        ctx.fillText(`${capturedMeta.date} · ${capturedMeta.time}`, 55, 755);
      } else if (currentFrame.id === 'souvenir-dots') {
        // Souvenir Polka Dots Top-Half Cutouts (340 x 226.66 scaled to 1200 x 800)
        const scale = 1200 / 340;

        ctx.save();
        ctx.scale(scale, scale);
        ctx.beginPath();
        SOUVENIR_DOTS.forEach((dot) => {
          ctx.moveTo(dot.cx + dot.r, dot.cy);
          ctx.arc(dot.cx, dot.cy, dot.r, 0, Math.PI * 2);
        });
        ctx.clip();

        if (activeStampImg) {
          ctx.save();
          if (selectedFilter.css !== 'none') ctx.filter = selectedFilter.css;
          drawImageCover(ctx, activeStampImg, 0, 0, 340, 226.666667);
          ctx.restore();
        } else {
          ctx.fillStyle = '#BBD7EB';
          ctx.fillRect(0, 0, 340, 226.666667);
        }
        ctx.restore();

        // Circle outlines
        ctx.save();
        ctx.scale(scale, scale);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.85)';
        ctx.lineWidth = 1;
        SOUVENIR_DOTS.forEach((dot) => {
          ctx.beginPath();
          ctx.arc(dot.cx, dot.cy, dot.r, 0, Math.PI * 2);
          ctx.stroke();
        });

        // Center poetic quote text
        ctx.fillStyle = '#3B4D5B';
        ctx.font = '500 10.5px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('some feelings are only visiting,', 170, 114);
        ctx.fillText('but they always leave a souvenir', 170, 128);
        ctx.restore();

        // Timestamp in top half (gold)
        ctx.fillStyle = '#E0BC52';
        ctx.font = 'bold 30px "Space Mono", monospace';
        ctx.textAlign = 'left';
        ctx.fillText(`${capturedMeta.date} · ${capturedMeta.time}`, 55, 755);
      }

      // 5. Draw Bottom Half (Full Photo for ALL frames: 1200 x 800)
      if (imgElement) {
        ctx.save();
        ctx.beginPath();
        ctx.rect(0, 800, 1200, 800);
        ctx.clip();
        if (selectedFilter.css !== 'none') {
          ctx.filter = selectedFilter.css;
        }
        drawImageCover(ctx, imgElement, 0, 800, 1200, 800);
        ctx.restore();
      } else {
        ctx.fillStyle = '#EAE4D7';
        ctx.fillRect(0, 800, 1200, 800);
      }

      // 6. Draw Frame Overlays on Bottom Photo (Cuts matching top shape)
      if (currentFrame.id === 'stamp-landscape') {
        const centerW = 414;
        const centerH = 260;
        const centerX = (1200 - centerW) / 2;
        const centerY = 1070; // 800 + 270 (matching top half 270px)
        const centerStampPath = new Path2D(getStampPath(centerW, centerH, 7.8, 13, 8));

        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.shadowColor = 'rgba(25, 20, 15, 0.18)';
        ctx.shadowBlur = 20;
        ctx.shadowOffsetY = 6;
        ctx.fillStyle = '#FAF8F4';
        ctx.fill(centerStampPath);
        ctx.shadowColor = 'transparent';
        ctx.strokeStyle = '#D8D0C2';
        ctx.lineWidth = 2;
        ctx.stroke(centerStampPath);

        if (labelNote) {
          ctx.fillStyle = '#2B2723';
          ctx.font = '28px "Space Mono", monospace';
          ctx.textAlign = 'center';
          ctx.fillText(labelNote, centerW / 2, centerH / 2 + 10);
        }
        ctx.restore();
      } else if (currentFrame.id === 'stamp-portrait') {
        const centerW = 320;
        const centerH = 420;
        const centerX = (1200 - centerW) / 2;
        const centerY = 990; // 800 + 190 (matching top half 190px)
        const centerStampPath = new Path2D(getStampPath(centerW, centerH, 8.0, 9, 12));

        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.shadowColor = 'rgba(25, 20, 15, 0.18)';
        ctx.shadowBlur = 20;
        ctx.shadowOffsetY = 6;
        ctx.fillStyle = '#FAF8F4';
        ctx.fill(centerStampPath);
        ctx.shadowColor = 'transparent';
        ctx.strokeStyle = '#D8D0C2';
        ctx.lineWidth = 2;
        ctx.stroke(centerStampPath);

        if (labelNote) {
          ctx.fillStyle = '#2B2723';
          ctx.font = '28px "Space Mono", monospace';
          ctx.textAlign = 'center';
          ctx.fillText(labelNote, centerW / 2, centerH / 2 + 10);
        }
        ctx.restore();
      } else if (currentFrame.id === 'stamp-square') {
        // Center Pink Stamp Overlay (matching top half 220px offset)
        const sqSize = 360;
        const centerX = (1200 - sqSize) / 2;
        const centerY = 1020; // 800 + 220
        const pinkStampPath = new Path2D(getStampPath(sqSize, sqSize, 7.5, 13, 13));

        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.shadowColor = 'rgba(60, 25, 35, 0.24)';
        ctx.shadowBlur = 22;
        ctx.shadowOffsetY = 8;
        ctx.fillStyle = '#FCE2EB';
        ctx.fill(pinkStampPath);
        ctx.shadowColor = 'transparent';
        ctx.strokeStyle = '#EAB4C2';
        ctx.lineWidth = 2;
        ctx.stroke(pinkStampPath);

        ctx.fillStyle = 'rgba(107, 46, 62, 0.18)';
        ctx.fillRect(14, sqSize / 2, sqSize - 28, 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.75)';
        ctx.fillRect(14, sqSize / 2 + 2, sqSize - 28, 1.5);

        if (labelNote) {
          ctx.fillStyle = '#4A2632';
          ctx.font = '28px "Space Mono", monospace';
          ctx.textAlign = 'center';
          ctx.fillText(labelNote, sqSize / 2, sqSize / 2 + 10);
        }
        ctx.restore();
      } else if (currentFrame.id === 'star-cluster') {
        // Star Cluster Bottom Cutout Overlay on Full Photo (Matching Top Shape)
        const scale = 1200 / 340;
        ctx.save();
        ctx.translate(0, 800);
        ctx.scale(scale, scale);
        ctx.shadowColor = 'rgba(25, 20, 15, 0.22)';
        ctx.shadowBlur = 8;
        ctx.shadowOffsetY = 2;
        ctx.fillStyle = selectedPaperTone.bgCard || '#FAF8F4';
        STAR_CLUSTER_POINTS.forEach((pt) => {
          const sp = new Path2D(getStarPath(pt.cx, pt.cy, pt.r));
          ctx.fill(sp);
        });
        ctx.shadowColor = 'transparent';
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.92)';
        ctx.lineWidth = 0.9;
        STAR_CLUSTER_POINTS.forEach((pt) => {
          ctx.stroke(new Path2D(getStarPath(pt.cx, pt.cy, pt.r)));
        });
        ctx.restore();

        if (labelNote) {
          ctx.save();
          ctx.fillStyle = 'rgba(250, 248, 244, 0.92)';
          ctx.fillRect(55, 1430, 480, 56);
          ctx.strokeStyle = '#D8D0C2';
          ctx.lineWidth = 1.5;
          ctx.strokeRect(55, 1430, 480, 56);
          ctx.fillStyle = '#3A332C';
          ctx.font = '24px "Space Mono", monospace';
          ctx.textAlign = 'left';
          ctx.fillText(labelNote, 75, 1468);
          ctx.restore();
        }
      } else if (currentFrame.id === 'wish-stars') {
        // Wish Constellation Bottom Cutout Overlay on Full Photo (Matching Top Shape)
        const scale = 1200 / 340;
        ctx.save();
        ctx.translate(0, 800);
        ctx.scale(scale, scale);
        ctx.shadowColor = 'rgba(25, 20, 15, 0.22)';
        ctx.shadowBlur = 8;
        ctx.shadowOffsetY = 2;
        ctx.fillStyle = selectedPaperTone.bgCard || '#FAF8F4';
        WISH_STARS.forEach((pt) => {
          const sp = new Path2D(getStarPath(pt.cx, pt.cy, pt.r));
          ctx.fill(sp);
        });
        ctx.shadowColor = 'transparent';
        ctx.strokeStyle = 'rgba(0, 0, 0, 0.28)';
        ctx.lineWidth = 0.85;
        ctx.fillStyle = '#5A5044';
        ctx.font = '9.5px monospace';
        WISH_STARS.forEach((pt) => {
          ctx.stroke(new Path2D(getStarPath(pt.cx, pt.cy, pt.r)));
          if (pt.text) ctx.fillText(pt.text, pt.cx + pt.r + 3, pt.cy + 3);
        });
        ctx.restore();

        if (labelNote) {
          ctx.save();
          ctx.fillStyle = 'rgba(250, 248, 244, 0.92)';
          ctx.fillRect(55, 1430, 480, 56);
          ctx.strokeStyle = '#D8D0C2';
          ctx.lineWidth = 1.5;
          ctx.strokeRect(55, 1430, 480, 56);
          ctx.fillStyle = '#3A332C';
          ctx.font = '24px "Space Mono", monospace';
          ctx.textAlign = 'left';
          ctx.fillText(labelNote, 75, 1468);
          ctx.restore();
        }
      } else if (currentFrame.id === 'souvenir-dots') {
        // Souvenir Polka Dots Bottom Cutout Overlay on Full Photo (Matching Top Shape)
        const scale = 1200 / 340;
        ctx.save();
        ctx.translate(0, 800);
        ctx.scale(scale, scale);
        ctx.shadowColor = 'rgba(25, 20, 15, 0.22)';
        ctx.shadowBlur = 8;
        ctx.shadowOffsetY = 2;
        ctx.fillStyle = '#EFF4EC';
        SOUVENIR_DOTS.forEach((dot) => {
          ctx.beginPath();
          ctx.arc(dot.cx, dot.cy, dot.r, 0, Math.PI * 2);
          ctx.fill();
        });
        ctx.shadowColor = 'transparent';
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.85)';
        ctx.lineWidth = 1;
        SOUVENIR_DOTS.forEach((dot) => {
          ctx.beginPath();
          ctx.arc(dot.cx, dot.cy, dot.r, 0, Math.PI * 2);
          ctx.stroke();
        });

        // Center quote text
        ctx.fillStyle = '#3B4D5B';
        ctx.font = '500 10.5px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('some feelings are only visiting,', 170, 114);
        ctx.fillText('but they always leave a souvenir', 170, 128);
        ctx.restore();

        if (labelNote) {
          ctx.save();
          ctx.fillStyle = 'rgba(250, 248, 244, 0.92)';
          ctx.fillRect(55, 1430, 480, 56);
          ctx.strokeStyle = '#D8D0C2';
          ctx.lineWidth = 1.5;
          ctx.strokeRect(55, 1430, 480, 56);
          ctx.fillStyle = '#3A332C';
          ctx.font = '24px "Space Mono", monospace';
          ctx.textAlign = 'left';
          ctx.fillText(labelNote, 75, 1468);
          ctx.restore();
        }
      }

      // Watermark in bottom right for all frames
      if (showWatermark) {
        ctx.save();
        ctx.fillStyle = '#FFFFFF';
        ctx.shadowColor = 'rgba(0, 0, 0, 0.85)';
        ctx.shadowBlur = 6;
        ctx.font = 'bold 30px "Plus Jakarta Sans", sans-serif';
        ctx.textAlign = 'right';
        ctx.fillText((watermarkText || '✻stampo').trim(), 1140, 1540);
        ctx.restore();
      }

      const triggerDownload = () => {
        const link = document.createElement('a');
        link.download = `stampo-${capturedMeta.date}-${capturedMeta.time}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
        showToast('Saved to Camera Roll ✨ (3:4 Instagram)');
      };

      // 7. Apply Chosen Texture to the entire exported image!
      if (selectedTexture !== 'none') {
        if (selectedTexture === 'custom' && customTextureUrl) {
          const custImg = new Image();
          custImg.onload = () => {
            ctx.save();
            ctx.globalAlpha = textureOpacity / 100;
            ctx.globalCompositeOperation = 'multiply';
            ctx.drawImage(custImg, 0, 0, 1200, 1600);
            ctx.restore();
            triggerDownload();
          };
          custImg.src = customTextureUrl;
          return;
        } else {
          // Render rich procedural paper texture to match UI appearance
          const op = (textureOpacity / 100);

          if (selectedTexture === 'aged-crease') {
            // Vintage Stained Paper with Aged Horizontal Crease and Warm Vignette
            ctx.save();
            ctx.globalCompositeOperation = 'multiply';
            
            // Corner tea/coffee aged stains
            const radGrad1 = ctx.createRadialGradient(1140, 360, 40, 1140, 360, 580);
            radGrad1.addColorStop(0, `rgba(160, 118, 70, ${0.45 * op})`);
            radGrad1.addColorStop(0.5, `rgba(185, 142, 95, ${0.22 * op})`);
            radGrad1.addColorStop(1, 'rgba(0, 0, 0, 0)');
            ctx.fillStyle = radGrad1;
            ctx.fillRect(0, 0, 1200, 1600);

            const radGrad2 = ctx.createRadialGradient(80, 1380, 30, 80, 1380, 520);
            radGrad2.addColorStop(0, `rgba(150, 105, 62, ${0.38 * op})`);
            radGrad2.addColorStop(1, 'rgba(0, 0, 0, 0)');
            ctx.fillStyle = radGrad2;
            ctx.fillRect(0, 0, 1200, 1600);

            // Center Fold / Crease Line across middle (Y = 800)
            const foldGrad = ctx.createLinearGradient(0, 786, 0, 814);
            foldGrad.addColorStop(0, 'rgba(0,0,0,0)');
            foldGrad.addColorStop(0.35, `rgba(90, 68, 48, ${0.35 * op})`);
            foldGrad.addColorStop(0.5, `rgba(255, 252, 240, ${0.45 * op})`);
            foldGrad.addColorStop(0.65, `rgba(80, 58, 40, ${0.40 * op})`);
            foldGrad.addColorStop(1, 'rgba(0,0,0,0)');
            ctx.fillStyle = foldGrad;
            ctx.fillRect(0, 786, 1200, 28);
            ctx.restore();
          } else if (selectedTexture === 'crumpled') {
            // Origami Wrinkles & Crinkles across surface
            ctx.save();
            ctx.globalCompositeOperation = 'multiply';
            // Draw multiple subtle directional fold lines
            ctx.strokeStyle = `rgba(60, 45, 30, ${0.28 * op})`;
            ctx.lineWidth = 2.5;
            const creases = [
              [0, 260, 480, 780],
              [480, 780, 1200, 620],
              [200, 0, 650, 600],
              [650, 600, 1200, 1280],
              [0, 1050, 540, 1200],
              [540, 1200, 920, 1600],
              [780, 0, 1200, 440],
              [0, 640, 380, 980]
            ];
            creases.forEach(([x1, y1, x2, y2]) => {
              ctx.beginPath();
              ctx.moveTo(x1, y1);
              ctx.lineTo(x2, y2);
              ctx.stroke();
            });
            ctx.restore();
          }

          // High-density organic paper fiber noise grain
          const imgData = ctx.getImageData(0, 0, 1200, 1600);
          const data = imgData.data;
          const factor = (textureOpacity / 100) * 58;
          for (let i = 0; i < data.length; i += 4) {
            const noise = (Math.random() - 0.5) * factor;
            data[i] = Math.min(255, Math.max(0, data[i] + noise));
            data[i + 1] = Math.min(255, Math.max(0, data[i + 1] + noise));
            data[i + 2] = Math.min(255, Math.max(0, data[i + 2] + noise));
          }
          ctx.putImageData(imgData, 0, 0);

          // Subtle organic paper grid overlay for canvas / linen / washi textures
          if (['canvas', 'linen', 'washi', 'kraft'].includes(selectedTexture)) {
            ctx.save();
            ctx.globalCompositeOperation = 'multiply';
            ctx.fillStyle = `rgba(40, 30, 20, ${0.04 * op})`;
            for (let y = 0; y < 1600; y += 4) {
              ctx.fillRect(0, y, 1200, 1);
            }
            for (let x = 0; x < 1200; x += 4) {
              ctx.fillRect(x, 0, 1, 1600);
            }
            ctx.restore();
          }

          triggerDownload();
          return;
        }
      }

      triggerDownload();
    };

    if (capturedPhotoUrl) {
      const img = new Image();
      img.onload = () => {
        if (stampPhotoUrl && stampPhotoUrl !== capturedPhotoUrl) {
          const stampImg = new Image();
          stampImg.onload = () => finalize(img, stampImg);
          stampImg.onerror = () => finalize(img);
          stampImg.src = stampPhotoUrl;
        } else {
          finalize(img);
        }
      };
      img.src = capturedPhotoUrl;
    } else {
      finalize();
    }
  };

  // 3D Physics Handlers
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isDragging || isAnimationActive || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setRotateX(-y * 12);
    setRotateY(x * 12);
  };

  const handleMouseLeave = () => {
    if (!isDragging && !isAnimationActive) {
      setRotateX(0);
      setRotateY(0);
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (isAnimationActive) setIsAnimationActive(false);
    setIsDragging(true);
    dragStartRef.current = { x: e.clientX, y: e.clientY, rx: rotateX, ry: rotateY };
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (isAnimationActive) setIsAnimationActive(false);
    if (e.touches.length === 1) {
      setIsDragging(true);
      dragStartRef.current = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
        rx: rotateX,
        ry: rotateY
      };
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || e.touches.length !== 1) return;
    const deltaX = e.touches[0].clientX - dragStartRef.current.x;
    const deltaY = e.touches[0].clientY - dragStartRef.current.y;
    setRotateY(dragStartRef.current.ry + deltaX * 0.4);
    setRotateX(dragStartRef.current.rx - deltaY * 0.4);
  };

  const handleGlobalMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging) return;
    const deltaX = e.clientX - dragStartRef.current.x;
    const deltaY = e.clientY - dragStartRef.current.y;
    setRotateY(dragStartRef.current.ry + deltaX * 0.4);
    setRotateX(dragStartRef.current.rx - deltaY * 0.4);
  }, [isDragging]);

  const handleGlobalMouseUp = useCallback(() => {
    if (isDragging) {
      setIsDragging(false);
      setTimeout(() => {
        if (!isAnimationActive) {
          setRotateX(0);
          setRotateY(0);
        }
      }, 50);
    }
  }, [isDragging, isAnimationActive]);

  useEffect(() => {
    window.addEventListener('mousemove', handleGlobalMouseMove);
    window.addEventListener('mouseup', handleGlobalMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleGlobalMouseMove);
      window.removeEventListener('mouseup', handleGlobalMouseUp);
    };
  }, [handleGlobalMouseMove, handleGlobalMouseUp]);

  const wobbleCard = () => {
    setRotateX(8);
    setRotateY(-10);
    setTimeout(() => {
      setRotateX(-5);
      setRotateY(7);
      setTimeout(() => {
        setRotateX(0);
        setRotateY(0);
      }, 150);
    }, 150);
  };

  const toggleFlip = () => {
    playTactileSound('rustle', soundEnabled);
    setIsFlipped((prev) => !prev);
    setRotateX(0);
    setRotateY(0);
  };

  const handleCustomTextureUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setCustomTextureUrl(event.target?.result as string);
        setSelectedTexture('custom');
        showToast('Tekstur kustom berhasil dimuat 🎨');
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen bg-[#ECE9E2] flex items-center justify-center p-0 sm:p-4 select-none">
      
      {/* Hidden File Input for Photos */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileUpload}
        className="hidden"
      />

      {/* Hidden File Input for Custom Texture */}
      <input
        ref={customTextureInputRef}
        type="file"
        accept="image/*"
        onChange={handleCustomTextureUpload}
        className="hidden"
      />

      {/* Main Mobile Screen Viewport (Strictly Clean: No Status Bar, No Bottom Bar) */}
      <div
        className="relative w-full max-w-[412px] h-[100dvh] sm:h-[844px] bg-[#F4F1EA] sm:rounded-[36px] overflow-hidden flex flex-col justify-between shadow-2xl border-stone-300 sm:border"
        style={{ backgroundColor: '#F4F1EA' }}
      >
        {/* Flash effect on shutter */}
        {flashActive && (
          <div className="absolute inset-0 bg-white z-[60] pointer-events-none animate-out fade-out duration-200"></div>
        )}

        {/* ----------------------------------------------------------------- */}
        {/* TOP HEADER (Matching reference screenshot) */}
        {/* ----------------------------------------------------------------- */}
        <header className="px-5 pt-4 pb-2 flex items-center justify-between z-30">
          {/* Navigation Button: Clear Camera Button on result screen, Back button on camera/album */}
          <button
            onClick={() => {
              if (activeModal === 'album') {
                playTactileSound('click', soundEnabled);
                setActiveModal('none');
              } else {
                setIsFlipped(false);
                setScreen(screen === 'result' ? 'camera' : 'result');
              }
            }}
            className="h-10 px-3.5 rounded-full bg-white/90 border border-stone-200/80 shadow-xs flex items-center gap-1.5 text-stone-700 hover:bg-white active:scale-95 transition cursor-pointer"
            title={activeModal === 'album' ? 'Tutup Album & Kembali' : screen === 'result' ? 'Buka Kamera untuk Mengambil Foto Baru' : 'Kembali ke Hasil Kartu'}
          >
            {screen === 'result' && activeModal !== 'album' ? (
              <>
                <Camera size={16} strokeWidth={2.2} className="text-[#C93B61]" />
                <span className="text-xs font-mono-tactile font-semibold text-[#3A332C]">kamera</span>
              </>
            ) : (
              <>
                <ArrowLeft size={16} strokeWidth={2.2} />
                <span className="text-xs font-mono-tactile font-medium text-stone-700">kartu</span>
              </>
            )}
          </button>

          {/* Dotted Pointillist Mascot Logo: stampo */}
          <div 
            onClick={() => {
              if (activeModal === 'album') setActiveModal('none');
            }}
            className="flex items-center gap-1.5 select-none cursor-pointer"
          >
            {/* Cute Pixel Eyes */}
            <div className="flex items-center gap-1 mr-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#E57373]"></span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#81C784]"></span>
            </div>
            {/* Pointillist Logo text "stampo" */}
            <span className="text-[22px] font-bold tracking-tight text-[#3A332C] font-mono-tactile">
              <span className="text-[#D9775A]">s</span>
              <span className="text-[#C29B38]">t</span>
              <span className="text-[#E5A65E]">a</span>
              <span className="text-[#4E8296]">m</span>
              <span className="text-[#A26D97]">p</span>
              <span className="text-[#D9775A]">o</span>
            </span>
          </div>

          {/* Right Slot: Album button on both screens + Flip Camera on camera */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => {
                playTactileSound('rustle', soundEnabled);
                setActiveModal(activeModal === 'album' ? 'none' : 'album');
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#FAF5EB] hover:bg-[#F2ECE0] border border-[#E3DACB] text-[#3D2E24] text-xs font-mono-tactile font-medium transition cursor-pointer shadow-2xs active:scale-95"
              title="Buka Koleksi Album Filateli"
            >
              <BookOpen size={13} className="text-[#C93B61]" />
              <span>album</span>
              <span className="w-4 h-4 rounded-full bg-[#C93B61] text-white text-[9px] flex items-center justify-center font-bold">
                {journalEntries.length}
              </span>
            </button>

            {screen === 'camera' && (
              <button
                onClick={() => setFacingMode((prev) => (prev === 'user' ? 'environment' : 'user'))}
                className="w-9 h-9 rounded-full bg-white/90 border border-stone-200/80 shadow-xs flex items-center justify-center text-stone-700 hover:bg-white active:scale-95 transition cursor-pointer"
                title="Flip Camera"
              >
                <RotateCw size={15} />
              </button>
            )}
          </div>
        </header>

        {/* ----------------------------------------------------------------- */}
        {/* VIEW A: CAMERA VIEWFINDER (Screenshot 2) */}
        {/* ----------------------------------------------------------------- */}
        {screen === 'camera' && activeModal !== 'album' && (
          <div className="flex-1 flex flex-col justify-between px-5 pb-6 pt-1 animate-in fade-in duration-200">
            
            {/* Center Area: Camera Viewfinder with Stamp Cutout Overlay */}
            <div className="flex-1 flex flex-col justify-center items-center my-auto">
              <div className="relative w-full aspect-[4/3] max-w-[350px] rounded-[32px] overflow-hidden bg-black border border-stone-200/40 shadow-sm">
                
                {/* Live Camera Video with Real-Time Filter Preview */}
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className={`w-full h-full object-cover transition-[filter] duration-200 ${facingMode === 'user' ? 'scale-x-[-1]' : ''}`}
                  style={{ filter: selectedFilter.css }}
                />

                {/* Fallback if camera stream is blocked */}
                {!cameraActive && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-[#E5DFD5]">
                    {/* Mediterranean Cafe Default Backdrop Artwork with Live Filter */}
                    <svg 
                      viewBox="0 0 400 300" 
                      className="absolute inset-0 w-full h-full object-cover transition-[filter] duration-200"
                      style={{ filter: selectedFilter.css }}
                    >
                      <rect width="400" height="300" fill="#E8DEC8" />
                      <polygon points="0,170 400,170 400,300 0,300" fill="#D2C3AA" />
                      <rect x="220" y="30" width="140" height="170" rx="65" fill="#2E5544" />
                      <rect x="235" y="50" width="110" height="145" rx="55" fill="#F8F3E5" />
                      <line x1="290" y1="50" x2="290" y2="195" stroke="#2E5544" strokeWidth="3" />
                      <polygon points="190,20 380,20 395,65 180,65" fill="#41735C" />
                      <ellipse cx="120" cy="240" rx="55" ry="18" fill="#FBF9F2" stroke="#DCD3C0" strokeWidth="2" />
                      <rect x="18" y="145" width="24" height="28" rx="4" fill="#B35F42" />
                      <circle cx="30" cy="115" r="16" fill="#4B6E55" />
                    </svg>
                  </div>
                )}

                {/* DYNAMIC CENTER CUTOUT STAMP FRAME OVERLAY (Framing the camera with prominent gerigi teeth) */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  {currentFrame.id === 'stamp-landscape' && (
                    <div
                      className="relative w-[196px] h-[124px] flex items-center justify-center pointer-events-none"
                      style={{ filter: 'drop-shadow(0 4px 16px rgba(0,0,0,0.65))' }}
                    >
                      <svg width="196" height="124" viewBox="0 0 196 124" className="w-full h-full overflow-visible">
                        {/* Perforated stamp outline with prominent gerigi teeth */}
                        <path
                          d={getStampPath(196, 124, 3.4, 15, 9)}
                          fill="rgba(255, 255, 255, 0.14)"
                          stroke="#FFFFFF"
                          strokeWidth="2.2"
                        />
                        {/* Inner photo guide line */}
                        <rect
                          x="9"
                          y="9"
                          width="178"
                          height="106"
                          rx="2"
                          fill="none"
                          stroke="rgba(255, 255, 255, 0.85)"
                          strokeWidth="1"
                          strokeDasharray="4,3"
                        />
                        {/* Crosshair focus point */}
                        <line x1="94" y1="62" x2="102" y2="62" stroke="rgba(255,255,255,0.75)" strokeWidth="1" />
                        <line x1="98" y1="58" x2="98" y2="66" stroke="rgba(255,255,255,0.75)" strokeWidth="1" />
                      </svg>
                    </div>
                  )}

                  {currentFrame.id === 'stamp-portrait' && (
                    <div
                      className="relative w-[128px] h-[168px] flex items-center justify-center pointer-events-none"
                      style={{ filter: 'drop-shadow(0 4px 16px rgba(0,0,0,0.65))' }}
                    >
                      <svg width="128" height="168" viewBox="0 0 128 168" className="w-full h-full overflow-visible">
                        <path
                          d={getStampPath(128, 168, 3.2, 9, 13)}
                          fill="rgba(255, 255, 255, 0.14)"
                          stroke="#FFFFFF"
                          strokeWidth="2.2"
                        />
                        <rect
                          x="9"
                          y="9"
                          width="110"
                          height="150"
                          rx="2"
                          fill="none"
                          stroke="rgba(255, 255, 255, 0.85)"
                          strokeWidth="1"
                          strokeDasharray="4,3"
                        />
                        <line x1="60" y1="84" x2="68" y2="84" stroke="rgba(255,255,255,0.75)" strokeWidth="1" />
                        <line x1="64" y1="80" x2="64" y2="88" stroke="rgba(255,255,255,0.75)" strokeWidth="1" />
                      </svg>
                    </div>
                  )}

                  {currentFrame.id === 'stamp-square' && (
                    <div
                      className="relative w-[150px] h-[150px] flex items-center justify-center pointer-events-none"
                      style={{ filter: 'drop-shadow(0 4px 16px rgba(0,0,0,0.65))' }}
                    >
                      <svg width="150" height="150" viewBox="0 0 150 150" className="w-full h-full overflow-visible">
                        <path
                          d={getStampPath(150, 150, 3.3, 11, 11)}
                          fill="rgba(252, 229, 235, 0.2)"
                          stroke="#FCE5EB"
                          strokeWidth="2.2"
                        />
                        <rect
                          x="9"
                          y="9"
                          width="132"
                          height="132"
                          rx="2"
                          fill="none"
                          stroke="rgba(255, 255, 255, 0.85)"
                          strokeWidth="1"
                          strokeDasharray="4,3"
                        />
                        <line x1="71" y1="75" x2="79" y2="75" stroke="rgba(255,255,255,0.75)" strokeWidth="1" />
                        <line x1="75" y1="71" x2="75" y2="79" stroke="rgba(255,255,255,0.75)" strokeWidth="1" />
                      </svg>
                    </div>
                  )}

                  {/* Subtle 50/50 Postcard Split Guideline for Camera Viewfinder */}
                  <div className="absolute top-1/2 left-0 right-0 h-0 border-t border-white/25 border-dashed pointer-events-none z-10" />

                  {currentFrame.id === 'star-cluster' && (
                    <>
                      <div className="absolute top-0 left-0 right-0 h-1/2 pointer-events-none">
                        <svg viewBox="0 0 340 226.66" className="w-full h-full" style={{ filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.5))' }}>
                          {STAR_CLUSTER_POINTS.map((pt, i) => (
                            <path key={i} d={getStarPath(pt.cx, pt.cy, pt.r)} fill="rgba(255, 243, 184, 0.45)" stroke="#FFFFFF" strokeWidth="1" />
                          ))}
                        </svg>
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 h-1/2 pointer-events-none">
                        <svg viewBox="0 0 340 226.66" className="w-full h-full" style={{ filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.5))' }}>
                          {STAR_CLUSTER_POINTS.map((pt, i) => (
                            <path key={i} d={getStarPath(pt.cx, pt.cy, pt.r)} fill="rgba(255, 255, 255, 0.25)" stroke="#FFFFFF" strokeWidth="1" />
                          ))}
                        </svg>
                      </div>
                    </>
                  )}

                  {currentFrame.id === 'wish-stars' && (
                    <>
                      <div className="absolute top-0 left-0 right-0 h-1/2 pointer-events-none">
                        <svg viewBox="0 0 340 226.66" className="w-full h-full" style={{ filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.5))' }}>
                          {WISH_STARS.map((pt, i) => (
                            <React.Fragment key={i}>
                              <path d={getStarPath(pt.cx, pt.cy, pt.r)} fill="rgba(255, 255, 255, 0.35)" stroke="#FFFFFF" strokeWidth="1" />
                              {pt.text && (
                                <text x={pt.cx + pt.r + 3} y={pt.cy + 3} className="text-[10px] font-mono fill-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] font-medium">
                                  {pt.text}
                                </text>
                              )}
                            </React.Fragment>
                          ))}
                        </svg>
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 h-1/2 pointer-events-none">
                        <svg viewBox="0 0 340 226.66" className="w-full h-full" style={{ filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.5))' }}>
                          {WISH_STARS.map((pt, i) => (
                            <React.Fragment key={i}>
                              <path d={getStarPath(pt.cx, pt.cy, pt.r)} fill="rgba(255, 255, 255, 0.25)" stroke="#FFFFFF" strokeWidth="1" />
                              {pt.text && (
                                <text x={pt.cx + pt.r + 3} y={pt.cy + 3} className="text-[10px] font-mono fill-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] font-medium">
                                  {pt.text}
                                </text>
                              )}
                            </React.Fragment>
                          ))}
                        </svg>
                      </div>
                    </>
                  )}

                  {currentFrame.id === 'souvenir-dots' && (
                    <>
                      <div className="absolute top-0 left-0 right-0 h-1/2 pointer-events-none">
                        <svg viewBox="0 0 340 226.66" className="w-full h-full" style={{ filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.5))' }}>
                          {SOUVENIR_DOTS.map((dot, i) => (
                            <circle key={i} cx={dot.cx} cy={dot.cy} r={dot.r} fill="rgba(216, 229, 236, 0.35)" stroke="#FFFFFF" strokeWidth="1.2" />
                          ))}
                          <text x="170" y="112" textAnchor="middle" className="text-[9.5px] font-mono fill-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)] font-medium">
                            some feelings are only visiting,
                          </text>
                          <text x="170" y="125" textAnchor="middle" className="text-[9.5px] font-mono fill-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)] font-medium">
                            but they always leave a souvenir
                          </text>
                        </svg>
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 h-1/2 pointer-events-none">
                        <svg viewBox="0 0 340 226.66" className="w-full h-full" style={{ filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.5))' }}>
                          {SOUVENIR_DOTS.map((dot, i) => (
                            <circle key={i} cx={dot.cx} cy={dot.cy} r={dot.r} fill="rgba(216, 229, 236, 0.25)" stroke="#FFFFFF" strokeWidth="1.2" />
                          ))}
                          <text x="170" y="112" textAnchor="middle" className="text-[9.5px] font-mono fill-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)] font-medium">
                            some feelings are only visiting,
                          </text>
                          <text x="170" y="125" textAnchor="middle" className="text-[9.5px] font-mono fill-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)] font-medium">
                            but they always leave a souvenir
                          </text>
                        </svg>
                      </div>
                    </>
                  )}
                </div>

              </div>

              {/* Segmented Switcher in Camera View: [ 🏷️ Bentuk Stamp ] vs [ ✦ Filter Foto ] */}
              <div className="flex items-center justify-between w-full max-w-[350px] px-1 mt-1 mb-1">
                <div className="flex items-center gap-1 p-0.5 bg-[#EAE4D7] rounded-lg">
                  <button
                    type="button"
                    onClick={() => {
                      playTactileSound('click', soundEnabled);
                      setCameraTab('frame');
                    }}
                    className={`px-2.5 py-0.5 rounded-md text-[10.5px] font-mono-tactile transition cursor-pointer ${
                      cameraTab === 'frame'
                        ? 'bg-[#2E2822] text-white font-medium shadow-2xs'
                        : 'text-stone-600 hover:text-stone-900'
                    }`}
                  >
                    🏷️ Bentuk ({FRAME_MODES.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      playTactileSound('click', soundEnabled);
                      setCameraTab('filter');
                    }}
                    className={`px-2.5 py-0.5 rounded-md text-[10.5px] font-mono-tactile transition cursor-pointer ${
                      cameraTab === 'filter'
                        ? 'bg-[#2E2822] text-white font-medium shadow-2xs'
                        : 'text-stone-600 hover:text-stone-900'
                    }`}
                  >
                    ✦ Filter ({PHOTO_FILTERS.length})
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    playTactileSound('click', soundEnabled);
                    setActiveModal('frame');
                  }}
                  className="text-[10px] font-mono-tactile text-[#C93B61] hover:underline cursor-pointer"
                >
                  koleksi bentuk ↗
                </button>
              </div>

              {/* Horizontal Scroll Selector: Either Frame Shapes or Filters */}
              <div className="w-full max-w-[350px] overflow-x-auto no-scrollbar py-1">
                {cameraTab === 'frame' ? (
                  /* 6 Frame / Stamp Shape Horizontal Pills */
                  <div className="flex items-center gap-1.5 px-0.5">
                    {FRAME_MODES.map((mode, idx) => {
                      const isSelected = frameModeIndex === idx;
                      return (
                        <button
                          key={mode.id}
                          type="button"
                          onClick={() => {
                            setFrameModeIndex(idx);
                            playTactileSound('stamp', soundEnabled);
                            showToast(`Bentuk: ${mode.name} ✨`);
                          }}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono-tactile whitespace-nowrap transition cursor-pointer shrink-0 active:scale-95 ${
                            isSelected
                              ? 'bg-[#2E2822] text-white shadow-xs'
                              : 'bg-white/80 border border-stone-200/80 text-stone-700 hover:bg-white'
                          }`}
                        >
                          <span>{mode.icon}</span>
                          <span className="text-[11px] font-medium">{mode.name}</span>
                          {isSelected && <Check size={11} className="text-[#FCD2DC] ml-0.5" />}
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  /* 20 Photo Filter Horizontal Scrolling Selector */
                  <div className="flex items-center gap-1.5 px-0.5">
                    {PHOTO_FILTERS.map((filter) => {
                      const isSelected = selectedFilterId === filter.id;
                      return (
                        <button
                          key={filter.id}
                          type="button"
                          onClick={() => {
                            setSelectedFilterId(filter.id);
                            showToast(`Filter: ${filter.name} ✨`);
                          }}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono-tactile whitespace-nowrap transition cursor-pointer shrink-0 active:scale-95 ${
                            isSelected
                              ? 'bg-[#2E2822] text-white shadow-xs'
                              : 'bg-white/80 border border-stone-200/80 text-stone-700 hover:bg-white'
                          }`}
                        >
                          <span
                            className="w-2.5 h-2.5 rounded-full border border-black/10 shrink-0"
                            style={{ backgroundColor: filter.previewBg }}
                          />
                          <span className="text-[11px] font-medium">{filter.name}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Bottom 3 Circular Controls: "change frame", Shutter, "upload" (Matching reference screenshot) */}
            <div className="flex items-center justify-around px-4 pb-4 pt-2">
              
              {/* 1. change frame (Exact layers icon) */}
              <button
                onClick={() => {
                  playTactileSound('click', soundEnabled);
                  const nextIdx = (frameModeIndex + 1) % FRAME_MODES.length;
                  setFrameModeIndex(nextIdx);
                  showToast(`Bentuk stamp: ${FRAME_MODES[nextIdx].name} ✨`);
                }}
                className="flex flex-col items-center gap-1.5 cursor-pointer active:scale-95 transition"
                title="Ganti Bentuk Stamp"
              >
                <div className="w-[52px] h-[52px] rounded-full bg-white/90 border border-stone-200/80 shadow-xs flex items-center justify-center text-stone-700 hover:bg-white">
                  <Layers size={20} strokeWidth={2} />
                </div>
                <span className="text-[11px] font-mono-tactile text-[#524B43]">change frame</span>
              </button>

              {/* 2. Shutter Button (Pink inside dark ring border) */}
              <button
                onClick={handleShutter}
                className="relative group p-1 cursor-pointer active:scale-90 transition-transform duration-100"
                title="Capture Memory"
              >
                <div className="w-[74px] h-[74px] rounded-full border-[3px] border-[#3D352F] flex items-center justify-center p-[3px] shadow-sm">
                  <div className="w-full h-full rounded-full bg-[#F7A6BC] hover:bg-[#F294AC] transition-colors shadow-xs"></div>
                </div>
              </button>

              {/* 3. upload */}
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex flex-col items-center gap-1.5 cursor-pointer active:scale-95 transition"
              >
                <div className="w-[52px] h-[52px] rounded-full bg-white/90 border border-stone-200/80 shadow-xs flex items-center justify-center text-stone-700 hover:bg-white">
                  <ImageIcon size={20} strokeWidth={2} />
                </div>
                <span className="text-[11px] font-mono-tactile text-[#524B43]">upload</span>
              </button>

            </div>

          </div>
        )}

        {/* ----------------------------------------------------------------- */}
        {/* VIEW B: RETRO PIXEL DEVELOPING SCREEN (Polishing your label...) */}
        {/* ----------------------------------------------------------------- */}
        {screen === 'developing' && (
          <div className="flex-1 flex flex-col items-center justify-center px-8 z-30 select-none animate-in fade-in duration-200">
            {/* Cute Pixel Mascot Box */}
            <div className="relative mb-6">
              <div className="w-24 h-24 rounded-2xl bg-[#3A332C] border-2 border-[#544B41] shadow-xl flex flex-col items-center justify-center p-3 relative overflow-hidden">
                <div className="flex items-center gap-4 my-auto">
                  {pixelBlink ? (
                    <>
                      <div className="w-3.5 h-1 bg-white rounded-xs"></div>
                      <div className="w-3.5 h-1 bg-white rounded-xs"></div>
                    </>
                  ) : (
                    <>
                      <div className="w-3.5 h-3.5 bg-white rounded-xs p-0.5 flex items-end justify-end">
                        <div className="w-1.5 h-1.5 bg-[#1E1A17]"></div>
                      </div>
                      <div className="w-3.5 h-3.5 bg-white rounded-xs p-0.5 flex items-end justify-end">
                        <div className="w-1.5 h-1.5 bg-[#1E1A17]"></div>
                      </div>
                    </>
                  )}
                </div>
                <div className="w-4 h-1 bg-white/80 rounded-full mb-1"></div>
              </div>
            </div>

            <h2 className="text-sm font-mono-tactile text-[#2E2822] font-semibold tracking-wide mb-2">
              Polishing your label...
            </h2>
            <p className="text-[11px] font-mono-tactile text-[#8A7F73] mb-5">
              developing stampo {selectedFilter.name} film {capturedMeta.stampNo}
            </p>

            <div className="w-48 h-1.5 bg-[#E4DDD2] rounded-full overflow-hidden p-0.5">
              <div
                className="h-full bg-[#C93B61] rounded-full transition-all duration-200"
                style={{ width: `${devProgress}%` }}
              ></div>
            </div>
          </div>
        )}

        {/* ----------------------------------------------------------------- */}
        {/* VIEW C: RESULT SCREEN (Card Preview or Full-Page Philately Album) */}
        {/* ----------------------------------------------------------------- */}
        {(screen === 'result' || activeModal === 'album') && screen !== 'developing' && (
          <div className="flex-1 flex flex-col justify-between px-5 pb-5 pt-1 animate-in fade-in duration-300 min-h-0 overflow-hidden">
            
            {activeModal === 'album' ? (
              /* ================================================================= */
              /* FULL-PAGE PHILATELY STAMP COLLECTION ALBUM (WITHOUT OVERLAPPING NAVIGATION) */
              /* ================================================================= */
              <div className="flex-1 flex flex-col min-h-0 overflow-hidden animate-in fade-in duration-200">
                {/* Album Header Bar */}
                <div className="flex items-center justify-between pb-2 pt-0.5 border-b border-[#E3DCCE] mb-2 shrink-0">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-xl bg-[#FCE8EE] text-[#C93B61] flex items-center justify-center shadow-2xs">
                      <BookOpen size={14} />
                    </div>
                    <div>
                      <h3 className="text-xs font-semibold text-stone-900 font-sans tracking-tight">
                        Album Koleksi Filateli
                      </h3>
                      <p className="text-[10px] text-stone-500 font-mono-tactile">
                        {journalEntries.length} prangko tersimpan dalam binder
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      playTactileSound('click', soundEnabled);
                      setActiveModal('none');
                    }}
                    className="px-2.5 py-1 rounded-full bg-stone-200/80 hover:bg-stone-300 text-stone-700 text-[10.5px] font-mono-tactile font-medium transition cursor-pointer"
                  >
                    Tutup ✕
                  </button>
                </div>

                {/* Banner: + Pasang Kartu Ini ke Album */}
                <button
                  type="button"
                  onClick={saveToJournal}
                  className="w-full mb-2 p-2.5 rounded-2xl bg-[#2E2822] text-white flex items-center justify-between hover:bg-stone-800 active:scale-98 transition shadow-xs cursor-pointer group shrink-0"
                >
                  <div className="flex items-center gap-2 text-left">
                    <div className="w-6 h-6 rounded-lg bg-white/10 flex items-center justify-center text-[#FCD2DC]">
                      <Bookmark size={12} />
                    </div>
                    <div>
                      <span className="text-[11.5px] font-semibold block group-hover:text-[#FCD2DC] transition-colors leading-tight">
                        + Pasang Kartu Ini ke Album
                      </span>
                      <span className="text-[9.5px] text-stone-300 font-mono-tactile">
                        {capturedMeta.date} · {capturedMeta.location}
                      </span>
                    </div>
                  </div>
                  <span className="text-[10.5px] font-mono-tactile bg-[#FCD2DC] text-[#7A1F36] px-2 py-0.5 rounded-lg font-semibold shadow-2xs">
                    Koleksi
                  </span>
                </button>

                {/* Collector Guide Microcopy */}
                <div className="flex items-center justify-between px-1 mb-2 text-[10px] font-mono-tactile text-stone-500 shrink-0">
                  <span>LEMBAR KOLEKSI PRANGKO</span>
                  <span className="text-stone-400">ketuk prangko untuk membuka kartu ↗</span>
                </div>

                {/* 2-Column Stamp Grid */}
                <div className="flex-1 overflow-y-auto no-scrollbar pr-0.5 pb-2">
                  {journalEntries.length === 0 ? (
                    <div className="py-12 text-center text-stone-400 font-mono-tactile text-xs flex flex-col items-center">
                      <div className="w-11 h-11 rounded-2xl bg-stone-100 flex items-center justify-center mb-2.5 text-stone-300">
                        <BookOpen size={20} />
                      </div>
                      <p className="font-semibold text-stone-600 mb-1">Album Masih Kosong</p>
                      <p className="text-[10.5px] max-w-[220px] text-stone-400">
                        Ambil foto atau buat kartu, lalu tekan "Pasang Kartu Ini ke Album".
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-2.5">
                      {journalEntries.map((item, idx) => {
                        const paper = PAPER_TONES.find((p) => p.id === item.paperToneId) || PAPER_TONES[0];
                        const filter = PHOTO_FILTERS.find((f) => f.id === item.filterId);

                        return (
                          <div
                            key={item.id}
                            onClick={() => loadFromJournal(item)}
                            className="group relative p-2 rounded-2xl border border-[#E5DFD4] shadow-2xs hover:shadow-md hover:border-[#D6CEBF] active:scale-[0.97] transition-all duration-150 cursor-pointer flex flex-col justify-between"
                            style={{ backgroundColor: paper.bgCard }}
                          >
                            {/* Top Tag: Collector Index & Delete button */}
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-[9px] font-mono-tactile font-semibold px-1.5 py-0.2 rounded-md bg-black/6 text-stone-700">
                                № {String(idx + 1).padStart(2, '0')}
                              </span>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  deleteFromJournal(item.id);
                                }}
                                className="w-5 h-5 rounded-full text-stone-400 hover:text-red-600 hover:bg-red-50 flex items-center justify-center transition cursor-pointer"
                                title="Hapus dari album"
                              >
                                <Trash2 size={11} />
                              </button>
                            </div>

                            {/* Mini Stamp with Authentic Dense Perforations */}
                            <div className="w-full flex items-center justify-center py-1">
                              <div
                                className="relative w-[126px] h-[80px] flex items-center justify-center transition-transform duration-150 group-hover:scale-105"
                                style={{
                                  filter: 'drop-shadow(0 2.5px 5px rgba(35,25,15,0.18))'
                                }}
                              >
                                <svg width="126" height="110" viewBox="0 0 126 110" className="w-full h-full overflow-visible">
                                  <defs>
                                    <clipPath id={`albumStampClip-${item.id}`}>
                                      <path d={getStampPath(126, 110, 3.0, 9, 8)} />
                                    </clipPath>
                                    <clipPath id={`albumStampInnerClip-${item.id}`}>
                                      <rect x="6" y="6" width="114" height="98" rx="1.5" />
                                    </clipPath>
                                  </defs>

                                  {/* Authentic Perforated Stamp Base */}
                                  <path
                                    d={getStampPath(126, 110, 3.0, 9, 8)}
                                    fill="#FFFFFF"
                                  />

                                  {/* Photo inside stamp with matching perforated teeth and white paper border */}
                                  <g clipPath={`url(#albumStampClip-${item.id})`}>
                                    <g clipPath={`url(#albumStampInnerClip-${item.id})`}>
                                      {item.photoUrl ? (
                                        <image
                                          href={item.photoUrl}
                                          x="6"
                                          y="6"
                                          width="114"
                                          height="98"
                                          preserveAspectRatio="xMidYMid slice"
                                          style={{ filter: filter?.css }}
                                        />
                                      ) : (
                                        <g transform="translate(6, 6)">
                                          <svg width="114" height="98" viewBox="75 18 245 155" preserveAspectRatio="xMidYMid slice">
                                            <CafeSceneSvg isCrop={true} filterCss={filter?.css} />
                                          </svg>
                                        </g>
                                      )}
                                    </g>
                                  </g>

                                  {/* Inner hairline frame */}
                                  <rect
                                    x="6"
                                    y="6"
                                    width="114"
                                    height="98"
                                    rx="1.5"
                                    fill="none"
                                    stroke="#DDD5C7"
                                    strokeWidth="0.6"
                                  />

                                  {/* Perforated stamp outline stroke */}
                                  <path
                                    d={getStampPath(126, 110, 3.0, 9, 8)}
                                    fill="none"
                                    stroke="#D4CBBC"
                                    strokeWidth="0.9"
                                  />
                                </svg>
                              </div>
                            </div>

                            {/* Details & Tap to open prompt */}
                            <div className="mt-1.5 pt-1 border-t border-black/5 text-left">
                              <div className="flex items-center justify-between">
                                <span
                                  className="text-[9.5px] font-mono-tactile font-semibold truncate"
                                  style={{ color: paper.text }}
                                >
                                  {item.date} · {item.time}
                                </span>
                                <span className="text-[8px] font-mono-tactile px-1 rounded-sm bg-black/5 text-stone-600 truncate max-w-[50px]">
                                  {filter?.name || 'film'}
                                </span>
                              </div>

                              <p className="text-[9px] font-mono-tactile text-stone-500 truncate mt-0.5">
                                {item.location}
                              </p>

                              {item.labelNote && (
                                <p className="text-[9px] font-serif italic text-stone-700 truncate mt-0.5">
                                  "{item.labelNote}"
                                </p>
                              )}

                              <div className="mt-1.5 flex items-center justify-between text-[9px] font-mono-tactile text-[#C93B61] group-hover:underline">
                                <span>Buka hasil</span>
                                <span>↗</span>
                              </div>
                            </div>

                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              /* Center: The Physical Collage Paper Card (Smoothly lifts and scales so it remains 100% visible when live drawer is open) */
              <div className={`flex-1 flex flex-col justify-center items-center my-auto transition-all duration-300 ease-out ${
                activeModal === 'paper-tone' || activeModal === 'filter' || activeModal === 'texture' ? '-translate-y-8 scale-[0.84]' : ''
              }`}>
              
              <div
                className="w-full max-w-[340px] perspective-container cursor-grab active:cursor-grabbing select-none"
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                onMouseDown={handleMouseDown}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleGlobalMouseUp}
              >
                {/* Physical Scrapbook Card with 3D Flip (Standard 3:4 Instagram Aspect Ratio) */}
                <div
                  ref={cardRef}
                  className="relative w-full aspect-[3/4] transition-transform duration-500 ease-out"
                  style={{
                    transform: `rotateX(${rotateX}deg) rotateY(${rotateY + (isFlipped ? 180 : 0)}deg) scale(${isDragging ? 1.02 : 1})`,
                    transformStyle: 'preserve-3d',
                  }}
                >
                  {/* ============================================================ */}
                  {/* FRONT FACE OF CARD */}
                  {/* ============================================================ */}
                  <div
                    onClick={() => {
                      playTactileSound('click', soundEnabled);
                      wobbleCard();
                    }}
                    className="absolute inset-0 w-full h-full rounded-[16px] overflow-hidden shadow-[0_18px_40px_-8px_rgba(35,28,20,0.2)] border transition-all duration-200 ease-out flex flex-col"
                    style={{
                      backfaceVisibility: 'hidden',
                      WebkitBackfaceVisibility: 'hidden',
                      backgroundColor: selectedPaperTone.bgCard,
                      borderColor: selectedPaperTone.border
                    }}
                  >
                  {/* Texture Overlay across the entire 3:4 card (seamlessly blending top & bottom) */}
                  {selectedTexture !== 'none' && (
                    <div
                      className={`absolute inset-0 pointer-events-none z-25 ${
                        selectedTexture === 'custom' ? '' : `texture-${selectedTexture}`
                      }`}
                      style={{
                        opacity: textureOpacity / 100,
                        mixBlendMode: 'multiply',
                        backgroundImage: selectedTexture === 'custom' && customTextureUrl ? `url(${customTextureUrl})` : undefined,
                        backgroundSize: selectedTexture === 'custom' ? 'cover' : undefined,
                      }}
                    />
                  )}

                  {/* CARD CONTENT: 50/50 Split Postcard for All Frames */}
                  <div className="relative w-full h-full flex flex-col">
                    {/* TOP HALF: Adaptive according to currentFrame.id (Exact 50% half) */}
                    <div 
                      className="h-1/2 flex items-center justify-center relative overflow-hidden px-3 transition-colors duration-200"
                      style={{ 
                        backgroundColor: currentFrame.id === 'stamp-square' ? '#FCE5EB' : currentFrame.id === 'souvenir-dots' ? '#EFF4EC' : selectedPaperTone.bgTop 
                      }}
                    >
                    {/* Pink Lace Background pattern for Stamp, square (Screenshot 5) */}
                    {currentFrame.id === 'stamp-square' && (
                      <svg className="absolute inset-0 w-full h-full opacity-60 pointer-events-none">
                        <defs>
                          <pattern id="pinkLacePattern" width="36" height="36" patternUnits="userSpaceOnUse">
                            <rect width="36" height="36" fill="#FCE5EB" />
                            <circle cx="18" cy="18" r="14" fill="none" stroke="#F5BECD" strokeWidth="1.2" strokeDasharray="2,2" />
                            <circle cx="18" cy="18" r="8" fill="none" stroke="#F7CAD6" strokeWidth="1" />
                            <circle cx="0" cy="0" r="12" fill="none" stroke="#F5BECD" strokeWidth="1" strokeDasharray="2,2" />
                            <circle cx="36" cy="0" r="12" fill="none" stroke="#F5BECD" strokeWidth="1" strokeDasharray="2,2" />
                            <circle cx="0" cy="36" r="12" fill="none" stroke="#F5BECD" strokeWidth="1" strokeDasharray="2,2" />
                            <circle cx="36" cy="36" r="12" fill="none" stroke="#F5BECD" strokeWidth="1" strokeDasharray="2,2" />
                            <path d="M 6 18 Q 18 6 30 18 Q 18 30 6 18 Z" fill="#FFFFFF" fillOpacity="0.45" />
                          </pattern>
                        </defs>
                        <rect width="100%" height="100%" fill="url(#pinkLacePattern)" />
                      </svg>
                    )}

                    {/* Subtle paper fold texture lines */}
                    <div className="absolute top-0 left-0 right-0 h-8 bg-gradient-to-b from-black/[0.03] to-transparent pointer-events-none" />

                    {/* 1. STAMP, LANDSCAPE (Screenshot 1, 2, 3: 170x106, 13x8 perforations) */}
                    {currentFrame.id === 'stamp-landscape' && (
                      <div className="absolute inset-0 flex items-center justify-center z-10">
                        {/* Timestamp positioned top-left cleanly */}
                        <div className="absolute top-2.5 left-3 pointer-events-none">
                          <span 
                            className="text-[11px] font-mono-tactile tracking-tight font-medium"
                            style={{ color: selectedPaperTone.text }}
                          >
                            {capturedMeta.date} · {capturedMeta.time}
                          </span>
                        </div>

                        {/* Landscape Postage Stamp - DEAD CENTER */}
                        <div className="relative">
                          <div className="relative w-[170px] h-[106px] flex items-center justify-center">
                            <svg
                              width="170"
                              height="106"
                              viewBox="0 0 170 106"
                              className="w-full h-full overflow-visible"
                              style={{
                                filter: 'drop-shadow(0 4px 12px rgba(35,25,15,0.18)) drop-shadow(0 1px 3px rgba(0,0,0,0.10))'
                              }}
                            >
                              <defs>
                                <clipPath id="stampLandscapeClip">
                                  <path d={getStampPath(170, 106, 3.2, 13, 8)} />
                                </clipPath>
                                <clipPath id="stampLandscapeInnerClip">
                                  <rect x="7" y="7" width="156" height="92" rx="1.5" />
                                </clipPath>
                              </defs>

                              {/* Pure White Perforated Paper Base with prominent gerigi */}
                              <path
                                d={getStampPath(170, 106, 3.2, 13, 8)}
                                fill="#FFFFFF"
                              />

                              {/* Photo clipped inside with margin */}
                              <g clipPath="url(#stampLandscapeClip)">
                                <g clipPath="url(#stampLandscapeInnerClip)">
                                  {(stampPhotoUrl || capturedPhotoUrl) ? (
                                    <image
                                      href={stampPhotoUrl || capturedPhotoUrl!}
                                      x="7"
                                      y="7"
                                      width="156"
                                      height="92"
                                      preserveAspectRatio="xMidYMid slice"
                                      style={{ filter: selectedFilter.css }}
                                    />
                                  ) : (
                                    <g transform="translate(7, 7)">
                                      <svg width="156" height="92" viewBox="75 18 245 155" preserveAspectRatio="xMidYMid slice">
                                        <CafeSceneSvg isCrop={true} filterCss={selectedFilter.css} />
                                      </svg>
                                    </g>
                                  )}
                                </g>
                              </g>

                              {/* Inner fine border around photo */}
                              <rect
                                x="7"
                                y="7"
                                width="156"
                                height="92"
                                rx="1.5"
                                fill="none"
                                stroke="#DDD5C7"
                                strokeWidth="0.7"
                              />

                              {/* Perforated stamp outline stroke */}
                              <path
                                d={getStampPath(170, 106, 3.2, 13, 8)}
                                fill="none"
                                stroke="#D4CBBC"
                                strokeWidth="0.9"
                              />
                            </svg>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* 1b. STAMP, PORTRAIT */}
                    {currentFrame.id === 'stamp-portrait' && (
                      <div className="absolute inset-0 flex items-center justify-center z-10">
                        {/* Timestamp top-left */}
                        <div className="absolute top-2.5 left-3 pointer-events-none">
                          <span 
                            className="text-[11px] font-mono-tactile tracking-tight font-medium"
                            style={{ color: selectedPaperTone.text }}
                          >
                            {capturedMeta.date} · {capturedMeta.time}
                          </span>
                        </div>

                        {/* Portrait Postage Stamp - DEAD CENTER */}
                        <div className="relative">
                          <div className="relative w-[114px] h-[150px] flex items-center justify-center">
                            <svg
                              width="114"
                              height="150"
                              viewBox="0 0 114 150"
                              className="w-full h-full overflow-visible"
                              style={{
                                filter: 'drop-shadow(0 4px 12px rgba(35,25,15,0.18)) drop-shadow(0 1px 3px rgba(0,0,0,0.10))'
                              }}
                            >
                              <defs>
                                <clipPath id="stampPortraitClip">
                                  <path d={getStampPath(114, 150, 3.1, 9, 12)} />
                                </clipPath>
                                <clipPath id="stampPortraitInnerClip">
                                  <rect x="7" y="7" width="100" height="136" rx="1.5" />
                                </clipPath>
                              </defs>

                              {/* Pure White Perforated Paper Base with prominent gerigi */}
                              <path
                                d={getStampPath(114, 150, 3.1, 9, 12)}
                                fill="#FFFFFF"
                              />

                               {/* Photo clipped inside with margin */}
                              <g clipPath="url(#stampPortraitClip)">
                                <g clipPath="url(#stampPortraitInnerClip)">
                                  {(stampPhotoUrl || capturedPhotoUrl) ? (
                                    <image
                                      href={stampPhotoUrl || capturedPhotoUrl!}
                                      x="7"
                                      y="7"
                                      width="100"
                                      height="136"
                                      preserveAspectRatio="xMidYMid slice"
                                      style={{ filter: selectedFilter.css }}
                                    />
                                  ) : (
                                    <g transform="translate(7, 7)">
                                      <svg width="100" height="136" viewBox="85 10 230 250" preserveAspectRatio="xMidYMid slice">
                                        <CafeSceneSvg isCrop={true} filterCss={selectedFilter.css} />
                                      </svg>
                                    </g>
                                  )}
                                </g>
                              </g>

                              {/* Inner fine border around photo */}
                              <rect
                                x="7"
                                y="7"
                                width="100"
                                height="136"
                                rx="1.5"
                                fill="none"
                                stroke="#DDD5C7"
                                strokeWidth="0.7"
                              />

                              {/* Perforated stamp outline stroke */}
                              <path
                                d={getStampPath(114, 150, 3.1, 9, 12)}
                                fill="none"
                                stroke="#D4CBBC"
                                strokeWidth="0.9"
                              />
                            </svg>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* 2. STAMP, SQUARE (Screenshot 5: 132x132, 10x10 perforations, lace) */}
                    {currentFrame.id === 'stamp-square' && (
                      <div className="absolute inset-0 flex items-center justify-center z-10">
                        {/* Square Stamp - DEAD CENTER */}
                        <div className="relative">
                          <div className="relative w-[132px] h-[132px] flex items-center justify-center">
                            <svg
                              width="132"
                              height="132"
                              viewBox="0 0 132 132"
                              className="w-full h-full overflow-visible"
                              style={{
                                filter: 'drop-shadow(0 4px 14px rgba(60,25,35,0.18))'
                              }}
                            >
                              <defs>
                                <clipPath id="stampSquareClip">
                                  <path d={getStampPath(132, 132, 3.2, 10, 10)} />
                                </clipPath>
                                <clipPath id="stampSquareInnerClip">
                                  <rect x="7" y="7" width="118" height="118" rx="1.5" />
                                </clipPath>
                              </defs>

                              <path
                                d={getStampPath(132, 132, 3.2, 10, 10)}
                                fill="#FFFFFF"
                              />

                              <g clipPath="url(#stampSquareClip)">
                                <g clipPath="url(#stampSquareInnerClip)">
                                  {(stampPhotoUrl || capturedPhotoUrl) ? (
                                    <image
                                      href={stampPhotoUrl || capturedPhotoUrl!}
                                      x="7"
                                      y="7"
                                      width="118"
                                      height="118"
                                      preserveAspectRatio="xMidYMid slice"
                                      style={{ filter: selectedFilter.css }}
                                    />
                                  ) : (
                                    <g transform="translate(7, 7)">
                                      <svg width="122" height="122" viewBox="90 20 220 220" preserveAspectRatio="xMidYMid slice">
                                        <CafeSceneSvg isCrop={true} filterCss={selectedFilter.css} />
                                      </svg>
                                    </g>
                                  )}
                                </g>
                              </g>

                              <rect
                                x="7"
                                y="7"
                                width="118"
                                height="118"
                                rx="1.5"
                                fill="none"
                                stroke="#E8BCC8"
                                strokeWidth="0.7"
                              />

                              <path
                                d={getStampPath(132, 132, 3.2, 10, 10)}
                                fill="none"
                                stroke="#E2AEBC"
                                strokeWidth="0.9"
                              />
                            </svg>
                          </div>
                        </div>

                        {/* Timestamp Centered below Square Stamp */}
                        <div className="absolute bottom-2.5 left-0 right-0 text-center pointer-events-none">
                          <span className="text-[11px] font-mono-tactile text-[#5A454C] font-medium tracking-tight">
                            {capturedMeta.date} · {capturedMeta.time}
                          </span>
                        </div>
                      </div>
                    )}

                    {/* 3. STAR CLUSTER (Top Half) */}
                    {currentFrame.id === 'star-cluster' && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <svg
                          viewBox="0 0 340 226.66"
                          className="w-full h-full overflow-visible"
                          preserveAspectRatio="xMidYMid meet"
                        >
                          <defs>
                            <clipPath id="starClusterTopClip">
                              {STAR_CLUSTER_POINTS.map((pt, i) => (
                                <path key={i} d={getStarPath(pt.cx, pt.cy, pt.r)} />
                              ))}
                            </clipPath>
                          </defs>

                          {/* Photo revealed inside star cutouts */}
                          <g clipPath="url(#starClusterTopClip)">
                            {(stampPhotoUrl || capturedPhotoUrl) ? (
                              <image
                                href={stampPhotoUrl || capturedPhotoUrl!}
                                x="0"
                                y="0"
                                width="340"
                                height="226.66"
                                preserveAspectRatio="xMidYMid slice"
                                style={{ filter: selectedFilter.css }}
                              />
                            ) : (
                              <svg width="340" height="226.66" viewBox="70 20 250 160" preserveAspectRatio="xMidYMid slice">
                                <CafeSceneSvg isCrop={true} filterCss={selectedFilter.css} />
                              </svg>
                            )}
                          </g>

                          {/* Star outlines */}
                          {STAR_CLUSTER_POINTS.map((pt, i) => (
                            <path
                              key={i}
                              d={getStarPath(pt.cx, pt.cy, pt.r)}
                              fill="none"
                              stroke="rgba(255,255,255,0.92)"
                              strokeWidth="0.85"
                            />
                          ))}
                        </svg>

                        {/* Timestamp for star cluster */}
                        <div className="absolute bottom-2.5 left-3 pointer-events-none">
                          <span className="text-[11px] font-mono-tactile font-bold text-[#F7A6BC]">
                            ★ {capturedMeta.date} · {capturedMeta.time}
                          </span>
                        </div>
                      </div>
                    )}

                    {/* 4. WISH CONSTELLATION (Top Half) */}
                    {currentFrame.id === 'wish-stars' && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <svg
                          viewBox="0 0 340 226.66"
                          className="w-full h-full overflow-visible"
                          preserveAspectRatio="xMidYMid meet"
                        >
                          <defs>
                            <clipPath id="wishStarsTopClip">
                              {WISH_STARS.map((pt, i) => (
                                <path key={i} d={getStarPath(pt.cx, pt.cy, pt.r)} />
                              ))}
                            </clipPath>
                          </defs>

                          {/* Photo revealed inside star cutouts */}
                          <g clipPath="url(#wishStarsTopClip)">
                            {(stampPhotoUrl || capturedPhotoUrl) ? (
                              <image
                                href={stampPhotoUrl || capturedPhotoUrl!}
                                x="0"
                                y="0"
                                width="340"
                                height="226.66"
                                preserveAspectRatio="xMidYMid slice"
                                style={{ filter: selectedFilter.css }}
                              />
                            ) : (
                              <svg width="340" height="226.66" viewBox="70 20 250 160" preserveAspectRatio="xMidYMid slice">
                                <CafeSceneSvg isCrop={true} filterCss={selectedFilter.css} />
                              </svg>
                            )}
                          </g>

                          {/* Star outlines and typewriter 'wish' labels */}
                          {WISH_STARS.map((pt, i) => (
                            <React.Fragment key={i}>
                              <path
                                d={getStarPath(pt.cx, pt.cy, pt.r)}
                                fill="none"
                                stroke="rgba(0,0,0,0.28)"
                                strokeWidth="0.85"
                              />
                              {pt.text && (
                                <text
                                  x={pt.cx + pt.r + 3}
                                  y={pt.cy + 3}
                                  className="text-[9.5px] font-mono fill-[#4A3E31] font-medium select-none"
                                >
                                  {pt.text}
                                </text>
                              )}
                            </React.Fragment>
                          ))}
                        </svg>

                        {/* Timestamp for wish stars */}
                        <div className="absolute bottom-2.5 left-3 pointer-events-none">
                          <span className="text-[11px] font-mono-tactile font-bold text-[#E0BC52]">
                            {capturedMeta.date} · {capturedMeta.time}
                          </span>
                        </div>
                      </div>
                    )}

                    {/* 5. SOUVENIR POLKA DOTS (Top Half) */}
                    {currentFrame.id === 'souvenir-dots' && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <svg
                          viewBox="0 0 340 226.66"
                          className="w-full h-full overflow-visible"
                          preserveAspectRatio="xMidYMid meet"
                        >
                          <defs>
                            <clipPath id="souvenirDotsTopClip">
                              {SOUVENIR_DOTS.map((dot, i) => (
                                <circle key={i} cx={dot.cx} cy={dot.cy} r={dot.r} />
                              ))}
                            </clipPath>
                          </defs>

                          {/* Photo revealed inside polka dot cutouts */}
                          <g clipPath="url(#souvenirDotsTopClip)">
                            {(stampPhotoUrl || capturedPhotoUrl) ? (
                              <image
                                href={stampPhotoUrl || capturedPhotoUrl!}
                                x="0"
                                y="0"
                                width="340"
                                height="226.66"
                                preserveAspectRatio="xMidYMid slice"
                                style={{ filter: selectedFilter.css }}
                              />
                            ) : (
                              <svg width="340" height="226.66" viewBox="70 20 250 160" preserveAspectRatio="xMidYMid slice">
                                <CafeSceneSvg isCrop={true} filterCss={selectedFilter.css} />
                              </svg>
                            )}
                          </g>

                          {/* Circle outlines */}
                          {SOUVENIR_DOTS.map((dot, i) => (
                            <circle
                              key={i}
                              cx={dot.cx}
                              cy={dot.cy}
                              r={dot.r}
                              fill="none"
                              stroke="rgba(255,255,255,0.85)"
                              strokeWidth="1"
                            />
                          ))}
                        </svg>

                        {/* Center Poetic Quote for Souvenir polka dots */}
                        <div className="absolute inset-0 flex items-center justify-center px-10 text-center pointer-events-none">
                          <p className="font-mono text-[10px] leading-relaxed text-[#3B4D5B] font-medium max-w-[190px] select-none tracking-tight">
                            some feelings are only visiting, but they always leave a souvenir
                          </p>
                        </div>

                        {/* Timestamp for souvenir dots */}
                        <div className="absolute bottom-2.5 left-3 pointer-events-none">
                          <span className="text-[11px] font-mono-tactile font-bold text-[#E0BC52]">
                            {capturedMeta.date} · {capturedMeta.time}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* ------------------------------------------- */}
                  {/* BOTTOM HALF: Main Photo + Frame Overlays (Exact 50% half) */}
                  {/* ------------------------------------------- */}
                  <div className="h-1/2 relative w-full overflow-hidden bg-[#EAE4D7]">
                    {/* Main Photo: Full Frame for ALL frames (exactly like other stamps) */}
                    {capturedPhotoUrl ? (
                      <img
                        src={capturedPhotoUrl}
                        alt="Scrapbook moment"
                        className="w-full h-full object-cover transition-[filter] duration-200"
                        style={{ filter: selectedFilter.css }}
                      />
                    ) : (
                      /* Outdoor Cafe Scene (Default Backdrop) */
                      <CafeSceneSvg isCrop={false} filterCss={selectedFilter.css} />
                    )}

                    {/* OVERLAY A: Stamp landscape center white stamp (Screenshot 1, 2) */}
                    {currentFrame.id === 'stamp-landscape' && (
                      <div
                        className="absolute inset-0 flex items-center justify-center cursor-pointer z-20"
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveModal('edit-label');
                        }}
                        title="Ketuk untuk menulis catatan di label prangko"
                      >
                        <div
                          className="relative w-[170px] h-[106px] flex items-center justify-center"
                          style={{
                            filter: 'drop-shadow(0 6px 18px rgba(35,25,15,0.24))'
                          }}
                        >
                          <svg width="170" height="106" viewBox="0 0 170 106" className="w-full h-full overflow-visible">
                            <path
                              d={getStampPath(170, 106, 3.2, 13, 8)}
                              fill="#FAF8F4"
                              stroke="#DCD4C6"
                              strokeWidth="0.9"
                            />
                          </svg>

                          {/* Note text if present */}
                          <div className="absolute inset-0 flex items-center justify-center p-3 text-center z-20">
                            {labelNote && (
                              <p className="font-mono-tactile text-[11px] leading-tight text-[#3A332C] max-w-[136px] break-words font-medium">
                                {labelNote}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* OVERLAY: Stamp portrait center white stamp */}
                    {currentFrame.id === 'stamp-portrait' && (
                      <div
                        className="absolute inset-0 flex items-center justify-center cursor-pointer z-20"
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveModal('edit-label');
                        }}
                        title="Ketuk untuk menulis catatan di label prangko"
                      >
                        <div
                          className="relative w-[114px] h-[150px] flex items-center justify-center"
                          style={{
                            filter: 'drop-shadow(0 6px 18px rgba(35,25,15,0.24))'
                          }}
                        >
                          <svg width="114" height="150" viewBox="0 0 114 150" className="w-full h-full overflow-visible">
                            <path
                              d={getStampPath(114, 150, 3.1, 9, 12)}
                              fill="#FAF8F4"
                              stroke="#DCD4C6"
                              strokeWidth="0.9"
                            />
                          </svg>

                          {/* Note text if present */}
                          <div className="absolute inset-0 flex items-center justify-center p-3 text-center z-20">
                            {labelNote && (
                              <p className="font-mono-tactile text-[11px] leading-tight text-[#3A332C] max-w-[94px] break-words font-medium">
                                {labelNote}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* OVERLAY B: Stamp square center pink stamp (Screenshot 5) */}
                    {currentFrame.id === 'stamp-square' && (
                      <div
                        className="absolute inset-0 flex items-center justify-center cursor-pointer z-20"
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveModal('edit-label');
                        }}
                        title="Ketuk untuk menulis catatan di label prangko"
                      >
                        <div
                          className="relative w-[132px] h-[132px] flex items-center justify-center"
                          style={{
                            filter: 'drop-shadow(0 6px 18px rgba(60,25,35,0.24))'
                          }}
                        >
                          <svg width="132" height="132" viewBox="0 0 132 132" className="w-full h-full overflow-visible">
                            <path
                              d={getStampPath(132, 132, 3.2, 10, 10)}
                              fill="#FCE2EB"
                              stroke="#EAB4C2"
                              strokeWidth="0.9"
                            />
                          </svg>

                          <div className="absolute top-1/2 left-2 right-2 h-[1px] bg-[#6B2E3E]/18 pointer-events-none" />
                          <div className="absolute top-[calc(50%+1px)] left-2 right-2 h-[1px] bg-white/75 pointer-events-none" />

                          <div className="absolute inset-0 flex items-center justify-center p-3 text-center z-20">
                            {labelNote && (
                              <p className="font-mono-tactile text-[11px] leading-tight text-[#4A2632] max-w-[110px] break-words font-medium">
                                {labelNote}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* OVERLAY C1: Star Cluster bottom cuts matching top shape */}
                    {currentFrame.id === 'star-cluster' && (
                      <div 
                        className="absolute inset-0 pointer-events-none"
                        style={{ filter: 'drop-shadow(0 2px 6px rgba(25, 20, 15, 0.22))' }}
                      >
                        <svg viewBox="0 0 340 226.66" className="w-full h-full overflow-visible">
                          {STAR_CLUSTER_POINTS.map((pt, i) => (
                            <path
                              key={i}
                              d={getStarPath(pt.cx, pt.cy, pt.r)}
                              fill={selectedPaperTone.bgCard || "#FAF8F4"}
                              stroke="rgba(255, 255, 255, 0.9)"
                              strokeWidth="0.85"
                            />
                          ))}
                        </svg>
                      </div>
                    )}

                    {/* OVERLAY C2: Wish Constellation bottom cuts matching top shape */}
                    {currentFrame.id === 'wish-stars' && (
                      <div 
                        className="absolute inset-0 pointer-events-none"
                        style={{ filter: 'drop-shadow(0 2px 6px rgba(25, 20, 15, 0.22))' }}
                      >
                        <svg viewBox="0 0 340 226.66" className="w-full h-full overflow-visible">
                          {WISH_STARS.map((pt, i) => (
                            <React.Fragment key={i}>
                              <path
                                d={getStarPath(pt.cx, pt.cy, pt.r)}
                                fill={selectedPaperTone.bgCard || "#FAF8F4"}
                                stroke="rgba(0, 0, 0, 0.28)"
                                strokeWidth="0.85"
                              />
                              {pt.text && (
                                <text
                                  x={pt.cx + pt.r + 3}
                                  y={pt.cy + 3}
                                  className="text-[9.5px] font-mono fill-[#4A3E31] font-medium select-none"
                                >
                                  {pt.text}
                                </text>
                              )}
                            </React.Fragment>
                          ))}
                        </svg>
                      </div>
                    )}

                    {/* OVERLAY C3: Souvenir Polka Dots bottom cuts matching top shape */}
                    {currentFrame.id === 'souvenir-dots' && (
                      <div 
                        className="absolute inset-0 pointer-events-none"
                        style={{ filter: 'drop-shadow(0 2px 6px rgba(25, 20, 15, 0.22))' }}
                      >
                        <svg viewBox="0 0 340 226.66" className="w-full h-full overflow-visible">
                          {SOUVENIR_DOTS.map((dot, i) => (
                            <circle
                              key={i}
                              cx={dot.cx}
                              cy={dot.cy}
                              r={dot.r}
                              fill="#EFF4EC"
                              stroke="rgba(255, 255, 255, 0.85)"
                              strokeWidth="1"
                            />
                          ))}
                        </svg>
                        {/* Center poetic quote */}
                        <div className="absolute inset-0 flex items-center justify-center px-10 text-center pointer-events-none">
                          <p className="font-mono text-[10px] leading-relaxed text-[#3B4D5B] font-medium max-w-[190px] select-none tracking-tight">
                            some feelings are only visiting, but they always leave a souvenir
                          </p>
                        </div>
                      </div>
                    )}

                    {/* OVERLAY D: Note badge for star-cluster, wish-stars, souvenir-dots */}
                    {labelNote && (currentFrame.id === 'star-cluster' || currentFrame.id === 'wish-stars' || currentFrame.id === 'souvenir-dots') && (
                      <div
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveModal('edit-label');
                        }}
                        className="absolute bottom-10 left-3.5 z-20 cursor-pointer pointer-events-auto bg-[#FAF8F4]/90 backdrop-blur-xs px-2.5 py-1 rounded-sm border border-[#D8D0C2] shadow-sm max-w-[200px]"
                        title="Ketuk untuk mengubah catatan"
                      >
                        <p className="font-mono-tactile text-[10px] leading-tight text-[#3A332C] truncate font-medium">
                          {labelNote}
                        </p>
                      </div>
                    )}

                    {/* Watermark in bottom right corner (Matching *stampo in reference) */}
                    {showWatermark && (
                      <div 
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveModal('edit-watermark');
                        }}
                        className="absolute bottom-2.5 right-3 z-20 pointer-events-auto cursor-pointer group flex items-center gap-1.5 transition active:scale-95"
                        title="Klik untuk ubah watermark teks"
                      >
                        <span className="text-[12px] font-sans font-bold text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.85)] tracking-wide">
                          {watermarkText}
                        </span>
                        <Edit3 size={9} className="text-white/80 group-hover:text-white transition-opacity drop-shadow-xs" />
                      </div>
                    )}

                  </div>
                </div>
              </div>

                  {/* ============================================================ */}
                  {/* BACK FACE OF CARD: Application Title Aesthetic Back */}
                  {/* ============================================================ */}
                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFlip();
                    }}
                    className="absolute inset-0 w-full h-full rounded-[16px] overflow-hidden shadow-[0_18px_40px_-8px_rgba(35,28,20,0.2)] border flex flex-col items-center justify-center p-6 select-none cursor-pointer"
                    style={{
                      backfaceVisibility: 'hidden',
                      WebkitBackfaceVisibility: 'hidden',
                      transform: 'rotateY(180deg)',
                      backgroundColor: selectedPaperTone.bgCard,
                      borderColor: selectedPaperTone.border
                    }}
                  >
                    {/* Paper texture overlay on back */}
                    {selectedTexture !== 'none' && (
                      <div
                        className={`absolute inset-0 pointer-events-none z-10 ${
                          selectedTexture === 'custom' ? '' : `texture-${selectedTexture}`
                        }`}
                        style={{
                          opacity: textureOpacity / 100,
                          mixBlendMode: 'multiply',
                          backgroundImage: selectedTexture === 'custom' && customTextureUrl ? `url(${customTextureUrl})` : undefined,
                          backgroundSize: selectedTexture === 'custom' ? 'cover' : undefined,
                        }}
                      />
                    )}

                    {/* Subtle aesthetic postcard inner border */}
                    <div className="absolute inset-3.5 rounded-[12px] border border-[#3A332C]/10 pointer-events-none" />

                    {/* Vintage Corner Details */}
                    <div className="absolute top-5 left-5 text-[9px] font-mono-tactile text-[#9E9486] tracking-widest pointer-events-none">
                      NO. 001
                    </div>
                    <div className="absolute top-5 right-5 text-[9px] font-mono-tactile text-[#9E9486] tracking-widest pointer-events-none">
                      POSTCARD
                    </div>

                    {/* Center: Application Title */}
                    <div className="relative z-20 flex flex-col items-center justify-center text-center px-4">
                      {/* Cute Pixel Eyes Mascot */}
                      <div className="flex items-center gap-1.5 mb-2.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#E57373] shadow-2xs"></span>
                        <span className="w-2.5 h-2.5 rounded-full bg-[#81C784] shadow-2xs"></span>
                      </div>

                      {/* Title: stampo */}
                      <h1 className="text-[48px] font-bold tracking-tight text-[#3A332C] font-mono-tactile leading-none select-none">
                        <span className="text-[#D9775A]">s</span>
                        <span className="text-[#C29B38]">t</span>
                        <span className="text-[#E5A65E]">a</span>
                        <span className="text-[#4E8296]">m</span>
                        <span className="text-[#A26D97]">p</span>
                        <span className="text-[#D9775A]">o</span>
                      </h1>

                      {/* Small tactile subtitle */}
                      <p className="mt-2 text-[10.5px] font-mono-tactile tracking-[0.25em] uppercase text-[#7D7366] font-medium">
                        keepsake studio
                      </p>
                    </div>

                    {/* Bottom subtle flip hint */}
                    <div className="absolute bottom-5 flex items-center gap-1.5 text-[10px] font-mono-tactile text-[#9E9486] hover:text-[#524B43] transition">
                      <RotateCcw size={11} />
                      <span>klik untuk membalik kartu</span>
                    </div>
                  </div>

                </div>
              </div>

            </div>
          )}

            {/* Bottom Controls: Ergonomic 4-Button Action Grid (Exact Match to Reference Screenshot) */}
            <div className="space-y-3 pt-1">
              
              {/* Row of 4 Action Buttons: [ share ] [ save ] [ change ] [ flip ] */}
              <div className="grid grid-cols-4 gap-2">
                
                {/* 1. share (Pink Card #F6B7C8) */}
                <button
                  onClick={() => {
                    playTactileSound('click', soundEnabled);
                    setActiveModal('share');
                  }}
                  className="h-[68px] rounded-[22px] bg-[#F6B7C8] text-[#3D2E24] hover:bg-[#F2A7BA] active:scale-95 transition flex flex-col items-center justify-center gap-1.5 shadow-xs cursor-pointer"
                  title="Bagikan Momen"
                >
                  <Share2 size={19} strokeWidth={2.2} />
                  <span className="text-[11px] font-medium font-sans">share</span>
                </button>

                {/* 2. save (Off-white Card #FAF7F2) */}
                <button
                  onClick={() => {
                    playTactileSound('click', soundEnabled);
                    setActiveModal('save-choice');
                  }}
                  className="h-[68px] rounded-[22px] bg-[#FAF7F2] border border-[#E8E2D6] text-[#3D2E24] hover:bg-[#F2ECE3] active:scale-95 transition flex flex-col items-center justify-center gap-1.5 shadow-xs cursor-pointer"
                  title="Pilih Simpan ke Album atau Unduh Gambar"
                >
                  <Download size={19} strokeWidth={2.2} />
                  <span className="text-[11px] font-medium font-sans">save</span>
                </button>

                {/* 3. change (Off-white Card #FAF7F2 - Matching screenshot layers icon) */}
                <button
                  onClick={() => {
                    playTactileSound('stamp', soundEnabled);
                    setActiveModal('frame');
                  }}
                  className="h-[68px] rounded-[22px] bg-[#FAF7F2] border border-[#E8E2D6] text-[#3D2E24] hover:bg-[#F2ECE3] active:scale-95 transition flex flex-col items-center justify-center gap-1.5 shadow-xs cursor-pointer"
                  title="Pilih Bentuk Stamp, Kertas, atau Filter"
                >
                  <Layers size={19} strokeWidth={2.2} />
                  <span className="text-[11px] font-medium font-sans">change</span>
                </button>

                {/* 4. flip (Replaced animation: Flips card to show application title on back) */}
                <button
                  onClick={() => {
                    toggleFlip();
                  }}
                  className={`h-[68px] rounded-[22px] border text-[#3D2E24] active:scale-95 transition flex flex-col items-center justify-center gap-1.5 shadow-xs cursor-pointer ${
                    isFlipped 
                      ? 'bg-[#F2ECE3] border-[#C93B61] text-[#C93B61]' 
                      : 'bg-[#FAF7F2] border-[#E8E2D6] hover:bg-[#F2ECE3]'
                  }`}
                  title="Balik Kartu (Lihat Bagian Belakang Judul Aplikasi)"
                >
                  <RotateCcw size={19} strokeWidth={2.2} className={isFlipped ? 'rotate-180 transition-transform duration-300' : 'transition-transform duration-300'} />
                  <span className="text-[11px] font-medium font-sans">flip</span>
                </button>

              </div>

              {/* Sub-row: Camera Mode Button (Left) + Feedback Button (Right) */}
              <div className="flex items-center justify-between px-1 pt-0.5">
                <button
                  onClick={() => {
                    playTactileSound('click', soundEnabled);
                    setIsFlipped(false);
                    setScreen('camera');
                  }}
                  className="h-9 px-3.5 rounded-full bg-[#FAF7F2] border border-[#E8E2D6] text-[#3D2E24] hover:bg-[#F2ECE3] active:scale-95 transition flex items-center gap-2 shadow-xs cursor-pointer font-mono-tactile text-xs font-semibold"
                  title="Buka Kamera untuk Mengambil Foto Baru"
                >
                  <Camera size={15} strokeWidth={2.2} className="text-[#C93B61]" />
                  <span>ambil foto baru</span>
                </button>

                <button
                  onClick={() => setActiveModal('feedback')}
                  className="h-9 px-4 rounded-full bg-[#F6B7C8] text-[#3D2E24] text-xs font-semibold hover:bg-[#F2A7BA] active:scale-95 transition cursor-pointer shadow-xs flex items-center"
                >
                  feedback
                </button>
              </div>

            </div>

          </div>
        )}

        {/* ----------------------------------------------------------------- */}
        {/* MODALS & SHEETS */}
        {/* ----------------------------------------------------------------- */}

        {/* Toast Notification */}
        {toastMessage && (
          <div className="absolute top-16 left-6 right-6 z-50 animate-in fade-in slide-in-from-top-3 duration-200">
            <div className="bg-[#2B2520] text-[#FAF8F5] px-4 py-2.5 rounded-2xl shadow-xl flex items-center justify-between text-xs">
              <span className="font-mono-tactile">{toastMessage}</span>
              <Sparkles size={14} className="text-[#FCD2DC]" />
            </div>
          </div>
        )}

        {/* Label Edit Modal */}
        {activeModal === 'edit-label' && (
          <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] z-50 flex items-end animate-in fade-in duration-150">
            <div className="w-full bg-[#FAF8F4] rounded-t-[28px] p-5 shadow-2xl border-t border-[#EAE4D8]">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-stone-900 font-mono-tactile">Tulis di Label Prangko</h3>
                <button
                  onClick={() => setActiveModal('none')}
                  className="w-7 h-7 rounded-full bg-stone-200 flex items-center justify-center text-stone-600"
                >
                  <X size={14} />
                </button>
              </div>

              <input
                type="text"
                value={labelNote}
                onChange={(e) => setLabelNote(e.target.value)}
                placeholder="misal: summer in paris · 14:28"
                maxLength={45}
                className="w-full p-3 rounded-xl bg-white border border-[#E2DBD0] text-xs font-mono-tactile focus:outline-none focus:border-[#C93B61] mb-3"
              />

              <div className="flex gap-2">
                <button
                  onClick={() => setLabelNote('')}
                  className="px-3 py-2 rounded-xl bg-stone-200 text-stone-700 text-xs font-mono"
                >
                  Kosongkan
                </button>
                <button
                  onClick={() => setActiveModal('none')}
                  className="flex-1 py-2 rounded-xl bg-[#C93B61] text-white text-xs font-semibold"
                >
                  Simpan ke Label
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Share Modal */}
        {activeModal === 'share' && (
          <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] z-50 flex items-end animate-in fade-in duration-150">
            <div className="w-full bg-[#FAF8F4] rounded-t-[28px] p-5 shadow-2xl border-t border-[#EAE4D8]">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-stone-900">Bagikan Momen</h3>
                <button
                  onClick={() => setActiveModal('none')}
                  className="w-7 h-7 rounded-full bg-stone-200 flex items-center justify-center text-stone-600"
                >
                  <X size={14} />
                </button>
              </div>

              <div className="space-y-2 mb-4">
                <button
                  onClick={() => {
                    setCopiedLink(true);
                    setTimeout(() => setCopiedLink(false), 2000);
                  }}
                  className="w-full flex items-center justify-between p-3 rounded-xl bg-white border border-[#EAE4D8] text-xs font-medium text-stone-800"
                >
                  <span>Salin Tautan Postcard</span>
                  {copiedLink ? (
                    <span className="text-emerald-600 font-mono text-[11px]">Tersalin!</span>
                  ) : (
                    <span className="text-stone-400 font-mono text-[11px]">stampo.app/m/402</span>
                  )}
                </button>

                <button
                  onClick={() => {
                    setActiveModal('none');
                    handleSaveToDevice();
                  }}
                  className="w-full flex items-center justify-between p-3 rounded-xl bg-white border border-[#EAE4D8] text-xs font-medium text-stone-800"
                >
                  <span className="text-[#C93B61]">Unduh Gambar Format PNG</span>
                  <span className="text-[10px] bg-[#FCD2DC] text-[#C93B61] px-2 py-0.5 rounded-full font-mono">
                    300 DPI
                  </span>
                </button>
              </div>

              <button
                onClick={() => setActiveModal('none')}
                className="w-full py-2.5 rounded-xl bg-stone-900 text-white text-xs font-medium"
              >
                Tutup
              </button>
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* LIVE CUSTOMIZER DRAWER (STAMP SHAPES, PAPER TONES, FILTER & TEXTURE REAL-TIME PREVIEW) */}
        {/* Card remains 100% visible and updates live with zero dark overlay */}
        {/* ================================================================= */}
        {(activeModal === 'frame' || activeModal === 'paper-tone' || activeModal === 'filter' || activeModal === 'texture') && (
          <div className="absolute inset-0 z-40 flex flex-col justify-end pointer-events-none animate-in fade-in duration-200">
            {/* Transparent dismiss zone at top so card is completely visible & tap-to-close */}
            <div
              onClick={() => setActiveModal('none')}
              className="flex-1 pointer-events-auto cursor-pointer"
              title="Ketuk area kartu untuk selesai"
            />

            {/* Bottom Live Drawer (Compact 46vh height, thumb-friendly) */}
            <div className="w-full bg-[#FAF8F4]/98 backdrop-blur-md rounded-t-[26px] p-4 shadow-[0_-12px_36px_rgba(25,18,12,0.22)] border-t border-[#E5DFD4] pointer-events-auto max-h-[48vh] flex flex-col z-50 animate-in slide-in-from-bottom-6 duration-200">
              
              {/* Header: Segmented Tabs [ 🏷️ Bentuk ] [ 📜 Kertas ] [ ✦ Filter ] [ 🎨 Tekstur ] + Selesai Button */}
              <div className="flex items-center justify-between gap-1.5 mb-3 pb-2 border-b border-[#EDE6DB]">
                <div className="flex items-center gap-1 p-1 bg-[#EAE4D7] rounded-xl overflow-x-auto no-scrollbar">
                  {/* Tab 0: Bentuk Stamp */}
                  <button
                    type="button"
                    onClick={() => {
                      playTactileSound('stamp', soundEnabled);
                      setActiveModal('frame');
                    }}
                    className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-mono-tactile transition cursor-pointer shrink-0 ${
                      activeModal === 'frame'
                        ? 'bg-[#2E2822] text-white font-medium shadow-xs'
                        : 'text-stone-700 hover:text-stone-900'
                    }`}
                  >
                    <Stamp size={12} className={activeModal === 'frame' ? 'text-[#FCD2DC]' : 'text-stone-500'} />
                    <span>Bentuk ({FRAME_MODES.length})</span>
                  </button>

                  {/* Tab 1: Kertas Scrapbook */}
                  <button
                    type="button"
                    onClick={() => {
                      playTactileSound('rustle', soundEnabled);
                      setActiveModal('paper-tone');
                    }}
                    className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-mono-tactile transition cursor-pointer shrink-0 ${
                      activeModal === 'paper-tone'
                        ? 'bg-[#2E2822] text-white font-medium shadow-xs'
                        : 'text-stone-700 hover:text-stone-900'
                    }`}
                  >
                    <Palette size={12} className={activeModal === 'paper-tone' ? 'text-[#FCD2DC]' : 'text-stone-500'} />
                    <span>Kertas ({PAPER_TONES.length})</span>
                  </button>

                  {/* Tab 2: Filter */}
                  <button
                    type="button"
                    onClick={() => {
                      playTactileSound('click', soundEnabled);
                      setActiveModal('filter');
                    }}
                    className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-mono-tactile transition cursor-pointer shrink-0 ${
                      activeModal === 'filter'
                        ? 'bg-[#2E2822] text-white font-medium shadow-xs'
                        : 'text-stone-700 hover:text-stone-900'
                    }`}
                  >
                    <Wand2 size={12} className={activeModal === 'filter' ? 'text-[#FCD2DC]' : 'text-stone-500'} />
                    <span>Filter ({PHOTO_FILTERS.length})</span>
                  </button>

                  {/* Tab 3: Tekstur */}
                  <button
                    type="button"
                    onClick={() => {
                      playTactileSound('rustle', soundEnabled);
                      setActiveModal('texture');
                    }}
                    className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-mono-tactile transition cursor-pointer shrink-0 ${
                      activeModal === 'texture'
                        ? 'bg-[#2E2822] text-white font-medium shadow-xs'
                        : 'text-stone-700 hover:text-stone-900'
                    }`}
                  >
                    <Layers size={12} className={activeModal === 'texture' ? 'text-[#FCD2DC]' : 'text-stone-500'} />
                    <span>Tekstur</span>
                  </button>

                  {/* Tab 4: Album Binder */}
                  <button
                    type="button"
                    onClick={() => {
                      playTactileSound('rustle', soundEnabled);
                      setActiveModal('album');
                    }}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-mono-tactile transition cursor-pointer shrink-0 text-stone-700 hover:text-stone-900"
                  >
                    <BookOpen size={12} className="text-[#C93B61]" />
                    <span>Album ({journalEntries.length})</span>
                  </button>
                </div>

                {/* Selesai / Close Button */}
                <button
                  type="button"
                  onClick={() => {
                    setActiveModal('none');
                    showToast('Pengaturan diterapkan ✨');
                  }}
                  className="px-3 py-1.5 rounded-xl bg-[#C93B61] text-white text-xs font-semibold hover:bg-[#A82B4D] active:scale-95 transition cursor-pointer shadow-xs flex items-center gap-1 shrink-0"
                >
                  <Check size={13} />
                  <span>Selesai</span>
                </button>
              </div>

              {/* TAB CONTENT 0: BENTUK STAMP / FRAME MODES */}
              {activeModal === 'frame' && (
                <div className="flex-1 flex flex-col min-h-0 overflow-y-auto no-scrollbar pr-0.5 pb-2">
                  <div className="flex items-center justify-between mb-2 px-0.5">
                    <span className="text-[11px] font-mono-tactile text-[#78716C]">
                      Bentuk: <strong className="text-stone-900 font-sans">{currentFrame.name}</strong>
                    </span>
                    <span className="text-[10px] font-mono-tactile text-[#C93B61] font-medium flex items-center gap-0.5">
                      <span>✦</span> pratinjau langsung di kartu ↑
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    {FRAME_MODES.map((mode, idx) => {
                      const isSelected = frameModeIndex === idx;
                      return (
                        <button
                          key={mode.id}
                          type="button"
                          onClick={() => {
                            setFrameModeIndex(idx);
                            setSelectedPaperToneId(mode.paperToneId);
                            setCapturedMeta((prev) => ({
                              ...prev,
                              date: mode.defaultDate,
                              time: mode.defaultTime
                            }));
                            setWatermarkText(mode.watermark || '✻stampo');
                            playTactileSound('stamp', soundEnabled);
                            showToast(`Bentuk stamp: ${mode.name} ✨`);
                            wobbleCard();
                          }}
                          className={`p-3 rounded-2xl border text-left transition flex flex-col justify-between cursor-pointer active:scale-98 min-h-[92px] ${
                            isSelected
                              ? 'border-[#C93B61] bg-[#FCE8EE]/80 shadow-xs ring-1 ring-[#C93B61]'
                              : 'border-stone-200/90 bg-white hover:bg-stone-50'
                          }`}
                        >
                          <div className="flex items-start justify-between w-full mb-1">
                            <span className="text-xl">{mode.icon}</span>
                            {isSelected ? (
                              <span className="w-5 h-5 rounded-full bg-[#C93B61] text-white flex items-center justify-center">
                                <Check size={12} strokeWidth={2.5} />
                              </span>
                            ) : (
                              <span className="text-[9px] font-mono-tactile px-1.5 py-0.5 rounded-sm bg-stone-100 text-stone-500">
                                #{idx + 1}
                              </span>
                            )}
                          </div>
                          
                          <div>
                            <span className="text-xs font-semibold text-stone-900 block leading-tight">
                              {mode.name}
                            </span>
                            <span className="text-[9.5px] text-stone-500 font-mono-tactile line-clamp-1 mt-0.5">
                              {mode.sub}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* TAB CONTENT 1: 5 ARTISANAL PAPER STOCKS */}
              {activeModal === 'paper-tone' && (
                <div className="flex-1 flex flex-col min-h-0 overflow-y-auto no-scrollbar pr-0.5 pb-2">
                  <div className="flex items-center justify-between mb-2 px-0.5">
                    <span className="text-[11px] font-mono-tactile text-[#78716C]">
                      Kertas: <strong className="text-stone-900 font-sans">{selectedPaperTone.name}</strong>
                    </span>
                    <span className="text-[10px] font-mono-tactile text-[#C93B61] font-medium flex items-center gap-0.5">
                      <span>✦</span> serat warna kertas asli ↑
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    {PAPER_TONES.map((tone) => {
                      const isSelected = selectedPaperToneId === tone.id;
                      return (
                        <button
                          key={tone.id}
                          type="button"
                          onClick={() => {
                            setSelectedPaperToneId(tone.id);
                            playTactileSound('rustle', soundEnabled);
                            showToast(`Kertas: ${tone.name}`);
                          }}
                          className={`w-full p-2.5 rounded-xl border text-left transition flex items-center justify-between cursor-pointer active:scale-98 ${
                            isSelected
                              ? 'border-[#C93B61] bg-[#FCE8EE]/80 shadow-xs ring-1 ring-[#C93B61]'
                              : 'border-stone-200/90 bg-white hover:bg-stone-50'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className="w-10 h-10 rounded-xl border shadow-2xs flex flex-col justify-between p-1 shrink-0"
                              style={{ backgroundColor: tone.bgCard, borderColor: tone.border }}
                            >
                              <div className="w-full h-3 rounded-xs" style={{ backgroundColor: tone.bgTop }} />
                              <div className="w-4 h-1.5 rounded-xs" style={{ backgroundColor: tone.text }} />
                            </div>
                            <div>
                              <div className="flex items-center gap-1.5">
                                <span className="text-xs font-semibold text-stone-900">{tone.name}</span>
                                <span className="text-[9px] font-mono-tactile px-1.5 py-0.5 rounded-sm bg-stone-100 text-stone-600">
                                  {tone.bgCard}
                                </span>
                              </div>
                              <span className="text-[10px] text-stone-500 font-mono-tactile block mt-0.5">{tone.sub}</span>
                            </div>
                          </div>
                          {isSelected && <Check size={14} className="text-[#C93B61] mr-1" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* TAB CONTENT 4: 20 PHOTO FILTERS */}
              {activeModal === 'filter' && (
                <div className="flex-1 flex flex-col min-h-0">
                  <div className="flex items-center justify-between mb-2 px-0.5">
                    <span className="text-[11px] font-mono-tactile text-[#78716C]">
                      Aktif: <strong className="text-stone-900 font-sans">{selectedFilter.name}</strong> ({selectedFilter.category})
                    </span>
                    <span className="text-[10px] font-mono-tactile text-[#C93B61] font-medium flex items-center gap-0.5">
                      <span>✦</span> pratinjau langsung di kartu ↑
                    </span>
                  </div>

                  {/* Filter Grid (Smooth scrolling list of 20 filters with live real-time update) */}
                  <div className="grid grid-cols-2 gap-2 overflow-y-auto no-scrollbar pr-0.5 pb-2">
                    {PHOTO_FILTERS.map((filter) => {
                      const isSelected = selectedFilterId === filter.id;
                      return (
                        <button
                          key={filter.id}
                          type="button"
                          onClick={() => {
                            setSelectedFilterId(filter.id);
                          }}
                          className={`p-2.5 rounded-2xl border text-left transition flex items-center gap-2 cursor-pointer active:scale-98 ${
                            isSelected
                              ? 'border-[#C93B61] bg-[#FCE8EE]/80 shadow-xs ring-1 ring-[#C93B61]'
                              : 'border-stone-200/90 bg-white hover:bg-stone-50'
                          }`}
                        >
                          <span
                            className="w-5 h-5 rounded-full border border-black/10 shrink-0 shadow-xs"
                            style={{ backgroundColor: filter.previewBg }}
                          />
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-semibold text-stone-900 truncate">{filter.name}</span>
                              {isSelected && <Check size={12} className="text-[#C93B61] shrink-0" />}
                            </div>
                            <span className="text-[9.5px] text-stone-400 font-mono-tactile block truncate">
                              {filter.category}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* TAB CONTENT B: TEXTURES */}
              {activeModal === 'texture' && (
                <div className="flex-1 flex flex-col min-h-0 overflow-y-auto no-scrollbar pr-0.5 pb-2">
                  <div className="flex items-center justify-between mb-2 px-0.5">
                    <span className="text-[11px] font-mono-tactile text-[#78716C]">
                      Aktif: <strong className="text-stone-900 font-sans">{TEXTURE_OPTIONS.find(t => t.id === selectedTexture)?.name}</strong>
                    </span>
                    <span className="text-[10px] font-mono-tactile text-[#C93B61] font-medium flex items-center gap-0.5">
                      <span>✦</span> pratinjau langsung di kartu ↑
                    </span>
                  </div>

                  {/* Preset options */}
                  <div className="grid grid-cols-2 gap-2 mb-3">
                    {TEXTURE_OPTIONS.map((tex) => {
                      const isSelected = selectedTexture === tex.id;
                      return (
                        <button
                          key={tex.id}
                          type="button"
                          onClick={() => {
                            if (tex.id === 'custom') {
                              customTextureInputRef.current?.click();
                            } else {
                              setSelectedTexture(tex.id);
                            }
                          }}
                          className={`p-2.5 rounded-2xl border text-left transition flex items-start gap-2 cursor-pointer active:scale-98 ${
                            isSelected
                              ? 'border-[#C93B61] bg-[#FCE8EE]/80 shadow-xs ring-1 ring-[#C93B61]'
                              : 'border-stone-200/90 bg-white hover:bg-stone-50'
                          }`}
                        >
                          <span className="text-lg mt-0.5">{tex.icon}</span>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-semibold text-stone-900">{tex.name}</span>
                              {isSelected && <Check size={12} className="text-[#C93B61]" />}
                            </div>
                            <p className="text-[9.5px] text-stone-500 line-clamp-1 mt-0.5">{tex.desc}</p>
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {/* Upload button banner */}
                  <button
                    type="button"
                    onClick={() => customTextureInputRef.current?.click()}
                    className="w-full mb-3 p-2 rounded-xl border border-dashed border-[#C93B61]/60 bg-[#FAF4F6] text-[11px] font-mono-tactile text-[#C93B61] flex items-center justify-center gap-1.5 hover:bg-[#F9EDF1] active:scale-98 transition cursor-pointer"
                  >
                    <ImagePlus size={14} />
                    <span>Unggah file tekstur sendiri (.jpg/.png)</span>
                  </button>

                  {/* Opacity / Intensity Slider */}
                  {selectedTexture !== 'none' && (
                    <div className="bg-white p-3 rounded-2xl border border-stone-200">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs font-semibold text-stone-800">Intensitas Tekstur</span>
                        <span className="text-xs font-mono-tactile text-stone-600">{textureOpacity}%</span>
                      </div>
                      <input
                        type="range"
                        min="10"
                        max="100"
                        value={textureOpacity}
                        onChange={(e) => setTextureOpacity(Number(e.target.value))}
                        className="w-full accent-[#C93B61] cursor-pointer"
                      />
                      <div className="flex justify-between text-[9.5px] text-stone-400 font-mono-tactile mt-0.5">
                        <span>Halus (10%)</span>
                        <span>Sedang (45%)</span>
                        <span>Kuat (100%)</span>
                      </div>
                    </div>
                  )}
                </div>
              )}

            </div>
          </div>
        )}

        {/* Watermark Edit Modal (Kustomisasi Mark Foto Bawah) */}
        {activeModal === 'edit-watermark' && (
          <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] z-50 flex items-end animate-in fade-in duration-150">
            <div className="w-full bg-[#FAF8F4] rounded-t-[28px] p-5 shadow-2xl border-t border-[#EAE4D8] max-h-[85vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="text-sm font-semibold text-stone-900 font-sans">Kustomisasi Watermark Foto</h3>
                  <p className="text-[11px] text-stone-500 font-mono-tactile">Ubah teks tanda di pojok kanan bawah foto</p>
                </div>
                <button
                  onClick={() => setActiveModal('none')}
                  className="w-7 h-7 rounded-full bg-stone-200 flex items-center justify-center text-stone-600 hover:bg-stone-300"
                >
                  <X size={14} />
                </button>
              </div>

              {/* Watermark Text Input */}
              <div className="mb-3">
                <label className="block text-[11px] font-mono-tactile text-stone-600 mb-1">
                  Teks Watermark Foto
                </label>
                <input
                  type="text"
                  value={watermarkText}
                  onChange={(e) => setWatermarkText(e.target.value)}
                  placeholder="misal: @nama_anda, ✻stampo, liburan 2026..."
                  maxLength={30}
                  className="w-full p-3 rounded-xl bg-white border border-[#E2DBD0] text-xs font-sans focus:outline-none focus:border-[#C93B61] text-stone-800"
                />
              </div>

              {/* Quick Presets */}
              <div className="mb-4">
                <span className="block text-[10px] font-mono-tactile text-stone-400 mb-1.5 uppercase tracking-wider">
                  Pilihan Cepat
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    '✻stampo',
                    'stampo',
                    '@username',
                    'memories ☕️',
                    '✦ diary',
                    'summer · 2026'
                  ].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => {
                        setWatermarkText(preset);
                        setShowWatermark(true);
                      }}
                      className={`px-2.5 py-1 rounded-lg text-xs font-mono-tactile border transition cursor-pointer ${
                        watermarkText === preset && showWatermark
                          ? 'bg-[#FCD2DC] text-[#C93B61] border-[#C93B61]/40 font-semibold'
                          : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-50'
                      }`}
                    >
                      {preset}
                    </button>
                  ))}
                </div>
              </div>

              {/* Visibility Toggle */}
              <div className="bg-white p-3 rounded-xl border border-stone-200 flex items-center justify-between mb-4">
                <div>
                  <span className="text-xs font-medium text-stone-800 block">Tampilkan di Foto</span>
                  <span className="text-[10px] text-stone-400 font-mono-tactile">Matikan jika ingin foto bersih tanpa tanda</span>
                </div>
                <button
                  type="button"
                  onClick={() => setShowWatermark(!showWatermark)}
                  className={`w-11 h-6 rounded-full transition-colors p-0.5 cursor-pointer ${
                    showWatermark ? 'bg-[#C93B61]' : 'bg-stone-300'
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full bg-white transition-transform ${
                      showWatermark ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setWatermarkText('');
                    setShowWatermark(false);
                    showToast('Watermark disembunyikan ✨');
                  }}
                  className="px-4 py-2.5 rounded-xl bg-stone-200 text-stone-700 text-xs font-mono-tactile hover:bg-stone-300 cursor-pointer"
                >
                  Hapus
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setActiveModal('none');
                    showToast('Watermark diperbarui ✨');
                  }}
                  className="flex-1 py-2.5 rounded-xl bg-[#2E2822] text-white text-xs font-semibold hover:bg-stone-800 active:scale-98 transition cursor-pointer"
                >
                  Terapkan
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Feedback Modal */}
        {activeModal === 'feedback' && (
          <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] z-50 flex items-end animate-in fade-in duration-150">
            <div className="w-full bg-[#FAF8F4] rounded-t-[28px] p-5 shadow-2xl border-t border-[#EAE4D8]">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-stone-900 font-sans">Kirim Feedback</h3>
                <button
                  onClick={() => setActiveModal('none')}
                  className="w-7 h-7 rounded-full bg-stone-200 flex items-center justify-center text-stone-600"
                >
                  <X size={14} />
                </button>
              </div>

              <textarea
                rows={3}
                placeholder="Bagikan masukanmu tentang stampo..."
                className="w-full p-3 rounded-xl bg-white border border-[#E2DBD0] text-xs font-sans focus:outline-none focus:border-stone-400 mb-3"
              ></textarea>

              <button
                onClick={() => {
                  setActiveModal('none');
                  showToast('Terima kasih atas feedback Anda! ☕️');
                }}
                className="w-full py-2.5 rounded-xl bg-[#2E2822] text-white text-xs font-medium"
              >
                Kirim Catatan
              </button>
            </div>
          </div>
        )}

        {/* Modal Pilihan Save: Simpan ke Album atau Download PNG */}
        {activeModal === 'save-choice' && (
          <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] z-50 flex items-end animate-in fade-in duration-150">
            <div className="w-full bg-[#FAF8F4] rounded-t-[28px] p-5 shadow-2xl border-t border-[#EAE4D8] animate-in slide-in-from-bottom duration-200">
              <div className="flex items-center justify-between pb-3 border-b border-[#EAE4D8] mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-xl bg-[#FCE8EE] text-[#C93B61] flex items-center justify-center">
                    <BookmarkPlus size={15} />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-stone-900 font-sans tracking-tight">
                      Pilih Tindakan Simpan
                    </h3>
                    <p className="text-[10px] text-stone-500 font-mono-tactile">
                      Tersedia 2 opsi penyimpanan kartu
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    playTactileSound('click', soundEnabled);
                    setActiveModal('none');
                  }}
                  className="w-7 h-7 rounded-full bg-stone-200/80 hover:bg-stone-300 flex items-center justify-center text-stone-600 transition cursor-pointer"
                >
                  <X size={14} />
                </button>
              </div>

              {/* Dua Opsi Pilihan */}
              <div className="space-y-2.5 mb-3">
                {/* Opsi 1: Simpan ke Album Filateli */}
                <button
                  type="button"
                  onClick={() => {
                    setActiveModal('none');
                    saveToJournal();
                  }}
                  className="w-full p-3.5 rounded-2xl bg-[#F5F2EB] hover:bg-[#EFECE3] border border-[#E3DCCF] flex items-center justify-between text-left transition active:scale-[0.98] group cursor-pointer shadow-2xs"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#2E2822] text-[#FCD2DC] flex items-center justify-center shrink-0 shadow-xs">
                      <Bookmark size={18} />
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-stone-900 font-sans group-hover:text-[#C93B61] transition-colors">
                          Simpan ke Album Filateli
                        </span>
                        <span className="text-[9px] font-mono-tactile font-semibold px-1.5 py-0.2 rounded-md bg-[#2E2822]/8 text-stone-700">
                          In-App
                        </span>
                      </div>
                      <p className="text-[10.5px] text-stone-500 font-sans mt-0.5 leading-snug">
                        Arsipkan kartu ke binder koleksi prangko tanpa mengunduh file
                      </p>
                    </div>
                  </div>
                  <span className="text-stone-400 group-hover:text-stone-700 font-mono-tactile text-xs pr-1">
                    →
                  </span>
                </button>

                {/* Opsi 2: Download Gambar Kartu (PNG) */}
                <button
                  type="button"
                  onClick={() => {
                    setActiveModal('none');
                    handleSaveToDevice();
                  }}
                  className="w-full p-3.5 rounded-2xl bg-[#2E2822] text-white hover:bg-stone-800 flex items-center justify-between text-left transition active:scale-[0.98] group cursor-pointer shadow-xs"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white/10 text-[#FCD2DC] flex items-center justify-center shrink-0">
                      <Download size={18} />
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-white font-sans group-hover:text-[#FCD2DC] transition-colors">
                          Download Gambar (PNG)
                        </span>
                        <span className="text-[9px] font-mono-tactile font-semibold px-1.5 py-0.2 rounded-md bg-[#FCD2DC] text-[#7A1F36]">
                          Galeri HP
                        </span>
                      </div>
                      <p className="text-[10.5px] text-stone-300 font-sans mt-0.5 leading-snug">
                        Simpan kartu prangko 3:4 resolusi tajam ke penyimpanan perangkat
                      </p>
                    </div>
                  </div>
                  <span className="text-stone-300 group-hover:text-white font-mono-tactile text-xs pr-1">
                    ↓
                  </span>
                </button>

                {/* Opsi 3: Buka Album Koleksi */}
                <button
                  type="button"
                  onClick={() => {
                    playTactileSound('rustle', soundEnabled);
                    setActiveModal('album');
                  }}
                  className="w-full p-3.5 rounded-2xl bg-[#FAF5EB] hover:bg-[#F2ECE0] border border-[#E3DACB] flex items-center justify-between text-left transition active:scale-[0.98] group cursor-pointer shadow-2xs"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#C93B61] text-white flex items-center justify-center shrink-0 shadow-xs">
                      <BookOpen size={18} />
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-stone-900 font-sans group-hover:text-[#C93B61] transition-colors">
                          Buka Album Koleksi
                        </span>
                        <span className="text-[9px] font-mono-tactile font-semibold px-1.5 py-0.2 rounded-md bg-[#C93B61]/10 text-[#C93B61]">
                          {journalEntries.length} Prangko
                        </span>
                      </div>
                      <p className="text-[10.5px] text-stone-500 font-sans mt-0.5 leading-snug">
                        Lihat lembar binder seluruh prangko yang sudah kamu arsipkan
                      </p>
                    </div>
                  </div>
                  <span className="text-stone-400 group-hover:text-[#C93B61] font-mono-tactile text-xs pr-1">
                    ↗
                  </span>
                </button>
              </div>

              {/* Batal */}
              <button
                type="button"
                onClick={() => {
                  playTactileSound('click', soundEnabled);
                  setActiveModal('none');
                }}
                className="w-full py-2.5 rounded-xl bg-stone-200/70 hover:bg-stone-200 text-stone-700 text-xs font-mono-tactile font-medium transition cursor-pointer"
              >
                Batal
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
