// Search every subfolder inside src/assets.
// Files are matched by filename, case-insensitively.
const files = import.meta.glob<string>(
  "../assets/**/*.{png,PNG,jpg,JPG,jpeg,JPEG,webp,svg,mp4,MP4,webm,WEBM,pdf,PDF}",
  {
    eager: true,
    query: "?url",
    import: "default",
  },
);

function asset(...names: string[]): string | undefined {
  for (const name of names) {
    const found = Object.entries(files).find(([path]) => {
      const filename = path.split("/").pop();

      return filename?.toLowerCase() === name.toLowerCase();
    });

    if (found) {
      return found[1];
    }
  }

  return undefined;
}

export const assets = {
  // =========================================================
  // HOMEPAGE
  // =========================================================

  background: asset("Main Page Background-01.png"),

  // This can remain missing.
  // The homepage has a text fallback for the main masthead.
  masthead: asset("Main Page Title-03.png"),

  /*
   * IMPORTANT:
   * Do not use the old composite reference image anymore.
   * That was producing the giant white rectangle behind
   * the project titles.
   */
  titleReference: undefined as string | undefined,

  // Exact images you uploaded
  chunkyTitle: asset("titles-03.png"),
  museumTitle: asset("titles-26.png"),
  tokyoTitle: asset("titles-27.png"),

  // Resume remains clean text like in your PDF
  resumeTitle: undefined as string | undefined,

  // Social photographs
  siteModel: asset("_MG_8772.JPG"),
  siteVisit: asset("Screenshot 2026-09-15 163105.png"),
  corbusierVisit: asset(
    "WhatsApp Image 2026-09-15 at 4.11.52 PM (1).jpeg",
  ),

  // =========================================================
  // CHUNKY FORMS
  // =========================================================

  textures: asset(
    "Chunky Forms AI TEXTURES-08.png",
    "Funky Forms AI TEXTURES-08.png",
  ),

  paper: asset(
    "Chunky Forms Background Scroll-03.png",
    "Funky Forms Background Scroll-03.png",
  ),

  axo: asset(
    "Chunky Forms Axo-07.png",
    "Funky Forms Axo-07.png",
  ),

  blurb: asset(
    "Chunky Forms Blurb-09.png",
    "Funky Forms Blurb-09.png",
  ),

  projections: asset(
    "Chunky Forms PROJECTIONS-07.png",
    "Funky Forms PROJECTIONS-07.png",
  ),

  method: asset(
    "Chunky Forms METHOD-07.png",
    "Funky Forms METHOD-07.png",
  ),

  iterations: asset(
    "Chunky Forms iTERATIONS-07.png",
    "Funky Forms iTERATIONS-07.png",
  ),

  chunkyRender: asset(
    "Chunky Forms Project Render-06.png",
    "Funky Forms Project Render-06.png",
  ),

  // =========================================================
  // MUSEUM OF SCALE
  // =========================================================

  museumGround: asset(
    "COMP FLOORPLAN GROUND-18.png",
  ),

  museumFirst: asset(
    "COMP FLOORPLAN 1-18.png",
  ),

  museumSecond: asset(
    "COMP FLOORPLAN 2-18.png",
  ),

  museumParkade: asset(
    "COMP FLOORPLAN PARKADE-18.png",
  ),

  museumElevation: asset(
    "Museum of Scale Elevation v22-22.png",
  ),

  museumSection: asset(
    "Museum of Scale Section-22.png",
  ),

  museumDetailOne: asset(
    "Museum of Scale Details-20.png",
  ),

  museumDetailTwo: asset(
    "Museum of Scale Details-21.png",
  ),

  museumAxo: asset(
    "AxoDiagrams comp-02.png",
  ),

  museumBoulder: asset(
    "Museum of Scale Boulder-19.png",
  ),

  // =========================================================
  // MADE IN TOKYO
  // =========================================================

  tokyoVideo: asset(
    "AXOEXTERIOR.mp4",
    "Tokyo Video.mp4",
    "Tokyo.mp4",
    "Tokyo Video.webm",
  ),

  tokyoPoster: asset(
    "Tokyo Video Poster.webp",
    "Tokyo Video Poster.png",
  ),

  tokyoResearch: asset(
    "Tokyo Research Collage.webp",
    "Tokyo Research Collage.png",
  ),

  tokyoPlans: asset(
    "Tokyo Floorplans-24.png",
  ),

  tokyoGallery: asset(
    "Tokyo Gallery.webp",
    "Tokyo Gallery.png",
  ),

  tokyoCafe: asset(
    "Tokyo Cafe.webp",
    "Tokyo Cafe.png",
  ),

  tokyoWorkshop: asset(
    "Tokyo Workshop.webp",
    "Tokyo Workshop.png",
  ),

  // =========================================================
  // RESUME
  // =========================================================

  resume: asset(
    "resume.pdf",
    "Resume.pdf",
    "Kiran Resume.pdf",
  ),
};

export type ProjectId =
  | "chunky-forms"
  | "museum-of-scale"
  | "tokyo"
  | "resume";

export const projectOrder: ProjectId[] = [
  "chunky-forms",
  "museum-of-scale",
  "tokyo",
  "resume",
];

export const projects = {
  "chunky-forms": {
    label: "Chunky Forms",
    title: assets.chunkyTitle,
    number: "01",
  },

  "museum-of-scale": {
    label: "Museum of Scale",
    title: assets.museumTitle,
    number: "02",
  },

  tokyo: {
    label: "Made in Tokyo",
    title: assets.tokyoTitle,
    number: "03",
  },

  resume: {
    label: "Resume",
    title: assets.resumeTitle,
    number: "04",
  },
};

export function isProjectId(
  value: string,
): value is ProjectId {
  return Object.hasOwn(projects, value);
}

/*
 * Kept only because ProjectTitle currently imports it.
 * Since titleReference is disabled, these are no longer
 * used on the homepage.
 */
export const titleCrops: Record<
  ProjectId,
  string
> = {
  "chunky-forms": "291 300 123 57",
  "museum-of-scale": "250 371 197 24",
  tokyo: "291 409 127 70",
  resume: "306 490 90 24",
};