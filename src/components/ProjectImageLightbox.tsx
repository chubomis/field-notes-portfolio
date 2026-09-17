import {
  useEffect,
  useState,
} from "react";

import "../project-interactions.css";

type ProjectImageLightboxProps = {
  projectKey: string;
};

type SelectedImage = {
  src: string;
  alt: string;
};

function isZoomableProjectImage(
  image: HTMLImageElement,
) {
  /*
   * Only images inside the actual project content.
   */
  if (!image.closest(".project-page main")) {
    return false;
  }

  /*
   * Don't enlarge the project title artwork.
   */
  if (
    image.closest(".project-heading") ||
    image.closest(".project-art")
  ) {
    return false;
  }

  /*
   * The paper graphic is part of the Chunky Forms
   * scroll animation rather than an artwork itself.
   */
  if (image.classList.contains("paper-image")) {
    return false;
  }

  return true;
}

function getImageDescription(
  image: HTMLImageElement,
) {
  if (image.alt.trim()) {
    return image.alt.trim();
  }

  const figure = image.closest("figure");

  const caption =
    figure
      ?.querySelector("figcaption")
      ?.textContent
      ?.trim();

  if (caption) {
    return caption;
  }

  return "Project image";
}

export function ProjectImageLightbox({
  projectKey,
}: ProjectImageLightboxProps) {
  const [selected, setSelected] =
    useState<SelectedImage | null>(null);

  /*
   * Automatically turn every project-content image
   * into a hoverable / clickable image.
   *
   * Doing this here means we do NOT need to manually
   * edit every ArtFigure or slideshow.
   */
  useEffect(() => {
    setSelected(null);

    const root =
      document.querySelector<HTMLElement>(
        ".project-page",
      );

    if (!root) {
      return;
    }

    const enhanceImages = () => {
      const images =
        root.querySelectorAll<HTMLImageElement>(
          "main img",
        );

      images.forEach((image) => {
        if (!isZoomableProjectImage(image)) {
          return;
        }

        image.classList.add(
          "project-zoom-image",
        );

        /*
         * Inactive slideshow images have
         * aria-hidden="true".
         * Don't make those keyboard-focusable.
         */
        if (
          image.getAttribute("aria-hidden") ===
          "true"
        ) {
          image.tabIndex = -1;
          return;
        }

        image.tabIndex = 0;
        image.setAttribute("role", "button");

        if (!image.getAttribute("aria-label")) {
          image.setAttribute(
            "aria-label",
            `${getImageDescription(
              image,
            )}. Click to enlarge.`,
          );
        }
      });
    };

    const openImage = (
      image: HTMLImageElement,
    ) => {
      const src =
        image.currentSrc || image.src;

      if (!src) {
        return;
      }

      setSelected({
        src,
        alt: getImageDescription(image),
      });
    };

    const handleClick = (
      event: MouseEvent,
    ) => {
      const target = event.target;

      if (
        !(target instanceof HTMLImageElement)
      ) {
        return;
      }

      if (!isZoomableProjectImage(target)) {
        return;
      }

      openImage(target);
    };

    const handleKeyDown = (
      event: KeyboardEvent,
    ) => {
      if (
        event.key !== "Enter" &&
        event.key !== " "
      ) {
        return;
      }

      const target = event.target;

      if (
        !(target instanceof HTMLImageElement)
      ) {
        return;
      }

      if (!isZoomableProjectImage(target)) {
        return;
      }

      event.preventDefault();

      openImage(target);
    };

    enhanceImages();

    /*
     * Slides change aria-hidden as they autoplay.
     * Observe that so only the active slide stays
     * keyboard-accessible.
     */
    const observer =
      new MutationObserver(() => {
        enhanceImages();
      });

    observer.observe(root, {
      subtree: true,
      childList: true,
      attributes: true,
      attributeFilter: ["aria-hidden"],
    });

    root.addEventListener(
      "click",
      handleClick,
    );

    root.addEventListener(
      "keydown",
      handleKeyDown,
    );

    return () => {
      observer.disconnect();

      root.removeEventListener(
        "click",
        handleClick,
      );

      root.removeEventListener(
        "keydown",
        handleKeyDown,
      );
    };
  }, [projectKey]);

  /*
   * Lock page scrolling and enable Escape-to-close
   * while the lightbox is open.
   */
  useEffect(() => {
    if (!selected) {
      return;
    }

    const previousOverflow =
      document.body.style.overflow;

    document.body.style.overflow = "hidden";

    const handleEscape = (
      event: KeyboardEvent,
    ) => {
      if (event.key === "Escape") {
        setSelected(null);
      }
    };

    window.addEventListener(
      "keydown",
      handleEscape,
    );

    return () => {
      document.body.style.overflow =
        previousOverflow;

      window.removeEventListener(
        "keydown",
        handleEscape,
      );
    };
  }, [selected]);

  if (!selected) {
    return null;
  }

  return (
    <div
      className="project-lightbox"
      role="dialog"
      aria-modal="true"
      aria-label={`Enlarged view: ${selected.alt}`}
      onMouseDown={(event) => {
        /*
         * Clicking the dark backdrop closes it.
         * Clicking the image does not.
         */
        if (
          event.target ===
          event.currentTarget
        ) {
          setSelected(null);
        }
      }}
    >
      <button
        className="project-lightbox__close"
        type="button"
        aria-label="Close enlarged image"
        onClick={() =>
          setSelected(null)
        }
      >
        ×
      </button>

      <figure
        className="project-lightbox__figure"
        onMouseDown={(event) =>
          event.stopPropagation()
        }
      >
        <div className="project-lightbox__image-wrap">
          <img
            className="project-lightbox__image"
            src={selected.src}
            alt={selected.alt}
            draggable={false}
          />
        </div>

        <figcaption className="project-lightbox__caption">
          {selected.alt}
        </figcaption>
      </figure>
    </div>
  );
}