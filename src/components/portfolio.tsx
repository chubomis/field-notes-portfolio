import { Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { assets, projectOrder, projects, titleCrops, type ProjectId } from "@/lib/portfolio-assets";

const clamp = (value: number) => Math.max(0, Math.min(1, value));

function useReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);
  return reduced;
}

function ProjectTitle({ project }: { project: ProjectId }) {
  const { title, label } = projects[project];
  return (
    <span className={`project-art project-art--${project}`}>
      {title ? (
        <img src={title} alt={label} draggable={false} />
      ) : assets.titleReference ? (
        <svg viewBox={titleCrops[project]} role="img" aria-label={label}>
          <image href={assets.titleReference} width="702" height="693" />
        </svg>
      ) : (
        <span className="title-fallback">{label}</span>
      )}
    </span>
  );
}

function Masthead() {
  return assets.masthead ? (
    <img src={assets.masthead} alt="Kiran’s Digital Fieldnotes" draggable={false} />
  ) : (
    <span>Kiran’s Digital Fieldnotes</span>
  );
}

export function HomePage() {
  return (
    <main className="home-page" id="main-content">
      <img className="home-background" src={assets.background} alt="" aria-hidden="true" />
      <div className="home-canvas">
        <h1 className="home-masthead">
          <Masthead />
        </h1>
        <figure className="social-photo social-photo--model">
          <img
            src={assets.siteModel}
            alt="Testing an architectural site model together in the studio"
          />
          <figcaption>
            Testing
            <br />
            on the site
            <br />
            model
          </figcaption>
        </figure>
        <figure className="social-photo social-photo--site">
          <img src={assets.siteVisit} alt="A winter site visit to Carraig Ridge" />
          <figcaption>
            Site visit
            <br />
            Carraig Ridge
          </figcaption>
        </figure>
        <figure className="social-photo social-photo--corbusier">
          <img src={assets.corbusierVisit} alt="Kiran visiting Le Corbusier’s architecture" />
          <figcaption>
            Visiting
            <br />
            Le Corbusier
          </figcaption>
        </figure>
        <nav className="home-projects" aria-label="Projects and Resume">
          {projectOrder.map((project) => (
            <Link className="home-project-link" key={project} to="/$project" params={{ project }}>
              <ProjectTitle project={project} />
            </Link>
          ))}
        </nav>
      </div>
    </main>
  );
}

function PageNavigation({ project }: { project: ProjectId }) {
  return (
    <header className="page-navigation">
      <a className="skip-link" href="#project-content">
        Skip to project
      </a>
      <Link to="/" className="home-link" aria-label="Back to Kiran’s Fieldnotes">
        <span aria-hidden="true">←</span> Fieldnotes
      </Link>
      <nav aria-label="Project navigation">
        {projectOrder.map((id) => (
          <Link
            key={id}
            to="/$project"
            params={{ project: id }}
            aria-current={project === id ? "page" : undefined}
          >
            {projects[id].label}
          </Link>
        ))}
      </nav>
    </header>
  );
}

function PageProgress() {
  const barRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const distance = document.documentElement.scrollHeight - window.innerHeight;
      const progress = distance > 0 ? clamp(window.scrollY / distance) : 0;
      barRef.current?.style.setProperty("--page-progress", String(progress));
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    const observer = new ResizeObserver(schedule);
    observer.observe(document.body);
    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      cancelAnimationFrame(frame);
    };
  }, []);
  return (
    <div ref={barRef} className="page-progress" aria-hidden="true">
      <span />
    </div>
  );
}

export function ProjectPage({ project }: { project: ProjectId }) {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [project]);
  return (
    <div className={`project-page project-page--${project}`}>
      <PageNavigation project={project} />
      <PageProgress />
      <main id="project-content">
        <header
          className={`project-heading ${project === "tokyo" ? "project-heading--tokyo" : ""}`}
        >
          <div>
            <p className="eyebrow">
              {projects[project].number} / {project === "resume" ? "About" : "Selected project"}
            </p>
            <h1>
              <ProjectTitle project={project} />
            </h1>
          </div>
          {project === "tokyo" && (
            <p className="tokyo-introduction">
              A non-profit fashion flagship in Harajuku that removes consumerism from the
              traditional flagship model, replacing retail with exhibition, making, performance, and
              community.
            </p>
          )}
        </header>
        {project === "chunky-forms" && <ChunkyForms />}
        {project === "museum-of-scale" && <MuseumOfScale />}
        {project === "tokyo" && <Tokyo />}
        {project === "resume" && <Resume />}
      </main>
      <footer className="project-footer">
        <Link to="/">← Back to Fieldnotes</Link>
        <span>Kiran’s Digital Fieldnotes</span>
      </footer>
    </div>
  );
}

function ArtFigure({
  src,
  alt,
  caption,
  className = "",
}: {
  src: string | undefined;
  alt: string;
  caption?: string;
  className?: string;
}) {
  if (!src) return null;
  return (
    <figure className={`art-figure ${className}`}>
      <img src={src} alt={alt} loading="lazy" decoding="async" draggable={false} />
      {caption && <figcaption>{caption}</figcaption>}
    </figure>
  );
}

function TextureLoop() {
  const [paused, setPaused] = useState(false);
  const reduced = useReducedMotion();
  if (!assets.textures) return null;
  return (
    <figure className="texture-loop" data-paused={paused} data-reduced={reduced}>
      <div
        className="texture-window"
        tabIndex={0}
        role="region"
        aria-label="Six columns of material studies; four visible at a time"
      >
        <div className="texture-track">
          {[0, 1].map((copy) => (
            <div className="texture-copy" key={copy} aria-hidden={copy === 1}>
              <img
                src={assets.textures}
                alt={
                  copy === 0
                    ? "Twelve material and form studies for Chunky Forms in six columns"
                    : ""
                }
                draggable={false}
                width="1921"
                height="411"
              />
            </div>
          ))}
        </div>
      </div>
      <figcaption className="figure-toolbar">
        <span>Process / Material language</span>
        {!reduced && (
          <button type="button" onClick={() => setPaused(!paused)} aria-pressed={paused}>
            {paused ? "Play" : "Pause"} motion
          </button>
        )}
      </figcaption>
    </figure>
  );
}

function PaperProcess() {
  const storyRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const paperRef = useRef<HTMLImageElement>(null);
  const drawingRef = useRef<HTMLImageElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const story = storyRef.current;
    const stage = stageRef.current;
    const paper = paperRef.current;
    const drawing = drawingRef.current;
    if (!story || !stage || !paper || !drawing) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      const rect = story.getBoundingClientRect();
      const travel = rect.height - stage.clientHeight;
      const progress = reduced ? 1 : clamp(-rect.top / Math.max(1, travel));
      story.style.setProperty("--paper-open", `${12 + progress * 88}%`);
      // Measure the actual paper and drawing after sizing them. This keeps
      // each stage behind the paper edge at every screen size.
      const paperRect = paper.getBoundingClientRect();
      const drawingRect = drawing.getBoundingClientRect();
      // The supplied paper graphic has its roller in the bottom quarter.
      // Reveal only once the flat sheet, above that roller, reaches a stage.
      const sheetBottom = paperRect.top + paperRect.height * 0.75;
      const available = sheetBottom - drawingRect.top;
      const stages = reduced
        ? 7
        : Math.floor(clamp(available / Math.max(1, drawingRect.height)) * 7);
      story.style.setProperty("--drawing-hidden", `${100 - (stages / 7) * 100}%`);
      story.querySelectorAll(".stage-index li").forEach((item, index) => {
        item.setAttribute("data-visible", String(index < stages));
      });
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    const observer = new ResizeObserver(schedule);
    observer.observe(stage);
    observer.observe(drawing);
    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    drawing.addEventListener("load", schedule);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      drawing.removeEventListener("load", schedule);
    };
  }, [reduced]);

  return (
    <section ref={storyRef} className="process-story" aria-label="Chunky Forms drawing progression">
      <div ref={stageRef} className="process-sticky">
        <p className="process-label eyebrow">Process / Form progression</p>
        <div className="paper-stage">
          <img
            ref={paperRef}
            className="paper-image"
            src={assets.paper}
            alt=""
            aria-hidden="true"
            draggable={false}
          />
          <img
            ref={drawingRef}
            className="process-drawing"
            src={assets.axo}
            alt="Seven stages of the Chunky Forms axonometric drawing"
            width="1180"
            height="2028"
            draggable={false}
          />
        </div>
        <ol className="stage-index" aria-hidden="true">
          {Array.from({ length: 7 }, (_, i) => (
            <li key={i}>0{i + 1}</li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function ChunkyForms() {
  return (
    <>
      <div className="chunky-intro content-width">
        <TextureLoop />
        <ArtFigure
          src={assets.blurb}
          alt="Continuous radial geometry choreographs movement, perception, artistic exchange and spatial experience."
          className="chunky-blurb"
        />
      </div>
      <PaperProcess />
      <section className="supporting-studies content-width" aria-label="Supporting project studies">
        <div className="study-heading">
          <p className="eyebrow">Studies / Operations</p>
          <h2>
            Geometry as a<br />
            way of moving.
          </h2>
        </div>
        <ArtFigure
          src={assets.projections}
          alt="Projection and extrusion line diagram"
          caption="Projection"
          className="study-projections visual-hover"
        />
        <ArtFigure
          src={assets.method}
          alt="Checkerboard method study"
          caption="Method"
          className="study-method visual-hover"
        />
        <ArtFigure
          src={assets.iterations}
          alt="Form iteration drawings"
          caption="Iterations"
          className="study-iterations visual-hover"
        />
      </section>
      <section className="final-outcome content-width" aria-labelledby="final-heading">
        <div>
          <p className="eyebrow">Final outcome</p>
          <h2 id="final-heading">
            Spatial
            <br />
            experience
          </h2>
        </div>
        <ArtFigure
          src={assets.chunkyRender}
          alt="Chunky Forms interior with a blue structural grid and pink sculpture"
          caption="Chunky Forms"
          className="visual-hover"
        />
      </section>
    </>
  );
}

type Slide = { src: string | undefined; label: string };

function DrawingSlideshow({
  slides,
  interval = 3200,
  className = "",
  label,
}: {
  slides: Slide[];
  interval?: number;
  className?: string;
  label: string;
}) {
  const usable = slides.filter((slide): slide is { src: string; label: string } =>
    Boolean(slide.src),
  );
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [visible, setVisible] = useState(false);
  const figureRef = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const count = usable.length;
  const active = count ? index % count : 0;
  useEffect(() => {
    if (!figureRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => setVisible(Boolean(entry?.isIntersecting)),
      { threshold: 0.15 },
    );
    observer.observe(figureRef.current);
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    if (!playing || reduced || !visible || count < 2) return;
    const timer = window.setInterval(() => {
      if (!document.hidden) setIndex((previous) => (previous + 1) % count);
    }, interval);
    return () => window.clearInterval(timer);
  }, [playing, reduced, visible, count, interval]);
  if (!count) return null;
  const step = (direction: number) => {
    setPlaying(false);
    setIndex((previous) => (previous + direction + count) % count);
  };
  return (
    <figure ref={figureRef} className={`drawing-slideshow ${className}`} aria-label={label}>
      <div className="drawing-frame">
        {usable.map((slide, i) => (
          <img
            key={slide.src}
            src={slide.src}
            alt={slide.label}
            width={className === "floorplan-slideshow" ? 926 : 1921}
            height={className === "floorplan-slideshow" ? 790 : 952}
            loading="lazy"
            decoding="async"
            className={i === active ? "is-active" : ""}
            aria-hidden={i !== active}
            draggable={false}
          />
        ))}
      </div>
      <figcaption className="figure-toolbar">
        <span aria-live={playing && !reduced ? "off" : "polite"}>{usable[active]?.label}</span>
        {count > 1 && (
          <span className="slideshow-controls">
            <button
              type="button"
              onClick={() => step(-1)}
              aria-label={`Previous ${label.toLowerCase()}`}
            >
              ←
            </button>
            {!reduced && (
              <button type="button" onClick={() => setPlaying(!playing)} aria-pressed={!playing}>
                {playing ? "Pause" : "Play"}
              </button>
            )}
            <button
              type="button"
              onClick={() => step(1)}
              aria-label={`Next ${label.toLowerCase()}`}
            >
              →
            </button>
          </span>
        )}
      </figcaption>
    </figure>
  );
}

function MuseumOfScale() {
  return (
    <div className="museum-content content-width">
      <DrawingSlideshow
        label="Elevation and section"
        className="elevation-slideshow"
        interval={4000}
        slides={[
          { src: assets.museumElevation, label: "Elevation" },
          { src: assets.museumSection, label: "Section" },
        ]}
      />
      <section className="museum-plans" aria-labelledby="museum-plan-title">
        <h2 id="museum-plan-title" className="eyebrow">
          Floorplans / Four levels
        </h2>
        <DrawingSlideshow
          label="Floorplan drawings"
          className="floorplan-slideshow"
          slides={[
            { src: assets.museumGround, label: "COMP MAIN FLOOR" },
            { src: assets.museumFirst, label: "1ST FLOOR" },
            { src: assets.museumSecond, label: "2ND FLOOR" },
            { src: assets.museumParkade, label: "PARKADE" },
          ]}
        />
      </section>
      <section
        className="museum-details"
        aria-label="Museum of Scale construction and spatial studies"
      >
        <ArtFigure
          src={assets.museumAxo}
          alt="Exploded axonometric diagram of Museum of Scale"
          caption="Spatial assembly"
          className="museum-axo visual-hover"
        />
        <div className="museum-detail-stack">
          <ArtFigure
            src={assets.museumDetailOne}
            alt="Museum of Scale construction detail"
            caption="Construction / Detail 01"
            className="visual-hover"
          />
          <ArtFigure
            src={assets.museumDetailTwo}
            alt="Museum of Scale structural section detail"
            caption="Construction / Detail 02"
            className="visual-hover"
          />
          <ArtFigure
            src={assets.museumBoulder}
            alt="Boulder and structural foundation detail"
            caption="Ground / Material connection"
            className="visual-hover"
          />
        </div>
      </section>
    </div>
  );
}

function Tokyo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !assets.tokyoVideo) return;
    // User-controlled playback; pause when the film leaves the viewport.
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry?.isIntersecting) video.pause();
    });
    observer.observe(video);
    return () => observer.disconnect();
  }, []);
  return (
    <div className="tokyo-content">
      <figure className="tokyo-film">
        <video
          ref={videoRef}
          controls={Boolean(assets.tokyoVideo)}
          playsInline
          loop
          preload="metadata"
          src={assets.tokyoVideo}
          poster={assets.tokyoPoster}
          aria-label="Made in Tokyo architectural film"
        />
        {!assets.tokyoVideo && <figcaption>Film preview / Video coming soon</figcaption>}
      </figure>
      <section className="tokyo-research content-width" aria-label="Tokyo research and floorplans">
        <ArtFigure
          src={assets.tokyoResearch}
          alt="Kimono making in Tokyo, avant-garde fashion, and visits to cultural and fashion centres"
          className="tokyo-collage"
        />
        <ArtFigure
          src={assets.tokyoPlans}
          alt="Tokyo floorplans showing making spaces, gallery and cafe"
          className="tokyo-floorplans"
        />
      </section>
      <section className="tokyo-renders" aria-label="Made in Tokyo interior views">
        <ArtFigure src={assets.tokyoGallery} alt="Made in Tokyo fashion exhibition and gallery" />
        <ArtFigure
          src={assets.tokyoCafe}
          alt="Made in Tokyo cafe with pink stools and a curved glazed roof"
        />
        <ArtFigure src={assets.tokyoWorkshop} alt="Made in Tokyo sewing and making workshop" />
      </section>
    </div>
  );
}

function Resume() {
  return (
    <section className="resume-content content-width" aria-label="Resume document">
      {assets.resume ? (
        <>
          <a className="document-link" href={assets.resume} download="Kiran-Resume.pdf">
            Download Resume ↓
          </a>
          <object
            data={assets.resume}
            type="application/pdf"
            className="resume-document"
            aria-label="Kiran’s Resume"
          >
            <p>
              <a href={assets.resume} target="_blank" rel="noreferrer">
                Open Resume
              </a>
            </p>
          </object>
        </>
      ) : (
        <p className="resume-empty">Resume coming soon.</p>
      )}
    </section>
  );
}