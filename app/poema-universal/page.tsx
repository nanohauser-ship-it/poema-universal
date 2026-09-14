import type { Metadata } from 'next';
import Threshold from './components/umbral-v2/Threshold';

export const metadata: Metadata = {
  title: 'Poema Universal',
  description:
    'Poema Universal · edición 2026 · una obra colectiva mundial.',
};

export default function Page() {
  return <Threshold />;
}
