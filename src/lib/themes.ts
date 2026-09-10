import { ThemeConfig } from '../types';

export const THEMES: ThemeConfig[] = [
  {
    id: 'metallic-dusk',
    name: 'Dusk',
    description: 'Periwinkle & indigo on deep violet-black. Standard high-contrast aesthetic.',
    mode: 'dark',
    swatches: ['#8cb0fa', '#736ed6', '#0d0a1f'],
  },
  {
    id: 'daylight',
    name: 'Daylight',
    description: 'Indigo & violet on soft lilac-cream. Designed for bright environments.',
    mode: 'light',
    swatches: ['#736ed6', '#2f028c', '#f3f0fb'],
  },
];
