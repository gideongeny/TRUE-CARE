import React from 'react';
import Image from 'next/image';

interface LogoProps {
    className?: string;
    showText?: boolean;
    light?: boolean;
}

export default function Logo({ className = "w-12 h-12", showText = true, light = false }: LogoProps) {
    return (
        <div className={`flex items-center gap-4 ${className.includes('flex-col') ? 'flex-col text-center' : ''}`}>
            <div className="shrink-0">
                <Image
                    src="/logo.png"
                    alt="TRUE CARE Logo"
                    width={showText ? 48 : 40}
                    height={showText ? 48 : 40}
                    className="object-contain"
                    priority
                />
            </div>

            {showText && (
                <div className="flex flex-col items-start leading-none">
                    <span className={`text-2xl font-black tracking-tight ${light ? 'text-white' : 'text-white'}`}>
                        TRUE <span className="text-gray-300">CARE</span>
                    </span>
                    <span className="text-[10px] font-bold tracking-[0.3em] text-gray-500 mt-1.5 uppercase">
                        Always With You
                    </span>
                </div>
            )}
        </div>
    );
}
