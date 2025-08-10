// Image Handler for better loading and error handling

// Handle image loading with fallback
function handleImageLoad(img, fallbackElement) {
    img.addEventListener('load', function() {
        this.style.display = 'block';
        if (fallbackElement) {
            fallbackElement.style.display = 'none';
        }
    });
    
    img.addEventListener('error', function() {
        this.style.display = 'none';
        if (fallbackElement) {
            fallbackElement.style.display = 'flex';
        }
    });
}

// Preload images for better performance
function preloadImages(imageUrls) {
    imageUrls.forEach(url => {
        if (url) {
            const img = new Image();
            img.src = url;
        }
    });
}

// Create optimized image element with lazy loading
function createOptimizedImage(src, alt, className = '', onError = null) {
    const img = document.createElement('img');
    img.src = src;
    img.alt = alt;
    img.className = className;
    img.loading = 'lazy'; // Native lazy loading
    
    if (onError) {
        img.addEventListener('error', onError);
    }
    
    return img;
}

// Export functions
window.handleImageLoad = handleImageLoad;
window.preloadImages = preloadImages;
window.createOptimizedImage = createOptimizedImage;
