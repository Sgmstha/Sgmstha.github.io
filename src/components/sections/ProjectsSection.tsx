import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { FadeIn } from '../ui/FadeIn';
import { LiveProjectButton } from '../ui/LiveProjectButton';
import portfolioData from '../../portfolioData.json';

const projects = portfolioData.projects;

const ProjectCard = ({ project, index, totalCards }: { project: any, index: number, totalCards: number }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ['start start', 'end start']
  });

  const targetScale = 1 - (totalCards - 1 - index) * 0.03;
  const scale = useTransform(scrollYProgress, [0, 1], [1, targetScale]);

  return (
    <div ref={cardRef} className="h-[85vh] w-full flex justify-center items-start sticky top-24 md:top-32" style={{ marginTop: `${index * 28}px` }}>
      <motion.div 
        style={{ scale }}
        className="w-full max-w-6xl rounded-[40px] sm:rounded-[50px] md:rounded-[60px] border-2 border-[#D7E2EA] bg-[#0C0C0C] p-4 sm:p-6 md:p-8 flex flex-col gap-4 sm:gap-6 md:gap-8 origin-top shadow-2xl"
      >
        {/* Top row */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-4 md:gap-8">
            <span className="text-[#D7E2EA] font-black text-[clamp(2.5rem,8vw,100px)] leading-none">{project.id}</span>
            <div className="flex flex-col">
              <span className="text-[#D7E2EA]/60 uppercase tracking-widest text-xs sm:text-sm">{project.client}</span>
              <h3 className="text-[#D7E2EA] font-medium uppercase text-xl sm:text-2xl md:text-3xl">{project.name}</h3>
            </div>
          </div>
          <LiveProjectButton />
        </div>

        {/* Bottom row */}
        <div className="flex gap-4 sm:gap-6 md:gap-8 flex-grow overflow-hidden h-[clamp(350px,50vw,700px)]">
          {/* Left col */}
          <div className="w-[40%] flex flex-col gap-4 sm:gap-6 md:gap-8">
            <img src={project.images.col1_1} alt="Project detail 1" className="w-full h-[clamp(130px,16vw,230px)] object-cover rounded-[30px] sm:rounded-[40px] md:rounded-[50px]" />
            <img src={project.images.col1_2} alt="Project detail 2" className="w-full h-[clamp(160px,22vw,340px)] object-cover rounded-[30px] sm:rounded-[40px] md:rounded-[50px] flex-grow" />
          </div>
          {/* Right col */}
          <div className="w-[60%] h-full">
            <img src={project.images.col2} alt="Project main detail" className="w-full h-full object-cover rounded-[30px] sm:rounded-[40px] md:rounded-[50px]" />
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export const ProjectsSection = () => {
  return (
    <section id="projects" className="bg-[#0C0C0C] rounded-t-[40px] sm:rounded-t-[50px] md:rounded-t-[60px] -mt-10 sm:-mt-12 md:-mt-14 relative z-20 px-5 sm:px-8 md:px-10 py-20 sm:py-24 md:py-32">
      <FadeIn y={40}>
        <h2 className="hero-heading font-black uppercase text-center mb-16 sm:mb-20 md:mb-28 text-[clamp(3rem,12vw,160px)] leading-none tracking-tight">
          Project
        </h2>
      </FadeIn>

      <div className="relative w-full max-w-6xl mx-auto pb-[15vh]">
        {projects.map((project, index) => (
          <ProjectCard key={project.id} project={project} index={index} totalCards={projects.length} />
        ))}
      </div>
    </section>
  );
};
