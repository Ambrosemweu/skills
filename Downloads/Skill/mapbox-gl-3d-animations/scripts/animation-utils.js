/**
 * Mapbox GL JS Animation Utilities
 * A collection of reusable animation functions for 3D map animations
 */

/**
 * Easing functions for smooth animations
 */
export const easings = {
    linear: (t) => t,
    
    // Ease In (slow start)
    easeInQuad: (t) => t * t,
    easeInCubic: (t) => t * t * t,
    easeInQuart: (t) => t * t * t * t,
    easeInQuint: (t) => t * t * t * t * t,
    easeInSine: (t) => 1 - Math.cos((t * Math.PI) / 2),
    easeInExpo: (t) => t === 0 ? 0 : Math.pow(2, 10 * t - 10),
    easeInCirc: (t) => 1 - Math.sqrt(1 - Math.pow(t, 2)),
    
    // Ease Out (slow end)
    easeOutQuad: (t) => t * (2 - t),
    easeOutCubic: (t) => 1 - Math.pow(1 - t, 3),
    easeOutQuart: (t) => 1 - Math.pow(1 - t, 4),
    easeOutQuint: (t) => 1 - Math.pow(1 - t, 5),
    easeOutSine: (t) => Math.sin((t * Math.PI) / 2),
    easeOutExpo: (t) => t === 1 ? 1 : 1 - Math.pow(2, -10 * t),
    easeOutCirc: (t) => Math.sqrt(1 - Math.pow(t - 1, 2)),
    
    // Ease In-Out (slow start and end)
    easeInOutQuad: (t) => t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2,
    easeInOutCubic: (t) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2,
    easeInOutQuart: (t) => t < 0.5 ? 8 * t * t * t * t : 1 - Math.pow(-2 * t + 2, 4) / 2,
    easeInOutQuint: (t) => t < 0.5 ? 16 * t * t * t * t * t : 1 - Math.pow(-2 * t + 2, 5) / 2,
    easeInOutSine: (t) => -(Math.cos(Math.PI * t) - 1) / 2,
    easeInOutExpo: (t) => {
        if (t === 0 || t === 1) return t;
        return t < 0.5
            ? Math.pow(2, 20 * t - 10) / 2
            : (2 - Math.pow(2, -20 * t + 10)) / 2;
    },
    
    // Bounce effect
    bounce: (t) => {
        const n1 = 7.5625;
        const d1 = 2.75;
        if (t < 1 / d1) return n1 * t * t;
        if (t < 2 / d1) return n1 * (t -= 1.5 / d1) * t + 0.75;
        if (t < 2.5 / d1) return n1 * (t -= 2.25 / d1) * t + 0.9375;
        return n1 * (t -= 2.625 / d1) * t + 0.984375;
    },
    
    // Elastic effect
    elastic: (t) => {
        const c4 = (2 * Math.PI) / 3;
        return t === 0 ? 0 : t === 1 ? 1 :
            -Math.pow(2, 10 * t - 10) * Math.sin((t * 10 - 10.75) * c4);
    }
};

/**
 * Create a custom bezier easing function
 * @param {number} x1 - First control point X
 * @param {number} y1 - First control point Y
 * @param {number} x2 - Second control point X
 * @param {number} y2 - Second control point Y
 * @returns {function} Easing function
 */
export function cubicBezier(x1, y1, x2, y2) {
    const cx = 3 * x1;
    const bx = 3 * (x2 - x1) - cx;
    const ax = 1 - cx - bx;
    const cy = 3 * y1;
    const by = 3 * (y2 - y1) - cy;
    const ay = 1 - cy - by;
    
    function sampleCurveX(t) {
        return ((ax * t + bx) * t + cx) * t;
    }
    
    function sampleCurveY(t) {
        return ((ay * t + by) * t + cy) * t;
    }
    
    function solveCurveX(x) {
        let t = x;
        for (let i = 0; i < 8; i++) {
            const error = sampleCurveX(t) - x;
            if (Math.abs(error) < 1e-6) return t;
            const dx = (3 * ax * t + 2 * bx) * t + cx;
            if (Math.abs(dx) < 1e-6) break;
            t -= error / dx;
        }
        return t;
    }
    
    return (x) => sampleCurveY(solveCurveX(x));
}


/**
 * Animation controller for managing animation state
 */
export class AnimationController {
    constructor() {
        this.animations = new Map();
    }
    
    /**
     * Start a new animation
     * @param {string} id - Unique animation identifier
     * @param {object} options - Animation options
     * @returns {Promise} Resolves when animation completes
     */
    start(id, options) {
        const {
            duration = 1000,
            easing = easings.linear,
            onUpdate,
            onComplete
        } = options;
        
        // Cancel existing animation with same ID
        this.cancel(id);
        
        return new Promise((resolve) => {
            const startTime = performance.now();
            
            const animate = (currentTime) => {
                const elapsed = currentTime - startTime;
                const rawProgress = Math.min(elapsed / duration, 1);
                const progress = easing(rawProgress);
                
                if (onUpdate) {
                    onUpdate(progress, rawProgress);
                }
                
                if (rawProgress < 1) {
                    const frameId = requestAnimationFrame(animate);
                    this.animations.set(id, frameId);
                } else {
                    this.animations.delete(id);
                    if (onComplete) onComplete();
                    resolve();
                }
            };
            
            const frameId = requestAnimationFrame(animate);
            this.animations.set(id, frameId);
        });
    }
    
    /**
     * Cancel an animation by ID
     * @param {string} id - Animation identifier
     */
    cancel(id) {
        if (this.animations.has(id)) {
            cancelAnimationFrame(this.animations.get(id));
            this.animations.delete(id);
        }
    }
    
    /**
     * Cancel all running animations
     */
    cancelAll() {
        this.animations.forEach((frameId) => {
            cancelAnimationFrame(frameId);
        });
        this.animations.clear();
    }
    
    /**
     * Check if an animation is running
     * @param {string} id - Animation identifier
     * @returns {boolean}
     */
    isRunning(id) {
        return this.animations.has(id);
    }
}


/**
 * Camera animation utilities
 */
export const cameraUtils = {
    /**
     * Animate camera in an orbit around a point
     * @param {mapboxgl.Map} map - Mapbox map instance
     * @param {LngLatLike} center - Center point to orbit around
     * @param {object} options - Orbit options
     */
    orbit(map, center, options = {}) {
        const {
            radius = 0.01,
            altitude = 1500,
            duration = 30000,
            direction = 1, // 1 = clockwise, -1 = counter-clockwise
            onStop
        } = options;
        
        const controller = new AnimationController();
        const startBearing = map.getBearing();
        
        controller.start('orbit', {
            duration,
            easing: easings.linear,
            onUpdate: (progress) => {
                const angle = (startBearing + direction * progress * 360) * Math.PI / 180;
                const lng = center[0] + radius * Math.cos(angle);
                const lat = center[1] + radius * Math.sin(angle);
                
                const camera = map.getFreeCameraOptions();
                camera.position = mapboxgl.MercatorCoordinate.fromLngLat([lng, lat], altitude);
                camera.lookAtPoint(center);
                map.setFreeCameraOptions(camera);
            },
            onComplete: onStop
        });
        
        return () => controller.cancel('orbit');
    },
    
    /**
     * Animate camera along a path using Turf.js
     * @param {mapboxgl.Map} map - Mapbox map instance
     * @param {Array} coordinates - Path coordinates
     * @param {object} options - Animation options
     */
    followPath(map, coordinates, options = {}) {
        const {
            duration = 10000,
            altitude = 500,
            pitch = 75,
            easing = easings.easeInOutCubic,
            onProgress,
            onComplete
        } = options;
        
        // Requires Turf.js
        if (typeof turf === 'undefined') {
            console.error('Turf.js is required for path following');
            return;
        }
        
        const route = turf.lineString(coordinates);
        const lineLength = turf.length(route, { units: 'kilometers' });
        const controller = new AnimationController();
        
        controller.start('followPath', {
            duration,
            easing,
            onUpdate: (progress) => {
                const distance = progress * lineLength;
                const point = turf.along(route, distance, { units: 'kilometers' });
                const coords = point.geometry.coordinates;
                
                // Calculate bearing to next point
                const nextDistance = Math.min(distance + 0.05, lineLength);
                const nextPoint = turf.along(route, nextDistance, { units: 'kilometers' });
                const bearing = turf.bearing(point, nextPoint);
                
                const camera = map.getFreeCameraOptions();
                camera.position = mapboxgl.MercatorCoordinate.fromLngLat(coords, altitude);
                camera.setPitchBearing(pitch, bearing);
                map.setFreeCameraOptions(camera);
                
                if (onProgress) onProgress(progress, coords);
            },
            onComplete
        });
        
        return () => controller.cancel('followPath');
    }
};


/**
 * Layer animation utilities
 */
export const layerUtils = {
    /**
     * Animate a property value over time
     * @param {mapboxgl.Map} map - Mapbox map instance
     * @param {string} layerId - Layer ID
     * @param {string} property - Paint property name
     * @param {*} fromValue - Starting value
     * @param {*} toValue - Ending value
     * @param {object} options - Animation options
     */
    animateProperty(map, layerId, property, fromValue, toValue, options = {}) {
        const {
            duration = 1000,
            easing = easings.easeOutCubic
        } = options;
        
        const controller = new AnimationController();
        
        return controller.start('property-' + layerId + '-' + property, {
            duration,
            easing,
            onUpdate: (progress) => {
                // Handle numeric values
                if (typeof fromValue === 'number' && typeof toValue === 'number') {
                    const value = fromValue + (toValue - fromValue) * progress;
                    map.setPaintProperty(layerId, property, value);
                }
                // Handle expression-based height animations
                else if (property === 'fill-extrusion-height') {
                    map.setPaintProperty(layerId, property, ['*', toValue, progress]);
                }
            }
        });
    },
    
    /**
     * Animate building extrusion rise effect
     * @param {mapboxgl.Map} map - Mapbox map instance
     * @param {string} layerId - Building layer ID
     * @param {object} options - Animation options
     */
    animateBuildingsRise(map, layerId, options = {}) {
        const {
            duration = 2000,
            easing = easings.easeOutCubic
        } = options;
        
        const controller = new AnimationController();
        
        return controller.start('buildings-rise', {
            duration,
            easing,
            onUpdate: (progress) => {
                map.setPaintProperty(
                    layerId,
                    'fill-extrusion-height',
                    ['*', ['get', 'height'], progress]
                );
            }
        });
    }
};


/**
 * GeoJSON source animation utilities
 */
export const sourceUtils = {
    /**
     * Animate a point along a line
     * @param {mapboxgl.Map} map - Mapbox map instance
     * @param {string} pointSourceId - Point source ID
     * @param {Array} coordinates - Line coordinates
     * @param {object} options - Animation options
     */
    animatePointAlongLine(map, pointSourceId, coordinates, options = {}) {
        const {
            duration = 5000,
            easing = easings.linear,
            loop = false,
            onProgress
        } = options;
        
        if (typeof turf === 'undefined') {
            console.error('Turf.js is required for point animation');
            return;
        }
        
        const route = turf.lineString(coordinates);
        const lineLength = turf.length(route, { units: 'kilometers' });
        const controller = new AnimationController();
        
        function animate() {
            controller.start('point-along-line', {
                duration,
                easing,
                onUpdate: (progress) => {
                    const distance = progress * lineLength;
                    const point = turf.along(route, distance, { units: 'kilometers' });
                    
                    map.getSource(pointSourceId).setData(point);
                    
                    if (onProgress) onProgress(progress, point.geometry.coordinates);
                },
                onComplete: () => {
                    if (loop) animate();
                }
            });
        }
        
        animate();
        return () => controller.cancel('point-along-line');
    },
    
    /**
     * Animate line drawing effect
     * @param {mapboxgl.Map} map - Mapbox map instance
     * @param {string} lineSourceId - Line source ID
     * @param {Array} coordinates - Full line coordinates
     * @param {object} options - Animation options
     */
    animateLineDrawing(map, lineSourceId, coordinates, options = {}) {
        const {
            duration = 3000,
            easing = easings.linear,
            onComplete
        } = options;
        
        const controller = new AnimationController();
        const totalPoints = coordinates.length;
        
        return controller.start('line-drawing', {
            duration,
            easing,
            onUpdate: (progress) => {
                const pointCount = Math.ceil(progress * totalPoints);
                const visibleCoords = coordinates.slice(0, pointCount);
                
                if (visibleCoords.length >= 2) {
                    map.getSource(lineSourceId).setData({
                        type: 'Feature',
                        geometry: {
                            type: 'LineString',
                            coordinates: visibleCoords
                        }
                    });
                }
            },
            onComplete
        });
    }
};


/**
 * Fog and atmosphere animation utilities
 */
export const atmosphereUtils = {
    /**
     * Animate fog transition
     * @param {mapboxgl.Map} map - Mapbox map instance
     * @param {object} fromFog - Starting fog configuration
     * @param {object} toFog - Ending fog configuration
     * @param {object} options - Animation options
     */
    animateFog(map, fromFog, toFog, options = {}) {
        const {
            duration = 2000,
            easing = easings.easeInOutCubic
        } = options;
        
        const controller = new AnimationController();
        
        return controller.start('fog-transition', {
            duration,
            easing,
            onUpdate: (progress) => {
                const interpolatedFog = {};
                
                // Interpolate numeric properties
                ['horizon-blend', 'star-intensity'].forEach(prop => {
                    if (fromFog[prop] !== undefined && toFog[prop] !== undefined) {
                        interpolatedFog[prop] = fromFog[prop] + (toFog[prop] - fromFog[prop]) * progress;
                    }
                });
                
                // For colors, use the target at midpoint
                if (progress >= 0.5) {
                    ['color', 'high-color', 'space-color'].forEach(prop => {
                        if (toFog[prop]) interpolatedFog[prop] = toFog[prop];
                    });
                } else {
                    ['color', 'high-color', 'space-color'].forEach(prop => {
                        if (fromFog[prop]) interpolatedFog[prop] = fromFog[prop];
                    });
                }
                
                // Range interpolation
                if (fromFog.range && toFog.range) {
                    interpolatedFog.range = [
                        fromFog.range[0] + (toFog.range[0] - fromFog.range[0]) * progress,
                        fromFog.range[1] + (toFog.range[1] - fromFog.range[1]) * progress
                    ];
                }
                
                map.setFog(interpolatedFog);
            }
        });
    },
    
    /**
     * Preset fog configurations
     */
    presets: {
        day: {
            range: [0.5, 10],
            color: 'white',
            'high-color': '#245cdf',
            'space-color': '#1d2a4d',
            'horizon-blend': 0.05,
            'star-intensity': 0
        },
        night: {
            range: [0.5, 10],
            color: '#242B4B',
            'high-color': '#161B36',
            'space-color': '#0B0D1C',
            'horizon-blend': 0.1,
            'star-intensity': 0.8
        },
        dusk: {
            range: [0.5, 10],
            color: '#dc9f9f',
            'high-color': '#ec8943',
            'space-color': '#1d1d3a',
            'horizon-blend': 0.08,
            'star-intensity': 0.2
        },
        dawn: {
            range: [0.5, 10],
            color: '#f0d9c0',
            'high-color': '#f5a962',
            'space-color': '#232342',
            'horizon-blend': 0.06,
            'star-intensity': 0.1
        }
    }
};


// Default export
export default {
    easings,
    cubicBezier,
    AnimationController,
    cameraUtils,
    layerUtils,
    sourceUtils,
    atmosphereUtils
};
