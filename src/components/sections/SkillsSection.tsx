import { FadeIn } from '../ui/FadeIn';
import portfolioData from '../../portfolioData.json';

const SkillCategory = ({ title, skills }) => (
  <div className="mb-12">
    <h3 className="text-3xl font-bold text-white mb-6">{title}</h3>
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
      {skills.map((skill, index) => (
        <div key={index} className="bg-[#1F1F1F] p-4 rounded-lg text-center">
          <p className="text-white text-lg">{skill.name}</p>
          <p className="text-gray-400">{skill.proficiency}%</p>
        </div>
      ))}
    </div>
  </div>
);

export const SkillsSection = () => {
  return (
    <section id="skills" className="bg-[#0C0C0C] py-20 sm:py-24 md:py-32">
      <div className="px-5 sm:px-8 md:px-10">
        <FadeIn y={40}>
          <h2 className="hero-heading font-black uppercase text-center mb-16 sm:mb-20 md:mb-28 text-[clamp(3rem,12vw,160px)] leading-none tracking-tight">
            Skills
          </h2>
        </FadeIn>
        <div className="relative w-full max-w-6xl mx-auto">
          <SkillCategory title="Frontend" skills={portfolioData.skills.frontend} />
          <SkillCategory title="Backend" skills={portfolioData.skills.backend} />
          <SkillCategory title="Miscellaneous" skills={portfolioData.skills.miscellaneous} />
        </div>
      </div>
    </section>
  );
};
