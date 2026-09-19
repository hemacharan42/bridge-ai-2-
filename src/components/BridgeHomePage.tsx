import React, { useEffect, useRef, useState, useCallback } from "react";
import * as THREE from "three";
import {
  GraduationCap,
  Briefcase,
  ArrowRight,
  Sparkles,
  Zap,
  ShieldCheck,
  PlayCircle,
  Info,
  UserCheck,
  X,
} from "lucide-react";
import { useAssessment } from "../store/assessmentContext";
import { DEFAULT_STUDENT_USER, DEFAULT_EMPLOYER_USER, DEFAULT_FACULTY_USER } from "../data/mockData";
import { AboutModal } from "./about/AboutModal";
import { BridgeLogo } from "./brand/BridgeLogo";

interface BridgeHomePageProps {
  onNavigateToStudentLogin: () => void;
  onNavigateToEmployeeLogin: () => void;
  onDirectLoginSuccess: (isFirstTime: boolean) => void;
}

export const BridgeHomePage: React.FC<BridgeHomePageProps> = ({
  onNavigateToStudentLogin,
  onNavigateToEmployeeLogin,
  onDirectLoginSuccess,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const studentCardRef = useRef<HTMLDivElement | null>(null);
  const employerCardRef = useRef<HTMLDivElement | null>(null);
  const { setCurrentUser } = useAssessment();

  // About modal state
  const [showAboutModal, setShowAboutModal] = useState(false);

  // Quick custom persona modal
  const [showCustomLoginModal, setShowCustomLoginModal] = useState(false);
  const [customRole, setCustomRole] = useState<"student" | "employee" | "faculty">("student");
  const [isFirstTimeStudent, setIsFirstTimeStudent] = useState(false);

  // Engine state for UI pills & buttons
  const [isCrashingState, setIsCrashingState] = useState(false);
  const [activePortalMode, setActivePortalMode] = useState<"default" | "student" | "employer">("default");
  const [statusText, setStatusText] = useState("Swirl Active");
  const [headerBtnText, setHeaderBtnText] = useState("Ignite Bridge");
  const [toastMessage, setToastMessage] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [navigatingTo, setNavigatingTo] = useState<"student" | "employer" | null>(null);

  // Action refs to expose Three.js trigger to React handlers
  const triggerCrashRef = useRef<((mode?: "student" | "employer" | "default") => void) | null>(null);
  const resetSwirlRef = useRef<(() => void) | null>(null);

  // -----------------------------------------------------------------
  // 1. THREE.JS SCENE, CAMERA & RENDERER SETUP (Cosmic Skill Verification Engine)
  // -----------------------------------------------------------------
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x000000, 0.02);

    const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    function updateCameraFrustum() {
      const aspect = window.innerWidth / window.innerHeight;
      camera.aspect = aspect;

      // Scale camera distance automatically so full bridge & stone hands fit on mobile screens
      if (aspect < 0.65) {
        camera.position.set(0, 0.5, 30);
      } else if (aspect < 1.0) {
        camera.position.set(0, 0.8, 24);
      } else {
        camera.position.set(0, 1.1, 19);
      }
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    }

    updateCameraFrustum();
    window.addEventListener("resize", updateCameraFrustum);

    // Ambient & Point Lighting
    const ambientLight = new THREE.AmbientLight(0x475569, 1.8);
    scene.add(ambientLight);

    const cyanLight = new THREE.PointLight(0x06b6d4, 9, 35);
    cyanLight.position.set(-14, 1, 4);
    scene.add(cyanLight);

    const amberLight = new THREE.PointLight(0xf59e0b, 9, 35);
    amberLight.position.set(14, 1, 4);
    scene.add(amberLight);

    const topLight = new THREE.DirectionalLight(0xffedd5, 2.0);
    topLight.position.set(0, 18, 12);
    scene.add(topLight);

    const frontFillLight = new THREE.DirectionalLight(0x94a3b8, 1.2);
    frontFillLight.position.set(0, -2, 22);
    scene.add(frontFillLight);

    // Starfield (3500 Stars)
    const starCount = 3500;
    const starGeo = new THREE.BufferGeometry();
    const starPos = new Float32Array(starCount * 3);
    const starColors = new Float32Array(starCount * 3);

    const colorCyan = new THREE.Color(0x38bdf8);
    const colorAmber = new THREE.Color(0xfcb316);
    const colorWhite = new THREE.Color(0xf8fafc);
    const colorYellow = new THREE.Color(0xfacc15);
    const colorOrange = new THREE.Color(0xf97316);

    for (let i = 0; i < starCount; i++) {
      starPos[i * 3] = (Math.random() - 0.5) * 160;
      starPos[i * 3 + 1] = (Math.random() - 0.5) * 100;
      starPos[i * 3 + 2] = -5 - Math.random() * 60;

      const rand = Math.random();
      let c = colorWhite;
      if (rand > 0.75) c = colorCyan;
      else if (rand > 0.45) c = colorAmber;

      starColors[i * 3] = c.r;
      starColors[i * 3 + 1] = c.g;
      starColors[i * 3 + 2] = c.b;
    }

    starGeo.setAttribute("position", new THREE.BufferAttribute(starPos, 3));
    starGeo.setAttribute("color", new THREE.BufferAttribute(starColors, 3));

    const starMat = new THREE.PointsMaterial({
      size: 0.13,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
    });
    const starfield = new THREE.Points(starGeo, starMat);
    scene.add(starfield);

    // Ambient Floating Dust
    const dustCount = 500;
    const dustGeo = new THREE.BufferGeometry();
    const dustPos = new Float32Array(dustCount * 3);
    for (let i = 0; i < dustCount * 3; i += 3) {
      dustPos[i] = (Math.random() - 0.5) * 45;
      dustPos[i + 1] = (Math.random() - 0.5) * 30;
      dustPos[i + 2] = (Math.random() - 0.5) * 20;
    }
    dustGeo.setAttribute("position", new THREE.BufferAttribute(dustPos, 3));
    const dustMat = new THREE.PointsMaterial({
      color: 0xfef08a,
      size: 0.08,
      transparent: true,
      opacity: 0.5,
      blending: THREE.AdditiveBlending,
    });
    const dustParticles = new THREE.Points(dustGeo, dustMat);
    scene.add(dustParticles);

    // Golden Bridge Curve & Tube
    const bridgeCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-25, -5.5, -6),
      new THREE.Vector3(-13, -0.2, 0),
      new THREE.Vector3(0, 1.6, 2.2),
      new THREE.Vector3(13, -0.2, 0),
      new THREE.Vector3(25, -5.5, -6),
    ]);

    const bridgeTubeGeo = new THREE.TubeGeometry(bridgeCurve, 120, 0.55, 16, false);
    const bridgeTubeMat = new THREE.MeshStandardMaterial({
      color: 0xd97706,
      metalness: 0.85,
      roughness: 0.25,
      emissive: 0x78350f,
      emissiveIntensity: 0.4,
    });
    const bridgeMesh = new THREE.Mesh(bridgeTubeGeo, bridgeTubeMat);
    scene.add(bridgeMesh);

    // Procedural Stone Hands (Brightened with subtle celestial slate emissive)
    const stoneMaterial = new THREE.MeshStandardMaterial({
      color: 0x64748b, // Brightened slate stone
      roughness: 0.65,
      metalness: 0.25,
      flatShading: true,
      emissive: 0x1e293b,
      emissiveIntensity: 0.5,
    });

    function createGiantHand(isLeft = true) {
      const handGroup = new THREE.Group();

      const palmGeo = new THREE.DodecahedronGeometry(2.4, 1);
      palmGeo.scale(1.2, 0.75, 1.3);
      const palm = new THREE.Mesh(palmGeo, stoneMaterial);
      handGroup.add(palm);

      const fingerData = [
        { angle: -0.65, len: 3.2, rotZ: 0.35, rotX: 0.6 },
        { angle: -0.32, len: 4.2, rotZ: 0.12, rotX: 0.8 },
        { angle: 0.0, len: 4.6, rotZ: 0.0, rotX: 0.85 },
        { angle: 0.32, len: 4.1, rotZ: -0.12, rotX: 0.8 },
        { angle: 0.65, len: 3.3, rotZ: -0.35, rotX: 0.65 },
      ];

      fingerData.forEach((f) => {
        const fingerGroup = new THREE.Group();
        fingerGroup.rotation.y = f.angle;
        fingerGroup.rotation.z = f.rotZ;

        const j1Geo = new THREE.CylinderGeometry(0.48, 0.62, f.len * 0.55, 6);
        const j1 = new THREE.Mesh(j1Geo, stoneMaterial);
        j1.position.y = f.len * 0.25;
        j1.rotation.x = 0.3;
        fingerGroup.add(j1);

        const j2Geo = new THREE.CylinderGeometry(0.32, 0.48, f.len * 0.45, 6);
        const j2 = new THREE.Mesh(j2Geo, stoneMaterial);
        j2.position.set(0, f.len * 0.58, 0.35);
        j2.rotation.x = f.rotX;
        fingerGroup.add(j2);

        handGroup.add(fingerGroup);
      });

      const wristGeo = new THREE.CylinderGeometry(2.1, 3.6, 12, 8);
      const wrist = new THREE.Mesh(wristGeo, stoneMaterial);
      wrist.position.set(0, -6.5, -0.4);
      wrist.rotation.x = -0.15;
      handGroup.add(wrist);

      if (!isLeft) handGroup.scale.x = -1;
      return handGroup;
    }

    const leftHand = createGiantHand(true);
    leftHand.position.set(-13, -1.8, 0);
    leftHand.rotation.set(0.2, 0.4, -0.15);
    scene.add(leftHand);

    const rightHand = createGiantHand(false);
    rightHand.position.set(13, -1.8, 0);
    rightHand.rotation.set(0.2, -0.4, 0.15);
    scene.add(rightHand);

    // Skill Tiles Textures & Orbiting Helix
    const skillTitles = [
      "PYTHON",
      "AI / ML",
      "REACT",
      "CLOUD",
      "CYBER",
      "DATA",
      "DEVOPS",
      "WEB3",
      "UI / UX",
      "FINTECH",
    ];

    function createSkillTileTexture(text: string, isCyan: boolean) {
      const texCanvas = document.createElement("canvas");
      texCanvas.width = 256;
      texCanvas.height = 256;
      const ctx = texCanvas.getContext("2d");
      if (!ctx) return new THREE.CanvasTexture(texCanvas);

      // Glass Tile Background
      ctx.fillStyle = "rgba(2, 6, 23, 0.85)";
      ctx.beginPath();
      if (ctx.roundRect) {
        ctx.roundRect(16, 16, 224, 224, 28);
      } else {
        ctx.rect(16, 16, 224, 224);
      }
      ctx.fill();

      // Glowing Border
      ctx.lineWidth = 10;
      ctx.strokeStyle = isCyan ? "rgba(34, 211, 238, 0.9)" : "rgba(251, 191, 36, 0.9)";
      ctx.shadowColor = isCyan ? "#06b6d4" : "#f59e0b";
      ctx.shadowBlur = 20;
      ctx.stroke();

      // Icon Symbol Box
      ctx.fillStyle = isCyan ? "#38bdf8" : "#fbbf24";
      ctx.beginPath();
      if (ctx.roundRect) {
        ctx.roundRect(88, 55, 80, 80, 16);
      } else {
        ctx.rect(88, 55, 80, 80);
      }
      ctx.fill();

      ctx.fillStyle = "#020617";
      ctx.beginPath();
      if (ctx.roundRect) {
        ctx.roundRect(102, 69, 52, 52, 10);
      } else {
        ctx.rect(102, 69, 52, 52);
      }
      ctx.fill();

      // Text Label
      ctx.shadowBlur = 0;
      ctx.font = "900 26px Outfit, sans-serif";
      ctx.fillStyle = "#f8fafc";
      ctx.textAlign = "center";
      ctx.fillText(text, 128, 185);

      const texture = new THREE.CanvasTexture(texCanvas);
      texture.needsUpdate = true;
      return texture;
    }

    const skillCardCount = skillTitles.length;
    const skillCardsGroup = new THREE.Group();
    const skillCardMeshes: THREE.Mesh<THREE.PlaneGeometry, THREE.MeshBasicMaterial>[] = [];

    for (let i = 0; i < skillCardCount; i++) {
      const isCyan = i % 2 === 0;
      const tex = createSkillTileTexture(skillTitles[i], isCyan);
      const cardGeo = new THREE.PlaneGeometry(1.6, 1.6);
      const cardMat = new THREE.MeshBasicMaterial({
        map: tex,
        transparent: true,
        opacity: 0.95,
        side: THREE.DoubleSide,
      });
      const mesh = new THREE.Mesh(cardGeo, cardMat);

      mesh.userData = {
        angle: (i / skillCardCount) * Math.PI * 2,
        speed: 0.35 + (i % 3) * 0.05,
        radiusX: 7.2 + (i % 2) * 1.2,
        radiusY: 3.2 + (i % 2) * 0.8,
        zOffset: Math.sin(i) * 2.5,
        baseScale: 1.0,
        isCyan,
        title: skillTitles[i],
      };

      skillCardMeshes.push(mesh);
      skillCardsGroup.add(mesh);
    }
    scene.add(skillCardsGroup);
    skillCardsGroup.position.set(0, 1.5, 2.5);

    // Particle Dot Stream (600 crash particles)
    const particleDotCount = 600;
    const dotGeo = new THREE.BufferGeometry();
    const dotPositions = new Float32Array(particleDotCount * 3);
    const dotColors = new Float32Array(particleDotCount * 3);

    interface DotData {
      active: boolean;
      progress: number;
      speed: number;
      startPos: THREE.Vector3;
      targetT: number;
      curveOffset: THREE.Vector3;
    }

    const dotData: DotData[] = [];
    for (let i = 0; i < particleDotCount; i++) {
      dotPositions[i * 3] = 0;
      dotPositions[i * 3 + 1] = 0;
      dotPositions[i * 3 + 2] = 0;

      const isCyan = Math.random() > 0.4;
      const c = isCyan ? colorCyan : colorAmber;
      dotColors[i * 3] = c.r;
      dotColors[i * 3 + 1] = c.g;
      dotColors[i * 3 + 2] = c.b;

      dotData.push({
        active: false,
        progress: 0,
        speed: 0.6 + Math.random() * 0.8,
        startPos: new THREE.Vector3(),
        targetT: Math.random(),
        curveOffset: new THREE.Vector3(
          (Math.random() - 0.5) * 3,
          Math.random() * 2 + 1,
          (Math.random() - 0.5) * 2
        ),
      });
    }

    dotGeo.setAttribute("position", new THREE.BufferAttribute(dotPositions, 3));
    dotGeo.setAttribute("color", new THREE.BufferAttribute(dotColors, 3));

    const dotMat = new THREE.PointsMaterial({
      size: 0.28,
      vertexColors: true,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
    });
    const crashParticles = new THREE.Points(dotGeo, dotMat);
    scene.add(crashParticles);

    // Ignition State
    let isCrashing = false;
    let crashProgress = 0;
    let bridgeIgniteIntensity = 0;

    const defaultBridgeColor = new THREE.Color(0xd97706);
    const yellowBridgeColor = new THREE.Color(0xfacc15);
    const orangeBridgeColor = new THREE.Color(0xf97316);
    const targetBridgeColor = defaultBridgeColor.clone();
    const currentBridgeColor = defaultBridgeColor.clone();

    // Trigger Skill Crash Sequence (Yellow for Student, Orange for Employer)
    function triggerSkillCrashSequence(mode: "student" | "employer" | "default" = "student") {
      isCrashing = true;
      crashProgress = 0;
      setIsCrashingState(true);
      setActivePortalMode(mode);

      setShowToast(true);
      setToastMessage("Skill Tiles Morphing into Energetic Particle Streams!");

      const colorArr = dotGeo.attributes.color.array as Float32Array;

      if (mode === "student") {
        targetBridgeColor.copy(yellowBridgeColor);
        setStatusText("Student Yellow Mode");
        setHeaderBtnText("Yellow Sync");

        for (let i = 0; i < particleDotCount; i++) {
          const c = Math.random() > 0.3 ? colorYellow : colorAmber;
          colorArr[i * 3] = c.r;
          colorArr[i * 3 + 1] = c.g;
          colorArr[i * 3 + 2] = c.b;
        }
      } else if (mode === "employer") {
        targetBridgeColor.copy(orangeBridgeColor);
        setStatusText("Recruiter Orange Mode");
        setHeaderBtnText("Orange Sync");

        for (let i = 0; i < particleDotCount; i++) {
          const c = Math.random() > 0.3 ? colorOrange : colorAmber;
          colorArr[i * 3] = c.r;
          colorArr[i * 3 + 1] = c.g;
          colorArr[i * 3 + 2] = c.b;
        }
      } else {
        targetBridgeColor.copy(defaultBridgeColor);
        setStatusText("Morphing Energy");
        setHeaderBtnText("Igniting...");
      }
      dotGeo.attributes.color.needsUpdate = true;

      const dotsPerTile = Math.floor(particleDotCount / skillCardCount);
      dotMat.opacity = 0.95;

      skillCardMeshes.forEach((mesh, tileIdx) => {
        const worldPos = new THREE.Vector3();
        mesh.getWorldPosition(worldPos);

        for (let k = 0; k < dotsPerTile; k++) {
          const dotIndex = tileIdx * dotsPerTile + k;
          if (dotIndex < particleDotCount) {
            const d = dotData[dotIndex];
            d.active = true;
            d.progress = 0;
            d.startPos.copy(worldPos).add(
              new THREE.Vector3(
                (Math.random() - 0.5) * 1.2,
                (Math.random() - 0.5) * 1.2,
                (Math.random() - 0.5) * 0.8
              )
            );
          }
        }
      });
    }

    function resetSwirlSequence() {
      isCrashing = false;
      crashProgress = 0;
      dotMat.opacity = 0;
      setIsCrashingState(false);
      setActivePortalMode("default");
      targetBridgeColor.copy(defaultBridgeColor);

      skillCardMeshes.forEach((mesh) => {
        mesh.scale.set(1, 1, 1);
        mesh.material.opacity = 0.95;
      });

      setShowToast(false);
      setStatusText("Swirl Active");
      setHeaderBtnText("Ignite Bridge");
    }

    // Expose actions to React refs
    triggerCrashRef.current = triggerSkillCrashSequence;
    resetSwirlRef.current = resetSwirlSequence;

    // Pointer Parallax
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    function handlePointerMove(clientX: number, clientY: number) {
      mouseX = (clientX - window.innerWidth / 2) * 0.0006;
      mouseY = (clientY - window.innerHeight / 2) * 0.0006;
    }

    const onMouseMove = (e: MouseEvent) => handlePointerMove(e.clientX, e.clientY);
    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        handlePointerMove(e.touches[0].clientX, e.touches[0].clientY);
      }
    };

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("touchmove", onTouchMove, { passive: true });

    const clock = new THREE.Clock();
    let animationId: number;

    function animate() {
      animationId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const time = clock.getElapsedTime();

      // Background rotations
      starfield.rotation.y = time * 0.005;
      dustParticles.rotation.y = time * 0.01;

      if (!isCrashing) {
        // Normal Orbital Swirl
        skillCardMeshes.forEach((mesh) => {
          const data = mesh.userData;
          data.angle += delta * data.speed;

          const x = Math.cos(data.angle) * data.radiusX;
          const y = Math.sin(data.angle * 2) * 0.8 + Math.sin(data.angle) * 0.6;
          const z = Math.sin(data.angle) * data.radiusY + data.zOffset;

          mesh.position.set(x, y, z);

          mesh.rotation.y = Math.sin(data.angle) * 0.25;
          mesh.rotation.x = Math.cos(data.angle) * 0.15;

          const depthFactor = (z + 10) / 20;
          const targetScale = 0.6 + depthFactor * 0.55;
          mesh.scale.set(targetScale, targetScale, targetScale);
          mesh.material.opacity = Math.min(1.0, 0.35 + depthFactor * 0.65);
        });

        if (bridgeIgniteIntensity > 0) {
          bridgeIgniteIntensity -= delta * 0.8;
          if (bridgeIgniteIntensity < 0) bridgeIgniteIntensity = 0;
        }
      } else {
        crashProgress += delta * 0.65;

        // Scale down and dissolve cards
        skillCardMeshes.forEach((mesh) => {
          mesh.scale.lerp(new THREE.Vector3(0.01, 0.01, 0.01), delta * 5);
          mesh.material.opacity = Math.max(0, mesh.material.opacity - delta * 3);
        });

        // Animate particles along bezier curves to bridge
        const positions = crashParticles.geometry.attributes.position.array as Float32Array;

        for (let i = 0; i < particleDotCount; i++) {
          const d = dotData[i];
          if (d.active) {
            d.progress += delta * d.speed * 0.95;

            if (d.progress < 1.0) {
              const bridgePt = bridgeCurve.getPoint(d.targetT);
              const t = d.progress;
              const invT = 1 - t;
              const controlPt = d.startPos.clone().lerp(bridgePt, 0.5).add(d.curveOffset);

              const currentPos = d.startPos
                .clone()
                .multiplyScalar(invT * invT)
                .add(controlPt.clone().multiplyScalar(2 * invT * t))
                .add(bridgePt.clone().multiplyScalar(t * t));

              positions[i * 3] = currentPos.x;
              positions[i * 3 + 1] = currentPos.y;
              positions[i * 3 + 2] = currentPos.z;
            } else {
              bridgeIgniteIntensity = Math.min(3.0, bridgeIgniteIntensity + 0.09);
            }
          }
        }
        crashParticles.geometry.attributes.position.needsUpdate = true;

        if (crashProgress > 1.2) {
          setToastMessage("⚡ BRIDGE IGNITED! Dual-Evidence Skills Synchronized.");
          setStatusText("Bridge Ignited!");
          setHeaderBtnText("Reset Orbit");
        }
      }

      // Smooth color lerp towards target mode color
      currentBridgeColor.lerp(targetBridgeColor, delta * 3.5);

      const wave = (Math.sin(time * 4) + 1) * 0.5;
      const activeColor = currentBridgeColor.clone();

      bridgeTubeMat.color.copy(activeColor);
      bridgeTubeMat.emissive.copy(activeColor);
      bridgeTubeMat.emissiveIntensity = 0.4 + bridgeIgniteIntensity * 1.5 + wave * 0.25;

      // Parallax Motion
      targetX += (mouseX - targetX) * 0.05;
      targetY += (-mouseY - targetY) * 0.05;

      camera.position.x = targetX * 5;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
    }
    animate();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", updateCameraFrustum);
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("touchmove", onTouchMove);
      renderer.dispose();
      starGeo.dispose();
      starMat.dispose();
      dustGeo.dispose();
      dustMat.dispose();
      bridgeTubeGeo.dispose();
      bridgeTubeMat.dispose();
      dotGeo.dispose();
      dotMat.dispose();
      stoneMaterial.dispose();
    };
  }, []);

  // -----------------------------------------------------------------
  // 2. 3D CARD TILT PHYSICS
  // -----------------------------------------------------------------
  const setupCardTilt = (element: HTMLDivElement | null) => {
    if (!element) return;

    const onMove = (e: MouseEvent) => {
      const rect = element.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const rotateX = ((y - rect.height / 2) / (rect.height / 2)) * -14;
      const rotateY = ((x - rect.width / 2) / (rect.width / 2)) * 14;
      element.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.03, 1.03, 1.03)`;
    };

    const onLeave = () => {
      element.style.transform = `rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
    };

    element.addEventListener("mousemove", onMove);
    element.addEventListener("mouseleave", onLeave);

    return () => {
      element.removeEventListener("mousemove", onMove);
      element.removeEventListener("mouseleave", onLeave);
    };
  };

  useEffect(() => {
    const cleanupStudent = setupCardTilt(studentCardRef.current);
    const cleanupEmployer = setupCardTilt(employerCardRef.current);
    return () => {
      cleanupStudent?.();
      cleanupEmployer?.();
    };
  }, []);

  // -----------------------------------------------------------------
  // 3. SEAMLESS NAVIGATION & PORTAL ENTRY HANDLERS
  // -----------------------------------------------------------------
  const handleStudentCardClick = useCallback(() => {
    if (triggerCrashRef.current) {
      triggerCrashRef.current("student");
    }
    setNavigatingTo("student");
    // Cinematic delay to let the user see the yellow particles crash into the bridge tube
    const timer = setTimeout(() => {
      onNavigateToStudentLogin();
    }, 900);
    return () => clearTimeout(timer);
  }, [onNavigateToStudentLogin]);

  const handleEmployerCardClick = useCallback(() => {
    if (triggerCrashRef.current) {
      triggerCrashRef.current("employer");
    }
    setNavigatingTo("employer");
    // Cinematic delay to let the user see the orange particles crash into the bridge tube
    const timer = setTimeout(() => {
      onNavigateToEmployeeLogin();
    }, 900);
    return () => clearTimeout(timer);
  }, [onNavigateToEmployeeLogin]);

  const handleIgniteHeaderClick = () => {
    if (!isCrashingState) {
      triggerCrashRef.current?.("student");
    } else {
      resetSwirlRef.current?.();
    }
  };

  const handleCrashPillClick = () => {
    if (activePortalMode === "student") {
      triggerCrashRef.current?.("employer");
    } else {
      triggerCrashRef.current?.("student");
    }
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (customRole === "student") {
      const user = { ...DEFAULT_STUDENT_USER, isFirstTime: isFirstTimeStudent };
      setCurrentUser(user);
      onDirectLoginSuccess(isFirstTimeStudent);
    } else if (customRole === "employee") {
      setCurrentUser(DEFAULT_EMPLOYER_USER);
      onDirectLoginSuccess(false);
    } else {
      setCurrentUser(DEFAULT_FACULTY_USER);
      onDirectLoginSuccess(false);
    }
  };

  return (
    <div className="min-h-[100dvh] flex flex-col justify-between relative selection:bg-cyan-500 selection:text-slate-950 overflow-x-hidden font-sans text-slate-100 bg-black">
      {/* ================= 3D THREE.JS CANVAS ================= */}
      <canvas
        ref={canvasRef}
        id="webgl-canvas"
        className="fixed inset-0 pointer-events-none z-0 w-full h-full"
      />

      {/* Cosmic Vignette Overlay */}
      <div className="fixed inset-0 pointer-events-none z-0 cosmic-vignette" />

      {/* ================= HEADER NAVBAR ================= */}
      <header className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-8 py-3 sm:py-5 flex justify-between items-center">
        {/* Left: Official Bridge Logo */}
        <div className="flex items-center gap-2 sm:gap-3">
          <BridgeLogo variant="full" size="md" showTagline={true} />
        </div>

        {/* Engine Status & Interactive Trigger + About Link */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            id="btn-ignite-header"
            onClick={handleIgniteHeaderClick}
            className="flex items-center gap-1.5 sm:gap-2 bg-gradient-to-r from-cyan-500 to-amber-500 hover:from-cyan-400 hover:to-amber-400 text-slate-950 font-extrabold text-[10px] sm:text-xs px-3 py-1.5 sm:px-4 sm:py-2 rounded-full shadow-lg shadow-cyan-500/25 transition-all transform active:scale-95 cursor-pointer"
          >
            <Zap className="w-3.5 h-3.5 fill-current" />
            <span id="ignite-btn-text">{headerBtnText}</span>
          </button>

          <div className="hidden xs:flex items-center gap-2 bg-slate-900/80 border border-slate-800 backdrop-blur-md px-3 py-1.5 rounded-full text-[10px] sm:text-xs text-slate-300 font-mono shadow-inner">
            <span
              id="status-indicator-dot"
              className={`w-2 h-2 rounded-full ${
                activePortalMode === "student"
                  ? "bg-yellow-400 animate-bounce"
                  : activePortalMode === "employer"
                  ? "bg-orange-500 animate-bounce"
                  : isCrashingState
                  ? "bg-emerald-400 animate-ping"
                  : "bg-cyan-400 animate-ping"
              }`}
            />
            <span id="status-indicator-text">{statusText}</span>
          </div>

          {/* About Link (Opens Mission & Dual-Evidence Modal) */}
          <button
            type="button"
            id="about-link"
            onClick={() => setShowAboutModal(true)}
            className="flex items-center gap-1.5 text-[10px] sm:text-xs font-mono text-slate-300 hover:text-white bg-slate-900/80 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 px-3 py-1.5 rounded-full backdrop-blur-md transition-all shadow-sm group cursor-pointer"
          >
            <Info className="w-3.5 h-3.5 text-cyan-400 group-hover:rotate-12 transition-transform" />
            <span>About</span>
          </button>

          {/* Quick Persona Bypass */}
          <button
            type="button"
            onClick={() => setShowCustomLoginModal(true)}
            className="hidden sm:flex items-center gap-1 text-[10px] font-mono text-slate-400 hover:text-slate-200 border border-slate-800/80 hover:border-slate-700 px-2.5 py-1.5 rounded-full bg-slate-950/60 transition-all cursor-pointer"
            title="Fast Bypass / Test Personas"
          >
            <UserCheck className="w-3 h-3 text-amber-400" />
            <span>Personas</span>
          </button>
        </div>
      </header>

      {/* ================= HERO & RESPONSIVE PORTAL SECTION ================= */}
      <main className="relative z-10 w-full max-w-5xl mx-auto px-3 sm:px-6 text-center my-auto flex flex-col items-center py-2 sm:py-4">
        {/* Live Engine Notification Pill */}
        <div
          id="engine-toast"
          className={`mb-2 sm:mb-4 transition-all duration-500 transform ${
            showToast ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2 pointer-events-none"
          } bg-slate-900/90 border border-cyan-500/50 backdrop-blur-xl px-4 py-1.5 rounded-full text-xs text-cyan-300 font-mono flex items-center gap-2 shadow-xl shadow-cyan-500/10`}
        >
          <Sparkles className="w-4 h-4 text-amber-400 animate-spin" />
          <span id="toast-message">{toastMessage || "Skills Morphing into Particle Energy Stream..."}</span>
        </div>

        {/* Hero Emblem & Title */}
        <div className="flex flex-col items-center justify-center">
          {/* App Icon Squircle Badge (From Uploaded Logo) */}
          <div className="mb-4 sm:mb-6 animate-in fade-in zoom-in duration-700">
            <BridgeLogo variant="badge" size="xl" className="shadow-[0_0_50px_rgba(6,182,212,0.3)] hover:scale-105 transition-transform duration-300" />
          </div>

          <h1 className="text-4xl xs:text-5xl sm:text-7xl md:text-8xl font-black tracking-widest uppercase bg-clip-text text-transparent bg-gradient-to-b from-white via-slate-100 to-slate-400 drop-shadow-[0_12px_40px_rgba(0,0,0,0.95)]">
            BRIDGE
          </h1>
        </div>

        {/* Subtitle with Color Highlights */}
        <p className="mt-2 sm:mt-3 text-xs xs:text-sm sm:text-xl text-slate-200 max-w-2xl font-light leading-relaxed drop-shadow-[0_4px_12px_rgba(0,0,0,0.95)] px-2">
          Bridging gaps between{" "}
          <span className="text-cyan-400 font-bold glow-cyan">traditional learning</span> and{" "}
          <span className="text-amber-400 font-bold glow-amber">market requirements</span>.
        </p>

        {/* ================= DUAL ACTION PORTALS ================= */}
        <div className="mt-5 sm:mt-8 w-full flex flex-row items-center justify-center gap-2.5 sm:gap-6 px-1">
          {/* 1) STUDENT / TRAINEE LOGIN CARD (Yellow Glow Trigger) */}
          <div className="card-3d-wrapper">
            <div
              ref={studentCardRef}
              id="student-card"
              onClick={handleStudentCardClick}
              className={`card-3d relative group px-3.5 sm:px-6 py-3 sm:py-4 rounded-xl sm:rounded-2xl bg-slate-950/85 border border-yellow-500/40 backdrop-blur-xl hover:border-yellow-300 hover:bg-slate-900/90 hover:shadow-[0_0_35px_rgba(250,204,21,0.5)] cursor-pointer w-[155px] xs:w-48 sm:w-56 transition-all ${
                navigatingTo === "student" ? "ring-2 ring-yellow-400 scale-[1.04]" : ""
              }`}
            >
              <div className="flex items-center gap-2.5 sm:gap-3.5">
                <div className="card-3d-icon p-2 sm:p-2.5 rounded-lg sm:rounded-xl bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 group-hover:bg-yellow-400 group-hover:text-slate-950 transition-colors shadow-md">
                  <GraduationCap className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <div className="card-3d-content text-left">
                  <div className="text-[9px] sm:text-[10px] text-yellow-400 uppercase tracking-wider font-mono font-bold leading-tight">
                    Trainee Access
                  </div>
                  <div className="text-[11px] sm:text-base font-extrabold text-white flex items-center gap-1 mt-0.5">
                    <span>{navigatingTo === "student" ? "Entering..." : "Student Portal"}</span>
                    <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 2) EMPLOYER / RECRUITER LOGIN CARD (Orange Glow Trigger) */}
          <div className="card-3d-wrapper">
            <div
              ref={employerCardRef}
              id="employer-card"
              onClick={handleEmployerCardClick}
              className={`card-3d relative group px-3.5 sm:px-6 py-3 sm:py-4 rounded-xl sm:rounded-2xl bg-slate-950/85 border border-orange-500/40 backdrop-blur-xl hover:border-orange-300 hover:bg-slate-900/90 hover:shadow-[0_0_35px_rgba(249,115,22,0.5)] cursor-pointer w-[155px] xs:w-48 sm:w-56 transition-all ${
                navigatingTo === "employer" ? "ring-2 ring-orange-400 scale-[1.04]" : ""
              }`}
            >
              <div className="flex items-center gap-2.5 sm:gap-3.5">
                <div className="card-3d-icon p-2 sm:p-2.5 rounded-lg sm:rounded-xl bg-orange-500/10 border border-orange-500/30 text-orange-400 group-hover:bg-orange-400 group-hover:text-slate-950 transition-colors shadow-md">
                  <Briefcase className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <div className="card-3d-content text-left">
                  <div className="text-[9px] sm:text-[10px] text-orange-400 uppercase tracking-wider font-mono font-bold leading-tight">
                    Recruiter Access
                  </div>
                  <div className="text-[11px] sm:text-base font-extrabold text-white flex items-center gap-1 mt-0.5">
                    <span>{navigatingTo === "employer" ? "Entering..." : "Recruiter Portal"}</span>
                    <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Feature Badges & Interactive Crash Trigger */}
        <div className="mt-4 sm:mt-7 flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-slate-400 text-[10px] sm:text-xs font-mono">
          <span className="bg-slate-900/70 border border-slate-800 rounded-full px-3 py-1 backdrop-blur-md text-cyan-300 flex items-center gap-1">
            <Zap className="w-3 h-3 text-cyan-400" /> Real-time Skill Matching
          </span>
          <span className="bg-slate-900/70 border border-slate-800 rounded-full px-3 py-1 backdrop-blur-md text-amber-300 flex items-center gap-1">
            <ShieldCheck className="w-3 h-3 text-amber-400" /> Verified Credentials
          </span>
          <button
            id="btn-crash-trigger"
            onClick={handleCrashPillClick}
            className="bg-slate-800/80 hover:bg-slate-700/90 border border-slate-700 rounded-full px-3 py-1 backdrop-blur-md text-slate-200 hover:text-white transition-all flex items-center gap-1 cursor-pointer"
          >
            <PlayCircle className="w-3 h-3 text-amber-400" /> Crash Tiles to Ignite
          </button>
        </div>
      </main>

      {/* ================= FOOTER ================= */}
      <footer className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-8 py-3 sm:py-5 text-center text-[10px] sm:text-xs font-mono text-slate-500">
        © 2026 BRIDGE Platform. All rights reserved. Dual-Evidence Skill Verification Engine.
      </footer>

      {/* About Mission & Dual-Evidence Modal */}
      <AboutModal isOpen={showAboutModal} onClose={() => setShowAboutModal(false)} />

      {/* Quick Custom Persona Modal */}
      {showCustomLoginModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl relative space-y-4">
            <button
              type="button"
              onClick={() => setShowCustomLoginModal(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-400">
                Direct Bypass
              </span>
              <h3 className="text-lg font-bold text-white">Select Account Persona</h3>
            </div>

            <form onSubmit={handleCustomSubmit} className="space-y-4 pt-1">
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setCustomRole("student")}
                  className={`p-2.5 rounded-xl border text-xs font-medium transition-all text-center cursor-pointer ${
                    customRole === "student"
                      ? "bg-cyan-500/15 border-cyan-500/50 text-cyan-300 font-bold"
                      : "bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200"
                  }`}
                >
                  <GraduationCap className="w-4 h-4 mx-auto mb-1" />
                  <span>Student</span>
                </button>

                <button
                  type="button"
                  onClick={() => setCustomRole("employee")}
                  className={`p-2.5 rounded-xl border text-xs font-medium transition-all text-center cursor-pointer ${
                    customRole === "employee"
                      ? "bg-amber-500/15 border-amber-500/50 text-amber-300 font-bold"
                      : "bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200"
                  }`}
                >
                  <Briefcase className="w-4 h-4 mx-auto mb-1" />
                  <span>Employee</span>
                </button>

                <button
                  type="button"
                  onClick={() => setCustomRole("faculty")}
                  className={`p-2.5 rounded-xl border text-xs font-medium transition-all text-center cursor-pointer ${
                    customRole === "faculty"
                      ? "bg-purple-500/15 border-purple-500/50 text-purple-300 font-bold"
                      : "bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200"
                  }`}
                >
                  <UserCheck className="w-4 h-4 mx-auto mb-1" />
                  <span>Faculty</span>
                </button>
              </div>

              {customRole === "student" && (
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <label className="flex items-center gap-2 cursor-pointer text-xs select-none">
                    <input
                      type="checkbox"
                      checked={isFirstTimeStudent}
                      onChange={(e) => setIsFirstTimeStudent(e.target.checked)}
                      className="rounded bg-slate-800 border-slate-700 text-cyan-500 focus:ring-0"
                    />
                    <span className="text-slate-300">
                      Simulate <strong>First-Time Student</strong> (Launches Onboarding Modal)
                    </span>
                  </label>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-amber-500 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-cyan-500/15 hover:opacity-95 transition-opacity cursor-pointer"
              >
                <span>Continue into Platform</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
