import React from 'react';
import { Nunito } from 'next/font/google';

// Initialize the Nunito font
const nunito = Nunito({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-nunito',
});

const Footer: React.FC = () => {
  return (
    <footer className={`bg-green-100 py-6 w-full ${nunito.variable} font-nunito`}>
      <div className="container mx-auto px-4">
        <p className="text-center text-gray-600">© 2024 DuaLink. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;