"use client"

import { useState } from "react"
import Link from "next/link"
import { X } from "lucide-react"

export function PromoBanner() {
  const [isVisible, setIsVisible] = useState(true)

  if (!isVisible) return null

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-[#3a8a8c] via-[#2d7a7c] to-[#1e6a6c]">
      {/* Confetti/sparkle decorations */}
      <div className="pointer-events-none absolute inset-0">
        {/* Sparkles */}
        <div className="absolute left-[10%] top-[20%] h-1.5 w-1.5 animate-pulse rounded-full bg-white/60" />
        <div className="absolute left-[25%] top-[60%] h-1 w-1 animate-pulse rounded-full bg-white/40" />
        <div className="absolute left-[40%] top-[15%] h-2 w-2 animate-pulse rounded-full bg-white/50" />
        <div className="absolute right-[15%] top-[25%] h-1.5 w-1.5 animate-pulse rounded-full bg-white/60" />
        <div className="absolute right-[30%] top-[70%] h-1 w-1 animate-pulse rounded-full bg-white/40" />
        <div className="absolute right-[45%] top-[10%] h-2 w-2 animate-pulse rounded-full bg-white/50" />
        <div className="absolute left-[60%] top-[80%] h-1.5 w-1.5 animate-pulse rounded-full bg-white/60" />
        <div className="absolute right-[60%] top-[40%] h-1 w-1 animate-pulse rounded-full bg-white/40" />
        
        {/* Confetti pieces */}
        <div className="absolute left-[5%] top-[30%] h-3 w-1.5 rotate-45 bg-[#e74c3c]/70" />
        <div className="absolute left-[15%] top-[70%] h-2 w-3 -rotate-12 bg-[#5dade2]/60" />
        <div className="absolute left-[35%] top-[25%] h-2.5 w-1 rotate-[30deg] bg-[#f8b4c4]/70" />
        <div className="absolute right-[8%] top-[45%] h-3 w-1.5 -rotate-45 bg-[#5dade2]/60" />
        <div className="absolute right-[20%] top-[15%] h-2 w-2.5 rotate-12 bg-[#e74c3c]/70" />
        <div className="absolute right-[35%] top-[75%] h-2.5 w-1 -rotate-[30deg] bg-[#f8b4c4]/70" />
        <div className="absolute left-[70%] top-[55%] h-2 w-3 rotate-[60deg] bg-[#2c3e50]/50" />
        <div className="absolute right-[70%] top-[85%] h-1.5 w-2.5 -rotate-[20deg] bg-[#5dade2]/50" />
      </div>

      {/* Close button */}
      <button
        onClick={() => setIsVisible(false)}
        className="absolute right-2 top-2 z-10 rounded-full p-1.5 text-white/70 transition-colors hover:bg-white/20 hover:text-white sm:right-4 sm:top-4"
        aria-label="Dismiss banner"
      >
        <X className="h-5 w-5" />
      </button>

      {/* Main content */}
      <div className="relative mx-auto max-w-4xl px-4 py-8 text-center sm:py-12">
        {/* WIN text */}
        <h2 className="mb-2 text-3xl font-bold tracking-wide text-white drop-shadow-lg sm:text-4xl md:text-5xl">
          WIN
        </h2>
        
        {/* $5,000 amount */}
        <div className="mb-4 flex items-center justify-center">
          <span className="text-5xl font-black text-[#f8b4c4] drop-shadow-[0_4px_8px_rgba(0,0,0,0.3)] sm:text-7xl md:text-8xl"
            style={{
              textShadow: '3px 3px 0 #e74c3c, 6px 6px 0 rgba(0,0,0,0.2)',
              WebkitTextStroke: '2px #c0392b'
            }}
          >
            $5,000
          </span>
        </div>

        {/* CTA Button */}
        <Link
          href="/contact"
          className="mb-6 inline-block rounded-lg bg-[#c0392b] px-6 py-3 text-base font-semibold text-white shadow-lg transition-all hover:bg-[#a93226] hover:shadow-xl sm:px-8 sm:py-4 sm:text-lg"
        >
          Apply to refinance your loan by<br className="sm:hidden" />
          <span className="sm:ml-1">16 June for the chance to win.</span>
        </Link>

        {/* Fine print */}
        <p className="mx-auto max-w-2xl text-[10px] leading-relaxed text-white/80 sm:text-xs">
          AU 18+ only. Ends 11:59 AEST 16/6/26. Limit 1 entry/application. Better Loans Australia Pty Ltd 
          trading as Charter Mortgage & Finance ABN 83 120 448 631 (Australian Credit Licence 385789). 
          <Link href="/terms" className="ml-1 underline hover:text-white">T&Cs apply.</Link>
        </p>
      </div>
    </div>
  )
}
