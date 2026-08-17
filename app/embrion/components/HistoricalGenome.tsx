"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { seededRandom, stableSeed } from "@/lib/embrion/genome";
import type { GenomeVector } from "@/lib/embrion/types";
import styles from "../embrion.module.css";

type Props = { genome: GenomeVector; color: string; label: string };

export default function HistoricalGenome({ genome, color, label }: Props) {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(36, 1, 0.1, 100);
    camera.position.set(0, 0, 5.6);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    mount.appendChild(renderer.domElement);

    const group = new THREE.Group();
    scene.add(group);
    const geometry = new THREE.IcosahedronGeometry(1.25 + genome.presence * 0.25, 4);
    const position = geometry.attributes.position;
    const seed = stableSeed(`${genome.conceptId}:${genome.periodId}`);
    const random = seededRandom(seed);
    const phase = random() * Math.PI * 2;
    const branches = 2 + Math.round(genome.semanticDiversity * 6);
    const v = new THREE.Vector3();
    for (let i = 0; i < position.count; i += 1) {
      v.fromBufferAttribute(position, i);
      const n = v.clone().normalize();
      const theta = Math.atan2(n.z, n.x);
      const phi = Math.acos(THREE.MathUtils.clamp(n.y, -1, 1));
      const wave = Math.sin(theta * branches + phase) * Math.sin(phi * (2 + genome.connections * 4));
      const rupture = Math.sin((n.x + n.y * 1.7 - n.z) * 8 + phase) * genome.transformation;
      const radius = 1 + wave * (0.04 + genome.semanticDiversity * 0.12) + rupture * 0.08;
      v.multiplyScalar(radius);
      v.x *= 0.92 + genome.stability * 0.18;
      v.y *= 0.92 + genome.persistence * 0.3;
      v.z *= 0.9 + genome.transformation * 0.35;
      position.setXYZ(i, v.x, v.y, v.z);
    }
    position.needsUpdate = true;
    geometry.computeVertexNormals();

    const core = new THREE.Mesh(geometry, new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(color), roughness: 0.42, metalness: 0.05,
      transparent: true, opacity: 0.56 + genome.evidenceCoverage * 0.34,
      transmission: 0.08, thickness: 0.6, side: THREE.DoubleSide,
    }));
    group.add(core);
    const shell = new THREE.Mesh(geometry.clone(), new THREE.MeshBasicMaterial({ color: "#d8c9ae", wireframe: true, transparent: true, opacity: 0.08 + genome.evidenceCoverage * 0.16 }));
    shell.scale.setScalar(1.035);
    group.add(shell);

    const particleCount = Math.round(70 + genome.recurrence * 160);
    const particlePositions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i += 1) {
      const radius = 1.7 + random() * (0.5 + genome.dispersion * 1.6);
      const theta = random() * Math.PI * 2;
      const u = random() * 2 - 1;
      const rxy = Math.sqrt(1 - u * u);
      particlePositions[i * 3] = Math.cos(theta) * rxy * radius;
      particlePositions[i * 3 + 1] = u * radius;
      particlePositions[i * 3 + 2] = Math.sin(theta) * rxy * radius;
    }
    const particleGeometry = new THREE.BufferGeometry();
    particleGeometry.setAttribute("position", new THREE.BufferAttribute(particlePositions, 3));
    const particles = new THREE.Points(particleGeometry, new THREE.PointsMaterial({ color: "#cdbb9c", size: 0.018 + genome.intensity * 0.018, transparent: true, opacity: 0.22 + genome.evidenceCoverage * 0.38, depthWrite: false }));
    group.add(particles);

    const lineMaterial = new THREE.LineBasicMaterial({ color: new THREE.Color(color), transparent: true, opacity: 0.2 + genome.connections * 0.34 });
    const lineCount = Math.round(genome.connections * 9);
    for (let i = 0; i < lineCount; i += 1) {
      const angle = (i / Math.max(lineCount, 1)) * Math.PI * 2 + phase;
      const start = new THREE.Vector3(Math.cos(angle), Math.sin(angle * 1.4) * 0.7, Math.sin(angle)).normalize().multiplyScalar(1.15);
      const end = start.clone().multiplyScalar(1.8 + random() * 0.8);
      const curve = new THREE.QuadraticBezierCurve3(start, start.clone().multiplyScalar(1.45).add(new THREE.Vector3(0, (random() - 0.5) * 0.7, 0)), end);
      group.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(curve.getPoints(18)), lineMaterial));
    }

    scene.add(new THREE.AmbientLight("#efe6d6", 1.2));
    const key = new THREE.DirectionalLight("#fff1d7", 2.2); key.position.set(3, 4, 5); scene.add(key);
    const rim = new THREE.DirectionalLight(color, 2.8); rim.position.set(-4, -2, -3); scene.add(rim);

    let dragging = false; let px = 0; let py = 0; let targetX = 0; let targetY = 0; let frame = 0;
    const pointerDown = (event: PointerEvent) => { dragging = true; px = event.clientX; py = event.clientY; renderer.domElement.setPointerCapture(event.pointerId); };
    const pointerMove = (event: PointerEvent) => { if (!dragging) return; targetY += (event.clientX - px) * 0.008; targetX += (event.clientY - py) * 0.008; px = event.clientX; py = event.clientY; };
    const pointerUp = () => { dragging = false; };
    renderer.domElement.addEventListener("pointerdown", pointerDown);
    renderer.domElement.addEventListener("pointermove", pointerMove);
    renderer.domElement.addEventListener("pointerup", pointerUp);
    const resize = () => { const rect = mount.getBoundingClientRect(); renderer.setSize(rect.width, rect.height, false); camera.aspect = Math.max(rect.width / Math.max(rect.height, 1), 0.1); camera.updateProjectionMatrix(); };
    const observer = new ResizeObserver(resize); observer.observe(mount); resize();
    const animate = () => { frame = requestAnimationFrame(animate); if (!dragging) targetY += 0.0015 + (1 - genome.stability) * 0.0018; group.rotation.x += (targetX - group.rotation.x) * 0.05; group.rotation.y += (targetY - group.rotation.y) * 0.05; const pulse = 1 + Math.sin(performance.now() * (0.00035 + genome.recurrence * 0.0005)) * genome.recurrence * 0.025; core.scale.setScalar(pulse); particles.rotation.y -= 0.0004; renderer.render(scene, camera); };
    animate();

    return () => {
      cancelAnimationFrame(frame); observer.disconnect();
      renderer.domElement.removeEventListener("pointerdown", pointerDown); renderer.domElement.removeEventListener("pointermove", pointerMove); renderer.domElement.removeEventListener("pointerup", pointerUp);
      scene.traverse((object) => { if (object instanceof THREE.Mesh || object instanceof THREE.Line || object instanceof THREE.Points) { object.geometry.dispose(); const materials = Array.isArray(object.material) ? object.material : [object.material]; materials.forEach((material) => material.dispose()); } });
      renderer.dispose(); renderer.domElement.remove();
    };
  }, [genome, color]);

  const metrics = [
    ["presencia", genome.presence], ["diversidad", genome.semanticDiversity], ["transformación", genome.transformation], ["persistencia", genome.persistence], ["conexiones", genome.connections], ["evidencia", genome.evidenceCoverage],
  ] as const;

  return (
    <div className={styles.genomePanel}>
      <div ref={mountRef} className={styles.genomeCanvas} aria-label={`Genoma histórico de ${label}`} />
      <div className={styles.genomeCaption}><span>GENOMA HISTÓRICO</span><strong>{label}</strong><small>{genome.sampleSize} {genome.sampleSize === 1 ? "obra" : "obras"} · forma calculada, no decorativa</small></div>
      <div className={styles.genomeMetrics}>{metrics.map(([name, value]) => <div key={name}><span>{name}</span><i><b style={{ width: `${Math.round(value * 100)}%` }} /></i><em>{Math.round(value * 100)}</em></div>)}</div>
    </div>
  );
}
