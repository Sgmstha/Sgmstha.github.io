import type { AvatarState } from '../components/scene/avatarState';

export interface AvatarAction {
  label: string;
  targetSection: string; // e.g. 'projects', 'contact'
}

export interface AvatarMessage {
  id: string;
  text: string;
  state: AvatarState;
  tags?: string[];
  actions?: AvatarAction[];
}

export type MessageGroup =
  | 'welcome'
  | 'welcomeBack'
  | 'hero'
  | 'about'
  | 'projects'
  | 'experience'
  | 'skills'
  | 'contact'
  | 'idle'
  | 'wakeUp'
  | 'scrollFast'
  | 'lateNight'
  | 'morning'
  | 'goodbye'
  | 'click'
  | 'dizzy'
  | 'exploreClick'
  | 'labSwitch';

/**
 * Message Bank for the Portfolio Mascot Avatar Companion.
 * All lines are under 90 characters, friendly, slightly witty, and easily editable.
 */
export const AVATAR_MESSAGES: Record<MessageGroup, AvatarMessage[]> = {
  // First visit greeting
  welcome: [
    {
      id: 'welc-1',
      text: "Hey there! I'm your tour guide. Feel free to explore!",
      state: 'excited',
      tags: ['greeting', 'warm'],
      actions: [{ label: 'See my work', targetSection: 'projects' }],
    },
    {
      id: 'welc-2',
      text: "Welcome! I keep an eye on things while Sugam writes the code.",
      state: 'happy',
      tags: ['intro', 'witty'],
    },
    {
      id: 'welc-3',
      text: "Glad you stopped by! Take your time looking around.",
      state: 'curious',
      tags: ['warm'],
      actions: [{ label: 'Explore projects', targetSection: 'projects' }],
    },
    {
      id: 'welc-4',
      text: "Fresh visitor detected! Enjoy the interactive ride.",
      state: 'excited',
      tags: ['playful'],
    },
    {
      id: 'welc-5',
      text: "Hi! Scroll down to see full-stack builds and experiments.",
      state: 'curious',
      tags: ['guide'],
      actions: [{ label: 'Start tour', targetSection: 'about' }],
    },
  ],

  // Returning visitor greeting
  welcomeBack: [
    {
      id: 'ret-1',
      text: "Welcome back! Good to see you again.",
      state: 'happy',
      tags: ['returning'],
      actions: [{ label: 'See updates', targetSection: 'projects' }],
    },
    {
      id: 'ret-2',
      text: "Hey, you returned! Did you miss my little eye blinks?",
      state: 'excited',
      tags: ['playful'],
    },
    {
      id: 'ret-3',
      text: "Back for another round? Let's check out what's new.",
      state: 'curious',
      tags: ['friendly'],
      actions: [{ label: 'Browse work', targetSection: 'projects' }],
    },
    {
      id: 'ret-4',
      text: "Nice to have you back! Need to get in touch?",
      state: 'happy',
      tags: ['direct'],
      actions: [{ label: 'Contact', targetSection: 'contact' }],
    },
  ],

  // Hero / Home section
  hero: [
    {
      id: 'hero-1',
      text: "That 3D sculpture in the back? Drag your mouse to inspect it!",
      state: 'curious',
      tags: ['interaction', '3d'],
    },
    {
      id: 'hero-2',
      text: "Sugam builds clean web apps, computer vision, and AI tools.",
      state: 'thinking',
      tags: ['intro'],
      actions: [{ label: 'See projects', targetSection: 'projects' }],
    },
    {
      id: 'hero-3',
      text: "Full-stack code crafted with precision in Nepal.",
      state: 'happy',
      tags: ['origin'],
    },
    {
      id: 'hero-4',
      text: "Ready to dive in? Scroll down whenever you're ready.",
      state: 'idle',
      tags: ['navigation'],
      actions: [{ label: 'About Sugam', targetSection: 'about' }],
    },
    {
      id: 'hero-5',
      text: "Psst, you can tap me anytime if you want a quick hello!",
      state: 'excited',
      tags: ['easter-egg'],
    },
  ],

  // About section
  about: [
    {
      id: 'abt-1',
      text: "Curious mind, methodical problem solver, and coffee-fueled coder.",
      state: 'thinking',
      tags: ['bio'],
    },
    {
      id: 'abt-2',
      text: "From frontend elegance to robust backend logic, it all connects.",
      state: 'curious',
      tags: ['stack'],
    },
    {
      id: 'abt-3',
      text: "Notice the attention to detail? Clean code is non-negotiable.",
      state: 'happy',
      tags: ['craft'],
    },
    {
      id: 'abt-4',
      text: "Always learning new patterns and breaking down complex problems.",
      state: 'thinking',
      tags: ['growth'],
    },
    {
      id: 'abt-5',
      text: "Want to see the actual builds? The projects are right below!",
      state: 'excited',
      tags: ['nudge'],
      actions: [{ label: 'View work', targetSection: 'projects' }],
    },
  ],

  // Work / Projects section
  projects: [
    {
      id: 'proj-1',
      text: "Hover over any project card to inspect the details and tech!",
      state: 'curious',
      tags: ['interaction'],
    },
    {
      id: 'proj-2',
      text: "From AI agents to real-time YOLO bots, every build has a story.",
      state: 'excited',
      tags: ['overview'],
    },
    {
      id: 'proj-3',
      text: "Click 'View preview' on screenshots for a crisp full-res look.",
      state: 'thinking',
      tags: ['tip'],
    },
    {
      id: 'proj-4',
      text: "Tested, refined, and built to solve actual real-world tasks.",
      state: 'happy',
      tags: ['quality'],
    },
    {
      id: 'proj-5',
      text: "Got an ambitious project idea? We should team up!",
      state: 'excited',
      tags: ['cta'],
      actions: [{ label: "Let's talk", targetSection: 'contact' }],
    },
  ],

  // Journey / Experience section
  experience: [
    {
      id: 'exp-1',
      text: "Every milestone here added a new layer of problem-solving grit.",
      state: 'thinking',
      tags: ['growth'],
    },
    {
      id: 'exp-2',
      text: "Expanding skills through verified certifications and real projects.",
      state: 'happy',
      tags: ['credentials'],
    },
    {
      id: 'exp-3',
      text: "Hands-on experience beats theory every single day of the week.",
      state: 'curious',
      tags: ['mindset'],
    },
    {
      id: 'exp-4',
      text: "Click any certificate entry to view details and credentials.",
      state: 'curious',
      tags: ['tip'],
    },
  ],

  // Toolkit / Skills section
  skills: [
    {
      id: 'skl-1',
      text: "TypeScript, Python, React, and databases—the core arsenal.",
      state: 'thinking',
      tags: ['stack'],
    },
    {
      id: 'skl-2',
      text: "No fluff percentages here—just verified hands-on capabilities.",
      state: 'curious',
      tags: ['truth'],
    },
    {
      id: 'skl-3',
      text: "Good tools are great, but knowing how to architect them is key.",
      state: 'thinking',
      tags: ['architecture'],
    },
    {
      id: 'skl-4',
      text: "Always tinkering with modern frameworks and performance tuning.",
      state: 'happy',
      tags: ['learning'],
    },
  ],

  // Contact section
  contact: [
    {
      id: 'cnt-1',
      text: "Don't be shy! Send an email or connect on LinkedIn below.",
      state: 'happy',
      tags: ['cta'],
      actions: [{ label: 'Send email', targetSection: 'contact' }],
    },
    {
      id: 'cnt-2',
      text: "Looking for a dedicated developer? The inbox is wide open!",
      state: 'excited',
      tags: ['collab'],
    },
    {
      id: 'cnt-3',
      text: "Click 'Copy Email' for quick clipboard access. Seamless!",
      state: 'curious',
      tags: ['convenience'],
    },
    {
      id: 'cnt-4',
      text: "Thanks for dropping by! Hope you enjoyed the journey.",
      state: 'happy',
      tags: ['gratitude'],
    },
  ],

  // Idle (user stopped moving for 15s)
  idle: [
    {
      id: 'idl-1',
      text: "Still here? I'm keeping watch while you ponder.",
      state: 'thinking',
      tags: ['idle'],
    },
    {
      id: 'idl-2',
      text: "*Quietly stretches* ...Take your time, no rush at all.",
      state: 'idle',
      tags: ['idle'],
    },
    {
      id: 'idl-3',
      text: "Admiring the typography? Space Mono is pretty slick.",
      state: 'curious',
      tags: ['idle'],
    },
    {
      id: 'idl-4',
      text: "If you leave me hanging for too long, I might take a nap...",
      state: 'thinking',
      tags: ['idle'],
    },
  ],

  // Waking up from sleeping state
  wakeUp: [
    {
      id: 'wake-1',
      text: "Oh, you're back! *blinks eyes awake*",
      state: 'curious',
      tags: ['wake'],
    },
    {
      id: 'wake-2',
      text: "Yaaawn... welcome back! Ready when you are.",
      state: 'happy',
      tags: ['wake'],
    },
    {
      id: 'wake-3',
      text: "Caught me dozing off! Where were we?",
      state: 'excited',
      tags: ['wake'],
    },
  ],

  // Fast scrolling
  scrollFast: [
    {
      id: 'scrl-1',
      text: "Whoa, speedy scroller! Don't miss the good stuff!",
      state: 'excited',
      tags: ['scroll'],
    },
    {
      id: 'scrl-2',
      text: "Zooooom! My little eyes can barely keep up with you!",
      state: 'curious',
      tags: ['playful'],
    },
    {
      id: 'scrl-3',
      text: "Turbomode activated! Feel free to brake and take a look.",
      state: 'excited',
      tags: ['fast'],
    },
    {
      id: 'scrl-4',
      text: "Speedrunning the portfolio? Let's see your final score!",
      state: 'happy',
      tags: ['humor'],
    },
  ],

  // Late night (after 10pm in Asia/Kathmandu)
  lateNight: [
    {
      id: 'nit-1',
      text: "Burning the midnight oil? Night owls build the best code.",
      state: 'thinking',
      tags: ['night'],
    },
    {
      id: 'nit-2',
      text: "Late night vibes! The dark mode feels extra cozy right now.",
      state: 'happy',
      tags: ['night'],
    },
    {
      id: 'nit-3',
      text: "Past 10 PM in Kathmandu! Thanks for spending time here.",
      state: 'curious',
      tags: ['timezone'],
    },
    {
      id: 'nit-4',
      text: "Coding after dark hits different. Hope you're resting soon!",
      state: 'idle',
      tags: ['care'],
    },
  ],

  // Morning (before 10am in Asia/Kathmandu)
  morning: [
    {
      id: 'mor-1',
      text: "Good morning! Fresh day, fresh code ideas.",
      state: 'happy',
      tags: ['morning'],
    },
    {
      id: 'mor-2',
      text: "Early bird! Grab some coffee and enjoy the projects.",
      state: 'excited',
      tags: ['morning'],
    },
    {
      id: 'mor-3',
      text: "Morning in Kathmandu! Starting the day with clean UI.",
      state: 'curious',
      tags: ['morning'],
    },
  ],

  // Goodbye (mouse leaves window towards top)
  goodbye: [
    {
      id: 'bye-1',
      text: "Heading out? Thanks for stopping by Sugam's portfolio!",
      state: 'happy',
      tags: ['farewell'],
      actions: [{ label: 'Say hi before leaving', targetSection: 'contact' }],
    },
    {
      id: 'bye-2',
      text: "Don't be a stranger! Drop a line whenever you like.",
      state: 'curious',
      tags: ['farewell'],
    },
    {
      id: 'bye-3',
      text: "Leaving so soon? Bookmark this page for later!",
      state: 'thinking',
      tags: ['farewell'],
    },
    {
      id: 'bye-4',
      text: "Safe travels across the web! Come back anytime.",
      state: 'happy',
      tags: ['farewell'],
    },
  ],

  // Click / tap reactions
  click: [
    {
      id: 'clk-1',
      text: "Boop! ✨",
      state: 'happy',
      tags: ['click'],
    },
    {
      id: 'clk-2',
      text: "Hey, that tickles!",
      state: 'excited',
      tags: ['click'],
    },
    {
      id: 'clk-3',
      text: "Hehe! What's up?",
      state: 'happy',
      tags: ['click'],
    },
    {
      id: 'clk-4',
      text: "Poke! I'm squishy.",
      state: 'curious',
      tags: ['click'],
    },
    {
      id: 'clk-5',
      text: "Aha! You found the tap reaction.",
      state: 'excited',
      tags: ['click'],
    },
  ],

  // Dizzy state after rapid clicks
  dizzy: [
    {
      id: 'diz-1',
      text: "Whoa... the room is spinning! @~@",
      state: 'dizzy',
      tags: ['dizzy'],
    },
    {
      id: 'diz-2',
      text: "Too... many... clicks... @@",
      state: 'dizzy',
      tags: ['dizzy'],
    },
    {
      id: 'diz-3',
      text: "Dizzy dizzy! Need a second to regain balance!",
      state: 'dizzy',
      tags: ['dizzy'],
    },
  ],

  // "Explore selected work" button click
  exploreClick: [
    {
      id: 'exp-1',
      text: "Buckle up! Diving into the project gallery!",
      state: 'excited',
      tags: ['explore'],
    },
    {
      id: 'exp-2',
      text: "Great choice! Let's check out the featured builds.",
      state: 'happy',
      tags: ['explore'],
    },
    {
      id: 'exp-3',
      text: "Off to the lab work! Enjoy the interactive cards.",
      state: 'curious',
      tags: ['explore'],
    },
  ],

  // Procedural geometry lab mode switch
  labSwitch: [
    {
      id: 'lab-1',
      text: "Ooh, procedural geometry shift!",
      state: 'thinking',
      tags: ['lab'],
    },
    {
      id: 'lab-2',
      text: "Twisting dimensions in real time!",
      state: 'curious',
      tags: ['lab'],
    },
    {
      id: 'lab-3',
      text: "Nice shape! WebGL math in action.",
      state: 'excited',
      tags: ['lab'],
    },
  ],
};

/**
 * Dedicated project-specific lines when hovering on a project card > 1s.
 */
export const PROJECT_MESSAGES: Record<string, AvatarMessage[]> = {
  'ai-coder-chatbot': [
    {
      id: 'prj-ai-1',
      text: "AI Coder Chatbot: inspects codebases and writes diffs!",
      state: 'excited',
      tags: ['ai'],
    },
    {
      id: 'prj-ai-2',
      text: "Built with Gemini API & Python. A coder's smart companion.",
      state: 'thinking',
      tags: ['ai'],
    },
  ],
  'smart-inventory-management': [
    {
      id: 'prj-inv-1',
      text: "Predictive inventory: calculates restocks before you run out!",
      state: 'excited',
      tags: ['fullstack'],
    },
    {
      id: 'prj-inv-2',
      text: "Real-time trends, PostgreSQL, and smart consumption alerts.",
      state: 'happy',
      tags: ['analytics'],
    },
  ],
  'subway-surfer-bot': [
    {
      id: 'prj-sub-1',
      text: "YOLO computer vision dodging trains in real time! Super fun.",
      state: 'excited',
      tags: ['vision'],
    },
    {
      id: 'prj-sub-2',
      text: "Autonomous screen capture and instant lane-switch execution.",
      state: 'curious',
      tags: ['vision'],
    },
  ],
  'feline-feeding-calculator': [
    {
      id: 'prj-fel-1',
      text: "Raw PMR feline nutrition calculator: precise recipes for cats!",
      state: 'happy',
      tags: ['webapp'],
    },
    {
      id: 'prj-fel-2',
      text: "Portion calculations down to the exact gram. Healthy pets!",
      state: 'excited',
      tags: ['webapp'],
    },
  ],
};
