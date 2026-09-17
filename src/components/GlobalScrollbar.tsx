import {
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";

import "../global-scrollbar.css";

type ScrollbarState = {
  visible: boolean;
  thumbHeight: number;
  thumbTop: number;
};

const MIN_THUMB_HEIGHT = 56;
const TRACK_PADDING = 6;

export function GlobalScrollbar() {
  const trackRef = useRef<HTMLDivElement>(null);

  const dragRef = useRef({
    dragging: false,
    pointerStart: 0,
    scrollStart: 0,
  });

  const [state, setState] =
    useState<ScrollbarState>({
      visible: false,
      thumbHeight: MIN_THUMB_HEIGHT,
      thumbTop: TRACK_PADDING,
    });

  const updateScrollbar = () => {
    const track = trackRef.current;

    if (!track) {
      return;
    }

    const documentHeight =
      document.documentElement.scrollHeight;

    const viewportHeight =
      window.innerHeight;

    const maxScroll =
      documentHeight - viewportHeight;

    if (maxScroll <= 1) {
      setState({
        visible: false,
        thumbHeight: MIN_THUMB_HEIGHT,
        thumbTop: TRACK_PADDING,
      });

      return;
    }

    const usableTrackHeight =
      track.clientHeight -
      TRACK_PADDING * 2;

    const calculatedThumbHeight =
      usableTrackHeight *
      (viewportHeight / documentHeight);

    const thumbHeight = Math.max(
      MIN_THUMB_HEIGHT,
      Math.min(
        calculatedThumbHeight,
        usableTrackHeight,
      ),
    );

    const availableTravel =
      usableTrackHeight - thumbHeight;

    const scrollProgress =
      window.scrollY / maxScroll;

    const thumbTop =
      TRACK_PADDING +
      availableTravel * scrollProgress;

    setState({
      visible: true,
      thumbHeight,
      thumbTop,
    });
  };

  useEffect(() => {
    let animationFrame = 0;

    const scheduleUpdate = () => {
      if (animationFrame) {
        return;
      }

      animationFrame =
        requestAnimationFrame(() => {
          animationFrame = 0;

          updateScrollbar();
        });
    };

    updateScrollbar();

    window.addEventListener(
      "scroll",
      scheduleUpdate,
      {
        passive: true,
      },
    );

    window.addEventListener(
      "resize",
      scheduleUpdate,
    );

    const observer =
      new ResizeObserver(
        scheduleUpdate,
      );

    observer.observe(
      document.documentElement,
    );

    observer.observe(
      document.body,
    );

    return () => {
      window.removeEventListener(
        "scroll",
        scheduleUpdate,
      );

      window.removeEventListener(
        "resize",
        scheduleUpdate,
      );

      observer.disconnect();

      cancelAnimationFrame(
        animationFrame,
      );
    };
  }, []);

  const handleThumbPointerDown = (
    event: ReactPointerEvent<HTMLDivElement>,
  ) => {
    event.preventDefault();

    dragRef.current = {
      dragging: true,
      pointerStart: event.clientY,
      scrollStart: window.scrollY,
    };

    event.currentTarget.setPointerCapture(
      event.pointerId,
    );

    document.documentElement.classList.add(
      "custom-scrollbar-dragging",
    );
  };

  const handleThumbPointerMove = (
    event: ReactPointerEvent<HTMLDivElement>,
  ) => {
    if (
      !dragRef.current.dragging
    ) {
      return;
    }

    const track = trackRef.current;

    if (!track) {
      return;
    }

    const viewportHeight =
      window.innerHeight;

    const documentHeight =
      document.documentElement
        .scrollHeight;

    const maxScroll =
      documentHeight -
      viewportHeight;

    const usableTrackHeight =
      track.clientHeight -
      TRACK_PADDING * 2;

    const availableTravel =
      usableTrackHeight -
      state.thumbHeight;

    if (
      availableTravel <= 0 ||
      maxScroll <= 0
    ) {
      return;
    }

    const pointerDelta =
      event.clientY -
      dragRef.current.pointerStart;

    const scrollDelta =
      pointerDelta *
      (maxScroll /
        availableTravel);

    window.scrollTo({
      top:
        dragRef.current
          .scrollStart +
        scrollDelta,
      behavior: "auto",
    });
  };

  const stopDragging = () => {
    dragRef.current.dragging =
      false;

    document.documentElement.classList.remove(
      "custom-scrollbar-dragging",
    );
  };

  const handleTrackPointerDown = (
    event: ReactPointerEvent<HTMLDivElement>,
  ) => {
    if (
      event.target !==
      event.currentTarget
    ) {
      return;
    }

    const track =
      event.currentTarget;

    const rect =
      track.getBoundingClientRect();

    const clickPosition =
      event.clientY -
      rect.top;

    const usableTrackHeight =
      track.clientHeight -
      TRACK_PADDING * 2;

    const desiredThumbTop =
      clickPosition -
      state.thumbHeight / 2;

    const availableTravel =
      usableTrackHeight -
      state.thumbHeight;

    if (availableTravel <= 0) {
      return;
    }

    const clampedThumbTop =
      Math.max(
        TRACK_PADDING,
        Math.min(
          desiredThumbTop,
          TRACK_PADDING +
            availableTravel,
        ),
      );

    const progress =
      (clampedThumbTop -
        TRACK_PADDING) /
      availableTravel;

    const maxScroll =
      document.documentElement
        .scrollHeight -
      window.innerHeight;

    window.scrollTo({
      top:
        progress * maxScroll,
      behavior: "smooth",
    });
  };

  return (
    <div
      ref={trackRef}
      className={
        state.visible
          ? "global-scrollbar is-visible"
          : "global-scrollbar"
      }
      aria-hidden="true"
      onPointerDown={
        handleTrackPointerDown
      }
    >
      <div
        className="global-scrollbar__thumb"
        style={{
          height:
            state.thumbHeight,
          transform: `translateY(${state.thumbTop}px)`,
        }}
        onPointerDown={
          handleThumbPointerDown
        }
        onPointerMove={
          handleThumbPointerMove
        }
        onPointerUp={
          stopDragging
        }
        onPointerCancel={
          stopDragging
        }
      />
    </div>
  );
}