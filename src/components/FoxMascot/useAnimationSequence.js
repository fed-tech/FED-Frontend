/**
 * @fileoverview useAnimationSequence Hook - GSAP timeline for fox mascot animation
 * Uses mathematical camera frustum calculation for screen-to-world conversion
 * @module components/FoxMascot/useAnimationSequence
 */

import { useRef, useCallback, useEffect } from 'react';
import gsap from 'gsap';

/**
 * Animation phases configuration
 */
const PHASES = {
    EMERGE: 'emerge',
    WALK_LEFT: 'walkLeft',
    WALK_RIGHT: 'walkRight',
    TRANSFORM: 'transform',
};

/**
 * Hook to manage the complete fox mascot animation sequence using GSAP
 * @param {Object} foxRef - Ref to FoxModel component
 * @param {Function} onComplete - Callback when animation completes
 * @param {Function} onPhaseChange - Callback when animation phase changes
 * @returns {Object} Animation control methods
 */
const useAnimationSequence = (foxRef, onComplete, onPhaseChange) => {
    const timeline = useRef(null);
    const isPlaying = useRef(false);
    const currentPhase = useRef(null);

    /**
     * Set current phase and notify
     */
    const setPhase = useCallback((phase) => {
        currentPhase.current = phase;
        if (onPhaseChange) {
            onPhaseChange(phase);
        }
    }, [onPhaseChange]);

    /**
     * Calculate visible area at z=0 using camera frustum math
     * Formula: visibleHeight = 2 * tan(FOV/2) * distance
     * Camera: FOV=50, position z=100
     */
    const getVisibleBounds = useCallback(() => {
        const fov = 50;  // degrees (must match FoxMascot.jsx)
        const cameraZ = 100;  // must match FoxMascot.jsx
        const aspectRatio = window.innerWidth / window.innerHeight;

        // Convert FOV to radians and calculate visible height at z=0
        const vFOVRad = (fov * Math.PI) / 180;
        const visibleHeight = 2 * Math.tan(vFOVRad / 2) * cameraZ;
        const visibleWidth = visibleHeight * aspectRatio;

        return {
            halfWidth: visibleWidth / 2,
            halfHeight: visibleHeight / 2
        };
    }, []);

    /**
     * Calculate positions based on viewport using camera frustum math
     */
    const getPositions = useCallback(() => {
        const bounds = getVisibleBounds();

        // Position at 90% towards each edge (very close to chatbot icon)
        const rightEdge = bounds.halfWidth * 0.90;
        const bottomEdge = -bounds.halfHeight * 0.85;
        const leftEdge = -bounds.halfWidth * 0.75;

        console.log('[Fox] Visible bounds:', bounds);
        console.log('[Fox] Positions: right=', rightEdge, 'bottom=', bottomEdge);

        return {
            startX: rightEdge,       // Right side (near chatbot)
            startY: bottomEdge,      // Bottom  
            centerX: 0,              // Center
            leftEdgeX: leftEdge,     // Left side
            groundY: bottomEdge      // Ground level
        };
    }, [getVisibleBounds]);

    /**
     * Build and play the master timeline
     */
    const play = useCallback(() => {
        if (!foxRef.current || isPlaying.current) return;

        const foxModel = foxRef.current;
        const group = foxModel.getGroup();
        if (!group) return;

        const { startX, startY, centerX, leftEdgeX, groundY } = getPositions();

        // Scale adjusted for mathematical positioning (previous was too small)
        // With FOV=50, z=100, the visible area is ~93 units, so we need larger scale
        const targetScale = 0.001;

        console.log('[Fox] Animation starting with:', { startX, startY, groundY, targetScale });

        // Kill any existing timeline
        if (timeline.current) {
            timeline.current.kill();
        }

        isPlaying.current = true;

        // Create master timeline
        timeline.current = gsap.timeline({
            onComplete: () => {
                isPlaying.current = false;
                if (onComplete) onComplete();
            },
        });

        const tl = timeline.current;

        // Phase 1: Emerge from bottom-right (0s - 1s)
        tl.call(() => {
            setPhase(PHASES.EMERGE);
            foxModel.playAnimation('Fox_Jump', 0.2);
        })
            .set(group.position, { x: startX, y: startY, z: 0 }) // Bottom-right corner
            .set(group.rotation, { y: -Math.PI / 2 }) // Face left (-90 degrees)
            // Pop in with scale
            .to(group.scale, {
                x: targetScale, y: targetScale, z: targetScale,
                duration: 0.4,
                ease: 'back.out(1.7)'
            })
            // Jump up slightly then land
            .to(group.position, {
                y: groundY + 3,
                duration: 0.3,
                ease: 'power2.out'
            })
            .to(group.position, {
                y: groundY,
                duration: 0.2,
                ease: 'bounce.out'
            })

            // Phase 2: Walk left across screen (1s - 4s)
            .call(() => {
                setPhase(PHASES.WALK_LEFT);
                foxModel.playAnimation('Fox_Walk', 0.3);
            })
            .to(group.position, {
                x: centerX,
                duration: 2.5,
                ease: 'none',
            })
            // Stop in center, do idle animation
            .call(() => foxModel.playAnimation('Fox_Idle', 0.2))
            .to({}, { duration: 0.8 }) // Pause for idle
            .call(() => foxModel.playAnimation('Fox_Sit_Yes', 0.3))
            .to({}, { duration: 0.6 })

            // Phase 3: Walk right / return (5s - 8s)
            .call(() => {
                setPhase(PHASES.WALK_RIGHT);
                foxModel.playAnimation('Fox_Walk', 0.3);
            })
            // Turn around to face right
            .to(group.rotation, { y: Math.PI * 0.5, duration: 0.3, ease: 'power2.inOut' })
            .to(group.position, {
                x: startX,
                duration: 2.5,
                ease: 'none',
            })

            // Phase 4: Transform back to icon (8s - 9s)  
            .call(() => {
                setPhase(PHASES.TRANSFORM);
                foxModel.playAnimation('Fox_Idle', 0.2);
            })
            // Move to bottom right corner
            .to(group.position, {
                y: startY,
                duration: 0.2,
                ease: 'power2.in'
            })
            // Shrink back to nothing
            .to(group.scale, {
                x: 0, y: 0, z: 0,
                duration: 0.4,
                ease: 'power2.in'
            });

    }, [foxRef, onComplete, onPhaseChange, setPhase, getPositions]);

    /**
     * Skip to end of animation
     */
    const skip = useCallback(() => {
        if (timeline.current) {
            timeline.current.progress(1);
            timeline.current.kill();
        }
        isPlaying.current = false;
        if (onComplete) onComplete();
    }, [onComplete]);

    /**
     * Pause animation
     */
    const pause = useCallback(() => {
        if (timeline.current) {
            timeline.current.pause();
        }
    }, []);

    /**
     * Resume animation
     */
    const resume = useCallback(() => {
        if (timeline.current) {
            timeline.current.resume();
        }
    }, []);

    /**
     * Cleanup on unmount
     */
    useEffect(() => {
        return () => {
            if (timeline.current) {
                timeline.current.kill();
            }
        };
    }, []);

    return {
        play,
        skip,
        pause,
        resume,
        isPlaying: () => isPlaying.current,
        getCurrentPhase: () => currentPhase.current,
        PHASES,
    };
};

export default useAnimationSequence;
export { PHASES };
