import { createFileRoute } from "@tanstack/react-router";
import { HomePage } from "@/components/portfolio";

import "../homepage.css";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      {
        title: "Kiran’s Digital Fieldnotes | Architecture Portfolio",
      },
      {
        name: "description",
        content:
          "Architecture, experiments and fieldnotes by Kiran. Explore Chunky Forms, Museum of Scale and Made in Tokyo.",
      },
    ],
  }),

  component: HomePage,
});