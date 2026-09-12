import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, type MouseEvent as ReactMouseEvent } from "react";

import { Button } from "@/components/ui/button";
import backgroundAsset from "@/assets/fieldnotes/Main_Page_Background-01.png.asset.json";
import colorfulProjectAsset from "@/assets/fieldnotes/Main_Page_Funky_Forms_Image-05.png.asset.json";
import snowyProjectAsset from "@/assets/fieldnotes/Main_Page_Hypar_Image-04.png.asset.json";
import cvAsset from "@/assets/fieldnotes/Main_Page_Menu_Titles-11.png.asset.json";
import writingAsset from "@/assets/fieldnotes/Main_Page_Menu_Titles-12.png.asset.json";
import interiorsAsset from "@/assets/fieldnotes/Main_Page_Menu_Titles-13.png.asset.json";
import objectAsset from "@/assets/fieldnotes/Main_Page_Menu_Titles-14.png.asset.json";
import archivesAsset from "@/assets/fieldnotes/Main_Page_Menu_Titles-15.png.asset.json";
import titleAsset from "@/assets/fieldnotes/Main_Page_Title-03.png.asset.json";
import funkyTitleAsset from "@/assets/funky-forms/Funky_Forms_TITLE-10.png.asset.json";
import texturesAsset from "@/assets/funky-forms/Funky_Forms_AI_TEXTURES-08.png.asset.json";
import paperAsset from "@/assets/funky-forms/Funky_Forms_Background_Scroll-03.png.asset.json";
import blurbAsset from "@/assets/funky-forms/Funky_Forms_Blurb-09.png.asset.json";
import axoAsset from "@/assets/funky-forms/Funky_Forms_Axo-07.png.asset.json";
import projectionsAsset from "@/assets/funky-forms/Funky_Forms_PROJECTIONS-07.png.asset.json";
import methodAsset from "@/assets/funky-forms/Funky_Forms_METHOD-07.png.asset.json";
import iterationsAsset from "@/assets/funky-forms/Funky_Forms_iTERATIONS-07.png.asset.json";
import finalRenderAsset from "@/assets/funky-forms/Funky_Forms_Project_Render-06.png.asset.json";

const navigation = [
  { label: "CV", image: cvAsset.url },
  { label: "Writing", image: writingAsset.url },
  { label: "Interiors", image: interiorsAsset.url },
  { label: "Object", image: objectAsset.url },
  { label: "Archives", image: archivesAsset.url },
];

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Kiran’s Digital Fieldnotes | Architecture Portfolio" },
      {
        name: "description",
        content: "Kiran’s Digital Fieldnotes — an interactive architectural portfolio and visual archive.",
      },
      { property: "og:title", content: "Kiran’s Digital Fieldnotes" },
      {
        property: "og:description",
        content: "An interactive architectural portfolio featuring the Funky Forms process and final spatial experience.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  const sceneRef = useRef<HTMLElement>(null);
  const projectRef = useRef<HTMLElement>(null);
  const processRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene) return;

    const reset = () => {
      scene.style.setProperty("--pointer-x", "0");
      scene.style.setProperty("--pointer-y", "0");
    };

    scene.addEventListener("mouseleave", reset);
    return () => scene.removeEventListener("mouseleave", reset);
  }, []);

  useEffect(() => {
    const project = projectRef.current;
    const process = processRef.current;
    if (!project || !process) return;

    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.setAttribute("data-visible", "true");
        });
      },
      { threshold: 0.14 },
    );
    project.querySelectorAll("[data-reveal]").forEach((element) => revealObserver.observe(element));

    const updateProgress = () => {
      const projectRect = project.getBoundingClientRect();
      const projectDistance = projectRect.height - window.innerHeight;
      const projectProgress = projectDistance > 0 ? -projectRect.top / projectDistance : 0;
      project.style.setProperty("--project-progress", Math.min(1, Math.max(0, projectProgress)).toFixed(3));

      const processRect = process.getBoundingClientRect();
      const processDistance = processRect.height - window.innerHeight;
      const processProgress = processDistance > 0 ? -processRect.top / processDistance : 0;
      process.style.setProperty("--process-progress", Math.min(1, Math.max(0, processProgress)).toFixed(3));
    };

    updateProgress();
    window.addEventListener("scroll", updateProgress, { passive: true });
    window.addEventListener("resize", updateProgress);
    return () => {
      revealObserver.disconnect();
      window.removeEventListener("scroll", updateProgress);
      window.removeEventListener("resize", updateProgress);
    };
  }, []);

  const handlePointerMove = (event: ReactMouseEvent<HTMLElement>) => {
    const scene = sceneRef.current;
    if (!scene) return;
    const rect = scene.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
    const y = ((event.clientY - rect.top) / rect.height - 0.5) * 2;
    scene.style.setProperty("--pointer-x", x.toFixed(3));
    scene.style.setProperty("--pointer-y", y.toFixed(3));
  };

  return (
    <main className="portfolio-page">
    <section
      ref={sceneRef}
      className="fieldnotes-scene"
      onMouseMove={handlePointerMove}
      aria-labelledby="portfolio-title"
    >
      <img
        className="fieldnotes-background"
        src={backgroundAsset.url}
        alt=""
        aria-hidden="true"
      />

      <h1 id="portfolio-title" className="sr-only">Kiran’s Digital Fieldnotes</h1>
      <div className="fieldnotes-title" aria-hidden="true">
        <img src={titleAsset.url} alt="" draggable={false} />
      </div>

      <button className="project-image project-image-colorful" type="button" aria-label="Open colorful architectural project">
        <img src={colorfulProjectAsset.url} alt="Colorful experimental architectural model" draggable={false} />
      </button>

      <button className="project-image project-image-snowy" type="button" aria-label="Open snowy building project">
        <img src={snowyProjectAsset.url} alt="Curved architectural building in a snowy setting" draggable={false} />
      </button>

      <nav className="fieldnotes-nav" aria-label="Portfolio sections">
        {navigation.map((item) => (
          <Button key={item.label} type="button" variant="collage" aria-label={item.label}>
            <img src={item.image} alt="" draggable={false} />
          </Button>
        ))}
      </nav>
    </section>

    <section ref={projectRef} className="funky-project" aria-labelledby="funky-title">
      <div className="project-progress" aria-hidden="true"><span /></div>

      <header className="funky-intro">
        <p className="project-kicker" data-reveal>01 / Featured project</p>
        <h2 id="funky-title" className="funky-title" data-reveal>
          <span className="sr-only">Funky Forms</span>
          <img src={funkyTitleAsset.url} alt="" aria-hidden="true" draggable={false} />
        </h2>
        <figure className="process-overview visual-hover" data-reveal>
          <img src={texturesAsset.url} alt="A matrix of material and form studies for Funky Forms" draggable={false} />
          <figcaption>Process / Material language</figcaption>
        </figure>
        <div className="project-blurb" data-reveal>
          <img
            src={blurbAsset.url}
            alt="The project uses a continuous radial geometry of concave and convex curves to choreograph movement, perception, and artistic exchange. Concave bends slow circulation and form collaborative pin-up zones or focused studios, while convex turns disrupt sightlines, build suspense, and act as narrative surfaces that prime visitors before artworks are revealed. With no neutral moments or blank backdrops, the architecture actively shapes how art is made, displayed, and understood, ultimately speculating on how radically curved, textured environments can alter creative processes, social interaction, and our everyday ways of navigating and interpreting space."
            draggable={false}
          />
        </div>
      </header>

      <section ref={processRef} className="process-story" aria-label="Funky Forms drawing progression">
        <div className="process-sticky">
          <p className="process-label">Process / Form progression</p>
          <div className="paper-unroll" aria-hidden="true">
            <img src={paperAsset.url} alt="" draggable={false} />
          </div>
          <div className="axo-reveal">
            <img src={axoAsset.url} alt="Seven stages of the Funky Forms colored axonometric drawing" draggable={false} />
          </div>
          <ol className="stage-index" aria-hidden="true">
            <li>01</li><li>02</li><li>03</li><li>04</li><li>05</li><li>06</li><li>07</li>
          </ol>
        </div>
      </section>

      <section className="supporting-studies" aria-label="Supporting project studies">
        <div className="study-heading" data-reveal>
          <p className="project-kicker">Studies / Operations</p>
          <h3>Geometry as a way of moving.</h3>
        </div>
        <figure className="study study-projections visual-hover" data-reveal>
          <img src={projectionsAsset.url} alt="Projection and extrusion line diagram" draggable={false} />
          <figcaption>Projection</figcaption>
        </figure>
        <figure className="study study-method visual-hover" data-reveal>
          <img src={methodAsset.url} alt="Checkerboard method study" draggable={false} />
          <figcaption>Method</figcaption>
        </figure>
        <figure className="study study-iterations visual-hover" data-reveal>
          <img src={iterationsAsset.url} alt="Black-background iteration studies" draggable={false} />
          <figcaption>Iterations</figcaption>
        </figure>
      </section>

      <section className="final-outcome" aria-labelledby="final-heading">
        <div className="final-copy" data-reveal>
          <p className="project-kicker">Final outcome</p>
          <h3 id="final-heading">Spatial experience</h3>
        </div>
        <figure className="final-render visual-hover" data-reveal>
          <img src={finalRenderAsset.url} alt="Final Funky Forms interior with a blue structural grid and pink sculpture" draggable={false} />
          <figcaption><span>Funky Forms</span><span>View detail</span></figcaption>
        </figure>
      </section>
    </section>
    </main>
  );
}
