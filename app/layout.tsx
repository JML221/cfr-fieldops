import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Field Ops Advisor',
  description: 'Practical decision support for field operators in conflict environments',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
