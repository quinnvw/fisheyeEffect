(function () {
    'use strict';

    window.initFisheyeEffect = function (flexSliderId, leftMarkerId, centerMarkerId, rightMarkerId) {
        function init() {
            const flexSlider = document.querySelector(`[id*="${flexSliderId}"]`);
            const leftMarker = document.querySelector(`[id*="${leftMarkerId}"]`);
            const centerMarker = document.querySelector(`[id*="${centerMarkerId}"]`);
            const rightMarker = document.querySelector(`[id*="${rightMarkerId}"]`);

            if (!flexSlider || !leftMarker || !centerMarker || !rightMarker) {
                console.warn('Fisheye elements not found, retrying...');
                setTimeout(init, 100);
                return;
            }

            console.log('Fisheye effect initialized');

            function applyFisheyeEffect() {
                const items = Array.from(flexSlider.children).filter(child => {
                    return !child.id.includes('Marker') && !child.id.includes('marker');
                });

                const leftRect = leftMarker.getBoundingClientRect();
                const centerRect = centerMarker.getBoundingClientRect();
                const rightRect = rightMarker.getBoundingClientRect();

                const centerPos = centerRect.left + (centerRect.width / 2);
                const leftPos = leftRect.left + (leftRect.width / 2);
                const rightPos = rightRect.left + (rightRect.width / 2);

                items.forEach(item => {
                    const itemRect = item.getBoundingClientRect();
                    const itemCenter = itemRect.left + (itemRect.width / 2);

                    let transform, opacity, zIndex;

                    const distanceFromCenter = itemCenter - centerPos;
                    const totalLeftDistance = centerPos - leftPos;
                    const totalRightDistance = rightPos - centerPos;

                    if (Math.abs(distanceFromCenter) < 50) {
                        transform = 'scale(1) rotateY(0deg)';
                        opacity = '1';
                        zIndex = '10';
                    } else if (distanceFromCenter < 0) {
                        const normalizedDistance = Math.abs(distanceFromCenter) / totalLeftDistance;
                        const clampedDistance = Math.min(normalizedDistance, 1);

                        const rotation = clampedDistance * 45;
                        const scale = Math.max(0.7, 1 - (clampedDistance * 0.3));
                        const opacityValue = Math.max(0.6, 1 - (clampedDistance * 0.4));

                        transform = `scale(${scale}) rotateY(${rotation}deg)`;
                        opacity = `${opacityValue}`;
                        zIndex = `${Math.round(10 - (clampedDistance * 9))}`;
                    } else {
                        const normalizedDistance = distanceFromCenter / totalRightDistance;
                        const clampedDistance = Math.min(normalizedDistance, 1);

                        const rotation = -clampedDistance * 45;
                        const scale = Math.max(0.7, 1 - (clampedDistance * 0.3));
                        const opacityValue = Math.max(0.6, 1 - (clampedDistance * 0.4));

                        transform = `scale(${scale}) rotateY(${rotation}deg)`;
                        opacity = `${opacityValue}`;
                        zIndex = `${Math.round(10 - (clampedDistance * 9))}`;
                    }

                    item.style.transform = transform;
                    item.style.opacity = opacity;
                    item.style.zIndex = zIndex;
                    item.style.transition = 'all 0.3s ease-out';
                });
            }

            applyFisheyeEffect();

            let scrollTimeout;
            flexSlider.addEventListener('scroll', () => {
                clearTimeout(scrollTimeout);
                scrollTimeout = setTimeout(applyFisheyeEffect, 16);
            });

            window.addEventListener('resize', applyFisheyeEffect);
        }

        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', init);
        } else {
            init();
        }
    };
})();
