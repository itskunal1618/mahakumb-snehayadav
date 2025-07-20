// Gallery Page JavaScript Functionality

// DOM Elements
let galleryGrid;
let filterButtons;
let galleryItems;
let lightbox;
let lightboxTitle;
let lightboxDescription;
let lightboxMedia;
let currentImageIndex = 0;
let filteredItems = [];

// Initialize Gallery
document.addEventListener('DOMContentLoaded', function() {
    initializeGallery();
    initializeFilters();
    initializeLightbox();
    initializeLoadMore();
    initializeIntersectionObserver();
    initGalleryStatsCountUp();
});

function initializeGallery() {
    galleryGrid = document.getElementById('galleryGrid');
    galleryItems = document.querySelectorAll('.gallery-item');
    lightbox = document.getElementById('lightbox');
    lightboxTitle = document.getElementById('lightbox-title');
    lightboxDescription = document.getElementById('lightbox-description');
    lightboxMedia = document.querySelector('.lightbox-media');
    
    // Convert NodeList to Array for easier manipulation
    filteredItems = Array.from(galleryItems);
}

function initializeFilters() {
    filterButtons = document.querySelectorAll('.filter-btn');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter');
            
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Filter gallery items
            filterGalleryItems(filter);
        });
    });
}

function filterGalleryItems(filter) {
    galleryItems.forEach(item => {
        const categories = item.getAttribute('data-category');
        
        if (filter === 'all' || categories.includes(filter)) {
            item.classList.remove('hidden');
            // Add staggered animation
            setTimeout(() => {
                item.style.opacity = '1';
                item.style.transform = 'scale(1)';
            }, Math.random() * 300);
        } else {
            item.classList.add('hidden');
            item.style.opacity = '0';
            item.style.transform = 'scale(0.8)';
        }
    });
    
    // Update filtered items array
    filteredItems = Array.from(galleryItems).filter(item => 
        !item.classList.contains('hidden')
    );
}

function initializeLightbox() {
    const lightboxClose = document.querySelector('.lightbox-close');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    
    // Close lightbox events
    lightboxClose.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', function(e) {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });
    
    // Navigation events
    prevBtn.addEventListener('click', showPreviousImage);
    nextBtn.addEventListener('click', showNextImage);
    
    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (lightbox.classList.contains('active')) {
            switch(e.key) {
                case 'Escape':
                    closeLightbox();
                    break;
                case 'ArrowLeft':
                    showPreviousImage();
                    break;
                case 'ArrowRight':
                    showNextImage();
                    break;
            }
        }
    });
}

function openLightbox(imageId) {
    const imageData = getImageData(imageId);
    
    if (imageData) {
        // Find current image index in filtered items
        currentImageIndex = filteredItems.findIndex(item => 
            item.querySelector('.view-btn').getAttribute('onclick').includes(imageId)
        );
        
        displayLightboxContent(imageData);
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Add entrance animation
        const lightboxContent = document.querySelector('.lightbox-content');
        lightboxContent.style.animation = 'lightboxFadeIn 0.3s ease-out';
    }
}

function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = 'auto';
}

function showPreviousImage() {
    if (currentImageIndex > 0) {
        currentImageIndex--;
        const prevItem = filteredItems[currentImageIndex];
        const imageId = extractImageIdFromItem(prevItem);
        const imageData = getImageData(imageId);
        displayLightboxContent(imageData);
    }
}

function showNextImage() {
    if (currentImageIndex < filteredItems.length - 1) {
        currentImageIndex++;
        const nextItem = filteredItems[currentImageIndex];
        const imageId = extractImageIdFromItem(nextItem);
        const imageData = getImageData(imageId);
        displayLightboxContent(imageData);
    }
}

function extractImageIdFromItem(item) {
    const onclickAttr = item.querySelector('.view-btn').getAttribute('onclick');
    const match = onclickAttr.match(/openLightbox\('([^']+)'\)/);
    return match ? match[1] : null;
}

function displayLightboxContent(imageData) {
    lightboxTitle.textContent = imageData.title;
    lightboxDescription.textContent = imageData.description;
    const mediaPlaceholder = lightboxMedia.querySelector('.media-placeholder');
    if (imageData.type === 'video') {
        mediaPlaceholder.innerHTML = `
            <i class="fas fa-play-circle"></i>
            <p>Video: ${imageData.title}</p>
            <small>Duration: ${imageData.duration || 'Unknown'}</small>
        `;
    } else if (imageData.imgUrl) {
        mediaPlaceholder.innerHTML = `
            <img src="${imageData.imgUrl}" alt="${imageData.title}" style="max-width:100%;max-height:100%;display:block;margin:auto;border-radius:12px;box-shadow:0 4px 24px rgba(0,0,0,0.18);background:#fff;" />
        `;
    } else {
        mediaPlaceholder.innerHTML = `
            <i class="fas fa-image"></i>
            <p>Photo: ${imageData.title}</p>
        `;
    }
}

function getImageData(imageId) {
    // Mock data for demonstration - in a real application, this would come from a database or API
    const imageDatabase = {
        'ganga-aarti': {
            title: 'Sacred Ganga Aarti',
            description: 'Thousands of devotees participate in the evening Aarti ceremony at Triveni Sangam, creating a mesmerizing spectacle of faith and devotion.',
            type: 'photo',
            imgUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80'
        },
        'crowd-aerial': {
            title: 'Sea of Devotion',
            description: 'Aerial view of the massive gathering at Sangam, showcasing the incredible scale of human participation in this sacred event.',
            type: 'photo',
            imgUrl: 'https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=1200&q=80'
        },
        'ritual-bath': {
            title: 'Sacred Bathing Ritual',
            description: 'Devotees taking the holy dip at Triveni Sangam for spiritual purification and divine blessings.',
            type: 'video',
            duration: '3:45',
            imgUrl: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=1200&q=80'
        },
        'naga-sadhus': {
            title: 'Naga Sadhus',
            description: 'Holy ascetics in procession',
            type: 'photo',
            imgUrl: 'https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?auto=format&fit=crop&w=1200&q=80'
        },
        'sangam-view': {
            title: 'Sangam Confluence',
            description: 'Sacred meeting of rivers',
            type: 'photo',
            imgUrl: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=1200&q=80'
        },
        'procession-video': {
            title: 'Kumbh Procession',
            description: 'Grand spiritual parade',
            type: 'video',
            duration: '5:20',
            imgUrl: 'https://images.unsplash.com/photo-1508672019048-805c876b67e2?auto=format&fit=crop&w=1200&q=80'
        },
        'havan-ritual': {
            title: 'Havan Ceremony',
            description: 'Sacred fire ritual',
            type: 'photo',
            imgUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=1200&q=80'
        },
        'night-gathering': {
            title: 'Night Gathering at Ghats',
            description: 'Devotees under starlit sky',
            type: 'photo',
            imgUrl: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=1200&q=80'
        },
        'spiritual-discourse': {
            title: 'Spiritual Discourse',
            description: 'Wisdom from saints',
            type: 'video',
            duration: '12:30',
            imgUrl: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=1200&q=80'
        },
        'sunrise-prayers': {
            title: 'Sunrise Prayers at Ganga',
            description: 'Dawn devotion at Ganga',
            type: 'photo',
            imgUrl: 'https://images.unsplash.com/photo-1508672019048-805c876b67e2?auto=format&fit=crop&w=1200&q=80'
        },
        'flower-offerings': {
            title: 'Flower Offerings at Kumbh',
            description: 'Sacred floral tributes',
            type: 'photo',
            imgUrl: 'https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=1200&q=80'
        },
        'cultural-performance': {
            title: 'Cultural Performances',
            description: 'Traditional music and dance',
            type: 'video',
            duration: '8:10',
            imgUrl: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=1200&q=80'
        }
    };
    return imageDatabase[imageId] || null;
}

function initializeLoadMore() {
    const loadMoreBtn = document.querySelector('.load-more-btn');
    let isLoading = false;
    
    loadMoreBtn.addEventListener('click', function() {
        if (isLoading) return;
        
        isLoading = true;
        this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';
        
        // Simulate loading delay
        setTimeout(() => {
            loadMoreImages();
            isLoading = false;
            this.innerHTML = '<i class="fas fa-plus-circle"></i> Load More Images';
        }, 1500);
    });
}

function loadMoreImages() {
    // Mock function to simulate loading more images
    const additionalImages = [
        {
            category: 'photos rituals',
            title: 'Sacred Chanting',
            description: 'Devotees chanting mantras',
            icon: 'fas fa-music',
            imgUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80'
        },
        {
            category: 'videos crowds',
            title: 'Crowd Movement',
            description: 'Time-lapse of devotee movement',
            icon: 'fas fa-play-circle',
            duration: '2:30',
            imgUrl: 'https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=600&q=80'
        },
        {
            category: 'photos rituals',
            title: 'Temple Prayers',
            description: 'Prayers at nearby temples',
            icon: 'fas fa-temple',
            imgUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&q=80'
        }
    ];
    
    additionalImages.forEach((img, index) => {
        const galleryItem = createGalleryItem(img, `new-image-${Date.now()}-${index}`);
        galleryGrid.appendChild(galleryItem);
        
        // Add entrance animation
        setTimeout(() => {
            galleryItem.style.opacity = '1';
            galleryItem.style.transform = 'translateY(0)';
        }, index * 200);
    });
    
    // Update gallery items array
    galleryItems = document.querySelectorAll('.gallery-item');
    filteredItems = Array.from(galleryItems).filter(item => 
        !item.classList.contains('hidden')
    );
    
    showNotification('New images loaded successfully!', 'success');
}

function createGalleryItem(imageData, imageId) {
    const galleryItem = document.createElement('div');
    galleryItem.className = 'gallery-item';
    galleryItem.setAttribute('data-category', imageData.category);
    galleryItem.style.opacity = '0';
    galleryItem.style.transform = 'translateY(30px)';
    galleryItem.style.transition = 'all 0.6s ease';
    
    const isVideo = imageData.duration;
    const videoClass = isVideo ? 'video-card' : '';
    const videoDuration = isVideo ? `<div class="video-duration">${imageData.duration}</div>` : '';
    
    let mediaContent = '';
    if (imageData.imgUrl) {
        mediaContent = `<img src="${imageData.imgUrl}" alt="${imageData.title}" style="width:100%;height:220px;object-fit:cover;border-radius:12px 12px 0 0;cursor:pointer;" onclick="openLightbox('${imageId}')" />`;
    } else {
        mediaContent = `<div class="image-placeholder"><i class="${imageData.icon}"></i></div>`;
    }
    galleryItem.innerHTML = `
        <div class="gallery-card ${videoClass}">
            ${mediaContent}
                <div class="placeholder-text">
                    <h4>${imageData.title}</h4>
                    <p>${imageData.description}</p>
                </div>
                ${videoDuration}
            <div class="gallery-overlay">
                <div class="overlay-content">
                    <h3>${imageData.title}</h3>
                    <p>Newly added content from MAHAKUMBH collection</p>
                    <button class="view-btn" onclick="openLightbox('${imageId}')">
                        <i class="fas fa-${isVideo ? 'play' : 'expand'}"></i>
                        ${isVideo ? 'Play Video' : 'View Full'}
                    </button>
                </div>
            </div>
        </div>
    `;
    
    return galleryItem;
}

function initializeIntersectionObserver() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                // Add staggered animation for gallery items
                const delay = Array.from(galleryItems).indexOf(entry.target) * 100;
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, delay);
            }
        });
    }, observerOptions);
    
    // Observe gallery items
    galleryItems.forEach(item => {
        observer.observe(item);
    });
}

// Search functionality
function initializeSearch() {
    const searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.placeholder = 'Search gallery...';
    searchInput.className = 'gallery-search';
    
    const filterSection = document.querySelector('.filter-section .container');
    filterSection.appendChild(searchInput);
    
    searchInput.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();
        
        galleryItems.forEach(item => {
            const title = item.querySelector('h4').textContent.toLowerCase();
            const description = item.querySelector('.placeholder-text p').textContent.toLowerCase();
            
            if (title.includes(searchTerm) || description.includes(searchTerm)) {
                item.style.display = 'block';
            } else {
                item.style.display = 'none';
            }
        });
    });
}

// Touch/Swipe support for mobile
function initializeTouchSupport() {
    let startX = 0;
    let startY = 0;
    
    lightbox.addEventListener('touchstart', function(e) {
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
    });
    
    lightbox.addEventListener('touchend', function(e) {
        const endX = e.changedTouches[0].clientX;
        const endY = e.changedTouches[0].clientY;
        
        const deltaX = endX - startX;
        const deltaY = endY - startY;
        
        // Horizontal swipe
        if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
            if (deltaX > 0) {
                showPreviousImage();
            } else {
                showNextImage();
            }
        }
        
        // Vertical swipe down to close
        if (deltaY > 100 && Math.abs(deltaX) < 50) {
            closeLightbox();
        }
    });
}

// Initialize touch support when DOM is loaded
document.addEventListener('DOMContentLoaded', initializeTouchSupport);

// Utility function for notifications (reusing from main script)
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: var(--primary-saffron);
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 10000;
        transform: translateX(400px);
        transition: transform 0.3s ease;
        max-width: 300px;
        font-weight: 500;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    setTimeout(() => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Performance optimization
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Lazy loading for images (when real images are added)
function initializeLazyLoading() {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            }
        });
    });
    
    const lazyImages = document.querySelectorAll('img[data-src]');
    lazyImages.forEach(img => imageObserver.observe(img));
}

// Initialize lazy loading
document.addEventListener('DOMContentLoaded', initializeLazyLoading);

// Count-up animation for stats in gallery-stats section
function animateCountUp(el, target, duration = 1800) {
    let start = 0;
    let startTimestamp = null;
    const plus = target.includes('+');
    const suffix = plus ? '+' : '';
    const displayTarget = parseInt(target.replace(/\D/g, ''));
    function step(timestamp) {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        el.textContent = Math.floor(progress * displayTarget) + suffix;
        if (progress < 1) {
            window.requestAnimationFrame(step);
        } else {
            el.textContent = target; // Ensure final value
        }
    }
    window.requestAnimationFrame(step);
}

function initGalleryStatsCountUp() {
    const statsSection = document.querySelector('.gallery-stats');
    if (!statsSection) return;
    const statNumbers = statsSection.querySelectorAll('.stat-number');
    let hasAnimated = false;
    function onScroll() {
        const rect = statsSection.getBoundingClientRect();
        if (!hasAnimated && rect.top < window.innerHeight && rect.bottom > 0) {
            statNumbers.forEach(el => {
                if (el.textContent.trim() === '1M+') {
                    // Do not animate this stat, just set the value
                    el.textContent = '1M+';
                } else {
                    animateCountUp(el, el.textContent.trim());
                }
            });
            hasAnimated = true;
            window.removeEventListener('scroll', onScroll);
        }
    }
    window.addEventListener('scroll', onScroll);
    // In case already in view on load
    onScroll();
}