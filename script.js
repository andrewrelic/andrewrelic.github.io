document.addEventListener('DOMContentLoaded', function() {
    // ------------------------------------
    // 1. Mobile Menu Toggle
    // ------------------------------------
    const menuToggle = document.querySelector('.menu-toggle');
    const mainNav = document.getElementById('mainNav');

    menuToggle.addEventListener('click', function() {
        const isExpanded = this.getAttribute('aria-expanded') === 'true' || false;
        
        mainNav.classList.toggle('active');
        this.setAttribute('aria-expanded', !isExpanded);
        
        // Change icon from hamburger to 'X' (times icon)
        const icon = this.querySelector('i');
        if (mainNav.classList.contains('active')) {
            icon.className = 'fas fa-times';
        } else {
            icon.className = 'fas fa-bars';
        }
    });

    // ------------------------------------
    // 2. Featured Content Carousel (Slider)
    // ------------------------------------
    const carouselInner = document.getElementById('carouselInner');
    if (carouselInner) {
        const panels = carouselInner.querySelectorAll('.carousel-panel');
        const totalPanels = panels.length;
        let currentIndex = 0;
        const intervalTime = 5000; // 5 seconds for auto-rotate

        // Function to show a specific panel
        function showPanel(index) {
            // Remove 'active' from all
            panels.forEach(panel => panel.classList.remove('active'));
            // Add 'active' to the desired panel
            panels[index].classList.add('active');
        }

        // Function to advance the carousel
        function nextPanel() {
            currentIndex = (currentIndex + 1) % totalPanels;
            showPanel(currentIndex);
        }

        // Auto-rotate interval
        let rotationInterval = setInterval(nextPanel, intervalTime);

        // Manual navigation buttons
        const prevButton = document.querySelector('.carousel-nav .prev');
        const nextButton = document.querySelector('.carousel-nav .next');

        function handleManualNav(direction) {
            // Clear the auto-rotate when manually navigated
            clearInterval(rotationInterval);

            if (direction === 'next') {
                currentIndex = (currentIndex + 1) % totalPanels;
            } else {
                currentIndex = (currentIndex - 1 + totalPanels) % totalPanels;
            }
            showPanel(currentIndex);

            // Restart the auto-rotate after a delay (e.g., after 10 seconds of user inactivity)
            rotationInterval = setInterval(nextPanel, intervalTime);
        }

        nextButton.addEventListener('click', () => handleManualNav('next'));
        prevButton.addEventListener('click', () => handleManualNav('prev'));

        // Initial display
        showPanel(currentIndex);
    }
});
