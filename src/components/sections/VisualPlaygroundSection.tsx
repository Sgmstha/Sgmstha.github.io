import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const VisualPlaygroundSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const leftColRef = useRef<HTMLDivElement>(null);
  const rightColRef = useRef<HTMLDivElement>(null);

  const images = [
    "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=2670&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?q=80&w=2670&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1550684376-efcbd6e3f031?q=80&w=2670&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?q=80&w=2787&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1618005192384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop"
  ];

  useEffect(() => {
    const section = sectionRef.current;
    const content = contentRef.current;
    const leftCol = leftColRef.current;
    const rightCol = rightColRef.current;

    if (!section || !content || !leftCol || !rightCol) return;

    ScrollTrigger.create({
      trigger: section,
      start: "top top",
      end: "bottom bottom",
      pin: content,
      pinSpacing: false,
    });

    gsap.to(leftCol, {
      yPercent: -50,
      ease: "none",
      scrollTrigger: {
        trigger: section,
        start: "top bottom",
        end: "bottom top",
        scrub: true,
      }
    });

    gsap.to(rightCol, {
      yPercent: 50,
      ease: "none",
      scrollTrigger: {
        trigger: section,
        start: "top bottom",
        end: "bottom top",
        scrub: true,
      }
    });

    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, []);

  return (
    <section ref={sectionRef} className="min-h-[300vh] relative bg-[#0C0C0C]">
      {/* Pinned Center */}
      <div ref={contentRef} className="h-screen w-full flex flex-col items-center justify-center absolute inset-0 z-10 pointer-events-none">
        <div className="text-center px-4">
          <p className="text-xs text-[#89AACC] uppercase tracking-[0.3em] mb-4">Explorations</p>
          <h2 className="text-6xl md:text-8xl lg:text-9xl font-black uppercase tracking-tight text-[#D7E2EA] mb-6">
            Visual <span className="italic font-serif font-light">playground</span>
          </h2>
          <p className="text-sm md:text-base text-white/50 max-w-md mx-auto mb-8">
            A collection of creative experiments, 3D renders, and conceptual designs.
          </p>
          <button className="pointer-events-auto px-8 py-4 rounded-full border-2 border-white/10 hover:border-[#89AACC] transition-colors text-white text-sm uppercase tracking-wider">
            View on Dribbble
          </button>
        </div>
      </div>

      {/* Parallax Columns */}
      <div className="absolute inset-0 z-20 pointer-events-none flex justify-center overflow-hidden">
        <div className="max-w-[1400px] w-full px-6 grid grid-cols-2 gap-12 md:gap-40 h-full relative">
          
          <div ref={leftColRef} className="flex flex-col gap-12 md:gap-32 pt-[50vh] pointer-events-auto">
            {images.slice(0, 3).map((img, i) => (
              <div key={`left-${i}`} className="w-full max-w-[320px] aspect-square mx-auto rounded-3xl overflow-hidden hover:scale-105 transition-transform duration-500 cursor-pointer">
                <img src={img} alt={`Exploration ${i}`} className="w-full h-full object-cover" />
              </div>
            ))}
          </div>

          <div ref={rightColRef} className="flex flex-col gap-12 md:gap-32 -mt-[50vh] pointer-events-auto">
            {images.slice(3, 6).map((img, i) => (
              <div key={`right-${i}`} className="w-full max-w-[320px] aspect-square mx-auto rounded-3xl overflow-hidden hover:scale-105 transition-transform duration-500 cursor-pointer">
                <img src={img} alt={`Exploration ${i+3}`} className="w-full h-full object-cover" />
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
};
