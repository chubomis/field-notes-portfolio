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
        content: "An interactive architectural portfolio and visual archive.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  const sceneRef = useRef<HTMLElement>(null);

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
    <main
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
    </main>
  );
}
