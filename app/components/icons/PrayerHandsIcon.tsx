import React from 'react';

export default function PrayerHandsIcon({ className }: { className?: string }) {
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
      <path d="M12 5.69l1.45 1.45c.3.3.49.71.49 1.13v4.25c0 .55.45 1 1 1s1-.45 1-1V9.5c0-.42.19-.83.49-1.13L18 7.28" />
      <path d="M12 5.69l-1.45 1.45c-.3.3-.49.71-.49 1.13v4.25c0 .55-.45 1-1 1s-1-.45-1-1V9.5c0-.42-.19-.83-.49-1.13L6 7.28" />
      <path d="M7.5 11h-.01M9.5 11H15.5M11.5 11H11.5" />
      <path d="M9.5 21h.01M11.5 21H13.5M15.5 21H17.5" />
    </svg>
  );
}
