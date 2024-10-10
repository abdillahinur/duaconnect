import React from 'react';

export default function MosqueIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M12 2C10.34 2 9 3.34 9 5s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" />
      <path d="M20 22H4v-6l8-4 8 4v6z" />
      <path d="M18 10h-1V6a2 2 0 0 0-2-2h-6a2 2 0 0 0-2 2v4H6a2 2 0 0 0-2 2v6h16v-6a2 2 0 0 0-2-2z" />
    </svg>
  );
}
