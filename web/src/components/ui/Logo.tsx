import React from 'react';

interface LogoProps {
    className?: string;
    showText?: boolean;
    light?: boolean;
}

export default function Logo({ className = "w-12 h-12", showText = true, light = false }: LogoProps) {
    const textPrimary = light ? 'text-white' : 'text-slate-900';
    const textSecondary = light ? 'text-white/70' : 'text-slate-500';
    return (
        <div className={`flex items-center gap-4 ${className.includes('flex-col') ? 'flex-col text-center' : ''}`}>
            <div className="shrink-0">
                <svg
                    width={showText ? 48 : 40}
                    height={showText ? 48 : 40}
                    viewBox="0 0 64 64"
                    role="img"
                    aria-label="TRUE CARE"
                    className="block"
                >
                    <defs>
                        <linearGradient id="tc-grad" x1="0" y1="0" x2="1" y2="1">
                            <stop offset="0" stopColor="#2563eb" />
                            <stop offset="1" stopColor="#60a5fa" />
                        </linearGradient>
                    </defs>
                    <path
                        d="M32 6c10.7 0 19.5 8.8 19.5 19.5S42.7 45 32 45 12.5 36.2 12.5 25.5 21.3 6 32 6Z"
                        fill="url(#tc-grad)"
                        opacity="0.18"
                    />
                    <path
                        d="M32 10.5c8.3 0 15 6.7 15 15 0 6.8-4.4 12.7-10.6 14.6v5.2c0 1.3-1 2.3-2.3 2.3h-4.2c-1.3 0-2.3-1-2.3-2.3v-5.2C21.4 38.2 17 32.3 17 25.5c0-8.3 6.7-15 15-15Z"
                        fill="url(#tc-grad)"
                    />
                    <path
                        d="M30 22.5h-6.2c-1.1 0-2 .9-2 2V26c0 1.1.9 2 2 2H30v6.2c0 1.1.9 2 2 2h1.5c1.1 0 2-.9 2-2V28h6.2c1.1 0 2-.9 2-2v-1.5c0-1.1-.9-2-2-2H35.5V16.3c0-1.1-.9-2-2-2H32c-1.1 0-2 .9-2 2v6.2Z"
                        fill={light ? "#ffffff" : "#0f172a"}
                        opacity={light ? 0.95 : 0.92}
                    />
                </svg>
            </div>

            {showText && (
                <div className="flex flex-col items-start leading-none">
                    <span className={`text-2xl font-black tracking-tight ${textPrimary}`}>
                        TRUE <span className={light ? 'text-white/70' : 'text-slate-500'}>CARE</span>
                    </span>
                    <span className={`text-[10px] font-bold tracking-[0.3em] mt-1.5 uppercase ${textSecondary}`}>
                        Always With You
                    </span>
                </div>
            )}
        </div>
    );
}
