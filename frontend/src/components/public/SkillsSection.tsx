import React from 'react';
import { Cpu, Sparkles, Layers, Database, Server, Terminal } from 'lucide-react';
import { usePublicPortfolio } from '../../context/PublicPortfolioContext';
import ScrollRevealSection from './ScrollRevealSection';
import { LogoLoop, LogoItem } from '../ui/LogoLoop';
import {
  SiReact,
  SiNextdotjs,
  SiTypescript,
  SiJavascript,
  SiTailwindcss,
  SiNodedotjs,
  SiExpress,
  SiNestjs,
  SiPostgresql,
  SiMysql,
  SiMongodb,
  SiRedis,
  SiDocker,
  SiGit,
  SiGithub,
  SiLinux,
  SiPython,
  SiGraphql,
  SiPrisma,
  SiFigma
} from 'react-icons/si';

const frontendLogos: LogoItem[] = [
  { node: <SiReact />, title: 'React 19', href: 'https://react.dev', hoverColor: '#61dafb' },
  { node: <SiNextdotjs />, title: 'Next.js', href: 'https://nextjs.org', hoverColor: '#ffffff' },
  { node: <SiTypescript />, title: 'TypeScript', href: 'https://www.typescriptlang.org', hoverColor: '#3178c6' },
  { node: <SiTailwindcss />, title: 'Tailwind CSS', href: 'https://tailwindcss.com', hoverColor: '#38bdf8' },
  { node: <SiJavascript />, title: 'JavaScript (ESNext)', href: 'https://developer.mozilla.org', hoverColor: '#f7df1e' },
  { node: <SiGraphql />, title: 'GraphQL', href: 'https://graphql.org', hoverColor: '#e10098' },
  { node: <SiPrisma />, title: 'Prisma ORM', href: 'https://www.prisma.io', hoverColor: '#5a67d8' },
  { node: <SiFigma />, title: 'Figma UI/UX', href: 'https://figma.com', hoverColor: '#f24e1e' },
];

const backendLogos: LogoItem[] = [
  { node: <SiNodedotjs />, title: 'Node.js', href: 'https://nodejs.org', hoverColor: '#68a063' },
  { node: <SiExpress />, title: 'Express.js', href: 'https://expressjs.com', hoverColor: '#ffffff' },
  { node: <SiNestjs />, title: 'NestJS', href: 'https://nestjs.com', hoverColor: '#e0234e' },
  { node: <SiPostgresql />, title: 'PostgreSQL', href: 'https://www.postgresql.org', hoverColor: '#336791' },
  { node: <SiMysql />, title: 'MySQL', href: 'https://www.mysql.com', hoverColor: '#4479a1' },
  { node: <SiRedis />, title: 'Redis Cache', href: 'https://redis.io', hoverColor: '#dc382d' },
  { node: <SiMongodb />, title: 'MongoDB', href: 'https://www.mongodb.com', hoverColor: '#47a248' },
  { node: <SiDocker />, title: 'Docker', href: 'https://www.docker.com', hoverColor: '#2496ed' },
  { node: <SiGit />, title: 'Git Versioning', href: 'https://git-scm.com', hoverColor: '#f05032' },
  { node: <SiGithub />, title: 'GitHub Actions', href: 'https://github.com', hoverColor: '#ffffff' },
  { node: <SiLinux />, title: 'Linux Environments', href: 'https://kernel.org', hoverColor: '#fcc624' },
  { node: <SiPython />, title: 'Python', href: 'https://python.org', hoverColor: '#3776ab' },
];

const skillCategories = [
  {
    icon: <Layers className="w-4 h-4 text-cyan-400" />,
    badge: 'FRONTEND ARCHITECTURE',
    title: 'Client-Side Engineering',
    description: 'Declarative, reactive interfaces crafted for speed, accessibility, and high visual fidelity.',
    tags: ['React 19', 'Next.js 15', 'TypeScript', 'Tailwind CSS', 'Framer Motion', 'State Management']
  },
  {
    icon: <Server className="w-4 h-4 text-emerald-400" />,
    badge: 'BACKEND SERVICES',
    title: 'Distributed Systems & APIs',
    description: 'Resilient microservices, RESTful and GraphQL endpoints with strict validation and caching.',
    tags: ['Node.js', 'Express', 'NestJS', 'REST & GraphQL', 'WebSockets', 'JWT & OAuth2']
  },
  {
    icon: <Database className="w-4 h-4 text-amber-400" />,
    badge: 'DATA & STORAGE',
    title: 'Databases & ORM',
    description: 'Structured relational data models, indexed document stores, and in-memory key-value caching.',
    tags: ['PostgreSQL', 'MySQL', 'Prisma ORM', 'Redis', 'MongoDB', 'Query Optimization']
  },
  {
    icon: <Cpu className="w-4 h-4 text-purple-400" />,
    badge: 'DEVOPS & PLATFORM',
    title: 'Containerization & CI/CD',
    description: 'Automated delivery pipelines, container orchestration, and reproducible Unix server setups.',
    tags: ['Docker', 'Linux Administration', 'Git CI/CD', 'Nginx Reverse Proxy', 'System Monitoring']
  }
];

export const SkillsSection: React.FC = () => {
  const { t } = usePublicPortfolio();

  return (
    <ScrollRevealSection id="skills" className="py-20 px-4 sm:px-8 max-w-6xl mx-auto w-full">
      <div className="p-8 sm:p-12 rounded-3xl bg-zinc-900/40 border border-zinc-800/70 backdrop-blur-xl relative overflow-hidden group hover:border-zinc-700/80 transition-all duration-300">
        {/* Ambient Top Glow */}
        <div className="absolute top-0 left-1/4 right-1/4 h-px bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent pointer-events-none" />

        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            <span className="p-2.5 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.15)]">
              <Terminal className="w-5 h-5" />
            </span>
            <div>
              <span className="text-[11px] font-mono text-cyan-400 uppercase tracking-widest block">
                03 // TECHNICAL ARSENAL
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                {t('nav.skills')}
              </h2>
            </div>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-800/60 border border-zinc-700/50 text-[11px] font-mono text-zinc-400 self-start sm:self-auto">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>PRODUCTION VERIFIED • 20+ TECHNOLOGIES</span>
          </div>
        </div>

        {/* Narrative Description */}
        <p className="text-zinc-400 text-sm sm:text-base leading-relaxed max-w-3xl mb-10">
          A modern, battle-tested engineering stack tuned for high throughput, sub-second latency,
          and seamless developer experience across both frontend ecosystems and scalable cloud microservices.
        </p>

        {/* Interactive Logo Loops Container */}
        <div className="space-y-4 py-4 px-2 sm:px-6 rounded-2xl bg-zinc-950/60 border border-zinc-800/80 relative overflow-hidden mb-12">
          {/* Subtle loop backdrop accent */}
          <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-80 h-28 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

          {/* Track 1: Client & Modern Frameworks */}
          <div className="py-2">
            <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider mb-2 px-3 flex items-center gap-2">
              <Sparkles className="w-3 h-3 text-cyan-400" />
              <span>FRONTEND &amp; UI SYSTEMS (SCROLL &amp; DRAG INTERACTIVE)</span>
            </div>
            <LogoLoop
              logos={frontendLogos}
              speed={70}
              direction="left"
              logoHeight={34}
              gap={48}
              hoverSpeed={0}
              scaleOnHover
              labels="hover"
              draggable
              fadeOut
              fadeOutWidth={0.14}
              ariaLabel="Frontend technologies"
            />
          </div>

          <div className="h-px bg-zinc-800/50 w-full" />

          {/* Track 2: Backend, Cloud & Infra */}
          <div className="py-2">
            <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider mb-2 px-3 flex items-center gap-2">
              <Cpu className="w-3 h-3 text-emerald-400" />
              <span>BACKEND, STORAGE &amp; INFRASTRUCTURE</span>
            </div>
            <LogoLoop
              logos={backendLogos}
              speed={60}
              direction="right"
              logoHeight={34}
              gap={48}
              hoverSpeed={0}
              scaleOnHover
              labels="hover"
              draggable
              fadeOut
              fadeOutWidth={0.14}
              ariaLabel="Backend and DevOps technologies"
            />
          </div>
        </div>

        {/* Categorized Capability Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {skillCategories.map((cat, index) => (
            <div
              key={index}
              className="p-5 rounded-2xl bg-zinc-950/40 border border-zinc-800/60 hover:border-zinc-700/80 transition-colors"
            >
              <div className="flex items-center gap-2.5 mb-2.5">
                <span className="p-1.5 rounded-lg bg-zinc-800/60 border border-zinc-700/50">
                  {cat.icon}
                </span>
                <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider">
                  {cat.badge}
                </span>
              </div>
              <h3 className="text-base font-bold text-white mb-1.5">{cat.title}</h3>
              <p className="text-xs text-zinc-400 leading-relaxed mb-4">{cat.description}</p>
              <div className="flex flex-wrap gap-1.5">
                {cat.tags.map((tag, tagIdx) => (
                  <span
                    key={tagIdx}
                    className="px-2.5 py-1 rounded-md bg-zinc-900 border border-zinc-800 text-[11px] font-mono text-zinc-300 hover:text-white hover:border-zinc-700 transition-colors"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </ScrollRevealSection>
  );
};

export default SkillsSection;
