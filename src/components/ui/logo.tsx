import * as React from "react"
import { cn } from "@/lib/utils"

export function Logo({ className }: { className?: string }) {
    return (
        <svg
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={cn("w-full h-full shadow-lg shadow-emerald-900/20 rounded-xl sm:rounded-2xl", className)}
        >
            <rect width="100" height="100" rx="24" fill="url(#mf_gradient)" />
            <path d="M25 70V35L40 52L55 35V70" stroke="white" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M70 35H85M70 52H80M70 35V70" stroke="white" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
            <defs>
                <linearGradient id="mf_gradient" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#10B981" />
                    <stop offset="1" stopColor="#047857" />
                </linearGradient>
            </defs>
        </svg>
    )
}
