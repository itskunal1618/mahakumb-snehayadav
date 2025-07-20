// Events Page JavaScript Functionality

// DOM Elements
let filterButtons;
let timelineItems;
let specialEventCards;
let guidelineCards;
let isScrolling = false;

// Initialize Events Page
document.addEventListener('DOMContentLoaded', function() {
    initializeEventFilters();
    initializeAnimations();
    initializeCountdown();
    initializeEventSearch();
    initializeEventNotifications();
    initializeIntersectionObserver();
    initializeEventCalendar();
});

function initializeEventFilters() {
    filterButtons = document.querySelectorAll('.filter-btn');
    timelineItems = document.querySelectorAll('.timeline-item');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter');
            
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Filter timeline items
            filterTimelineItems(filter);
            
            // Add button click animation
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 150);
        });
    });
}

function filterTimelineItems(filter) {
    timelineItems.forEach((item, index) => {
        const categories = item.getAttribute('data-category');
        
        if (filter === 'all' || categories.includes(filter)) {
            item.style.display = 'flex';
            // Add staggered animation
            setTimeout(() => {
                item.classList.add('animate-in');
            }, index * 100);
        } else {
            item.style.display = 'none';
            item.classList.remove('animate-in');
        }
    });
    
    // Update timeline line height
    updateTimelineLine();
}

function updateTimelineLine() {
    const timeline = document.querySelector('.events-timeline');
    const visibleItems = document.querySelectorAll('.timeline-item[style*="flex"]');
    
    if (visibleItems.length > 0) {
        const lastItem = visibleItems[visibleItems.length - 1];
        const timelineHeight = lastItem.offsetTop + lastItem.offsetHeight;
        timeline.style.setProperty('--timeline-height', timelineHeight + 'px');
    }
}

function initializeAnimations() {
    // Animate royal bathing cards on scroll
    const bathingCards = document.querySelectorAll('.bathing-day-card');
    const specialCards = document.querySelectorAll('.special-event-card');
    const guidelineCards = document.querySelectorAll('.guideline-card');
    
    // Add initial animation classes
    bathingCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(50px)';
        card.style.transition = 'all 0.6s ease';
        card.style.transitionDelay = (index * 0.1) + 's';
    });
    
    specialCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(50px)';
        card.style.transition = 'all 0.6s ease';
        card.style.transitionDelay = (index * 0.1) + 's';
    });
    
    guidelineCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(50px)';
        card.style.transition = 'all 0.6s ease';
        card.style.transitionDelay = (index * 0.1) + 's';
    });
}

function initializeCountdown() {
    // Countdown to next royal bathing day
    const nextBathingDate = new Date('2025-01-29T04:00:00'); // Mauni Amavasya
    const countdownElement = createCountdownElement();
    
    if (countdownElement) {
        updateCountdown(nextBathingDate, countdownElement);
        setInterval(() => updateCountdown(nextBathingDate, countdownElement), 1000);
    }
}

function createCountdownElement() {
    const heroContent = document.querySelector('.events-hero .hero-content .container');
    if (!heroContent) return null;
    
    const countdownDiv = document.createElement('div');
    countdownDiv.className = 'countdown-container';
    countdownDiv.innerHTML = `
        <div class="countdown-title">
            <i class="fas fa-clock"></i>
            Next Royal Bathing Day
        </div>
        <div class="countdown-timer" id="countdown-timer">
            <div class="countdown-item">
                <span class="countdown-number" id="days">00</span>
                <span class="countdown-label">Days</span>
            </div>
            <div class="countdown-item">
                <span class="countdown-number" id="hours">00</span>
                <span class="countdown-label">Hours</span>
            </div>
            <div class="countdown-item">
                <span class="countdown-number" id="minutes">00</span>
                <span class="countdown-label">Minutes</span>
            </div>
            <div class="countdown-item">
                <span class="countdown-number" id="seconds">00</span>
                <span class="countdown-label">Seconds</span>
            </div>
        </div>
    `;
    
    // Add styles
    countdownDiv.style.cssText = `
        margin-top: 2rem;
        padding: 2rem;
        background: rgba(255, 255, 255, 0.1);
        border-radius: 15px;
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255, 255, 255, 0.2);
        text-align: center;
        color: white;
    `;
    
    heroContent.appendChild(countdownDiv);
    return countdownDiv;
}

function updateCountdown(targetDate, countdownElement) {
    const now = new Date().getTime();
    const distance = targetDate.getTime() - now;
    
    if (distance < 0) {
        countdownElement.innerHTML = '<div class="countdown-expired">Event has started!</div>';
        return;
    }
    
    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);
    
    const daysEl = countdownElement.querySelector('#days');
    const hoursEl = countdownElement.querySelector('#hours');
    const minutesEl = countdownElement.querySelector('#minutes');
    const secondsEl = countdownElement.querySelector('#seconds');
    
    if (daysEl) daysEl.textContent = days.toString().padStart(2, '0');
    if (hoursEl) hoursEl.textContent = hours.toString().padStart(2, '0');
    if (minutesEl) minutesEl.textContent = minutes.toString().padStart(2, '0');
    if (secondsEl) secondsEl.textContent = seconds.toString().padStart(2, '0');
}

function initializeEventSearch() {
    // Create search functionality
    const searchContainer = document.createElement('div');
    searchContainer.className = 'event-search-container';
    searchContainer.innerHTML = `
        <div class="search-input-wrapper">
            <i class="fas fa-search"></i>
            <input type="text" id="event-search" placeholder="Search events, ceremonies, or dates..." />
            <button class="clear-search" id="clear-search">
                <i class="fas fa-times"></i>
            </button>
        </div>
        <div class="search-results" id="search-results"></div>
    `;
    
    // Add styles
    searchContainer.style.cssText = `
        margin: 2rem 0;
        position: relative;
        max-width: 500px;
        margin-left: auto;
        margin-right: auto;
    `;
    
    const calendarContainer = document.querySelector('.calendar-container');
    if (calendarContainer) {
        calendarContainer.insertBefore(searchContainer, calendarContainer.firstChild);
        
        const searchInput = document.getElementById('event-search');
        const clearButton = document.getElementById('clear-search');
        const searchResults = document.getElementById('search-results');
        
        searchInput.addEventListener('input', debounce(function() {
            performEventSearch(this.value, searchResults);
        }, 300));
        
        clearButton.addEventListener('click', function() {
            searchInput.value = '';
            searchResults.innerHTML = '';
            showAllEvents();
        });
    }
}

function performEventSearch(query, resultsContainer) {
    if (query.length < 2) {
        resultsContainer.innerHTML = '';
        showAllEvents();
        return;
    }
    
    const allEvents = document.querySelectorAll('.timeline-item, .bathing-day-card, .special-event-card');
    const matchingEvents = [];
    
    allEvents.forEach(event => {
        const title = event.querySelector('h3')?.textContent.toLowerCase() || '';
        const description = event.querySelector('p')?.textContent.toLowerCase() || '';
        const date = event.querySelector('.date, .day')?.textContent.toLowerCase() || '';
        
        if (title.includes(query.toLowerCase()) || 
            description.includes(query.toLowerCase()) || 
            date.includes(query.toLowerCase())) {
            matchingEvents.push({
                element: event,
                title: event.querySelector('h3')?.textContent || 'Event',
                description: event.querySelector('p')?.textContent || '',
                type: event.classList.contains('timeline-item') ? 'Daily Event' : 
                      event.classList.contains('bathing-day-card') ? 'Royal Bathing' : 'Special Event'
            });
        }
    });
    
    displaySearchResults(matchingEvents, resultsContainer);
    highlightMatchingEvents(matchingEvents);
}

function displaySearchResults(results, container) {
    if (results.length === 0) {
        container.innerHTML = '<div class="no-results">No events found matching your search.</div>';
        return;
    }
    
    const resultsHTML = results.map(result => `
        <div class="search-result-item" onclick="scrollToEvent(this)" data-element-id="${getElementId(result.element)}">
            <div class="result-type">${result.type}</div>
            <div class="result-title">${result.title}</div>
            <div class="result-description">${result.description.substring(0, 100)}...</div>
        </div>
    `).join('');
    
    container.innerHTML = resultsHTML;
}

function highlightMatchingEvents(matchingEvents) {
    // Reset all events
    const allEvents = document.querySelectorAll('.timeline-item, .bathing-day-card, .special-event-card');
    allEvents.forEach(event => {
        event.style.opacity = '0.3';
        event.style.transform = 'scale(0.95)';
    });
    
    // Highlight matching events
    matchingEvents.forEach(match => {
        match.element.style.opacity = '1';
        match.element.style.transform = 'scale(1)';
        match.element.style.boxShadow = '0 0 20px rgba(255, 140, 0, 0.5)';
    });
}

function showAllEvents() {
    const allEvents = document.querySelectorAll('.timeline-item, .bathing-day-card, .special-event-card');
    allEvents.forEach(event => {
        event.style.opacity = '1';
        event.style.transform = 'scale(1)';
        event.style.boxShadow = '';
    });
}

function getElementId(element) {
    if (!element.id) {
        element.id = 'event-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
    }
    return element.id;
}

function scrollToEvent(resultItem) {
    const elementId = resultItem.getAttribute('data-element-id');
    const targetElement = document.getElementById(elementId);
    
    if (targetElement) {
        targetElement.scrollIntoView({
            behavior: 'smooth',
            block: 'center'
        });
        
        // Add highlight animation
        targetElement.style.animation = 'highlight-pulse 2s ease-in-out';
        setTimeout(() => {
            targetElement.style.animation = '';
        }, 2000);
    }
    
    // Clear search results
    document.getElementById('search-results').innerHTML = '';
    document.getElementById('event-search').value = '';
    showAllEvents();
}

function initializeEventNotifications() {
    // Check for upcoming events and show notifications
    const upcomingEvents = getUpcomingEvents();
    
    if (upcomingEvents.length > 0) {
        setTimeout(() => {
            showEventNotification(upcomingEvents[0]);
        }, 2000);
    }
}

function getUpcomingEvents() {
    const now = new Date();
    const upcomingEvents = [
        {
            name: 'Mauni Amavasya Royal Bath',
            date: new Date('2025-01-29T04:00:00'),
            type: 'royal-bath'
        },
        {
            name: 'Basant Panchami Celebration',
            date: new Date('2025-02-03T04:30:00'),
            type: 'royal-bath'
        },
        {
            name: 'Maha Shivratri',
            date: new Date('2025-02-26T04:00:00'),
            type: 'royal-bath'
        }
    ];
    
    return upcomingEvents.filter(event => event.date > now).slice(0, 3);
}

function showEventNotification(event) {
    const notification = document.createElement('div');
    notification.className = 'event-notification';
    
    const timeUntil = getTimeUntilEvent(event.date);
    
    notification.innerHTML = `
        <div class="notification-icon">
            <i class="fas fa-bell"></i>
        </div>
        <div class="notification-content">
            <div class="notification-title">Upcoming Event</div>
            <div class="notification-event">${event.name}</div>
            <div class="notification-time">${timeUntil}</div>
        </div>
        <button class="notification-close" onclick="closeNotification(this)">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: linear-gradient(135deg, var(--primary-saffron), var(--golden-yellow));
        color: white;
        padding: 1rem;
        border-radius: 10px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
        z-index: 1000;
        max-width: 300px;
        transform: translateX(400px);
        transition: transform 0.3s ease;
        display: flex;
        align-items: center;
        gap: 1rem;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Auto-hide after 8 seconds
    setTimeout(() => {
        if (document.body.contains(notification)) {
            closeNotification(notification.querySelector('.notification-close'));
        }
    }, 8000);
}

function closeNotification(button) {
    const notification = button.closest('.event-notification');
    notification.style.transform = 'translateX(400px)';
    setTimeout(() => {
        if (document.body.contains(notification)) {
            document.body.removeChild(notification);
        }
    }, 300);
}

function getTimeUntilEvent(eventDate) {
    const now = new Date();
    const timeDiff = eventDate.getTime() - now.getTime();
    
    if (timeDiff < 0) return 'Event has started';
    
    const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (days > 0) {
        return `In ${days} day${days > 1 ? 's' : ''}`;
    } else if (hours > 0) {
        return `In ${hours} hour${hours > 1 ? 's' : ''}`;
    } else {
        return 'Starting soon';
    }
}

function initializeIntersectionObserver() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                
                // Add special animation for timeline items
                if (entry.target.classList.contains('timeline-item')) {
                    entry.target.classList.add('animate-in');
                }
            }
        });
    }, observerOptions);
    
    // Observe all animated elements
    const animatedElements = document.querySelectorAll(
        '.bathing-day-card, .special-event-card, .guideline-card, .timeline-item'
    );
    
    animatedElements.forEach(element => {
        observer.observe(element);
    });
}

function initializeEventCalendar() {
    // Add calendar view toggle
    const calendarToggle = document.createElement('button');
    calendarToggle.className = 'calendar-toggle-btn';
    calendarToggle.innerHTML = '<i class="fas fa-calendar-alt"></i> Calendar View';
    
    calendarToggle.style.cssText = `
        background: var(--deep-blue);
        color: white;
        border: none;
        padding: 0.8rem 1.5rem;
        border-radius: 25px;
        font-weight: 500;
        cursor: pointer;
        margin: 1rem;
        transition: all 0.3s ease;
        display: flex;
        align-items: center;
        gap: 0.5rem;
    `;
    
    const filterSection = document.querySelector('.calendar-filters');
    if (filterSection) {
        filterSection.appendChild(calendarToggle);
        
        calendarToggle.addEventListener('click', function() {
            toggleCalendarView();
        });
    }
}

function toggleCalendarView() {
    const timeline = document.querySelector('.events-timeline');
    const isCalendarView = timeline.classList.contains('calendar-view');
    
    if (isCalendarView) {
        timeline.classList.remove('calendar-view');
        document.querySelector('.calendar-toggle-btn').innerHTML = 
            '<i class="fas fa-calendar-alt"></i> Calendar View';
    } else {
        timeline.classList.add('calendar-view');
        document.querySelector('.calendar-toggle-btn').innerHTML = 
            '<i class="fas fa-list"></i> Timeline View';
        generateCalendarView();
    }
}

function generateCalendarView() {
    // This would generate a calendar grid view of events
    // For now, we'll just rearrange the timeline items in a grid
    const timeline = document.querySelector('.events-timeline');
    timeline.style.display = 'grid';
    timeline.style.gridTemplateColumns = 'repeat(auto-fit, minmax(300px, 1fr))';
    timeline.style.gap = '1rem';
    
    const timelineItems = timeline.querySelectorAll('.timeline-item');
    timelineItems.forEach(item => {
        item.style.flexDirection = 'column';
        item.style.margin = '0';
        
        const content = item.querySelector('.timeline-content');
        if (content) {
            content.style.margin = '0';
            content.style.textAlign = 'left';
        }
        
        const icon = item.querySelector('.event-icon');
        if (icon) {
            icon.style.position = 'relative';
            icon.style.left = 'auto';
            icon.style.top = 'auto';
            icon.style.transform = 'none';
            icon.style.marginBottom = '1rem';
        }
    });
}

// Utility Functions
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

function formatDate(date) {
    const options = { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        weekday: 'long'
    };
    return date.toLocaleDateString('en-IN', options);
}

function formatTime(date) {
    const options = { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true
    };
    return date.toLocaleTimeString('en-IN', options);
}

// Export event data for other pages
window.EventsData = {
    getRoyalBathingDates: function() {
        return [
            { name: 'Makar Sankranti', date: '2025-01-14', time: '4:00 AM' },
            { name: 'Mauni Amavasya', date: '2025-01-29', time: '3:30 AM' },
            { name: 'Basant Panchami', date: '2025-02-03', time: '4:30 AM' },
            { name: 'Maghi Purnima', date: '2025-02-12', time: '5:00 AM' },
            { name: 'Maha Shivratri', date: '2025-02-26', time: '4:00 AM' },
            { name: 'Holi', date: '2025-03-14', time: '5:30 AM' }
        ];
    },
    
    getUpcomingEvents: getUpcomingEvents,
    formatDate: formatDate,
    formatTime: formatTime
};

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes highlight-pulse {
        0%, 100% { box-shadow: 0 0 0 rgba(255, 140, 0, 0.5); }
        50% { box-shadow: 0 0 30px rgba(255, 140, 0, 0.8); }
    }
    
    .search-input-wrapper {
        position: relative;
        display: flex;
        align-items: center;
    }
    
    .search-input-wrapper i {
        position: absolute;
        left: 1rem;
        color: #666;
        z-index: 2;
    }
    
    .search-input-wrapper input {
        width: 100%;
        padding: 1rem 1rem 1rem 3rem;
        border: 2px solid #e9ecef;
        border-radius: 25px;
        font-size: 1rem;
        transition: all 0.3s ease;
    }
    
    .search-input-wrapper input:focus {
        outline: none;
        border-color: var(--primary-saffron);
        box-shadow: 0 0 0 3px rgba(255, 140, 0, 0.1);
    }
    
    .clear-search {
        position: absolute;
        right: 1rem;
        background: none;
        border: none;
        color: #666;
        cursor: pointer;
        padding: 0.5rem;
        border-radius: 50%;
        transition: all 0.3s ease;
    }
    
    .clear-search:hover {
        background: #f8f9fa;
        color: var(--primary-saffron);
    }
    
    .search-results {
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        background: white;
        border-radius: 10px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
        max-height: 300px;
        overflow-y: auto;
        z-index: 1000;
        margin-top: 0.5rem;
    }
    
    .search-result-item {
        padding: 1rem;
        border-bottom: 1px solid #f0f0f0;
        cursor: pointer;
        transition: all 0.3s ease;
    }
    
    .search-result-item:hover {
        background: #f8f9fa;
    }
    
    .search-result-item:last-child {
        border-bottom: none;
    }
    
    .result-type {
        font-size: 0.8rem;
        color: var(--primary-saffron);
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 1px;
        margin-bottom: 0.3rem;
    }
    
    .result-title {
        font-weight: 600;
        color: var(--deep-blue);
        margin-bottom: 0.3rem;
    }
    
    .result-description {
        font-size: 0.9rem;
        color: #666;
        line-height: 1.4;
    }
    
    .no-results {
        padding: 2rem;
        text-align: center;
        color: #666;
        font-style: italic;
    }
`;
document.head.appendChild(style);