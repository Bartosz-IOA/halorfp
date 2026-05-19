import React, { createContext, useCallback, useContext, useMemo, useRef } from 'react';

type EdgnexReportNavContextValue = {
  registerSection: (sectionId: string, expand: () => void) => () => void;
  jumpToSection: (sectionId: string) => void;
};

const EdgnexReportNavContext = createContext<EdgnexReportNavContextValue | null>(null);

export function EdgnexReportNavProvider({ children }: { children: React.ReactNode }) {
  const expandersRef = useRef(new Map<string, () => void>());
  const pendingOpenRef = useRef(new Set<string>());

  const registerSection = useCallback((sectionId: string, expand: () => void) => {
    expandersRef.current.set(sectionId, expand);
    if (pendingOpenRef.current.has(sectionId)) {
      expand();
      pendingOpenRef.current.delete(sectionId);
    }
    return () => {
      expandersRef.current.delete(sectionId);
    };
  }, []);

  const jumpToSection = useCallback((sectionId: string) => {
    const expand = expandersRef.current.get(sectionId);
    if (expand) {
      expand();
    } else {
      pendingOpenRef.current.add(sectionId);
    }

    const scrollToTarget = (attempt = 0) => {
      const el = document.getElementById(sectionId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        return;
      }
      if (attempt < 120) {
        window.requestAnimationFrame(() => scrollToTarget(attempt + 1));
      }
    };

    // Brief delay when expanding so layout height updates before scroll (lazy sections included).
    window.setTimeout(() => scrollToTarget(), expand ? 80 : 0);
  }, []);

  const value = useMemo(
    () => ({ registerSection, jumpToSection }),
    [registerSection, jumpToSection],
  );

  return <EdgnexReportNavContext.Provider value={value}>{children}</EdgnexReportNavContext.Provider>;
}

export function useEdgnexReportNav() {
  const ctx = useContext(EdgnexReportNavContext);
  if (!ctx) {
    throw new Error('useEdgnexReportNav must be used within EdgnexReportNavProvider');
  }
  return ctx;
}

/** Bind accordion expand to a report section id (for use with AccordionSection). */
export function useEdgnexSectionExpandBinding(sectionId: string | undefined) {
  const { registerSection } = useEdgnexReportNav();
  return useCallback(
    (expand: () => void) => {
      if (!sectionId) return undefined;
      return registerSection(sectionId, expand);
    },
    [registerSection, sectionId],
  );
}
