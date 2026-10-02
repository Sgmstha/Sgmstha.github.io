import { FadeIn } from '../ui/FadeIn';
import portfolioData from '../../portfolioData.json';

export const ContactSection = () => {
  const { email, phone, location, social } = portfolioData.contact;

  return (
    <section id="contact" className="bg-[#0C0C0C] py-20 sm:py-24 md:py-32">
      <div className="px-5 sm:px-8 md:px-10">
        <FadeIn y={40}>
          <h2 className="hero-heading font-black uppercase text-center mb-16 sm:mb-20 md:mb-28 text-[clamp(3rem,12vw,160px)] leading-none tracking-tight">
            Contact
          </h2>
        </FadeIn>
        <div className="relative w-full max-w-6xl mx-auto text-center text-white">
          <p className="text-lg mb-4">Email: <a href={`mailto:${email}`} className="text-blue-400 hover:underline">{email}</a></p>
          <p className="text-lg mb-4">Phone: {phone}</p>
          <p className="text-lg mb-8">Location: {location}</p>
          <div className="flex justify-center gap-8">
            <a href={social.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline text-lg">LinkedIn</a>
            <a href={social.github} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline text-lg">GitHub</a>
          </div>
        </div>
      </div>
    </section>
  );
};
