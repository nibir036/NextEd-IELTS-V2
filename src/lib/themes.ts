import { ThemeConfig } from '../types';

export const THEMES: ThemeConfig[] = [
  {
    id: 'metallic-dusk',
    name: 'Metallic Dusk',
    description: 'Copper & Teal on near-black. Standard high-contrast aesthetic.',
    mode: 'dark',
    swatches: ['#e8a463', '#3f8fb0', '#090b10'],
  },
  {
    id: 'midnight',
    name: 'Midnight',
    description: 'Indigo & Cyan on deep navy-black. Ideal for late-night study sessions.',
    mode: 'dark',
    swatches: ['#8b8cf0', '#3fb0c9', '#070913'],
  },
  {
    id: 'emerald',
    name: 'Emerald',
    description: 'Warm Gold & Forest Green. Calming, focus-oriented atmosphere.',
    mode: 'dark',
    swatches: ['#e8c463', '#3fb08a', '#060e0a'],
  },
  {
    id: 'daylight',
    name: 'Daylight',
    description: 'Terracotta & Deep Teal on warm cream. Designed for bright environments.',
    mode: 'light',
    swatches: ['#d97a3f', '#2f7c95', '#f3efe8'],
  },
  {
    id: 'vintage-rust',
    name: 'Vintage Rust',
    description: 'Copper Rust (#5F3920) & Olive Slate (#373F38) on Espresso (#332521).',
    mode: 'dark',
    swatches: ['#d97d41', '#373F38', '#332521'],
  },
  {
    id: 'forest-chapel',
    name: 'Forest Chapel',
    description: 'Deep Emerald (#245B47) & Cypress (#224942) on Abyssal Navy (#192A3C).',
    mode: 'dark',
    swatches: ['#245B47', '#223546', '#192A3C'],
  },
  {
    id: 'alpine-twilight',
    name: 'Alpine Twilight',
    description: 'Steel Cyan (#38667E) & Plum Violet (#563457) on Abyssal Indigo (#161638).',
    mode: 'dark',
    swatches: ['#38667E', '#563457', '#161638'],
  },
  {
    id: 'royal-salon',
    name: 'Royal Salon',
    description: 'Bronze Cognac (#74563B) & Silver Mist (#9498A1) on Royal Navy (#122537).',
    mode: 'dark',
    swatches: ['#c49466', '#9498A1', '#122537'],
  },
];
