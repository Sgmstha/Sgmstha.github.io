export type Source = 'old-live' | 'local' | 'linkedin' | 'user-approved' | 'unverified';
export interface Candidate<T> { value: T; source: Source }
export interface Sourced<T> {
  value: T | null;
  source: Source;
  candidates?: Candidate<T>[];
  evidenceUrl?: string;
  approvalNote?: string;
  reviewFlag?: string;
}
export interface Skill { name: string; source: Source; proficiency: Sourced<number>; evidenceUrl?: string }
export interface Project {
  id: string; source: Source; name: Sourced<string>; description: Sourced<string>;
  category: Sourced<string>; techStack: Sourced<string[]>;
  sourceUrl: Sourced<string>; liveUrl: Sourced<string>;
  images: Sourced<{ url: string; alt: string } | { col1_1: string; col1_2: string; col2: string }>;
  client: Sourced<string>; features: Sourced<string[]>;
  summary?: Sourced<string>; status?: Sourced<string>;
}
export interface LocalExperience {
  role: string; company: string; employmentType: string; period: string;
  location?: string; skills: string[]; description: string;
}
export interface Experience {
  id: string; source: Source; role: Sourced<string>; company: Sourced<string>;
  description: Sourced<string>; period: Sourced<string>; details: Sourced<LocalExperience>;
  employmentType?: Sourced<string>; location?: Sourced<string>; skills?: Sourced<string[]>;
}
export interface Certification {
  id: string; source: Source; name: Sourced<string>; issuer: Sourced<string>;
  description: Sourced<string>; localWording?: Sourced<{ name: string; issuer: string }>;
  evidenceUrl?: string; evidenceKind?: 'linkedin-post';
  postedOn?: Sourced<string>; issuedOn?: Sourced<string>; credentialUrl?: Sourced<string>;
  organizer?: Sourced<string>; trainingPartner?: Sourced<string>;
}
export interface PortfolioContent {
  provenance: { oldRepository: string; oldCommit: string; oldPath: string; localPath: string; note: string; linkedin?: { profileUrl: string; experienceUrl: string; skillsUrl: string; accessedOn: string } };
  name: Sourced<string>; headline: Sourced<string>; tagline: Sourced<string>;
  summary: Sourced<string>; profileImage: Sourced<string>;
  contact: { source: Source; email: Sourced<string>; phone: Sourced<string>; location: Sourced<string>;
    social: { github: Sourced<string>; linkedin: Sourced<string> }; message: Sourced<string> };
  projects: Project[]; archivedProjects?: Project[];
  skills: { frontend: Skill[]; backend: Skill[]; miscellaneous: Skill[]; linkedin: Skill[] };
  experience: Experience[]; certifications: Certification[];
  resume: Sourced<string>; footer: Sourced<string>;
}

// Candidates are evidence for review, not approved values. Consumers use value only.
export const portfolioContent: PortfolioContent = {
  "provenance": {
    "oldRepository": "https://github.com/Sgmstha/Sgmstha.github.io",
    "oldCommit": "5f93b662d1dc3071506051783195a7ebdd87de3f",
    "oldPath": "index.html",
    "localPath": "src/portfolioData.json (removed; original retained in baseline 3602741)",
    "note": "old-live identifies wording found in the audited live source; it does not independently validate personal claims. Null means unresolved, never choose a candidate automatically.",
    "linkedin": {
      "profileUrl": "https://www.linkedin.com/in/sugam-shrestha-67682a29b/",
      "experienceUrl": "https://www.linkedin.com/in/sugam-shrestha-67682a29b/details/experience/",
      "skillsUrl": "https://www.linkedin.com/in/sugam-shrestha-67682a29b/details/skills/",
      "accessedOn": "2026-10-02"
    }
  },
  "name": {
    "value": "Sugam Shrestha",
    "source": "old-live"
  },
  "headline": {
    "value": "Full-Stack Developer",
    "source": "user-approved",
    "approvalNote": "User confirmed keeping this headline during content review."
  },
  "tagline": {
    "value": "I create responsive, user-friendly websites and applications with clean, efficient code.",
    "source": "old-live"
  },
  "summary": {
    "value": "I'm Sugam Shrestha, a full-stack developer building web and mobile applications with TypeScript, React, Next.js, and Flutter. I work across frontend and backend development to turn ideas into responsive, user-friendly applications.",
    "source": "user-approved",
    "approvalNote": "User authorized a professional rewrite and confirmed using TypeScript, React, Next.js, and Flutter. Updated to emphasize current work without inventing seniority or outcomes.",
    "candidates": [
      {
        "value": "I'm a passionate full-stack developer with a strong foundation in HTML, CSS, JavaScript, and Python. I enjoy creating responsive, user-friendly websites and applications that solve real-world problems.",
        "source": "old-live"
      },
      {
        "value": "A passionate full-stack developer with a strong foundation in HTML, CSS, JavaScript, and Python. Specializes in creating responsive, user-friendly websites and applications with clean, efficient code.",
        "source": "local"
      }
    ]
  },
  "profileImage": {
    "value": "https://sugam-shrestha.com.np/pfp.jpg",
    "source": "old-live"
  },
  "contact": {
    "source": "old-live",
    "email": {
      "value": "sugam.shrestha@gmail.com",
      "source": "user-approved",
      "approvalNote": "User confirmed keeping existing deployed-site contact details."
    },
    "phone": {
      "value": "+977 9847852643",
      "source": "user-approved",
      "approvalNote": "User confirmed keeping existing deployed-site contact details."
    },
    "location": {
      "value": "Nepal",
      "source": "user-approved",
      "approvalNote": "User confirmed keeping existing deployed-site contact details."
    },
    "social": {
      "github": {
        "value": null,
        "source": "unverified",
        "candidates": [
          {
            "value": "https://github.com/Sgmstha",
            "source": "old-live"
          },
          {
            "value": "https://github.com/Sugam-Shrestha",
            "source": "local"
          },
          {
            "value": "https://github.com/sugamshst",
            "source": "unverified"
          }
        ],
        "reviewFlag": "SOCIAL-URLS"
      },
      "linkedin": {
        "value": "https://www.linkedin.com/in/sugam-shrestha-67682a29b/",
        "source": "user-approved",
        "approvalNote": "User confirmed this profile and authorized retaining the supplied URL if shortening was unavailable.",
        "candidates": [
          {
            "value": "https://www.linkedin.com/in/sugam-shrestha-67682a29b/",
            "source": "old-live"
          },
          {
            "value": "https://www.linkedin.com/in/sugam-shrestha-0579b8214/",
            "source": "local"
          }
        ]
      }
    },
    "message": {
      "value": "Feel free to reach out to me for any inquiries, collaboration opportunities, or just to say hello. I'm always open to discussing new projects and ideas.",
      "source": "old-live"
    }
  },
  "projects": [
    {
      "id": "ai-coder-chatbot",
      "source": "user-approved",
      "name": {
        "value": "AI Coder Chatbot",
        "source": "user-approved"
      },
      "summary": {
        "value": "Conversational coding assistant for codebase exploration, refactoring, and patch generation.",
        "source": "user-approved"
      },
      "status": {
        "value": "In development · Side project",
        "source": "user-approved"
      },
      "description": {
        "value": "An AI-powered coding chatbot designed to streamline development workflows. It interfaces with LLMs to analyze codebases, explain architecture, generate contextual diffs and code patches, and answer repository-specific queries.",
        "source": "user-approved"
      },
      "category": {
        "value": "AI / Developer Tool",
        "source": "user-approved"
      },
      "techStack": {
        "value": [
          "Python",
          "TypeScript",
          "React",
          "Gemini API"
        ],
        "source": "user-approved"
      },
      "sourceUrl": {
        "value": null,
        "source": "unverified",
        "reviewFlag": "PROJECT-LINKS"
      },
      "liveUrl": {
        "value": null,
        "source": "unverified",
        "reviewFlag": "PROJECT-LINKS"
      },
      "images": {
        "value": {
          "url": "/projects/ai-coder-chatbot.webp",
          "alt": "AI Coder Chatbot interface showing chat, workspace, and model tiers."
        },
        "source": "user-approved"
      },
      "client": {
        "value": "Personal side project",
        "source": "user-approved"
      },
      "features": {
        "value": [
          "Codebase analysis & Q&A",
          "Code generation & diffs",
          "Multi-model tier selection",
          "Interactive chat workspace"
        ],
        "source": "user-approved"
      }
    },
    {
      "id": "smart-inventory-management",
      "source": "user-approved",
      "name": {
        "value": "Smart Inventory Management",
        "source": "user-approved"
      },
      "summary": {
        "value": "Predictive inventory tracking that forecasts restocking needs based on usage trends.",
        "source": "user-approved"
      },
      "status": {
        "value": "Personal Project",
        "source": "user-approved"
      },
      "description": {
        "value": "An intelligent inventory management system that tracks stock levels and analyzes historical consumption data. It automatically forecasts restocking timelines and calculates optimal reorder quantities based on current trends.",
        "source": "user-approved"
      },
      "category": {
        "value": "Full-Stack / Predictive",
        "source": "user-approved"
      },
      "techStack": {
        "value": [
          "Python",
          "React",
          "PostgreSQL",
          "Analytics"
        ],
        "source": "user-approved"
      },
      "sourceUrl": {
        "value": null,
        "source": "unverified",
        "reviewFlag": "PROJECT-LINKS"
      },
      "liveUrl": {
        "value": null,
        "source": "unverified",
        "reviewFlag": "PROJECT-LINKS"
      },
      "images": {
        "value": {
          "url": "/projects/smart-inventory.webp",
          "alt": "Smart Inventory Management System showing analytics, stock levels, and smart restock recommendations."
        },
        "source": "user-approved"
      },
      "client": {
        "value": "Personal project",
        "source": "user-approved"
      },
      "features": {
        "value": [
          "Automated restock calculation",
          "Trend-based demand forecasting",
          "Real-time stock monitoring",
          "Urgency-level restock alerts"
        ],
        "source": "user-approved"
      }
    },
    {
      "id": "subway-surfer-bot",
      "source": "user-approved",
      "name": {
        "value": "Subway Surfer Bot",
        "source": "user-approved"
      },
      "summary": {
        "value": "Autonomous game-playing agent using real-time YOLO object detection and screen capture.",
        "source": "user-approved"
      },
      "status": {
        "value": "Personal Project",
        "source": "user-approved"
      },
      "description": {
        "value": "An entry-level autonomous vision bot trained to play Subway Surfers. It captures screen frames in real time, identifies obstacles, trains, and coins using a custom YOLO model, and sends directional inputs to play autonomously.",
        "source": "user-approved"
      },
      "category": {
        "value": "Computer Vision / Automation",
        "source": "user-approved"
      },
      "techStack": {
        "value": [
          "Python",
          "YOLO",
          "OpenCV",
          "PyAutoGUI"
        ],
        "source": "user-approved"
      },
      "sourceUrl": {
        "value": null,
        "source": "unverified",
        "reviewFlag": "PROJECT-LINKS"
      },
      "liveUrl": {
        "value": null,
        "source": "unverified",
        "reviewFlag": "PROJECT-LINKS"
      },
      "images": {
        "value": {
          "url": "/projects/subway-surfer-bot.webp",
          "alt": "Subway Surfer Bot running real-time YOLO obstacle and coin detection on screen capture."
        },
        "source": "user-approved"
      },
      "client": {
        "value": "Personal project",
        "source": "user-approved"
      },
      "features": {
        "value": [
          "Real-time screen capture",
          "Custom YOLO model inference",
          "3-lane trajectory mapping",
          "Autonomous input execution"
        ],
        "source": "user-approved"
      }
    },
    {
      "id": "feline-feeding-calculator",
      "source": "user-approved",
      "name": {
        "value": "Feline Feeding Calculator",
        "source": "user-approved"
      },
      "summary": {
        "value": "Prey Model Raw (PMR) feeding calculator and custom recipe builder for cats.",
        "source": "user-approved"
      },
      "status": {
        "value": "Personal Project",
        "source": "user-approved"
      },
      "description": {
        "value": "A specialized calculator that computes exact daily raw food requirements and 80/10/10 nutritional breakdowns based on a cat's weight, age, and daily activity level, featuring an interactive recipe builder.",
        "source": "user-approved"
      },
      "category": {
        "value": "Web App / Nutrition",
        "source": "user-approved"
      },
      "techStack": {
        "value": [
          "JavaScript",
          "HTML5",
          "CSS3",
          "Tailwind CSS"
        ],
        "source": "user-approved"
      },
      "sourceUrl": {
        "value": null,
        "source": "unverified",
        "reviewFlag": "PROJECT-LINKS"
      },
      "liveUrl": {
        "value": null,
        "source": "unverified",
        "reviewFlag": "PROJECT-LINKS"
      },
      "images": {
        "value": {
          "url": "/projects/feline-feeding-calculator.webp",
          "alt": "Feline PMR Feeding Calculator and Recipe Builder interface."
        },
        "source": "user-approved"
      },
      "client": {
        "value": "Personal project",
        "source": "user-approved"
      },
      "features": {
        "value": [
          "PMR ratio calculation (80/10/5/5)",
          "Activity-level adjustments",
          "Custom recipe ingredient selector",
          "Imperial & metric support"
        ],
        "source": "user-approved"
      }
    }
  ],
  "skills": {
    "frontend": [
      {
        "name": "HTML5",
        "proficiency": {
          "value": 95,
          "source": "old-live"
        },
        "source": "old-live"
      },
      {
        "name": "CSS3",
        "proficiency": {
          "value": 90,
          "source": "old-live"
        },
        "source": "old-live"
      },
      {
        "name": "JavaScript",
        "proficiency": {
          "value": 85,
          "source": "old-live"
        },
        "source": "old-live"
      },
      {
        "name": "React",
        "proficiency": {
          "value": 80,
          "source": "old-live"
        },
        "source": "old-live"
      }
    ],
    "backend": [
      {
        "name": "Python",
        "proficiency": {
          "value": null,
          "source": "unverified",
          "candidates": [
            {
              "value": 85,
              "source": "old-live"
            },
            {
              "value": 90,
              "source": "local"
            }
          ],
          "reviewFlag": "SKILL-SCORES"
        },
        "source": "old-live"
      },
      {
        "name": "Node.js",
        "proficiency": {
          "value": 75,
          "source": "old-live"
        },
        "source": "old-live"
      },
      {
        "name": "MongoDB",
        "proficiency": {
          "value": 70,
          "source": "old-live"
        },
        "source": "old-live"
      },
      {
        "name": "SQL",
        "proficiency": {
          "value": null,
          "source": "unverified",
          "candidates": [
            {
              "value": 65,
              "source": "old-live"
            },
            {
              "value": 70,
              "source": "local"
            }
          ],
          "reviewFlag": "SKILL-SCORES"
        },
        "source": "old-live"
      }
    ],
    "miscellaneous": [
      {
        "name": "Git",
        "proficiency": {
          "value": null,
          "source": "unverified",
          "candidates": [
            {
              "value": 85,
              "source": "local"
            }
          ],
          "reviewFlag": "SKILL-PERCENTAGES"
        },
        "source": "old-live"
      },
      {
        "name": "RESTful APIs",
        "proficiency": {
          "value": null,
          "source": "unverified",
          "candidates": [
            {
              "value": 80,
              "source": "local"
            }
          ],
          "reviewFlag": "SKILL-PERCENTAGES"
        },
        "source": "old-live"
      },
      {
        "name": "Responsive Design",
        "proficiency": {
          "value": null,
          "source": "unverified",
          "candidates": [
            {
              "value": 95,
              "source": "local"
            }
          ],
          "reviewFlag": "SKILL-PERCENTAGES"
        },
        "source": "old-live"
      },
      {
        "name": "UI/UX Basics",
        "proficiency": {
          "value": null,
          "source": "unverified",
          "candidates": [
            {
              "value": 75,
              "source": "local"
            }
          ],
          "reviewFlag": "SKILL-PERCENTAGES"
        },
        "source": "old-live"
      },
      {
        "name": "Problem Solving",
        "proficiency": {
          "value": null,
          "source": "unverified",
          "candidates": [
            {
              "value": 90,
              "source": "local"
            }
          ],
          "reviewFlag": "SKILL-PERCENTAGES"
        },
        "source": "old-live"
      },
      {
        "name": "Team Collaboration",
        "proficiency": {
          "value": null,
          "source": "unverified",
          "candidates": [
            {
              "value": 90,
              "source": "local"
            }
          ],
          "reviewFlag": "SKILL-PERCENTAGES"
        },
        "source": "old-live"
      },
      {
        "name": "Agile Methodology",
        "proficiency": {
          "value": null,
          "source": "unverified",
          "candidates": [
            {
              "value": 80,
              "source": "local"
            }
          ],
          "reviewFlag": "SKILL-PERCENTAGES"
        },
        "source": "old-live"
      },
      {
        "name": "Testing",
        "proficiency": {
          "value": null,
          "source": "unverified",
          "candidates": [
            {
              "value": 70,
              "source": "local"
            }
          ],
          "reviewFlag": "SKILL-PERCENTAGES"
        },
        "source": "old-live"
      }
    ],
    "linkedin": [
      {
        "name": "Front-End Design",
        "source": "linkedin",
        "evidenceUrl": "https://www.linkedin.com/in/sugam-shrestha-67682a29b/details/skills/",
        "proficiency": {
          "value": null,
          "source": "unverified",
          "approvalNote": "User approved displaying skills without percentages."
        }
      },
      {
        "name": "Full-Stack Development",
        "source": "linkedin",
        "evidenceUrl": "https://www.linkedin.com/in/sugam-shrestha-67682a29b/details/skills/",
        "proficiency": {
          "value": null,
          "source": "unverified",
          "approvalNote": "User approved displaying skills without percentages."
        }
      },
      {
        "name": "Flutter",
        "source": "linkedin",
        "evidenceUrl": "https://www.linkedin.com/in/sugam-shrestha-67682a29b/details/skills/",
        "proficiency": {
          "value": null,
          "source": "unverified",
          "approvalNote": "User approved displaying skills without percentages."
        }
      },
      {
        "name": "Java",
        "source": "linkedin",
        "evidenceUrl": "https://www.linkedin.com/in/sugam-shrestha-67682a29b/details/skills/",
        "proficiency": {
          "value": null,
          "source": "unverified",
          "approvalNote": "User approved displaying skills without percentages."
        }
      },
      {
        "name": "Python (Programming Language)",
        "source": "linkedin",
        "evidenceUrl": "https://www.linkedin.com/in/sugam-shrestha-67682a29b/details/skills/",
        "proficiency": {
          "value": null,
          "source": "unverified",
          "approvalNote": "User approved displaying skills without percentages."
        }
      },
      {
        "name": "Front-End Development",
        "source": "linkedin",
        "evidenceUrl": "https://www.linkedin.com/in/sugam-shrestha-67682a29b/details/skills/",
        "proficiency": {
          "value": null,
          "source": "unverified",
          "approvalNote": "User approved displaying skills without percentages."
        }
      },
      {
        "name": "Responsive Web Design",
        "source": "linkedin",
        "evidenceUrl": "https://www.linkedin.com/in/sugam-shrestha-67682a29b/details/skills/",
        "proficiency": {
          "value": null,
          "source": "unverified",
          "approvalNote": "User approved displaying skills without percentages."
        }
      },
      {
        "name": "HTML5",
        "source": "linkedin",
        "evidenceUrl": "https://www.linkedin.com/in/sugam-shrestha-67682a29b/details/skills/",
        "proficiency": {
          "value": null,
          "source": "unverified",
          "approvalNote": "User approved displaying skills without percentages."
        }
      },
      {
        "name": "Web Development",
        "source": "linkedin",
        "evidenceUrl": "https://www.linkedin.com/in/sugam-shrestha-67682a29b/details/skills/",
        "proficiency": {
          "value": null,
          "source": "unverified",
          "approvalNote": "User approved displaying skills without percentages."
        }
      },
      {
        "name": "E-Commerce",
        "source": "linkedin",
        "evidenceUrl": "https://www.linkedin.com/in/sugam-shrestha-67682a29b/details/skills/",
        "proficiency": {
          "value": null,
          "source": "unverified",
          "approvalNote": "User approved displaying skills without percentages."
        }
      },
      {
        "name": "Figma (Software)",
        "source": "linkedin",
        "evidenceUrl": "https://www.linkedin.com/in/sugam-shrestha-67682a29b/details/skills/",
        "proficiency": {
          "value": null,
          "source": "unverified",
          "approvalNote": "User approved displaying skills without percentages."
        }
      },
      {
        "name": "Bootstrap (Framework)",
        "source": "linkedin",
        "evidenceUrl": "https://www.linkedin.com/in/sugam-shrestha-67682a29b/details/skills/",
        "proficiency": {
          "value": null,
          "source": "unverified",
          "approvalNote": "User approved displaying skills without percentages."
        }
      },
      {
        "name": "Web Pages",
        "source": "linkedin",
        "evidenceUrl": "https://www.linkedin.com/in/sugam-shrestha-67682a29b/details/skills/",
        "proficiency": {
          "value": null,
          "source": "unverified",
          "approvalNote": "User approved displaying skills without percentages."
        }
      },
      {
        "name": "HTML",
        "source": "linkedin",
        "evidenceUrl": "https://www.linkedin.com/in/sugam-shrestha-67682a29b/details/skills/",
        "proficiency": {
          "value": null,
          "source": "unverified",
          "approvalNote": "User approved displaying skills without percentages."
        }
      },
      {
        "name": "Cascading Style Sheets (CSS)",
        "source": "linkedin",
        "evidenceUrl": "https://www.linkedin.com/in/sugam-shrestha-67682a29b/details/skills/",
        "proficiency": {
          "value": null,
          "source": "unverified",
          "approvalNote": "User approved displaying skills without percentages."
        }
      },
      {
        "name": "JavaScript",
        "source": "linkedin",
        "evidenceUrl": "https://www.linkedin.com/in/sugam-shrestha-67682a29b/details/skills/",
        "proficiency": {
          "value": null,
          "source": "unverified",
          "approvalNote": "User approved displaying skills without percentages."
        }
      }
    ]
  },
  "experience": [
    {
      "id": "annapurnabyte",
      "source": "linkedin",
      "role": {
        "value": "Technology Intern",
        "source": "linkedin",
        "candidates": [
          {
            "value": "Technology Intern",
            "source": "local"
          }
        ],
        "evidenceUrl": "https://www.linkedin.com/in/sugam-shrestha-67682a29b/details/experience/"
      },
      "company": {
        "value": "AnnapurnaByte Innovations",
        "source": "linkedin",
        "candidates": [
          {
            "value": "AnnapurnaByte Innovations",
            "source": "local"
          }
        ],
        "evidenceUrl": "https://www.linkedin.com/in/sugam-shrestha-67682a29b/details/experience/"
      },
      "description": {
        "value": null,
        "source": "unverified",
        "candidates": [
          {
            "value": "Technology internship focused on Python and Flutter development.",
            "source": "local"
          }
        ],
        "reviewFlag": "ANNAPURNABYTE"
      },
      "period": {
        "value": "May 2026 - Present",
        "source": "linkedin",
        "candidates": [
          {
            "value": "May 2026 – Present",
            "source": "local"
          }
        ],
        "evidenceUrl": "https://www.linkedin.com/in/sugam-shrestha-67682a29b/details/experience/"
      },
      "details": {
        "value": null,
        "source": "unverified",
        "candidates": [
          {
            "value": {
              "role": "Technology Intern",
              "company": "AnnapurnaByte Innovations",
              "employmentType": "Internship",
              "period": "May 2026 – Present",
              "location": "Nepal · On-site",
              "skills": [
                "Python",
                "Flutter"
              ],
              "description": "Technology internship focused on Python and Flutter development."
            },
            "source": "local"
          }
        ],
        "reviewFlag": "ANNAPURNABYTE"
      },
      "employmentType": {
        "value": "Internship",
        "source": "linkedin",
        "evidenceUrl": "https://www.linkedin.com/in/sugam-shrestha-67682a29b/details/experience/"
      },
      "skills": {
        "value": [
          "Flutter",
          "Front-End Design",
          "Python (Programming Language)",
          "Full-Stack Development"
        ],
        "source": "linkedin",
        "evidenceUrl": "https://www.linkedin.com/in/sugam-shrestha-67682a29b/overlay/2941646802/skill-associations-details/?associationType=position"
      },
      "location": {
        "value": "Nepal · On-site",
        "source": "linkedin",
        "evidenceUrl": "https://www.linkedin.com/in/sugam-shrestha-67682a29b/details/experience/"
      }
    },
    {
      "id": "webniza",
      "source": "linkedin",
      "role": {
        "value": "Full stack Web Developer",
        "source": "linkedin",
        "candidates": [
          {
            "value": "Internship at Webniza",
            "source": "old-live"
          },
          {
            "value": "Full Stack Web Developer",
            "source": "local"
          }
        ],
        "evidenceUrl": "https://www.linkedin.com/in/sugam-shrestha-67682a29b/details/experience/"
      },
      "company": {
        "value": "webninza.com",
        "source": "linkedin",
        "candidates": [
          {
            "value": "Webniza",
            "source": "old-live"
          },
          {
            "value": "webninza.com",
            "source": "local"
          }
        ],
        "evidenceUrl": "https://www.linkedin.com/in/sugam-shrestha-67682a29b/details/experience/"
      },
      "description": {
        "value": null,
        "source": "unverified",
        "candidates": [
          {
            "value": "Completed a comprehensive internship at Webniza, where I gained hands-on experience in full-stack development, working with modern web technologies and best practices.",
            "source": "old-live"
          },
          {
            "value": "Completed a seven-month full-stack web development internship.",
            "source": "local"
          }
        ],
        "reviewFlag": "WEBNIZA-DETAILS"
      },
      "period": {
        "value": "Jun 2024 - Dec 2024",
        "source": "linkedin",
        "candidates": [
          {
            "value": "Jun 2024 – Dec 2024 · 7 mos",
            "source": "local"
          }
        ],
        "evidenceUrl": "https://www.linkedin.com/in/sugam-shrestha-67682a29b/details/experience/"
      },
      "details": {
        "value": null,
        "source": "unverified",
        "candidates": [
          {
            "value": {
              "role": "Full Stack Web Developer",
              "company": "webninza.com",
              "employmentType": "Internship",
              "period": "Jun 2024 – Dec 2024 · 7 mos",
              "skills": [
                "Responsive Web Design",
                "Java"
              ],
              "description": "Completed a seven-month full-stack web development internship."
            },
            "source": "local"
          }
        ],
        "reviewFlag": "WEBNIZA-DETAILS"
      },
      "employmentType": {
        "value": "Internship",
        "source": "linkedin",
        "evidenceUrl": "https://www.linkedin.com/in/sugam-shrestha-67682a29b/details/experience/"
      },
      "skills": {
        "value": [
          "Responsive Web Design",
          "Java",
          "Front-End Development",
          "HTML5"
        ],
        "source": "linkedin",
        "evidenceUrl": "https://www.linkedin.com/in/sugam-shrestha-67682a29b/overlay/2422139340/skill-associations-details/?associationType=position"
      },
      "location": {
        "value": null,
        "source": "unverified"
      }
    }
  ],
  "certifications": [
    {
      "id": "fullstack",
      "source": "old-live",
      "name": {
        "value": "Full-Stack Certificate",
        "source": "old-live"
      },
      "issuer": {
        "value": "Webniza",
        "source": "old-live"
      },
      "description": {
        "value": "Received a full-stack development certificate from Webniza, validating my skills in both frontend and backend technologies.",
        "source": "old-live"
      },
      "localWording": {
        "value": {
          "name": "Full-Stack Development Certificate",
          "issuer": "Webniza"
        },
        "source": "local"
      }
    },
    {
      "id": "python-training",
      "source": "linkedin",
      "name": {
        "value": "Software Development (Python)",
        "source": "linkedin",
        "evidenceUrl": "https://www.linkedin.com/feed/update/urn:li:activity:7232254285349089281/",
        "candidates": [
          {
            "value": "Python Training Certificate",
            "source": "old-live"
          }
        ]
      },
      "issuer": {
        "value": null,
        "source": "unverified",
        "candidates": [
          {
            "value": "Government of Nepal",
            "source": "local"
          }
        ],
        "reviewFlag": "CERTIFICATE-ISSUER"
      },
      "description": {
        "value": "Completed a one-month Software Development (Python) training under the Employment and Economic Enhancement for Prosperity of Kathmandu - Pride Project.",
        "source": "linkedin",
        "evidenceUrl": "https://www.linkedin.com/feed/update/urn:li:activity:7232254285349089281/",
        "candidates": [
          {
            "value": "Completed a one-month Python training program certified by the government, enhancing my programming skills and problem-solving abilities.",
            "source": "old-live"
          }
        ]
      },
      "localWording": {
        "value": {
          "name": "One-Month Python Training",
          "issuer": "Government of Nepal"
        },
        "source": "local"
      },
      "evidenceUrl": "https://www.linkedin.com/feed/update/urn:li:activity:7232254285349089281/",
      "evidenceKind": "linkedin-post",
      "organizer": {
        "value": "Kathmandu Metropolitan City",
        "source": "linkedin",
        "evidenceUrl": "https://www.linkedin.com/feed/update/urn:li:activity:7232254285349089281/"
      },
      "trainingPartner": {
        "value": "Xavier International College",
        "source": "linkedin",
        "evidenceUrl": "https://www.linkedin.com/feed/update/urn:li:activity:7232254285349089281/"
      },
      "postedOn": {
        "value": "Aug 22, 2024",
        "source": "linkedin",
        "evidenceUrl": "https://www.linkedin.com/feed/update/urn:li:activity:7232254285349089281/"
      },
      "issuedOn": {
        "value": null,
        "source": "unverified"
      },
      "credentialUrl": {
        "value": null,
        "source": "unverified"
      }
    },
    {
      "id": "web-development-beginners",
      "source": "linkedin",
      "name": {
        "value": "Web Development for Beginners",
        "source": "linkedin",
        "evidenceUrl": "https://www.linkedin.com/feed/update/urn:li:activity:7232081894429913088/"
      },
      "issuer": {
        "value": "Simplilearn SkillUp",
        "source": "linkedin",
        "evidenceUrl": "https://www.linkedin.com/feed/update/urn:li:activity:7232081894429913088/"
      },
      "description": {
        "value": "Completed the online course Web Development for Beginners.",
        "source": "linkedin",
        "evidenceUrl": "https://www.linkedin.com/feed/update/urn:li:activity:7232081894429913088/"
      },
      "evidenceUrl": "https://www.linkedin.com/feed/update/urn:li:activity:7232081894429913088/",
      "evidenceKind": "linkedin-post",
      "postedOn": {
        "value": "Aug 21, 2024",
        "source": "linkedin",
        "evidenceUrl": "https://www.linkedin.com/feed/update/urn:li:activity:7232081894429913088/"
      },
      "issuedOn": {
        "value": null,
        "source": "unverified"
      },
      "credentialUrl": {
        "value": null,
        "source": "unverified"
      }
    },
    {
      "id": "git-course",
      "source": "linkedin",
      "name": {
        "value": "GIT",
        "source": "linkedin",
        "evidenceUrl": "https://www.linkedin.com/feed/update/urn:li:activity:7231977272952451072/"
      },
      "issuer": {
        "value": "Simplilearn SkillUp",
        "source": "linkedin",
        "evidenceUrl": "https://www.linkedin.com/feed/update/urn:li:activity:7231977272952451072/"
      },
      "description": {
        "value": "Completed the online course GIT.",
        "source": "linkedin",
        "evidenceUrl": "https://www.linkedin.com/feed/update/urn:li:activity:7231977272952451072/"
      },
      "evidenceUrl": "https://www.linkedin.com/feed/update/urn:li:activity:7231977272952451072/",
      "evidenceKind": "linkedin-post",
      "postedOn": {
        "value": "Aug 21, 2024",
        "source": "linkedin",
        "evidenceUrl": "https://www.linkedin.com/feed/update/urn:li:activity:7231977272952451072/"
      },
      "issuedOn": {
        "value": null,
        "source": "unverified"
      },
      "credentialUrl": {
        "value": null,
        "source": "unverified"
      }
    }
  ],
  "resume": {
    "value": null,
    "source": "unverified",
    "candidates": [
      {
        "value": "#",
        "source": "old-live"
      }
    ],
    "reviewFlag": "RESUME",
    "approvalNote": "User will update resume later; omit resume action for now."
  },
  "footer": {
    "value": null,
    "source": "unverified",
    "candidates": [
      {
        "value": "© 2023 Sugam Shrestha. All Rights Reserved.",
        "source": "old-live"
      }
    ],
    "reviewFlag": "FOOTER-YEAR"
  },
  "archivedProjects": [
    {
      "id": "03",
      "source": "old-live",
      "name": {
        "value": "Blog Page",
        "source": "old-live"
      },
      "description": {
        "value": "A responsive blog page built with HTML and CSS, with structured post previews and author information designed for clear reading and straightforward navigation.",
        "source": "user-approved",
        "candidates": [
          {
            "value": "A clean and responsive blog page designed using HTML and CSS. It features a minimal layout with well-structured sections for blog posts, including titles, content previews, and author info. The design focuses on readability and user-friendly navigation.",
            "source": "old-live"
          },
          {
            "value": "A clean and responsive blog page designed using HTML and CSS. It focuses on readability with a minimal layout.",
            "source": "local"
          }
        ],
        "approvalNote": "User authorized rewriting existing project copy; no new features added. Technology conflicts remain unresolved separately."
      },
      "category": {
        "value": null,
        "source": "unverified",
        "reviewFlag": "PROJECT-TAGS",
        "candidates": [
          {
            "value": "fullstack",
            "source": "old-live"
          }
        ]
      },
      "techStack": {
        "value": [
          "HTML",
          "CSS"
        ],
        "source": "user-approved",
        "candidates": [
          {
            "value": [
              "React",
              "Node.js",
              "MongoDB"
            ],
            "source": "old-live"
          },
          {
            "value": [
              "HTML",
              "CSS"
            ],
            "source": "local"
          }
        ],
        "approvalNote": "User explicitly approved the local technology tags for Blog Page."
      },
      "sourceUrl": {
        "value": null,
        "source": "unverified",
        "candidates": [
          {
            "value": "https://github.com/Sgmstha",
            "source": "old-live"
          }
        ],
        "reviewFlag": "PROJECT-LINKS",
        "approvalNote": "User deferred project links; omit repository actions until exact URLs are supplied."
      },
      "liveUrl": {
        "value": null,
        "source": "unverified",
        "reviewFlag": "PROJECT-LINKS",
        "approvalNote": "User has no live project websites; omit live demo actions."
      },
      "images": {
        "value": null,
        "source": "unverified",
        "candidates": [
          {
            "value": {
              "url": "/placeholder.svg?height=300&width=500",
              "alt": "Task Management App"
            },
            "source": "old-live"
          },
          {
            "value": {
              "col1_1": "https://picsum.photos/seed/blog1/600/400",
              "col1_2": "https://picsum.photos/seed/blog2/600/600",
              "col2": "https://picsum.photos/seed/blog3/800/1000"
            },
            "source": "local"
          }
        ],
        "reviewFlag": "PROJECT-IMAGES",
        "approvalNote": "User will provide real screenshots later; omit placeholder images."
      },
      "client": {
        "value": null,
        "source": "unverified",
        "candidates": [
          {
            "value": "Personal Project",
            "source": "local"
          }
        ],
        "reviewFlag": "PROJECT-COPY"
      },
      "features": {
        "value": null,
        "source": "unverified",
        "candidates": [
          {
            "value": [
              "Responsive Design",
              "Minimal Layout"
            ],
            "source": "local"
          }
        ],
        "reviewFlag": "PROJECT-COPY"
      }
    },
    {
      "id": "01",
      "source": "old-live",
      "name": {
        "value": "E-commerce Website",
        "source": "old-live"
      },
      "description": {
        "value": "A responsive e-commerce website built with HTML, CSS, and JavaScript, featuring product filtering and shopping cart functionality.",
        "source": "user-approved",
        "candidates": [
          {
            "value": "A fully responsive e-commerce platform built with HTML, CSS, and JavaScript. Features include product filtering, cart functionality, and responsive design.",
            "source": "old-live"
          },
          {
            "value": "A fully responsive e-commerce platform built with HTML, CSS, and JavaScript. Includes product filtering and cart functionality.",
            "source": "local"
          }
        ],
        "approvalNote": "User authorized rewriting existing project copy; no new features added. Technology conflicts remain unresolved separately."
      },
      "category": {
        "value": "web",
        "source": "old-live"
      },
      "techStack": {
        "value": [
          "HTML",
          "CSS",
          "JavaScript"
        ],
        "source": "user-approved",
        "approvalNote": "User said to retain tags; existing old/local tags agree."
      },
      "sourceUrl": {
        "value": null,
        "source": "unverified",
        "candidates": [
          {
            "value": "https://github.com/Sgmstha",
            "source": "old-live"
          },
          {
            "value": "https://github.com/Sgmstha/Django2",
            "source": "unverified"
          }
        ],
        "reviewFlag": "PROJECT-LINKS",
        "approvalNote": "User deferred project links; omit repository actions until exact URLs are supplied."
      },
      "liveUrl": {
        "value": null,
        "source": "unverified",
        "reviewFlag": "PROJECT-LINKS",
        "approvalNote": "User has no live project websites; omit live demo actions."
      },
      "images": {
        "value": null,
        "source": "unverified",
        "candidates": [
          {
            "value": {
              "url": "/placeholder.svg?height=300&width=500",
              "alt": "E-commerce Website"
            },
            "source": "old-live"
          },
          {
            "value": {
              "col1_1": "https://picsum.photos/seed/ecom1/600/400",
              "col1_2": "https://picsum.photos/seed/ecom2/600/600",
              "col2": "https://picsum.photos/seed/ecom3/800/1000"
            },
            "source": "local"
          }
        ],
        "reviewFlag": "PROJECT-IMAGES",
        "approvalNote": "User will provide real screenshots later; omit placeholder images."
      },
      "client": {
        "value": null,
        "source": "unverified",
        "candidates": [
          {
            "value": "Personal Project",
            "source": "local"
          }
        ],
        "reviewFlag": "PROJECT-COPY"
      },
      "features": {
        "value": null,
        "source": "unverified",
        "candidates": [
          {
            "value": [
              "Product Filtering",
              "Shopping Cart"
            ],
            "source": "local"
          }
        ],
        "reviewFlag": "PROJECT-COPY"
      }
    },
    {
      "id": "02",
      "source": "old-live",
      "name": {
        "value": "Music App",
        "source": "old-live"
      },
      "description": {
        "value": "A web-based music application built with Next.js and JavaScript. It supports searching for YouTube tracks, streaming audio, and downloading music through a custom backend using ytdl-core.",
        "source": "user-approved",
        "candidates": [
          {
            "value": "A modern web-based music application built with Next.js and JavaScript. It allows users to search for YouTube tracks, stream audio, and download music seamlessly through a custom backend using ytdl-core. The app features a clean UI, responsive design, and real-time audio playback — optimized for both desktop and mobile users.",
            "source": "old-live"
          },
          {
            "value": "A modern web-based music application built with Next.js and JavaScript. It allows users to stream and download YouTube tracks.",
            "source": "local"
          }
        ],
        "approvalNote": "User authorized rewriting existing project copy; no new features added. Technology conflicts remain unresolved separately."
      },
      "category": {
        "value": null,
        "source": "unverified",
        "reviewFlag": "PROJECT-TAGS",
        "candidates": [
          {
            "value": "python",
            "source": "old-live"
          }
        ]
      },
      "techStack": {
        "value": [
          "Next.js",
          "JavaScript",
          "ytdl-core"
        ],
        "source": "user-approved",
        "candidates": [
          {
            "value": [
              "Python",
              "Pandas",
              "Matplotlib"
            ],
            "source": "old-live"
          },
          {
            "value": [
              "Next.js",
              "JavaScript",
              "ytdl-core"
            ],
            "source": "local"
          }
        ],
        "approvalNote": "User explicitly approved the local technology tags for Music App."
      },
      "sourceUrl": {
        "value": null,
        "source": "unverified",
        "candidates": [
          {
            "value": "https://github.com/Sgmstha",
            "source": "old-live"
          },
          {
            "value": "https://github.com/Sgmstha/Music_app",
            "source": "unverified"
          }
        ],
        "reviewFlag": "PROJECT-LINKS",
        "approvalNote": "User deferred project links; omit repository actions until exact URLs are supplied."
      },
      "liveUrl": {
        "value": null,
        "source": "unverified",
        "reviewFlag": "PROJECT-LINKS",
        "approvalNote": "User has no live project websites; omit live demo actions."
      },
      "images": {
        "value": null,
        "source": "unverified",
        "candidates": [
          {
            "value": {
              "url": "/placeholder.svg?height=300&width=500",
              "alt": "Data Analysis Tool"
            },
            "source": "old-live"
          },
          {
            "value": {
              "col1_1": "https://picsum.photos/seed/music1/600/400",
              "col1_2": "https://picsum.photos/seed/music2/600/600",
              "col2": "https://picsum.photos/seed/music3/800/1000"
            },
            "source": "local"
          }
        ],
        "reviewFlag": "PROJECT-IMAGES",
        "approvalNote": "User will provide real screenshots later; omit placeholder images."
      },
      "client": {
        "value": null,
        "source": "unverified",
        "candidates": [
          {
            "value": "Personal Project",
            "source": "local"
          }
        ],
        "reviewFlag": "PROJECT-COPY"
      },
      "features": {
        "value": null,
        "source": "unverified",
        "candidates": [
          {
            "value": [
              "Stream YouTube Tracks",
              "Download Tracks"
            ],
            "source": "local"
          }
        ],
        "reviewFlag": "PROJECT-COPY"
      }
    },
    {
      "id": "ai-companion",
      "source": "user-approved",
      "name": {
        "value": "AI Companion",
        "source": "user-approved"
      },
      "summary": {
        "value": "Local and online AI, connected to your project workspace.",
        "source": "user-approved"
      },
      "status": {
        "value": "In development · Side project",
        "source": "user-approved"
      },
      "description": {
        "value": "A standalone AI assistant that uses local or online models according to the task and selected mode. Its integrated workspace lets it work with project files, modify code, analyze a codebase, and provide feedback. Voice input offers a conversational way to interact. I’m developing it as a personal side project in my spare time.",
        "source": "user-approved"
      },
      "category": {
        "value": "AI / Standalone app",
        "source": "user-approved"
      },
      "techStack": {
        "value": null,
        "source": "unverified",
        "reviewFlag": "AI-COMPANION"
      },
      "sourceUrl": {
        "value": null,
        "source": "unverified",
        "reviewFlag": "AI-COMPANION"
      },
      "liveUrl": {
        "value": null,
        "source": "unverified",
        "reviewFlag": "AI-COMPANION"
      },
      "images": {
        "value": {
          "url": "/projects/ai-companion.png",
          "alt": "AI Companion interface showing AI Chat, a connected workspace, model modes, and Voice Mode."
        },
        "source": "user-approved",
        "approvalNote": "Original screenshot supplied by the user on 2026-10-02; copied without alteration."
      },
      "client": {
        "value": "Personal side project",
        "source": "user-approved"
      },
      "features": {
        "value": [
          "Local + online models",
          "Workspace code changes",
          "Project analysis & feedback",
          "Voice input"
        ],
        "source": "user-approved"
      }
    },
    {
      "id": "04",
      "source": "old-live",
      "name": {
        "value": "Portfolio Website",
        "source": "old-live"
      },
      "description": {
        "value": "A portfolio website built with HTML, CSS, and JavaScript to present projects and skills through a responsive layout and smooth animations.",
        "source": "user-approved",
        "candidates": [
          {
            "value": "A responsive portfolio website built with HTML, CSS, and JavaScript. Features smooth animations and a clean, professional design.",
            "source": "old-live"
          },
          {
            "value": "A responsive portfolio website built with HTML, CSS, and JavaScript. It features smooth animations and a clean design.",
            "source": "local"
          }
        ],
        "approvalNote": "User authorized rewriting existing project copy; no new features added. Technology conflicts remain unresolved separately."
      },
      "category": {
        "value": "web",
        "source": "old-live"
      },
      "techStack": {
        "value": [
          "HTML",
          "CSS",
          "JavaScript"
        ],
        "source": "user-approved",
        "approvalNote": "User said to retain tags; existing old/local tags agree."
      },
      "sourceUrl": {
        "value": null,
        "source": "unverified",
        "candidates": [
          {
            "value": "https://github.com/Sgmstha",
            "source": "old-live"
          }
        ],
        "reviewFlag": "PROJECT-LINKS",
        "approvalNote": "User deferred project links; omit repository actions until exact URLs are supplied."
      },
      "liveUrl": {
        "value": null,
        "source": "unverified",
        "reviewFlag": "PROJECT-LINKS",
        "approvalNote": "User has no live project websites; omit live demo actions."
      },
      "images": {
        "value": null,
        "source": "unverified",
        "candidates": [
          {
            "value": {
              "url": "/placeholder.svg?height=300&width=500",
              "alt": "Portfolio Website"
            },
            "source": "old-live"
          },
          {
            "value": {
              "col1_1": "https://picsum.photos/seed/port1/600/400",
              "col1_2": "https://picsum.photos/seed/port2/600/600",
              "col2": "https://picsum.photos/seed/port3/800/1000"
            },
            "source": "local"
          }
        ],
        "reviewFlag": "PROJECT-IMAGES",
        "approvalNote": "User will provide real screenshots later; omit placeholder images."
      },
      "client": {
        "value": null,
        "source": "unverified",
        "candidates": [
          {
            "value": "Personal Project",
            "source": "local"
          }
        ],
        "reviewFlag": "PROJECT-COPY"
      },
      "features": {
        "value": null,
        "source": "unverified",
        "candidates": [
          {
            "value": [
              "Smooth Animations",
              "Clean UI"
            ],
            "source": "local"
          }
        ],
        "reviewFlag": "PROJECT-COPY"
      }
    }
  ]
};
