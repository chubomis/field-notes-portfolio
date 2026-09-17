import { createFileRoute } from "@tanstack/react-router";
import {
  useEffect,
  useRef,
  type MouseEvent as ReactMouseEvent,
} from "react";

import { Button } from "@/components/ui/button";

import backgroundAsset from "@/assets/fieldnotes/Main Page Background-01.png";
import colorfulProjectAsset from "@/assets/fieldnotes/Main Page Funky Forms Image-05.png";
import snowyProjectAsset from "@/assets/fieldnotes/Main Page Hypar Image-04.png";
import cvAsset from "@/assets/fieldnotes/Main Page Menu Titles-11.png";
import writingAsset from "@/assets/fieldnotes/Main Page Menu Titles-12.png";
import interiorsAsset from "@/assets/fieldnotes/Main Page Menu Titles-13.png";
import objectAsset from "@/assets/fieldnotes/Main Page Menu Titles-14.png";
import archivesAsset from "@/assets/fieldnotes/Main Page Menu Titles-15.png";
import titleAsset from "@/assets/fieldnotes/Main Page Title-03.png";

import funkyTitleAsset from "@/assets/funky-forms/Funky Forms TITLE-10.png";
import texturesAsset from "@/assets/funky-forms/Funky Forms AI TEXTURES-08.png";
import paperAsset from "@/assets/funky-forms/Funky Forms Background Scroll-03.png";
import blurbAsset from "@/assets/funky-forms/Funky Forms Blurb-09.png";
import axoAsset from "@/assets/funky-forms/Funky Forms Axo-07.png";
import projectionsAsset from "@/assets/funky-forms/Funky Forms PROJECTIONS-07.png";
import methodAsset from "@/assets/funky-forms/Funky Forms METHOD-07.png";
import iterationsAsset from "@/assets/funky-forms/Funky Forms iTERATIONS-07.png";
import finalRenderAsset from "@/assets/funky-forms/Funky Forms Project Render-06.png";

const navigation = [
  { label: "CV", image: cvAsset },
  { label: "Writing", image: writingAsset },
  { label: "Interiors", image: interiorsAsset },
  { label: "Object", image: objectAsset },
  { label: "Archives", image: archivesAsset },
];

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      {
        title: "Kiran’s Digital Fieldnotes | Architecture Portfolio",
      },
      {
        name: "description",
        content:
          "Kiran’s Digital Fieldnotes — an interactive architectural portfolio and visual archive.",
      },
      {
        property: "og:title",
        content: "Kiran’s Digital Fieldnotes",
      },
      {
        property: "og:description",
        content:
          "An interactive architectural portfolio featuring the Funky Forms process and final spatial experience.",
      },
      {
        property: "og:type",
        content: "website",
      },
      {
        name: "twitter:card",
        content: "summary_large_image",
      },
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

    if (!scene) {
      return;
    }

    const reset = () => {
      scene.style.setProperty("--pointer-x", "0");
      scene.style.setProperty("--pointer-y", "0");
    };

    scene.addEventListener("mouseleave", reset);

    return () => {
      scene.removeEventListener("mouseleave", reset);
    };
  }, []);

  useEffect(() => {
    const project = projectRef.current;
    const process = processRef.current;

    if (!project || !process) {
      return;
    }

    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.setAttribute(
              "data-visible",
              "true",
            );
          }
        });
      },
      {
        threshold: 0.14,
      },
    );

    project
      .querySelectorAll("[data-reveal]")
      .forEach((element) => {
        revealObserver.observe(element);
      });

    /*
     * These thresholds are matched to the paper's actual
     * physical position.
     *
     * Paper:
     * top: -7vh
     * starting height: 16vh
     * additional travel: 92vh
     *
     * Drawing:
     * top: 7vh
     * total reveal height: 92vh
     *
     * This means every threshold corresponds closely to
     * the paper reaching the bottom of one of the 7 stages.
     */
    const stageThresholds = [
      0.12,
      0.263,
      0.407,
      0.55,
      0.693,
      0.837,
      0.98,
    ];

    const updateProgress = () => {
      /*
       * Overall Funky Forms project progress.
       */
      const projectRect =
        project.getBoundingClientRect();

      const projectDistance =
        projectRect.height - window.innerHeight;

      const projectProgress =
        projectDistance > 0
          ? -projectRect.top / projectDistance
          : 0;

      const clampedProjectProgress = Math.min(
        1,
        Math.max(0, projectProgress),
      );

      project.style.setProperty(
        "--project-progress",
        clampedProjectProgress.toFixed(4),
      );

      /*
       * Sticky process section progress.
       */
      const processRect =
        process.getBoundingClientRect();

      const processDistance =
        processRect.height - window.innerHeight;

      const processProgress =
        processDistance > 0
          ? -processRect.top / processDistance
          : 0;

      const progress = Math.min(
        1,
        Math.max(0, processProgress),
      );

      /*
       * Paper movement stays completely continuous.
       */
      process.style.setProperty(
        "--process-progress",
        progress.toFixed(4),
      );

      /*
       * Count only the stages that the paper has
       * physically reached.
       */
      let revealedStages = 0;

      for (const threshold of stageThresholds) {
        if (progress >= threshold) {
          revealedStages += 1;
        }
      }

      /*
       * Turn 0-7 stages into a 0-1 drawing reveal.
       */
      const drawingProgress =
        revealedStages / stageThresholds.length;

      process.style.setProperty(
        "--drawing-progress",
        drawingProgress.toFixed(4),
      );

      process.style.setProperty(
        "--revealed-stages",
        revealedStages.toString(),
      );
    };

    updateProgress();

    window.addEventListener(
      "scroll",
      updateProgress,
      {
        passive: true,
      },
    );

    window.addEventListener(
      "resize",
      updateProgress,
    );

    return () => {
      revealObserver.disconnect();

      window.removeEventListener(
        "scroll",
        updateProgress,
      );

      window.removeEventListener(
        "resize",
        updateProgress,
      );
    };
  }, []);

  const handlePointerMove = (
    event: ReactMouseEvent<HTMLElement>,
  ) => {
    const scene = sceneRef.current;

    if (!scene) {
      return;
    }

    const rect = scene.getBoundingClientRect();

    const x =
      ((event.clientX - rect.left) / rect.width - 0.5) *
      2;

    const y =
      ((event.clientY - rect.top) / rect.height - 0.5) *
      2;

    scene.style.setProperty(
      "--pointer-x",
      x.toFixed(3),
    );

    scene.style.setProperty(
      "--pointer-y",
      y.toFixed(3),
    );
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
          src={backgroundAsset}
          alt=""
          aria-hidden="true"
          draggable={false}
        />

        <h1
          id="portfolio-title"
          className="sr-only"
        >
          Kiran’s Digital Fieldnotes
        </h1>

        <div
          className="fieldnotes-title"
          aria-hidden="true"
        >
          <img
            src={titleAsset}
            alt=""
            draggable={false}
          />
        </div>

        <button
          className="project-image project-image-colorful"
          type="button"
          aria-label="Open colorful architectural project"
        >
          <img
            src={colorfulProjectAsset}
            alt="Colorful experimental architectural model"
            draggable={false}
          />
        </button>

        <button
          className="project-image project-image-snowy"
          type="button"
          aria-label="Open snowy building project"
        >
          <img
            src={snowyProjectAsset}
            alt="Curved architectural building in a snowy setting"
            draggable={false}
          />
        </button>

        <nav
          className="fieldnotes-nav"
          aria-label="Portfolio sections"
        >
          {navigation.map((item) => (
            <Button
              key={item.label}
              type="button"
              variant="collage"
              aria-label={item.label}
            >
              <img
                src={item.image}
                alt=""
                draggable={false}
              />
            </Button>
          ))}
        </nav>
      </section>

      <section
        ref={projectRef}
        className="funky-project"
        aria-labelledby="funky-title"
      >
        <div
          className="project-progress"
          aria-hidden="true"
        >
          <span />
        </div>

        <header className="funky-intro">
          <p
            className="project-kicker"
            data-reveal
          >
            01 / Featured project
          </p>

          <h2
            id="funky-title"
            className="funky-title"
            data-reveal
          >
            <span className="sr-only">
              Funky Forms
            </span>

            <img
              src={funkyTitleAsset}
              alt=""
              aria-hidden="true"
              draggable={false}
            />
          </h2>

          <figure
            className="process-overview visual-hover"
            data-reveal
          >
            <img
              src={texturesAsset}
              alt="A matrix of material and form studies for Funky Forms"
              draggable={false}
            />

            <figcaption>
              Process / Material language
            </figcaption>
          </figure>

          <div
            className="project-blurb"
            data-reveal
          >
            <img
              src={blurbAsset}
              alt="The project uses continuous radial geometry to choreograph movement, perception, artistic exchange and spatial experience."
              draggable={false}
            />
          </div>
        </header>

        <section
          ref={processRef}
          className="process-story"
          aria-label="Funky Forms drawing progression"
        >
          <div className="process-sticky">
            <p className="process-label">
              Process / Form progression
            </p>

            <div
              className="paper-unroll"
              aria-hidden="true"
            >
              <img
                src={paperAsset}
                alt=""
                draggable={false}
              />
            </div>

            <div className="axo-reveal">
              <img
                src={axoAsset}
                alt="Seven stages of the Funky Forms colored axonometric drawing"
                draggable={false}
              />
            </div>

            <ol
              className="stage-index"
              aria-hidden="true"
            >
              <li>01</li>
              <li>02</li>
              <li>03</li>
              <li>04</li>
              <li>05</li>
              <li>06</li>
              <li>07</li>
            </ol>
          </div>
        </section>

        <section
          className="supporting-studies"
          aria-label="Supporting project studies"
        >
          <div
            className="study-heading"
            data-reveal
          >
            <p className="project-kicker">
              Studies / Operations
            </p>

            <h3>
              Geometry as a way of moving.
            </h3>
          </div>

          <figure
            className="study study-projections visual-hover"
            data-reveal
          >
            <img
              src={projectionsAsset}
              alt="Projection and extrusion line diagram"
              draggable={false}
            />

            <figcaption>
              Projection
            </figcaption>
          </figure>

          <figure
            className="study study-method visual-hover"
            data-reveal
          >
            <img
              src={methodAsset}
              alt="Checkerboard method study"
              draggable={false}
            />

            <figcaption>
              Method
            </figcaption>
          </figure>

          <figure
            className="study study-iterations visual-hover"
            data-reveal
          >
            <img
              src={iterationsAsset}
              alt="Black-background iteration studies"
              draggable={false}
            />

            <figcaption>
              Iterations
            </figcaption>
          </figure>
        </section>

        <section
          className="final-outcome"
          aria-labelledby="final-heading"
        >
          <div
            className="final-copy"
            data-reveal
          >
            <p className="project-kicker">
              Final outcome
            </p>

            <h3 id="final-heading">
              Spatial experience
            </h3>
          </div>

          <figure
            className="final-render visual-hover"
            data-reveal
          >
            <img
              src={finalRenderAsset}
              alt="Final Funky Forms interior with a blue structural grid and pink sculpture"
              draggable={false}
            />

            <figcaption>
              <span>Funky Forms</span>
              <span>View detail</span>
            </figcaption>
          </figure>
        </section>
      </section>
    </main>
  );
}