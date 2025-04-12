
import * as React from "react";

// The breakpoint for mobile devices (768px is standard for tablets)
const MOBILE_BREAKPOINT = 768;

/**
 * Hook to detect if the current viewport is mobile-sized
 * @returns boolean indicating if the viewport is mobile-sized
 */
export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean>(false);

  React.useEffect(() => {
    // Function to check if window width is less than mobile breakpoint
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };

    // Set initial value
    checkIfMobile();

    // Add event listener for window resize
    window.addEventListener("resize", checkIfMobile);

    // Clean up event listener
    return () => window.removeEventListener("resize", checkIfMobile);
  }, []);

  return isMobile;
}

// Additional breakpoints for more specific responsive design
export function useBreakpoint() {
  const [breakpoint, setBreakpoint] = React.useState<"xs" | "sm" | "md" | "lg" | "xl" | "2xl">("xs");

  React.useEffect(() => {
    const checkBreakpoint = () => {
      const width = window.innerWidth;
      if (width < 640) {
        setBreakpoint("xs");
      } else if (width >= 640 && width < 768) {
        setBreakpoint("sm");
      } else if (width >= 768 && width < 1024) {
        setBreakpoint("md");
      } else if (width >= 1024 && width < 1280) {
        setBreakpoint("lg");
      } else if (width >= 1280 && width < 1536) {
        setBreakpoint("xl");
      } else {
        setBreakpoint("2xl");
      }
    };

    checkBreakpoint();
    window.addEventListener("resize", checkBreakpoint);
    return () => window.removeEventListener("resize", checkBreakpoint);
  }, []);

  return breakpoint;
}
