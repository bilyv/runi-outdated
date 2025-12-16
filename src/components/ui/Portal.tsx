import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

interface PortalProps {
  children: React.ReactNode;
}

export function Portal({ children }: PortalProps) {
  const [mounted, setMounted] = useState(false);
  const portalRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // Create portal container only on client-side
    if (typeof document !== "undefined") {
      portalRef.current = document.createElement("div");
      document.body.appendChild(portalRef.current);
      setMounted(true);
      
      // Cleanup function
      return () => {
        if (portalRef.current) {
          document.body.removeChild(portalRef.current);
        }
      };
    }
  }, []);

  // Render children only after mounting to avoid SSR issues
  if (!mounted || !portalRef.current) {
    return null;
  }

  return createPortal(children, portalRef.current);
}