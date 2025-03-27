import Image from "next/image"
import { Github, Linkedin, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import ProjectCard from "@/components/project-card"
import SkillBadge from "@/components/skill-badge"
import ContactForm from "@/components/contact-form"
import { Badge } from "@/components/ui/badge"

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative">
        <div
          className="absolute inset-0 bg-gradient-to-r from-primary/10 to-primary/5 pointer-events-none"
          aria-hidden="true"
        />
        <div className="container px-4 py-24 md:py-32 mx-auto">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="space-y-6">
              <Badge className="px-3 py-1 text-sm bg-primary/10 text-primary border-primary/20 mb-4">
                Available for work
              </Badge>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
                Hi, I'm <span className="text-primary">Alex</span>
              </h1>
              <p className="text-xl text-muted-foreground">
                A passionate full-stack developer crafting beautiful and functional web experiences.
              </p>
              <div className="flex flex-wrap gap-3">
                <Button asChild>
                  <a href="#contact">Get in touch</a>
                </Button>
                <Button variant="outline" asChild>
                  <a href="#projects">View my work</a>
                </Button>
              </div>
              <div className="flex gap-4 pt-2">
                <a href="https://github.com" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
                  <Github className="h-6 w-6 text-muted-foreground hover:text-foreground transition-colors" />
                </a>
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                  <Linkedin className="h-6 w-6 text-muted-foreground hover:text-foreground transition-colors" />
                </a>
                <a href="mailto:hello@example.com" aria-label="Email">
                  <Mail className="h-6 w-6 text-muted-foreground hover:text-foreground transition-colors" />
                </a>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-square rounded-full overflow-hidden border-4 border-primary/20 shadow-xl max-w-md mx-auto">
                <Image
                  src="/placeholder.svg?height=400&width=400"
                  alt="Profile"
                  width={400}
                  height={400}
                  className="object-cover"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-muted/50">
        <div className="container px-4 mx-auto">
          <h2 className="text-3xl font-bold mb-12 text-center">About Me</h2>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <p className="text-lg">
                I'm a full-stack developer with over 5 years of experience building web applications. I specialize in
                React, Next.js, and Node.js, creating responsive and accessible websites that deliver exceptional user
                experiences.
              </p>
              <p className="text-lg">
                My approach combines technical expertise with creative problem-solving. I'm passionate about clean code,
                performance optimization, and staying current with emerging technologies.
              </p>
              <p className="text-lg">
                When I'm not coding, you can find me hiking, reading sci-fi novels, or experimenting with new cooking
                recipes.
              </p>
            </div>
            <div className="space-y-6">
              <h3 className="text-xl font-semibold">My Skills</h3>
              <div className="flex flex-wrap gap-2">
                <SkillBadge name="JavaScript" />
                <SkillBadge name="TypeScript" />
                <SkillBadge name="React" />
                <SkillBadge name="Next.js" />
                <SkillBadge name="Node.js" />
                <SkillBadge name="Express" />
                <SkillBadge name="MongoDB" />
                <SkillBadge name="PostgreSQL" />
                <SkillBadge name="Tailwind CSS" />
                <SkillBadge name="HTML5" />
                <SkillBadge name="CSS3" />
                <SkillBadge name="Git" />
                <SkillBadge name="AWS" />
                <SkillBadge name="Docker" />
                <SkillBadge name="GraphQL" />
                <SkillBadge name="Redux" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="py-20">
        <div className="container px-4 mx-auto">
          <h2 className="text-3xl font-bold mb-4 text-center">My Projects</h2>
          <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
            Here are some of my recent projects. Each one presented unique challenges and opportunities for growth.
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <ProjectCard
              title="E-commerce Platform"
              description="A full-featured online store with product management, cart functionality, and secure checkout."
              tags={["Next.js", "Stripe", "MongoDB"]}
              imageUrl="/placeholder.svg?height=300&width=500"
              demoUrl="#"
              repoUrl="#"
            />
            <ProjectCard
              title="Task Management App"
              description="A collaborative task manager with real-time updates, drag-and-drop interface, and team permissions."
              tags={["React", "Firebase", "Tailwind"]}
              imageUrl="/placeholder.svg?height=300&width=500"
              demoUrl="#"
              repoUrl="#"
            />
            <ProjectCard
              title="Portfolio Website"
              description="A responsive portfolio site showcasing projects and skills with a modern design."
              tags={["Next.js", "Framer Motion", "Tailwind"]}
              imageUrl="/placeholder.svg?height=300&width=500"
              demoUrl="#"
              repoUrl="#"
            />
            <ProjectCard
              title="Weather Dashboard"
              description="A weather application with location-based forecasts, interactive maps, and historical data."
              tags={["React", "OpenWeather API", "Chart.js"]}
              imageUrl="/placeholder.svg?height=300&width=500"
              demoUrl="#"
              repoUrl="#"
            />
            <ProjectCard
              title="Recipe Finder"
              description="A recipe search engine with filtering options, nutritional information, and saved favorites."
              tags={["JavaScript", "Spoonacular API", "CSS Grid"]}
              imageUrl="/placeholder.svg?height=300&width=500"
              demoUrl="#"
              repoUrl="#"
            />
            <ProjectCard
              title="Fitness Tracker"
              description="A workout tracking application with progress visualization, custom routines, and goal setting."
              tags={["React Native", "Node.js", "MongoDB"]}
              imageUrl="/placeholder.svg?height=300&width=500"
              demoUrl="#"
              repoUrl="#"
            />
          </div>
        </div>
      </section>

      {/* Experience Section */}
      <section id="experience" className="py-20 bg-muted/50">
        <div className="container px-4 mx-auto">
          <h2 className="text-3xl font-bold mb-12 text-center">Work Experience</h2>
          <div className="space-y-12 max-w-3xl mx-auto">
            <div className="relative pl-8 border-l border-primary/30">
              <div className="absolute w-4 h-4 bg-primary rounded-full -left-2 top-1"></div>
              <div className="mb-1">
                <span className="font-semibold text-lg">Senior Frontend Developer</span>
                <span className="text-muted-foreground"> • TechCorp Inc.</span>
              </div>
              <div className="text-sm text-muted-foreground mb-4">Jan 2021 - Present</div>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>Led the development of the company's flagship SaaS product, improving performance by 40%</li>
                <li>Mentored junior developers and established coding standards and best practices</li>
                <li>Implemented CI/CD pipelines, reducing deployment time by 60%</li>
                <li>Collaborated with design and product teams to create intuitive user interfaces</li>
              </ul>
            </div>

            <div className="relative pl-8 border-l border-primary/30">
              <div className="absolute w-4 h-4 bg-primary rounded-full -left-2 top-1"></div>
              <div className="mb-1">
                <span className="font-semibold text-lg">Frontend Developer</span>
                <span className="text-muted-foreground"> • WebSolutions Ltd.</span>
              </div>
              <div className="text-sm text-muted-foreground mb-4">Mar 2019 - Dec 2020</div>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>Developed responsive web applications using React and Redux</li>
                <li>Optimized website performance, achieving a 25% reduction in load time</li>
                <li>Integrated third-party APIs and services to enhance functionality</li>
                <li>Participated in code reviews and contributed to technical documentation</li>
              </ul>
            </div>

            <div className="relative pl-8 border-l border-primary/30">
              <div className="absolute w-4 h-4 bg-primary rounded-full -left-2 top-1"></div>
              <div className="mb-1">
                <span className="font-semibold text-lg">Junior Web Developer</span>
                <span className="text-muted-foreground"> • Digital Creations</span>
              </div>
              <div className="text-sm text-muted-foreground mb-4">Jun 2017 - Feb 2019</div>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>Built and maintained websites for various clients using HTML, CSS, and JavaScript</li>
                <li>Collaborated with designers to implement responsive layouts</li>
                <li>Assisted in troubleshooting and fixing bugs in existing websites</li>
                <li>Gained experience with version control systems and agile development methodologies</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20">
        <div className="container px-4 mx-auto">
          <h2 className="text-3xl font-bold mb-4 text-center">Get In Touch</h2>
          <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
            Have a project in mind or want to discuss potential opportunities? Feel free to reach out!
          </p>
          <div className="grid md:grid-cols-2 gap-12 items-start max-w-4xl mx-auto">
            <div className="space-y-6">
              <h3 className="text-xl font-semibold">Contact Information</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-primary" />
                  <a href="mailto:hello@example.com" className="hover:text-primary transition-colors">
                    hello@example.com
                  </a>
                </div>
                <div className="flex items-center gap-3">
                  <Linkedin className="h-5 w-5 text-primary" />
                  <a
                    href="https://linkedin.com/in/username"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-primary transition-colors"
                  >
                    linkedin.com/in/username
                  </a>
                </div>
                <div className="flex items-center gap-3">
                  <Github className="h-5 w-5 text-primary" />
                  <a
                    href="https://github.com/username"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-primary transition-colors"
                  >
                    github.com/username
                  </a>
                </div>
              </div>
              <div className="pt-6">
                <h3 className="text-xl font-semibold mb-4">Let's connect</h3>
                <p className="text-muted-foreground mb-4">
                  I'm always open to discussing new projects, creative ideas, or opportunities to be part of your
                  vision.
                </p>
              </div>
            </div>
            <ContactForm />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t">
        <div className="container px-4 mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-muted-foreground">© {new Date().getFullYear()} Alex Smith. All rights reserved.</div>
            <div className="flex gap-6">
              <a href="#about" className="text-muted-foreground hover:text-foreground transition-colors">
                About
              </a>
              <a href="#projects" className="text-muted-foreground hover:text-foreground transition-colors">
                Projects
              </a>
              <a href="#experience" className="text-muted-foreground hover:text-foreground transition-colors">
                Experience
              </a>
              <a href="#contact" className="text-muted-foreground hover:text-foreground transition-colors">
                Contact
              </a>
            </div>
            <div className="flex gap-4">
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
                <Github className="h-5 w-5 text-muted-foreground hover:text-foreground transition-colors" />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                <Linkedin className="h-5 w-5 text-muted-foreground hover:text-foreground transition-colors" />
              </a>
              <a href="mailto:hello@example.com" aria-label="Email">
                <Mail className="h-5 w-5 text-muted-foreground hover:text-foreground transition-colors" />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

