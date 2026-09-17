// Assets can live in any subfolder of src/assets. Keep their original filenames.
// Missing optional assets do not break the Vite build.
const files = import.meta.glob<string>(
  "../assets/**/*.{png,PNG,jpg,JPG,jpeg,JPEG,webp,svg,mp4,MP4,webm,WEBM,pdf,PDF}",
  { eager: true, query: "?url", import: "default" },
);

function asset(...names: string[]): string | undefined {
  for (const name of names) {
    const found = Object.entries(files).find(
      ([path]) => path.split("/").pop()?.toLowerCase() === name.toLowerCase(),
    );
    if (found) return found[1];
  }
  return undefined;
}

// Change only these filenames if your separately exported title graphics,
// Tokyo video or Resume PDF have different names.
export const assets = {
  background: asset("Main Page Background-01.png"),
  masthead: asset("Main Page Title-03.png"),
  titleReference: asset("c9260b1c-46c5-454e-badc-b97288ce589f.png"),
  chunkyTitle: asset("Chunky Forms TITLE-10.png", "Chunky Forms Title.png"),
  museumTitle: asset("Museum of Scale Title.png"),
  tokyoTitle: asset("Made in Tokyo Title.png", "Tokyo Title.png"),
  resumeTitle: asset("Resume Title.png"),
  siteModel: asset("_MG_8772.JPG"),
  siteVisit: asset("Screenshot 2026-09-15 163105.png"),
  corbusierVisit: asset("WhatsApp Image 2026-09-15 at 4.11.52 PM (1).jpeg"),
  textures: asset("Chunky Forms AI TEXTURES-08.png", "Funky Forms AI TEXTURES-08.png"),
  paper: asset("Chunky Forms Background Scroll-03.png", "Funky Forms Background Scroll-03.png"),
  axo: asset("Chunky Forms Axo-07.png", "Funky Forms Axo-07.png"),
  blurb: asset("Chunky Forms Blurb-09.png", "Funky Forms Blurb-09.png"),
  projections: asset("Chunky Forms PROJECTIONS-07.png", "Funky Forms PROJECTIONS-07.png"),
  method: asset("Chunky Forms METHOD-07.png", "Funky Forms METHOD-07.png"),
  iterations: asset("Chunky Forms iTERATIONS-07.png", "Funky Forms iTERATIONS-07.png"),
  chunkyRender: asset("Chunky Forms Project Render-06.png", "Funky Forms Project Render-06.png"),
  museumGround: asset("COMP FLOORPLAN GROUND-18.png"),
  museumFirst: asset("COMP FLOORPLAN 1-18.png"),
  museumSecond: asset("COMP FLOORPLAN 2-18.png"),
  museumParkade: asset("COMP FLOORPLAN PARKADE-18.png"),
  museumElevation: asset("Museum of Scale Elevation v22-22.png"),
  museumSection: asset("Museum of Scale Section-22.png"),
  museumDetailOne: asset("Museum of Scale Details-20.png"),
  museumDetailTwo: asset("Museum of Scale Details-21.png"),
  museumAxo: asset("AxoDiagrams comp-02.png"),
  museumBoulder: asset("Museum of Scale Boulder-19.png"),
  tokyoVideo: asset("Tokyo Video.mp4", "Tokyo.mp4", "Tokyo Video.webm"),
  tokyoPoster: asset("Tokyo Video Poster.webp", "Tokyo Video Poster.png"),
  tokyoResearch: asset("Tokyo Research Collage.webp", "Tokyo Research Collage.png"),
  tokyoPlans: asset("Tokyo Floorplans-24.png"),
  tokyoGallery: asset("Tokyo Gallery.webp", "Tokyo Gallery.png"),
  tokyoCafe: asset("Tokyo Cafe.webp", "Tokyo Cafe.png"),
  tokyoWorkshop: asset("Tokyo Workshop.webp", "Tokyo Workshop.png"),
  resume: asset("Resume.pdf", "Kiran Resume.pdf"),
};

export type ProjectId = "chunky-forms" | "museum-of-scale" | "tokyo" | "resume";
export const projectOrder: ProjectId[] = ["chunky-forms", "museum-of-scale", "tokyo", "resume"];

export const projects = {
  "chunky-forms": { label: "Chunky Forms", title: assets.chunkyTitle, number: "01" },
  "museum-of-scale": { label: "Museum of Scale", title: assets.museumTitle, number: "02" },
  tokyo: { label: "Made in Tokyo", title: assets.tokyoTitle, number: "03" },
  resume: { label: "Resume", title: assets.resumeTitle, number: "04" },
};

export function isProjectId(value: string): value is ProjectId {
  return Object.hasOwn(projects, value);
}

// Reuse the exact title artwork in your supplied homepage image until a
// separate high-resolution title export is added above.
export const titleCrops: Record<ProjectId, string> = {
  "chunky-forms": "291 300 123 57",
  "museum-of-scale": "250 371 197 24",
  tokyo: "291 409 127 70",
  resume: "306 490 90 24",
};
