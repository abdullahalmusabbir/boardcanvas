import { Zap } from 'lucide-react';
import Link from 'next/link';

const footerLinks = {
    Product: [
        { label: 'Features', href: '/features' },
        { label: 'About', href: '/about' },
    ],
    Legal: [
        { label: 'Privacy', href: '#' },
        { label: 'Terms', href: '#' },
    ],
};

export default function LandingFooter() {
    return (
        <footer className="border-t border-[#2a2a3a]/60 bg-[#0a0a0f]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
            {/* Brand */}
            <div className="md:col-span-2">
                <div className="flex items-center gap-2.5 mb-4">
                <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center
                                justify-center shadow-lg shadow-indigo-500/30">
                    <Zap size={18} className="text-white" />
                </div>
                <span className="font-bold text-white text-xl">
                    VisionBoard
                </span>
                </div>
                <p className="text-sm text-[#8b8ba7] leading-relaxed max-w-xs">
                The ultimate workspace for teams that want to manage tasks
                and annotate images — all in one place.
                </p>
                
            </div>

            {/* Links */}
            {Object.entries(footerLinks).map(([title, links]) => (
                <div key={title}>
                <h4 className="text-xs font-semibold text-[#8b8ba7] uppercase
                                tracking-wider mb-4">
                    {title}
                </h4>
                <ul className="space-y-3">
                    {links.map(({ label, href }) => (
                    <li key={label}>
                        <Link
                        href={href}
                        className="text-sm text-[#6b6b87] hover:text-white
                                    transition-colors duration-200"
                        >
                        {label}
                        </Link>
                    </li>
                    ))}
                </ul>
                </div>
            ))}
            </div>

            {/* Bottom bar */}
            <div className="border-t border-[#2a2a3a]/60 mt-12 pt-8
                            flex flex-col sm:flex-row items-center
                            justify-between gap-4">
            <p className="text-xs text-[#4a4a6a]">
                © {new Date().getFullYear()} 404 App. All rights reserved.
            </p>
            <p className="text-xs text-[#4a4a6a]">
                Built with ❤️ using Next.js & Django
            </p>
            </div>
        </div>
        </footer>
    );
}