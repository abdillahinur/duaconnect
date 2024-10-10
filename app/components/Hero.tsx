import React from 'react';
import Link from 'next/link';
import { Button } from './ui/button'; // Assuming the button component is correctly imported

export default function Hero() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-green-50">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col items-center space-y-4 text-center">
          {/* Hero Text Section */}
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
              Connect Through Prayer
            </h1>
            <p className="mx-auto max-w-[700px] text-gray-600 md:text-xl">
              Share your duas, support others, and strengthen your faith with our global Muslim community.
            </p>
          </div>

          {/* Hero Buttons Section */}
          <div className="space-x-4">
            {/* Primary Button to navigate to Dua Board */}
            <Link href="/dua-board">
              <Button className="bg-green-600 text-white hover:bg-green-700">
                Go to Dua Board
              </Button>
            </Link>

            {/* Secondary Button (Outlined) */}
            <Button variant="outline" className="border border-green-600 text-green-600 hover:bg-green-50">
              Learn More
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
