import { FadeIn } from '../ui/FadeIn';

export const Navbar = () => {
  return (
    <FadeIn delay={0} y={-20} className="w-full">
      <nav className="flex justify-between w-full px-6 md:px-10 pt-6 md:pt-8 text-[#D7E2EA] font-medium uppercase tracking-wider text-sm md:text-lg lg:text-[1.4rem]">
        {['About', 'Price', 'Projects', 'Contact'].map((item) => (
          <a key={item} href={`#${item.toLowerCase()}`} className="hover:opacity-70 transition-opacity duration-200">
            {item}
          </a>
        ))}
      </nav>
    </FadeIn>
  );
};
