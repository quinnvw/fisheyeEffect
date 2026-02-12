(function() {
    'use strict';
    
    window.initFisheyeEffect = function(flexSliderId, leftMarkerId, centerMarkerId, rightMarkerId) {
        function init() {
            var flexSlider = document.querySelector('[id*="' + flexSliderId + '"]');
            var leftMarker = document.querySelector('[id*="' + leftMarkerId + '"]');
            var centerMarker = document.querySelector('[id*="' + centerMarkerId + '"]');
            var rightMarker = document.querySelector('[id*="' + rightMarkerId + '"]');
            
            if (!flexSlider || !leftMarker || !centerMarker || !rightMarker) {
                console.error('Fisheye elements not found, retrying...');
                setTimeout(init, 100);
                return;
            }
            
            console.log('Fisheye effect initialized');
            
            function applyFisheyeEffect() {
                var items = Array.from(flexSlider.children).filter(function(child) {
                    return !child.id.includes('Marker') && !child.id.includes('marker');
                });
                
                var leftRect = leftMarker.getBoundingClientRect();
                var centerRect = centerMarker.getBoundingClientRect();
                var rightRect = rightMarker.getBoundingClientRect();
                
                var centerPos = centerRect.left + (centerRect.width / 2);
                var leftPos = leftRect.left + (leftRect.width / 2);
                var rightPos = rightRect.left + (rightRect.width / 2);
                
                items.forEach(function(item) {
                    var itemRect = item.getBoundingClientRect();
                    var itemCenter = itemRect.left + (itemRect.width / 2);
                    
                    var transform, opacity, zIndex;
                    
                    var distanceFromCenter = itemCenter - centerPos;
                    var totalLeftDistance = centerPos - leftPos;
                    var totalRightDistance = rightPos - centerPos;
                    
                    if (Math.abs(distanceFromCenter) < 50) {
                        transform = 'scale(1) rotateY(0deg)';
                        opacity = '1';
                        zIndex = '10';
                    } else if (distanceFromCenter < 0) {
                        var normalizedDistance = Math.abs(distanceFromCenter) / totalLeftDistance;
                        var clampedDistance = Math.min(normalizedDistance, 1);
                        
                        var rotation = clampedDistance * 45;
                        var scale = Math.max(0.7, 1 - (clampedDistance * 0.3));
                        var opacityValue = Math.max(0.6, 1 - (clampedDistance * 0.4));
                        
                        transform = 'scale(' + scale + ') rotateY(' + rotation + 'deg)';
                        opacity = '' + opacityValue;
                        zIndex = '' + Math.round(10 - (clampedDistance * 9));
                    } else {
                        var normalizedDistance = distanceFromCenter / totalRightDistance;
                        var clampedDistance = Math.min(normalizedDistance, 1);
                        
                        var rotation = -clampedDistance * 45;
                        var scale = Math.max(0.7, 1 - (clampedDistance * 0.3));
                        var opacityValue = Math.max(0.6, 1 - (clampedDistance * 0.4));
                        
                        transform = 'scale(' + scale + ') rotateY(' + rotation + 'deg)';
                        opacity = '' + opacityValue;
                        zIndex = '' + Math.round(10 - (clampedDistance * 9));
                    }
                    
                    item.style.transform = transform;
                    item.style.opacity = opacity;
                    item.style.zIndex = zIndex;
                    item.style.transition = 'all 0.3s ease-out';
                });
            }
            
            applyFisheyeEffect();
            
            var scrollTimeout;
            flexSlider.addEventListener('scroll', function() {
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
