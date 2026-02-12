(function () {
    'use strict';

    window.initFisheyeEffect = function () {
        // No more parameters needed – we're using classes now

        function init() {
            const flexSlider = document.querySelector('.fisheye-container');
            const leftMarker  = document.querySelector('.fisheye-left-marker');
            const centerMarker = document.querySelector('.fisheye-center-marker');
            const rightMarker = document.querySelector('.fisheye-right-marker');

            if (!flexSlider || !leftMarker || !centerMarker || !rightMarker) {
                console.warn('Fisheye elements not found, retrying...');
                setTimeout(init, 150);
                return;
            }

            console.log('Fisheye effect initialized successfully');

            function applyFisheyeEffect() {
                // Filter out markers (using class check is more reliable)
                const items = Array.from(flexSlider.children).filter(child => {
                    return !child.classList.contains('fisheye-left-marker') &&
                           !child.classList.contains('fisheye-center-marker') &&
                           !child.classList.contains('fisheye-right-marker');
                });

                const leftRect   = leftMarker.getBoundingClientRect();
                const centerRect = centerMarker.getBoundingClientRect();
                const rightRect  = rightMarker.getBoundingClientRect();

                const centerPos = centerRect.left + (centerRect.width / 2);
                const leftPos   = leftRect.left   + (leftRect.width   / 2);
                const rightPos  = rightRect.left  + (rightRect.width  / 2);

                items.forEach(item => {
                    const itemRect = item.getBoundingClientRect();
                    const itemCenter = itemRect.left + (itemRect.width / 2);

                    let transform, opacity, zIndex;
                    const distanceFromCenter = itemCenter - centerPos;
                    const totalLeftDistance  = centerPos - leftPos;
                    const totalRightDistance = rightPos - centerPos;

                    if (Math.abs(distanceFromCenter) < 60) {  // slightly larger center zone
                        transform = 'scale(1) rotateY(0deg)';
                        opacity = '1';
                        zIndex = '10';
                    } else if (distanceFromCenter < 0) {
                        let normalized = Math.abs(distanceFromCenter) / totalLeftDistance;
                        let clamped = Math.min(normalized, 1);
                        let rotation = clamped * 50;               // slightly stronger rotation
                        let scale    = Math.max(0.68, 1 - clamped * 0.35);
                        let opac     = Math.max(0.55, 1 - clamped * 0.45);
                        transform = `scale(${scale}) rotateY(${rotation}deg)`;
                        opacity = opac;
                        zIndex = Math.round(10 - clamped * 9);
                    } else {
                        let normalized = distanceFromCenter / totalRightDistance;
                        let clamped = Math.min(normalized, 1);
                        let rotation = -clamped * 50;
                        let scale    = Math.max(0.68, 1 - clamped * 0.35);
                        let opac     = Math.max(0.55, 1 - clamped * 0.45);
                        transform = `scale(${scale}) rotateY(${rotation}deg)`;
                        opacity = opac;
                        zIndex = Math.round(10 - clamped * 9);
                    }

                    item.style.transform = transform;
                    item.style.opacity = opacity;
                    item.style.zIndex = zIndex;
                    item.style.transition = 'all 0.3s ease-out';
                });
            }

            // Initial call
            applyFisheyeEffect();

            // Scroll handler (debounced)
            let scrollTimeout;
            flexSlider.addEventListener('scroll', () => {
                clearTimeout(scrollTimeout);
                scrollTimeout = setTimeout(applyFisheyeEffect, 20);
            });

            // Resize handler
            window.addEventListener('resize', applyFisheyeEffect);

            // Optional: also call on images load (in case lazy loading affects sizes)
            flexSlider.addEventListener('load', applyFisheyeEffect, { capture: true });
        }

        // Run when DOM is ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', init);
        } else {
            init();
        }
    };
})();
