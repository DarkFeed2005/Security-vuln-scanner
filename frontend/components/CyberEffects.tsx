'use client';

import { useEffect, useState } from 'react';

export default function CyberEffects() {
  const [matrixChars, setMatrixChars] = useState<Array<{ id: number; left: number; delay: number }>>([]);

  useEffect(() => {
    // Generate random matrix rain characters
    const chars = Array.from({ length: 15 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 5,
    }));
    setMatrixChars(chars);
  }, []);

  return (
    <>
      {/* Scanline Effect */}
      <div className="scanline-container">
        <div className="scanline"></div>
      </div>

      {/* Matrix Rain Effect */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0 opacity-20">
        {matrixChars.map((char) => (
          <div
            key={char.id}
            className="matrix-char"
            style={{
              left: `${char.left}%`,
              animationDuration: `${10 + Math.random() * 10}s`,
              animationDelay: `${char.delay}s`,
            }}
          >
            {String.fromCharCode(0x30A0 + Math.random() * 96)}
          </div>
        ))}
      </div>
    </>
  );
}