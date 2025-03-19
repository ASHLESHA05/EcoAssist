"use client";

import { useEffect, useRef, useState } from "react";

export default function CoinAnimation({ onComplete, points }: { onComplete: () => void; points: number }) {
  const coinRef = useRef<HTMLDivElement>(null);
  const [isAnimating, setIsAnimating] = useState(true);

  useEffect(() => {
    const coin = coinRef.current;
    if (coin) {
      // Enhanced entrance animation with depth
      const entrance = coin.animate(
        [
          { transform: "scale(0) rotateY(0deg) translateZ(-20px)", opacity: 0 },
          { transform: "scale(1.3) rotateY(180deg) translateZ(20px)", opacity: 1, offset: 0.6 },
          { transform: "scale(1) rotateY(360deg) translateZ(0px)", opacity: 1 }
        ],
        {
          duration: 1000,
          easing: "cubic-bezier(0.34, 1.56, 0.64, 1)",
          fill: "forwards"
        }
      );

      entrance.onfinish = () => {
        // Floating with subtle depth oscillation
        const float = coin.animate(
          [
            { transform: "translateY(0px) rotateY(0deg) translateZ(10px)" },
            { transform: "translateY(-15px) rotateY(180deg) translateZ(-10px)", offset: 0.5 },
            { transform: "translateY(0px) rotateY(360deg) translateZ(10px)" }
          ],
          {
            duration: 2000,
            iterations: 1,
            easing: "ease-in-out"
          }
        );

        float.onfinish = () => {
          // Enhanced spin with dynamic scaling and depth
          const spin = coin.animate(
            [
              { transform: "rotateY(0deg) scale(1) translateZ(10px)", opacity: 1 },
              { transform: "rotateY(1440deg) scale(1.8) translateZ(30px)", opacity: 1 }
            ],
            {
              duration: 2000,
              easing: "cubic-bezier(0.2, 0.8, 0.2, 1)"
            }
          );

          spin.onfinish = () => {
            const scorePlace = document.querySelector(".eco-score-place");
            if (scorePlace) {
              const scoreRect = scorePlace.getBoundingClientRect();
              const coinRect = coin.getBoundingClientRect();
              const deltaX = scoreRect.left - coinRect.left;
              const deltaY = scoreRect.top - coinRect.top;

              createParticles(coin);

              coin.animate(
                [
                  { transform: `translate(0, 0) scale(1.8) translateZ(30px)`, opacity: 1 },
                  { transform: `translate(${deltaX}px, ${deltaY}px) scale(0.3) translateZ(0px)`, opacity: 0 }
                ],
                {
                  duration: 1000,
                  fill: "forwards",
                  easing: "cubic-bezier(0.22, 1, 0.36, 1)"
                }
              ).onfinish = () => {
                setIsAnimating(false);
                onComplete();
              };
            }
          };
        };
      };
    }
  }, [onComplete]);

  const createParticles = (coin: HTMLDivElement) => {
    const container = coin.parentElement;
    if (!container) return;

    const colors = ["#4CAF50", "#8BC34A", "#CDDC39", "#E6EE9C"];
    const particleCount = 30;

    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement("div");
      const size = Math.random() * 8 + 4;

      particle.style.position = "absolute";
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;
      particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      particle.style.borderRadius = "50%";
      particle.style.pointerEvents = "none";
      particle.style.transform = "translateZ(0)";

      container.appendChild(particle);

      const angle = Math.random() * Math.PI * 2;
      const velocity = Math.random() * 6 + 4;
      const posX = coin.offsetWidth / 2 - size / 2;
      const posY = coin.offsetHeight / 2 - size / 2;

      const animation = particle.animate(
        [
          { transform: `translate(${posX}px, ${posY}px) scale(1) translateZ(10px)`, opacity: 1 },
          {
            transform: `translate(${posX + Math.cos(angle) * velocity * 25}px, ${posY + Math.sin(angle) * velocity * 25}px) scale(0) translateZ(0px)`,
            opacity: 0
          }
        ],
        {
          duration: Math.random() * 800 + 500,
          easing: "cubic-bezier(0.4, 0, 0.2, 1)",
          fill: "forwards"
        }
      );

      animation.onfinish = () => particle.remove();
    }
  };

  if (!isAnimating) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
      <div className="flex flex-col items-center relative">
        {/* Enhanced glow effect */}
        <div className="absolute w-40 h-40 rounded-full bg-green-500 opacity-25 blur-xl animate-pulse"></div>
        <div className="absolute w-32 h-32 rounded-full bg-green-400 opacity-20 blur-lg animate-pulse delay-200"></div>

        {/* 3D Coin with Thickness */}
        <div
          ref={coinRef}
          className="relative w-28 h-28"
          style={{
            transformStyle: "preserve-3d",
            perspective: "1200px"
          }}
        >
          {/* Front Face */}
          <div
            className="absolute inset-0 rounded-full overflow-hidden"
            style={{
              backfaceVisibility: "hidden",
              transform: "translateZ(8px)",
              background: "radial-gradient(circle at 30% 30%, #4CAF50, #2E7D32)"
            }}
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-4xl transform">🍃</span>
            </div>
            <div className="absolute inset-2 rounded-full border-2 border-green-200 opacity-40"></div>
            <div className="absolute inset-0 rounded-full bg-gradient-to-b from-transparent to-black opacity-15"></div>
            <div className="absolute w-3/4 h-2 bg-white opacity-25 rounded-full top-1/5 blur-sm transform rotate-45"></div>
          </div>

          {/* Back Face */}
          <div
            className="absolute inset-0 rounded-full overflow-hidden"
            style={{
              backfaceVisibility: "hidden",
              transform: "rotateY(180deg) translateZ(8px)",
              background: "radial-gradient(circle at 70% 70%, #388E3C, #1B5E20)"
            }}
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-3xl text-green-100 font-bold">{points}</span>
            </div>
            <div className="absolute inset-2 rounded-full border-2 border-green-300 opacity-30"></div>
            <div className="absolute inset-0 rounded-full bg-gradient-to-t from-transparent to-black opacity-15"></div>
            <div className="absolute w-3/4 h-2 bg-white opacity-20 rounded-full bottom-1/5 blur-sm transform -rotate-45"></div>
          </div>

          {/* Coin Edge (Thickness) */}
          {Array.from({ length: 16 }).map((_, i) => (
            <div
              key={i}
              className="absolute inset-0"
              style={{
                transform: `rotateY(${i * 22.5}deg) translateZ(8px)`,
                height: "16px",
                top: "calc(50% - 8px)",
                background: "linear-gradient(90deg, #2E7D32, #43A047, #2E7D32)",
                transformOrigin: "center",
                clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)"
              }}
            />
          ))}
        </div>

        {/* Enhanced Points Text */}
        <div className="mt-8 text-xl font-bold text-green-800 relative">
          <div className="absolute inset-0 text-green-600 blur-md animate-pulse">+{points} Points</div>
          <div className="relative drop-shadow-md">+{points} Points Added</div>
        </div>
      </div>
    </div>
  );
}