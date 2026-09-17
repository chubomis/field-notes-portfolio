import {
  createFileRoute,
  notFound,
  redirect,
} from "@tanstack/react-router";

import {
  ProjectPage,
} from "@/components/portfolio";

import {
  ProjectImageLightbox,
} from "@/components/ProjectImageLightbox";

import {
  isProjectId,
  projects,
} from "@/lib/portfolio-assets";


export const Route =
  createFileRoute("/$project")({
    beforeLoad: ({ params }) => {
      /*
       * Keep the old project URL working
       * after Funky Forms became Chunky Forms.
       */
      if (
        params.project ===
        "funky-forms"
      ) {
        throw redirect({
          to: "/$project",

          params: {
            project:
              "chunky-forms",
          },

          replace: true,
        });
      }


      if (
        !isProjectId(
          params.project,
        )
      ) {
        throw notFound();
      }


      return {
        projectId:
          params.project,
      };
    },


    head: ({ params }) => ({
      meta: [
        {
          title:
            isProjectId(
              params.project,
            )
              ? `${
                  projects[
                    params.project
                  ].label
                } | Kiran’s Digital Fieldnotes`
              : "Kiran’s Digital Fieldnotes",
        },
      ],
    }),


    component:
      ProjectRoute,
  });


function ProjectRoute() {
  const {
    projectId,
  } =
    Route.useRouteContext();


  return (
    <>
      <ProjectPage
        key={projectId}
        project={projectId}
      />

      <ProjectImageLightbox
        projectKey={projectId}
      />
    </>
  );
}