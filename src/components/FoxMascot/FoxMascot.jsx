/**
 * @fileoverview FoxMascot Component - Main canvas wrapper for 3D fox animation
 * @module components/FoxMascot/FoxMascot
 */

import React, { useRef, useEffect, useState, useCallback, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';
import FoxModel from './FoxModel';
import useAnimationSequence from './useAnimationSequence';
import styles from './FoxMascot.module.scss';

/**
 * FoxMascot Component - Renders the 3D fox mascot animation overlay
 * @param {Object} props
 * @param {Function} props.onComplete - Called when animation finishes or is skipped
 * @param {boolean} props.isVisible - Controls visibility of the component
 */
const FoxMascot = ({ onComplete, isVisible = true }) => {
    const foxRef = useRef();
    const canvasRef = useRef();
    const [showSkip, setShowSkip] = useState(true);
    const [currentPhase, setCurrentPhase] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);

    /**
     * Handle phase change from animation sequence
     */
    const handlePhaseChange = useCallback((phase) => {
        setCurrentPhase(phase);
        console.log(`[FoxMascot] Phase: ${phase}`);
    }, []);

    /**
     * Handle animation complete
     */
    const handleComplete = useCallback(() => {
        console.log('[FoxMascot] Animation complete');
        setShowSkip(false);
        if (onComplete) {
            onComplete();
        }
    }, [onComplete]);

    // Animation sequence hook
    const animation = useAnimationSequence(foxRef, handleComplete, handlePhaseChange);

    /**
     * Start animation when fox model is loaded
     * Sequence: Jump → Run (move left) → Walk (continue left) → Sit
     * Combines skeletal animations with position movement
     */
    /**
     * AVAILABLE FOX ANIMATIONS:
     * -------------------------
     * Fox_Attack_Paws, Fox_Attack_Tail, Fox_Falling, Fox_Falling_Left,
     * Fox_Idle, Fox_Jump, Fox_Jump_InAir, Fox_Jump_Pivot_InPlace,
     * Fox_Run, Fox_Run_InPlace, Fox_Run_Left, Fox_Run_Left_InPlace,
     * Fox_Run_Right, Fox_Run_Right_InPlace, Fox_Sit1, Fox_Sit2_Idle,
     * Fox_Sit3_StandUp, Fox_Sit_Idle_Break, Fox_Sit_No, Fox_Sit_Yes,
     * Fox_Somersault, Fox_Somersault_InPlace, Fox_Walk, Fox_Walk_Back,
     * Fox_Walk_Back_InPlace, Fox_Walk_InPlace, Fox_Walk_Left,
     * Fox_Walk_Left_InPlace, Fox_Walk_Right, Fox_Walk_Right_InPlace
     */
    const handleFoxLoaded = useCallback(() => {
        setIsLoaded(true);
        console.log('[FoxMascot] Fox loaded - IN-PLACE ANIMATION with GSAP movement');

        if (!foxRef.current) return;

        const fox = foxRef.current;
        const group = fox.getGroup();

        if (!group) {
            console.error('[FoxMascot] Could not get group for position animation');
            return;
        }

        // Animation durations (seconds)
        const JUMP_DURATION = 1.2;
        const RUN_DURATION = 1.5;
        const FALL_DURATION = 1.2;      // Falling animation
        const IDLE_DURATION = 1.0;      // Stand up / recover
        const TURN_DURATION = 0.8;      // Turn to face user
        const WALK_DURATION = 2.0;      // Walk to final position
        const SIT_DURATION = 0.53;

        const crossfade = 0.3;  // Smooth crossfade between animations

        // Starting position (right side of screen)
        const START_X = 55;
        const END_X = -20;  // Final position (left side)

        // Set initial position
        group.position.x = START_X;
        group.position.y = -35;

        console.log('[FoxMascot] Animation sequence:');
        console.log('  1. Jump → 2. Run → 3. Fall');
        console.log('  4. Idle (recover) → 5. Turn to face user');
        console.log('  6. Walk → 7. Sit');

        // Import GSAP and create timeline
        import('gsap').then(({ default: gsap }) => {

            // Calculate movement distances
            const jumpDistance = 5;
            const runDistance = 30;
            const fallDistance = 3;      // Slight forward during fall
            const walkDistance = 37;     // Walk to final position

            // Position checkpoints
            const afterJumpX = START_X - jumpDistance;        // 50
            const afterRunX = afterJumpX - runDistance;       // 20
            const afterFallX = afterRunX - fallDistance;      // 17
            const afterWalkX = afterFallX - walkDistance;     // -20

            // Create GSAP timeline
            const tl = gsap.timeline({
                onComplete: () => {
                    console.log('[FoxMascot] ✓ Animation sequence complete!');
                    console.log(`[FoxMascot] Final position: ${group.position.x.toFixed(2)}`);
                }
            });

            // ===== PHASE 1: JUMP =====
            tl.add(() => {
                fox.playAnimation('Fox_Jump', 0, false, 1);
                console.log('[FoxMascot] ▶ Phase 1: JUMP');
            })
                .to(group.position, {
                    x: afterJumpX,
                    duration: JUMP_DURATION,
                    ease: 'power2.out'
                }, '<')

                // ===== PHASE 2: RUN =====
                .add(() => {
                    fox.playAnimation('Fox_Run_InPlace', crossfade, true, 1);
                    console.log('[FoxMascot] ▶ Phase 2: RUN');
                })
                .to(group.position, {
                    x: afterRunX,
                    duration: RUN_DURATION,
                    ease: 'linear'
                }, '<')

                // ===== PHASE 3: FALL (cute stumble) =====
                .add(() => {
                    fox.playAnimation('Fox_Falling', crossfade, false, 1);
                    console.log('[FoxMascot] ▶ Phase 3: FALL (oops!)');
                })
                .to(group.position, {
                    x: afterFallX,
                    duration: FALL_DURATION,
                    ease: 'power2.out'
                }, '<')

                // ===== PHASE 4: IDLE (recover/stand up) =====
                .add(() => {
                    fox.playAnimation('Fox_Idle', crossfade, true, 1);
                    console.log('[FoxMascot] ▶ Phase 4: IDLE (recovering)');
                })
                .to({}, { duration: IDLE_DURATION })

                // ===== PHASE 5: TURN HEAD TO FACE USER =====
                // Rotate only the head bone while staying in Idle (no leg/body movement)
                .add(() => {
                    console.log('[FoxMascot] ▶ Phase 5: TURNING HEAD TO FACE USER');
                    fox.setHeadRotation(0, true);  // Enable head rotation
                })
                .to({ headX: 0 }, {
                    headX: 1,  // Turn head LEFT to look at user
                    duration: TURN_DURATION,
                    ease: 'power2.inOut',
                    onUpdate: function () {
                        const xVal = this.targets()[0].headX;
                        fox.setHeadRotation(xVal, true);
                    }
                })

                // ===== PHASE 5b: TURN HEAD BACK TO ORIGINAL =====
                .add(() => {
                    console.log('[FoxMascot] ▶ Phase 5b: TURNING HEAD BACK');
                })
                .to({ headX: 1 }, {
                    headX: 0,  // Turn head back to original direction
                    duration: TURN_DURATION * 0.7,
                    ease: 'power2.inOut',
                    onUpdate: function () {
                        const xVal = this.targets()[0].headX;
                        fox.setHeadRotation(xVal, true);
                    }
                })

                // ===== PHASE 6: WALK =====
                .add(() => {
                    fox.setHeadRotation(0, false);  // Disable head override
                    fox.playAnimation('Fox_Walk_InPlace', crossfade, true, 1);
                    console.log('[FoxMascot] ▶ Phase 6: WALK');
                })
                .to(group.position, {
                    x: afterWalkX,
                    duration: WALK_DURATION,
                    ease: 'linear'
                }, '<')

                // ===== PHASE 7: TURN TO FACE USER =====
                .add(() => {
                    fox.playAnimation('Fox_Walk_Left_InPlace', crossfade, true, 1);
                    console.log('[FoxMascot] ▶ Phase 7: TURN TO FACE USER');
                })
                .to(group.rotation, {
                    y: Math.PI / 12,  // Rotate slightly to face camera
                    duration: 1.0,
                    ease: 'power2.inOut'
                }, '<')

                // ===== PHASE 8: SIT (facing user) =====
                .add(() => {
                    fox.playAnimation('Fox_Sit2_Idle', crossfade, true, 1);  // Use idle sit - more forward looking
                    console.log('[FoxMascot] ▶ Phase 8: SIT (facing user)');
                })
                // Tilt fox upward so it looks at the screen/user
                .to(group.rotation, {
                    x: -0.30,  // Tilt more to look at user
                    duration: 0.5,
                    ease: 'power2.out'
                }, '<+0.3');

        });

    }, []);

    /**
     * Handle skip button click
     */
    const handleSkip = useCallback(() => {
        animation.skip();
    }, [animation]);

    // DISABLED: Start animation once loaded
    // useEffect(() => {
    //     if (isLoaded && foxRef.current && isVisible) {
    //         animation.play();
    //     }
    // }, [isLoaded, isVisible]);

    if (!isVisible) {
        return null;
    }

    return (
        <div className={styles.foxMascotContainer}>
            {/* Skip Button */}
            {showSkip && (
                <button
                    className={styles.skipButton}
                    onClick={handleSkip}
                    aria-label="Skip animation"
                >
                    Skip ✕
                </button>
            )}

            {/* Three.js Canvas */}
            <Canvas
                ref={canvasRef}
                className={styles.canvas}
                gl={{
                    antialias: true,
                    alpha: true,
                    powerPreference: 'high-performance'
                }}
                dpr={[1, 2]}
            >
                {/* Lighting */}
                <ambientLight intensity={0.8} />
                <directionalLight position={[5, 5, 5]} intensity={1} />
                <directionalLight position={[-5, 3, -5]} intensity={0.5} />

                {/* Camera - FOV=50, z=100 where size was correct */}
                <PerspectiveCamera
                    makeDefault
                    position={[0, 0, 100]}
                    fov={50}
                />

                {/* Fox Model - PROPERLY SIZED AND POSITIONED */}
                {/* Base model is ~27 units, scale=0.5 gives ~13 unit fox (visible height ~93 units) */}
                <Suspense fallback={null}>
                    <FoxModel
                        ref={foxRef}
                        position={[55, -35, 0]}
                        rotation={[0, -Math.PI / 2, 0]}
                        scale={0.9}
                        onLoaded={handleFoxLoaded}
                    />
                </Suspense>

                {/* Debug controls (uncomment to debug) */}
                {/* <OrbitControls enableZoom={true} /> */}
            </Canvas>
        </div>
    );
};

export default FoxMascot;
