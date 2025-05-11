/**
 * Image Optimization Script
 * - Implements lazy loading for images
 * - Provides WebP detection and fallback
 * - Optimizes image loading sequence
 */

// Check if the browser supports WebP format
function checkWebpSupport() {
  return new Promise((resolve) => {
    const webpImage = new Image();
    webpImage.onload = function() { resolve(true); };
    webpImage.onerror = function() { resolve(false); };
    webpImage.src = 'data:image/webp;base64,UklGRhoAAABXRUJQVlA4TA0AAAAvAAAAEAcQERGIiP4HAA==';
  });
}

// Initialize image optimization
async function initImageOptimization() {
  // Check WebP support
  const supportsWebP = await checkWebpSupport();
  
  // Add class to body for CSS targeting
  if (supportsWebP) {
    document.body.classList.add('webp-support');
  } else {
    document.body.classList.add('no-webp-support');
    
    // Replace WebP sources with fallback
    document.querySelectorAll('source[type="image/webp"]').forEach(source => {
      source.remove();
    });
  }
  
  // Implement lazy loading for browsers that don't support it natively
  if (!('loading' in HTMLImageElement.prototype)) {
    // Polyfill lazy loading
    const lazyImages = document.querySelectorAll('img[loading="lazy"]');
    
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            
            // Load the image
            if (img.dataset.src) {
              img.src = img.dataset.src;
            }
            
            // Load srcset if available
            if (img.dataset.srcset) {
              img.srcset = img.dataset.srcset;
            }
            
            // Stop observing once loaded
            imageObserver.unobserve(img);
          }
        });
      });
      
      lazyImages.forEach(img => {
        // Store original src and srcset
        if (img.src && !img.dataset.src) {
          img.dataset.src = img.src;
          img.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1 1"%3E%3C/svg%3E';
        }
        
        if (img.srcset && !img.dataset.srcset) {
          img.dataset.srcset = img.srcset;
          img.srcset = '';
        }
        
        // Start observing
        imageObserver.observe(img);
      });
    } else {
      // Fallback for browsers without IntersectionObserver
      // Simple scroll-based lazy loading
      const lazyLoad = () => {
        lazyImages.forEach(img => {
          if (img.getBoundingClientRect().top <= window.innerHeight && 
              img.getBoundingClientRect().bottom >= 0 &&
              getComputedStyle(img).display !== 'none') {
            
            if (img.dataset.src) {
              img.src = img.dataset.src;
              img.removeAttribute('data-src');
            }
            
            if (img.dataset.srcset) {
              img.srcset = img.dataset.srcset;
              img.removeAttribute('data-srcset');
            }
          }
        });
        
        // Clean up if all images are loaded
        if (lazyImages.length === 0) {
          document.removeEventListener('scroll', lazyLoad);
          window.removeEventListener('resize', lazyLoad);
          window.removeEventListener('orientationchange', lazyLoad);
        }
      };
      
      // Add event listeners
      document.addEventListener('scroll', lazyLoad);
      window.addEventListener('resize', lazyLoad);
      window.addEventListener('orientationchange', lazyLoad);
      
      // Initial load
      lazyLoad();
    }
  }
  
  // Optimize image quality based on connection speed
  if ('connection' in navigator && navigator.connection.effectiveType) {
    const connectionType = navigator.connection.effectiveType;
    
    // For slow connections, use lower quality images
    if (connectionType === 'slow-2g' || connectionType === '2g') {
      document.body.classList.add('slow-connection');
      
      // Find high-res images and replace with lower quality versions
      document.querySelectorAll('img[srcset]').forEach(img => {
        // Keep only the lowest resolution option
        const srcsetParts = img.srcset.split(',');
        if (srcsetParts.length > 1) {
          // Get the first (lowest resolution) option
          img.srcset = srcsetParts[0];
        }
      });
    }
  }
}

// Run on DOMContentLoaded
document.addEventListener('DOMContentLoaded', initImageOptimization);
