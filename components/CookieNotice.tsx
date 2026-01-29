'use client';

import { useState, useEffect } from 'react';

export default function CookieNotice() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Check if user has already accepted
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) {
      setShow(true);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem('cookie-consent', 'accepted');
    setShow(false);
  };

  if (!show) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-900 text-white p-4 shadow-lg z-50 border-t border-gray-700">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-sm text-gray-300">
          Ta spletna stran uporablja piškotke za avtentikacijo in izboljšanje uporabniške izkušnje.
          Z uporabo strani se strinjate s tem.
        </p>
        <button
          onClick={acceptCookies}
          className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg whitespace-nowrap transition-colors"
        >
          Razumem
        </button>
      </div>
    </div>
  );
}
