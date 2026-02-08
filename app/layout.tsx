import type { Metadata } from 'next';
import { Inter, Outfit } from 'next/font/google';
import './globals.css';
import { cn } from '@/lib/utils';
import { Shield } from 'lucide-react';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const outfit = Outfit({ subsets: ['latin'], variable: '--font-outfit' });

export const metadata: Metadata = {
    title: 'Fraud Operations Dashboard',
    description: 'Real-time transaction monitoring & risk management',
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" className="dark">
            <body className={cn(inter.variable, outfit.variable, "font-sans min-h-screen bg-neutral-950 text-neutral-100")}>

                {/* Header */}
                <header className="fixed top-0 left-0 right-0 h-16 border-b border-neutral-800/80 bg-neutral-950/80 backdrop-blur-md z-40 flex items-center px-6">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-neutral-100 flex items-center justify-center text-neutral-950">
                            <Shield className="w-5 h-5 fill-current" />
                        </div>
                        <div>
                            <h1 className="text-base font-bold text-neutral-100 leading-tight">Fraud Operations Dashboard</h1>
                            <p className="text-[10px] text-neutral-500 uppercase tracking-widest font-medium">Real-time Risk Engine</p>
                        </div>
                    </div>
                    <div className="ml-auto flex items-center gap-4">
                        <span className="flex items-center gap-2 text-xs font-medium text-emerald-500 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            Live System
                        </span>
                    </div>
                </header>

                {/* Main Content */}
                <main className="pt-20 px-6 pb-12 max-w-[1920px] mx-auto">
                    {children}
                </main>
            </body>
        </html>
    );
}
