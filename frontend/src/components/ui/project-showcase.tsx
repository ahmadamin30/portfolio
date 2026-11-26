"use client"

import type React from "react"
import { useState, useRef, useEffect, useContext, useMemo } from "react"
import { ArrowUpRight } from "lucide-react"
import type { Project as SharedProject } from "@portfolio/shared"
import api from "@/services/api"
import {
  PublicPortfolioContext,
  type PortfolioLanguage,
} from "@/context/PublicPortfolioContext"

export interface Project {
  id?: string | number
  title: string
  description: string
  year?: string
  link: string
  image: string
}

const API_ORIGIN = (
  import.meta.env.VITE_API_URL || "http://localhost:5000/api"
).replace(/\/api\/?$/, "")

const FALLBACK_IMAGES = [
  "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&auto=format&fit=crop&q=80",
]

const defaultProjects: Project[] = [
  {
    id: "vecmenu",
    title: "VecMenu",
    description:
      "Live QR-based digital menu platform for restaurants with multi-language support and fast mobile browsing.",
    link: "https://vecmenu.com",
    image: FALLBACK_IMAGES[0],
  },
  {
    id: "advax-cms",
    title: "ADVAX Portfolio & CMS",
    description:
      "Personal portfolio and custom content management system with a dedicated REST API, trilingual support (EN, AR with RTL, TR), and smooth interactive visuals.",
    link: "#",
    image: FALLBACK_IMAGES[1],
  },
  {
    id: "car-rental",
    title: "Car Rental Web App",
    description:
      "A simple, clean car rental web application for browsing available vehicles, viewing details, and booking.",
    link: "#",
    image: FALLBACK_IMAGES[2],
  },
]

const isProjectPublished = (rawTags: unknown): boolean => {
  const tags: string[] = Array.isArray(rawTags)
    ? rawTags.map((item) => String(item).trim())
    : typeof rawTags === "string"
      ? rawTags.split(",").map((item) => item.trim())
      : []

  for (const tag of tags) {
    if (tag === "status:draft") return false
    if (tag === "status:published") return true
  }

  return true
}

const getLocalizedText = (
  project: SharedProject,
  field: "title" | "description",
  lang: PortfolioLanguage
): string => {
  if (field === "title") {
    const byLang =
      lang === "ar"
        ? project.titleAr
        : lang === "tr"
          ? project.titleTr
          : project.titleEn
    return (
      byLang?.trim() ||
      project.titleEn?.trim() ||
      project.titleAr?.trim() ||
      project.titleTr?.trim() ||
      project.title?.trim() ||
      ""
    )
  }

  const byLang =
    lang === "ar"
      ? project.descriptionAr
      : lang === "tr"
        ? project.descriptionTr
        : project.descriptionEn
  return (
    byLang?.trim() ||
    project.descriptionEn?.trim() ||
    project.descriptionAr?.trim() ||
    project.descriptionTr?.trim() ||
    project.description?.trim() ||
    ""
  )
}

const resolveImageUrl = (imageUrl: string | undefined, index: number): string => {
  if (!imageUrl || !imageUrl.trim()) {
    return FALLBACK_IMAGES[index % FALLBACK_IMAGES.length]
  }
  const trimmed = imageUrl.trim()
  if (trimmed.startsWith("/uploads/")) {
    return `${API_ORIGIN}${trimmed}`
  }
  return trimmed
}

export interface ProjectShowcaseProps {
  projects?: Project[]
  title?: string
}

export function ProjectShowcase({
  projects,
  title = "Selected Work",
}: ProjectShowcaseProps) {
  const portfolioContext = useContext(PublicPortfolioContext)
  const language: PortfolioLanguage = portfolioContext?.language ?? "en"
  const dir: "ltr" | "rtl" = portfolioContext?.dir ?? "ltr"
  const t = portfolioContext?.t

  const [apiProjects, setApiProjects] = useState<SharedProject[]>([])
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [smoothPosition, setSmoothPosition] = useState({ x: 0, y: 0 })
  const [isVisible, setIsVisible] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const animationRef = useRef<number | null>(null)

  useEffect(() => {
    if (projects) return
    let isMounted = true

    const fetchProjects = async () => {
      try {
        const res = await api.get<{ data?: SharedProject[] }>("/projects")
        if (isMounted && Array.isArray(res.data?.data)) {
          setApiProjects(res.data.data)
        }
      } catch {
        // Seamlessly fall back to localized 3-project list
      }
    }

    void fetchProjects()

    return () => {
      isMounted = false
    }
  }, [projects])

  const localizedDefaultProjects = useMemo<Project[]>(() => {
    if (!t) return defaultProjects
    return [
      {
        id: "vecmenu",
        title: t("projects.item1.title"),
        description: t("projects.item1.desc"),
        link: "https://vecmenu.com",
        image: FALLBACK_IMAGES[0],
      },
      {
        id: "advax-cms",
        title: t("projects.item2.title"),
        description: t("projects.item2.desc"),
        link: "#",
        image: FALLBACK_IMAGES[1],
      },
      {
        id: "car-rental",
        title: t("projects.item3.title"),
        description: t("projects.item3.desc"),
        link: "#",
        image: FALLBACK_IMAGES[2],
      },
    ]
  }, [t])

  const displayProjects = useMemo<Project[]>(() => {
    if (projects) return projects

    const published = apiProjects
      .filter((item) => isProjectPublished(item.tags))
      .sort((a, b) => a.orderIndex - b.orderIndex)

    if (published.length === 0) {
      return localizedDefaultProjects
    }

    return published.slice(0, 3).map((item, index) => ({
      id: item.id,
      title: getLocalizedText(item, "title", language),
      description: getLocalizedText(item, "description", language),
      link: item.liveUrl?.trim() || item.githubUrl?.trim() || "#",
      image: resolveImageUrl(item.imageUrl, index),
    }))
  }, [projects, apiProjects, localizedDefaultProjects, language])

  useEffect(() => {
    const lerp = (start: number, end: number, factor: number) => {
      return start + (end - start) * factor
    }

    const animate = () => {
      setSmoothPosition((prev) => ({
        x: lerp(prev.x, mousePosition.x, 0.15),
        y: lerp(prev.y, mousePosition.y, 0.15),
      }))
      animationRef.current = requestAnimationFrame(animate)
    }

    animationRef.current = requestAnimationFrame(animate)

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [mousePosition])

  const handleMouseMove = (e: React.MouseEvent) => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect()
      setMousePosition({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      })
    }
  }

  const handleMouseEnter = (index: number) => {
    setHoveredIndex(index)
    setIsVisible(true)
  }

  const handleMouseLeave = () => {
    setHoveredIndex(null)
    setIsVisible(false)
  }

  const previewOffsetX =
    dir === "rtl" && smoothPosition.x > 360
      ? smoothPosition.x - 340
      : smoothPosition.x + 20

  return (
    <section
      ref={containerRef}
      dir={dir}
      onMouseMove={handleMouseMove}
      className="relative w-full max-w-4xl mx-auto px-4 sm:px-6 py-20"
    >
      <h2 className="text-muted-foreground text-sm sm:text-base font-medium tracking-wide rtl:tracking-normal uppercase mb-10 text-start">
        {title}
      </h2>

      <div
        className="pointer-events-none fixed z-50 overflow-hidden rounded-xl shadow-2xl hidden md:block"
        style={{
          left: containerRef.current?.getBoundingClientRect().left ?? 0,
          top: containerRef.current?.getBoundingClientRect().top ?? 0,
          transform: `translate3d(${previewOffsetX}px, ${smoothPosition.y - 110}px, 0) scale(${isVisible ? 1 : 0.8})`,
          opacity: isVisible ? 1 : 0,
          transition:
            "opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1), transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        }}
      >
        <div className="relative w-[320px] h-[205px] bg-secondary rounded-xl overflow-hidden">
          {displayProjects.map((project, index) => (
            <img
              key={project.id ?? project.title}
              src={project.image || "/placeholder.svg"}
              alt={project.title}
              className="absolute inset-0 w-full h-full object-cover transition-all duration-500 ease-out"
              style={{
                opacity: hoveredIndex === index ? 1 : 0,
                transform: `scale(${hoveredIndex === index ? 1 : 1.1})`,
                filter: hoveredIndex === index ? "none" : "blur(10px)",
              }}
            />
          ))}
          {/* Subtle gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-background/20 to-transparent" />
        </div>
      </div>

      <div className="space-y-0">
        {displayProjects.map((project, index) => {
          const isExternal = /^https?:\/\//i.test(project.link)

          return (
            <a
              key={project.id ?? project.title}
              href={project.link}
              target={isExternal ? "_blank" : undefined}
              rel={isExternal ? "noopener noreferrer" : undefined}
              onClick={
                project.link === "#" ? (e) => e.preventDefault() : undefined
              }
              className="group block"
              onMouseEnter={() => handleMouseEnter(index)}
              onMouseLeave={handleMouseLeave}
            >
              <div className="relative py-7 sm:py-8 border-t border-border transition-all duration-300 ease-out">
                {/* Background highlight on hover */}
                <div
                  className={`
                    absolute inset-0 -mx-4 px-4 bg-secondary/50 rounded-lg
                    transition-all duration-300 ease-out
                    ${hoveredIndex === index ? "opacity-100 scale-100" : "opacity-0 scale-95"}
                  `}
                />

                <div className="relative flex items-start justify-between gap-6 text-start">
                  <div className="flex-1 min-w-0">
                    {/* Title with animated underline */}
                    <div className="inline-flex items-center gap-2.5">
                      <h3 className="text-foreground font-medium text-xl sm:text-2xl tracking-tight rtl:tracking-normal">
                        <span className="relative">
                          {project.title}
                          {/* Animated underline */}
                          <span
                            className={`
                              absolute start-0 -bottom-0.5 h-px bg-foreground
                              transition-all duration-300 ease-out
                              ${hoveredIndex === index ? "w-full" : "w-0"}
                            `}
                          />
                        </span>
                      </h3>

                      {/* Arrow that slides in */}
                      <ArrowUpRight
                        className={`
                          w-5 h-5 text-muted-foreground shrink-0 rtl:-scale-x-100
                          transition-all duration-300 ease-out
                          ${
                            hoveredIndex === index
                              ? "opacity-100 translate-x-0 translate-y-0"
                              : "opacity-0 -translate-x-2 rtl:translate-x-2 translate-y-2"
                          }
                        `}
                      />
                    </div>

                    {/* Description with fade effect */}
                    <p
                      className={`
                        text-muted-foreground text-base sm:text-[1.05rem] mt-2 leading-relaxed rtl:leading-[1.85] max-w-2xl
                        transition-all duration-300 ease-out
                        ${hoveredIndex === index ? "text-foreground/75" : "text-muted-foreground"}
                      `}
                    >
                      {project.description}
                    </p>
                  </div>
                </div>
              </div>
            </a>
          )
        })}

        {/* Bottom border for last item */}
        <div className="border-t border-border" />
      </div>
    </section>
  )
}

export default ProjectShowcase
