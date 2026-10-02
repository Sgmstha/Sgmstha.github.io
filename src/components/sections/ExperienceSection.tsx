import { FadeIn } from '../ui/FadeIn';
import portfolioData from '../../portfolioData.json';

export const ExperienceSection = () => {
  return (
    <section id="experience" className="bg-[#0C0C0C] py-20 sm:py-24 md:py-32">
      <div className="px-5 sm:px-8 md:px-10">
        <FadeIn y={40}>
          <h2 className="hero-heading font-black uppercase text-center mb-16 sm:mb-20 md:mb-28 text-[clamp(3rem,12vw,160px)] leading-none tracking-tight">
            Experience
          </h2>
        </FadeIn>
        <div className="relative w-full max-w-6xl mx-auto">
          {portfolioData.experience.map((exp, index) => (
            <div key={index} className="mb-8">
              <h3 className="text-2xl font-bold text-white">{exp.role}</h3>
              <p className="text-lg text-gray-400">{exp.company}</p>
            </div>
          ))}
          {portfolioData.certifications.map((cert, index) => (
            <div key={index} className="mb-8">
              <h3 className="text-2xl font-bold text-white">{cert.name}</h3>
              <p className="text-lg text-gray-400">{cert.issuer}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
