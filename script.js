// Scroll Spy & Scroll-linked Horizontal Slide Implementation
document.addEventListener('DOMContentLoaded', () => {
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = {
        'history': document.getElementById('history-section'),
        'behaviors': document.getElementById('behaviors-section')
    };

    // Keep track of active active-line indicators
    const updateActiveIndicator = (activeTarget) => {
        const links = document.querySelectorAll(`.nav-link[data-target="${activeTarget}"]`);
        
        links.forEach(link => {
            const menu = link.closest('.nav-menu');
            if (menu) {
                const indicator = menu.querySelector('.active-line');
                if (indicator) {
                    const linkRect = link.getBoundingClientRect();
                    const menuRect = menu.getBoundingClientRect();
                    const offsetLeft = linkRect.left - menuRect.left;
                    
                    indicator.style.left = `${offsetLeft}px`;
                    indicator.style.width = `${linkRect.width}px`;
                }
            }
        });
    };

    // Scroll Spy: Highlight header menu item depending on vertical scroll position
    const handleScrollSpy = () => {
        const scrollPosition = window.scrollY + 150; // offset for header detection
        
        let currentSection = 'history';
        const behaviorsTop = sections['behaviors'].offsetTop;
        
        if (scrollPosition >= behaviorsTop) {
            currentSection = 'behaviors';
        }

        // Highlight header links
        document.querySelectorAll('.nav-menu .nav-link').forEach(link => {
            if (link.getAttribute('data-target') === currentSection) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
        
        // Highlight footer links
        document.querySelectorAll('.footer-nav .nav-link').forEach(link => {
            if (link.getAttribute('data-target') === currentSection) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });

        updateActiveIndicator(currentSection);
    };

    // Horizontal Scroll Trigger: Slide timeline horizontally relative to vertical scroll
    const timelineSection = document.getElementById('history-timeline-section');
    const horizontalTrack = document.querySelector('.horizontal-track');
    
    const handleHorizontalScroll = () => {
        if (!timelineSection || !horizontalTrack) return;
        
        const rect = timelineSection.getBoundingClientRect();
        const sectionTop = timelineSection.offsetTop;
        const sectionHeight = timelineSection.offsetHeight;
        const viewHeight = window.innerHeight;
        
        const scrollStart = sectionTop;
        const scrollEnd = sectionTop + sectionHeight - viewHeight;
        const currentScroll = window.scrollY;
        
        const W = window.innerWidth;
        const L = Math.max(0, (W - 1420) / 2);
        
        // Dynamic translation bounds based on screen width
        let tStart = 234 - L;
        let tEnd = W - L - 1653;
        
        // If screen is wider than original Figma design width, keep original positions
        if (W >= 1920) {
            tStart = 0;
            tEnd = 0;
        }
        
        if (currentScroll >= scrollStart && currentScroll <= scrollEnd) {
            let progress = (currentScroll - scrollStart) / (sectionHeight - viewHeight);
            
            // Reach end translation at 80% of scroll depth, hold for last 20%
            progress = Math.min(1.0, progress / 0.8);
            
            const tx = tStart + progress * (tEnd - tStart);
            horizontalTrack.style.transform = `translateX(${tx}px)`;
        } else if (currentScroll < scrollStart) {
            horizontalTrack.style.transform = `translateX(${tStart}px)`;
        } else if (currentScroll > scrollEnd) {
            horizontalTrack.style.transform = `translateX(${tEnd}px)`;
        }
    };

    // Back-to-top Button Logic
    const topButton = document.getElementById('back-to-top');
    const handleTopButtonVisibility = () => {
        if (!topButton) return;
        if (window.scrollY > 300) {
            topButton.classList.add('visible');
        } else {
            topButton.classList.remove('visible');
        }
    };

    if (topButton) {
        topButton.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // Set up click handlers on navigation menu links (smooth scrolling)
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('data-target') + '-section';
            const targetSection = document.getElementById(targetId);
            if (targetSection) {
                // If it is behaviors-section, scroll exactly to behaviors
                // If it is history-section, scroll to top
                const targetScrollTop = targetId === 'history-section' ? 0 : targetSection.offsetTop;
                window.scrollTo({
                    top: targetScrollTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Event listeners
    window.addEventListener('scroll', () => {
        handleScrollSpy();
        handleHorizontalScroll();
        handleTopButtonVisibility();
    });
    
    window.addEventListener('resize', () => {
        handleScrollSpy();
        handleHorizontalScroll();
        handleTopButtonVisibility();
    });
    
    // Initial calls
    setTimeout(() => {
        handleScrollSpy();
        handleHorizontalScroll();
        handleTopButtonVisibility();
    }, 100);
});
