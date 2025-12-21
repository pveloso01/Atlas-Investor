'use client';

import { useState, useEffect, useRef } from 'react';

/**
 * Hook to calculate the safe bottom position for floating widgets
 * to ensure they never overlap with the footer.
 * Returns the bottom offset in pixels - widgets should use this as their bottom value.
 */
export function useFooterPosition() {
  const [bottomOffset, setBottomOffset] = useState(24);
  const rafIdRef = useRef<number | null>(null);
  const lastOffsetRef = useRef<number>(24);

  useEffect(() => {
    const calculateOffset = () => {
      const footer = document.querySelector('footer');
      if (!footer) {
        const newOffset = 24;
        if (lastOffsetRef.current !== newOffset) {
          lastOffsetRef.current = newOffset;
          setBottomOffset(newOffset);
        }
        return;
      }

      const footerRect = footer.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const footerTop = footerRect.top;
      const footerBottom = footerRect.bottom;

      // Default position: widgets stay at bottom of viewport
      const defaultBottom = 24;
      
      // Padding between widget and footer when footer is visible
      const paddingAboveFooter = 16;
      
      // Widget height (FAB is 56px)
      const widgetHeight = 56;
      
      let newOffset: number;
      
      // Check if footer is visible in viewport
      const isFooterVisible = footerTop < viewportHeight && footerBottom > 0;
      
      if (isFooterVisible) {
        // Footer is visible - calculate distance from bottom of viewport to top of footer
        const distanceToFooterTop = viewportHeight - footerTop;
        
        // Position widget so its TOP edge is above footer's TOP edge
        // Widget bottom = distance to footer top + widget height + padding
        // This ensures widget top = footer top + padding
        const offsetAboveFooter = distanceToFooterTop + widgetHeight + paddingAboveFooter;
        
        // Use the larger of: default bottom position OR position above footer
        // This ensures widgets smoothly transition from bottom to above footer
        newOffset = Math.max(defaultBottom, offsetAboveFooter);
      } else {
        // Footer is not visible - widgets stay at bottom of viewport
        newOffset = defaultBottom;
      }

      // Update immediately if value changed (reduced threshold for more responsive updates)
      if (Math.abs(lastOffsetRef.current - newOffset) > 0.5) {
        lastOffsetRef.current = newOffset;
        setBottomOffset(newOffset);
      }
    };

    // Resize handler - use RAF for smooth updates
    const handleResize = () => {
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
      }
      rafIdRef.current = requestAnimationFrame(calculateOffset);
    };

    // Calculate on mount
    calculateOffset();
    
    // Use Intersection Observer for footer visibility (more efficient than scroll)
    const footer = document.querySelector('footer');
    if (footer) {
      const observer = new IntersectionObserver(
        () => {
          // Use RAF to batch updates
          if (rafIdRef.current) {
            cancelAnimationFrame(rafIdRef.current);
          }
          rafIdRef.current = requestAnimationFrame(calculateOffset);
        },
        {
          root: null,
          rootMargin: '0px',
          threshold: [0, 0.01, 0.05, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1],
        }
      );

      observer.observe(footer);

      // Also use ResizeObserver for footer size changes
      const resizeObserver = new ResizeObserver(() => {
        if (rafIdRef.current) {
          cancelAnimationFrame(rafIdRef.current);
        }
        rafIdRef.current = requestAnimationFrame(calculateOffset);
      });
      resizeObserver.observe(footer);

      // Scroll handler - use RAF directly for immediate updates
      const handleScroll = () => {
        if (rafIdRef.current) {
          cancelAnimationFrame(rafIdRef.current);
        }
        rafIdRef.current = requestAnimationFrame(calculateOffset);
      };

      window.addEventListener('scroll', handleScroll, { passive: true });
      window.addEventListener('resize', handleResize);

      return () => {
        observer.disconnect();
        resizeObserver.disconnect();
        window.removeEventListener('scroll', handleScroll);
        window.removeEventListener('resize', handleResize);
        if (rafIdRef.current) {
          cancelAnimationFrame(rafIdRef.current);
        }
      };
    }

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
      }
    };
  }, []);

  return bottomOffset;
}

