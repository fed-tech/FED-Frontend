/**
 * @fileoverview FoxModel Component - Loads and animates the 3D fox mascot
 * @module components/FoxMascot/FoxModel
 * 
 * FIXES APPLIED:
 * 1. Using Center from drei to auto-center the model geometry
 * 2. Computing bounding box to understand model dimensions
 * 3. Positioning the group AFTER centering
 * 4. Removed cloning - using original scene with Center
 */

import React, { useRef, useEffect, useMemo, forwardRef, useImperativeHandle } from 'react';
import { useGLTF, useAnimations, Center } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * AVAILABLE FOX ANIMATIONS:
 * -------------------------
 * Fox_Attack_Paws          - Attack with paws
 * Fox_Attack_Tail          - Attack with tail
 * Fox_Falling              - Falling animation
 * Fox_Falling_Left         - Falling to the left
 * Fox_Idle                 - Standard idle/breathing
 * Fox_Jump                 - Jump and land
 * Fox_Jump_InAir           - In-air jump pose
 * Fox_Jump_Pivot_InPlace   - Pivot jump in place
 * Fox_Run                  - Running with root motion
 * Fox_Run_InPlace          - Running in place (treadmill)
 * Fox_Run_Left             - Running while turning left
 * Fox_Run_Left_InPlace     - Running left in place
 * Fox_Run_Right            - Running while turning right
 * Fox_Run_Right_InPlace    - Running right in place
 * Fox_Sit1                 - Transition from standing to sitting
 * Fox_Sit2_Idle            - Idle while sitting
 * Fox_Sit3_StandUp         - Standing up from sit
 * Fox_Sit_Idle_Break       - Idle break while sitting
 * Fox_Sit_No               - Shaking head no while sitting
 * Fox_Sit_Yes              - Nodding yes while sitting
 * Fox_Somersault           - Flip/tumble animation
 * Fox_Somersault_InPlace   - Somersault in place
 * Fox_Walk                 - Walking with root motion
 * Fox_Walk_Back            - Walking backwards
 * Fox_Walk_Back_InPlace    - Walking backwards in place
 * Fox_Walk_InPlace         - Walking in place (treadmill)
 * Fox_Walk_Left            - Walking while turning left
 * Fox_Walk_Left_InPlace    - Walking left in place
 * Fox_Walk_Right           - Walking while turning right
 * Fox_Walk_Right_InPlace   - Walking right in place
 */

// Animation name constants
const ANIMATIONS = {
    // Basic
    IDLE: 'Fox_Idle',
    JUMP: 'Fox_Jump',
    JUMP_INAIR: 'Fox_Jump_InAir',
    JUMP_PIVOT_INPLACE: 'Fox_Jump_Pivot_InPlace',
    FALLING: 'Fox_Falling',
    FALLING_LEFT: 'Fox_Falling_Left',

    // Attack
    ATTACK_PAWS: 'Fox_Attack_Paws',
    ATTACK_TAIL: 'Fox_Attack_Tail',

    // Run
    RUN: 'Fox_Run',
    RUN_INPLACE: 'Fox_Run_InPlace',
    RUN_LEFT: 'Fox_Run_Left',
    RUN_LEFT_INPLACE: 'Fox_Run_Left_InPlace',
    RUN_RIGHT: 'Fox_Run_Right',
    RUN_RIGHT_INPLACE: 'Fox_Run_Right_InPlace',

    // Walk
    WALK: 'Fox_Walk',
    WALK_INPLACE: 'Fox_Walk_InPlace',
    WALK_LEFT: 'Fox_Walk_Left',
    WALK_LEFT_INPLACE: 'Fox_Walk_Left_InPlace',
    WALK_RIGHT: 'Fox_Walk_Right',
    WALK_RIGHT_INPLACE: 'Fox_Walk_Right_InPlace',
    WALK_BACK: 'Fox_Walk_Back',
    WALK_BACK_INPLACE: 'Fox_Walk_Back_InPlace',

    // Sit
    SIT: 'Fox_Sit1',
    SIT_IDLE: 'Fox_Sit2_Idle',
    SIT_STANDUP: 'Fox_Sit3_StandUp',
    SIT_IDLE_BREAK: 'Fox_Sit_Idle_Break',
    SIT_NO: 'Fox_Sit_No',
    SIT_YES: 'Fox_Sit_Yes',

    // Tricks
    SOMERSAULT: 'Fox_Somersault',
    SOMERSAULT_INPLACE: 'Fox_Somersault_InPlace',
};

// Model path - must be in public folder for Vite
const MODEL_PATH = '/models/fox.glb';

/**
 * FoxModel component - Loads GLB model and manages animations
 * Uses Center from drei to properly center the model geometry
 */
const FoxModel = forwardRef(({ position = [0, 0, 0], rotation = [0, 0, 0], scale = 1, onLoaded }, ref) => {
    const group = useRef();
    const { scene, animations } = useGLTF(MODEL_PATH);
    const { actions, mixer } = useAnimations(animations, group);

    // Current playing animation tracking
    const currentAnimation = useRef(null);

    // Head rotation state (applied every frame after mixer update)
    const headRotation = useRef({ y: 0, x: 0, enabled: false });
    const headBoneRef = useRef(null);

    // Compute bounding box and log model info on mount
    useEffect(() => {
        if (scene) {
            // Compute bounding box to understand model size
            const box = new THREE.Box3().setFromObject(scene);
            const size = box.getSize(new THREE.Vector3());
            const center = box.getCenter(new THREE.Vector3());

            console.log('[FoxModel] === Model Info ===');
            console.log('[FoxModel] Bounding box size:', size.x.toFixed(2), size.y.toFixed(2), size.z.toFixed(2));
            console.log('[FoxModel] Bounding box center:', center.x.toFixed(2), center.y.toFixed(2), center.z.toFixed(2));
            console.log('[FoxModel] Animations available:', Object.keys(actions));

            // Log DURATION of each animation clip
            console.log('[FoxModel] === Animation Durations ===');
            animations.forEach(clip => {
                console.log(`[FoxModel] ${clip.name}: ${clip.duration.toFixed(2)}s`);
            });

            // LOG ALL BONES in the model
            console.log('[FoxModel] === ALL BONES ===');
            const bones = [];
            scene.traverse((child) => {
                if (child.isBone) {
                    const worldPos = new THREE.Vector3();
                    child.getWorldPosition(worldPos);
                    bones.push({
                        name: child.name,
                        x: worldPos.x.toFixed(4),
                        y: worldPos.y.toFixed(4),
                        z: worldPos.z.toFixed(4)
                    });
                    console.log(`[FoxModel] BONE: "${child.name}" at (${worldPos.x.toFixed(4)}, ${worldPos.y.toFixed(4)}, ${worldPos.z.toFixed(4)})`);
                }
            });
            console.log('[FoxModel] Total bones found:', bones.length);

            console.log('[FoxModel] Props:', { position, rotation, scale });
        }

        if (onLoaded) {
            onLoaded();
        }
    }, [scene, actions, animations, onLoaded, position, rotation, scale]);

    /**
     * Get the duration of an animation clip in seconds
     */
    const getAnimationDuration = (animationName) => {
        const clip = animations.find(c => c.name === animationName);
        return clip ? clip.duration : 0;
    };

    /**
     * Crossfade to a new animation smoothly
     * @param {string} animationName - Name of the animation to play
     * @param {number} duration - Crossfade duration (default 0.5)
     * @param {boolean|null} loop - Force loop on/off, or null for auto-detect
     * @param {number} timeScale - Playback speed: 1=normal, 0.5=half speed, 2=double speed
     */
    const playAnimation = (animationName, duration = 0.5, loop = null, timeScale = 1) => {
        const nextAction = actions[animationName];
        if (!nextAction) {
            console.warn(`[FoxModel] Animation "${animationName}" not found`);
            return;
        }

        if (currentAnimation.current === animationName) {
            return;
        }

        console.log(`[FoxModel] Playing animation: ${animationName} at speed ${timeScale}x`);

        const prevAction = currentAnimation.current ? actions[currentAnimation.current] : null;

        const shouldLoop = loop !== null ? loop :
            animationName.includes('Walk') ||
            animationName.includes('Run') ||
            animationName.includes('Idle');

        nextAction.reset();
        nextAction.setLoop(shouldLoop ? THREE.LoopRepeat : THREE.LoopOnce, shouldLoop ? Infinity : 1);
        nextAction.clampWhenFinished = !shouldLoop;
        nextAction.setEffectiveWeight(1);
        nextAction.setEffectiveTimeScale(timeScale);  // Use the timeScale parameter
        nextAction.play();

        if (prevAction) {
            prevAction.crossFadeTo(nextAction, duration, true);
        }

        currentAnimation.current = animationName;
    };

    /**
     * Stop all animations
     */
    const stopAllAnimations = () => {
        Object.values(actions).forEach(action => {
            if (action) action.stop();
        });
        currentAnimation.current = null;
    };

    /**
     * Get the world position of a bone (for tracking root motion)
     * Returns the position of the root/hip bone or falls back to bounding box center
     */
    const getRootBonePosition = () => {
        if (!scene) return new THREE.Vector3();

        // Try to find root/hip bone
        let rootBone = null;
        scene.traverse((child) => {
            if (child.isBone && (
                child.name.toLowerCase().includes('root') ||
                child.name.toLowerCase().includes('hip') ||
                child.name.toLowerCase().includes('pelvis')
            )) {
                rootBone = child;
            }
        });

        if (rootBone) {
            const worldPos = new THREE.Vector3();
            rootBone.getWorldPosition(worldPos);
            return worldPos;
        }

        // Fallback: use bounding box center
        const box = new THREE.Box3().setFromObject(scene);
        return box.getCenter(new THREE.Vector3());
    };

    /**
     * Get the current bounding box of the model (for position tracking)
     */
    const getBoundingBox = () => {
        if (!scene) return null;
        const box = new THREE.Box3().setFromObject(scene);
        return {
            center: box.getCenter(new THREE.Vector3()),
            min: box.min.clone(),
            max: box.max.clone()
        };
    };

    /**
     * Force update the mixer to apply current animation pose
     * Call this after playAnimation to ensure bones reflect the new pose
     */
    const forceUpdate = (deltaTime = 0) => {
        if (mixer) {
            mixer.update(deltaTime);
        }
    };

    /**
     * Get the head bone for procedural rotation
     * Searches for bones with 'head' or 'neck' in the name
     */
    const getHeadBone = () => {
        if (!scene) return null;

        let headBone = null;
        scene.traverse((child) => {
            if (child.isBone && (
                child.name.toLowerCase().includes('head') ||
                child.name.toLowerCase().includes('neck')
            )) {
                // Prefer 'head' over 'neck'
                if (!headBone || child.name.toLowerCase().includes('head')) {
                    headBone = child;
                }
            }
        });
        return headBone;
    };

    /**
     * Set head rotation target - applied every frame after mixer updates
     * @param {number} xRotation - X rotation (left/right turn) in radians
     * @param {boolean} enabled - Whether to apply head rotation  
     */
    const setHeadRotation = (xRotation = 0, enabled = true) => {
        headRotation.current = { x: xRotation, enabled };
        // Cache the head bone
        if (!headBoneRef.current) {
            headBoneRef.current = getHeadBone();
        }
        console.log(`[FoxModel] Head rotation set: X=${xRotation.toFixed(2)}, enabled=${enabled}`);
    };

    /**
     * Apply head rotation AFTER animation mixer updates
     * This ensures our rotation overrides the animation
     */
    useFrame(() => {
        if (headRotation.current.enabled && headBoneRef.current) {
            headBoneRef.current.rotation.x = headRotation.current.x;
        }
    });

    /**
     * Get the scene for bone access
     */
    const getScene = () => scene;

    // Expose methods to parent via ref
    useImperativeHandle(ref, () => ({
        playAnimation,
        stopAllAnimations,
        getGroup: () => group.current,
        getAnimationDuration,
        getRootBonePosition,
        getBoundingBox,
        forceUpdate,
        getMixer: () => mixer,
        getHeadBone,
        setHeadRotation,
        getScene,
        ANIMATIONS,
    }));

    // Use the scene directly without cloning
    // Center component will handle geometry centering
    console.log('[FoxModel] Rendering at position:', position, 'scale:', scale);

    return (
        <>
            {/* 
             * Key fix: Use group for GSAP/position control
             * Center component auto-centers the model geometry
             */}
            <group
                ref={group}
                position={position}
                rotation={rotation}
                scale={typeof scale === 'number' ? [scale, scale, scale] : scale}
            >
                <Center>
                    <primitive object={scene} />
                </Center>
            </group>
        </>
    );
});

FoxModel.displayName = 'FoxModel';

// Preload the model
useGLTF.preload(MODEL_PATH);

export default FoxModel;
export { ANIMATIONS };
