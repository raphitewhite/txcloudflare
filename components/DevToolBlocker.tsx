"use client";

import { useEffect, useCallback } from "react";

const DevToolBlocker = () => {
  const blockDevTools = useCallback(() => {
    // Intentionally no UI changes; just prevent common shortcuts.
  }, []);

  useEffect(() => {
    const isDesktop = window.matchMedia('(min-width: 1024px)').matches;

    if (!isDesktop) {
      return;
    }

    const devToolsCheck = () => {
      const threshold = 160;
      if (
        (window.outerWidth - window.innerWidth > threshold) ||
        (window.outerHeight - window.innerHeight > threshold)
      ) {
        blockDevTools();
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      // Block F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+Shift+C, Ctrl+U
      if (
        e.key === 'F12' ||
        (e.ctrlKey && e.shiftKey && ['I', 'J', 'C'].includes(e.key.toUpperCase())) ||
        (e.ctrlKey && e.key.toUpperCase() === 'U')
      ) {
        e.preventDefault();
        blockDevTools();
      }
    };

    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      blockDevTools();
    };

    const intervalId = setInterval(devToolsCheck, 1000);
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('contextmenu', handleContextMenu);

    // Cleanup
    return () => {
      clearInterval(intervalId);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('contextmenu', handleContextMenu);
    };
  }, [blockDevTools]);

  return null;
};

export default DevToolBlocker;
