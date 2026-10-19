"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import gsap from "gsap";

export function ProductScene() {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 100);
    camera.position.set(0, 0.35, 7.2);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.12;
    host.appendChild(renderer.domElement);

    const environmentGenerator = new THREE.PMREMGenerator(renderer);
    const environment = environmentGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = environment;

    const key = new THREE.DirectionalLight(0xffffff, 5.5);
    key.position.set(3, 5, 5);
    const rim = new THREE.DirectionalLight(0xd7ef62, 4);
    rim.position.set(-4, 2, -2);
    scene.add(key, rim, new THREE.HemisphereLight(0xf7fff0, 0x123326, 2.4));

    const lab = new THREE.Group();
    lab.rotation.set(0.06, -0.25, -0.035);
    scene.add(lab);

    const glass = new THREE.MeshPhysicalMaterial({
      color: 0xf3fffc,
      transparent: true,
      opacity: 0.2,
      transmission: 1,
      thickness: 0.38,
      ior: 1.46,
      roughness: 0.035,
      metalness: 0,
      clearcoat: 1,
      clearcoatRoughness: 0.03,
      attenuationColor: new THREE.Color(0xdff8ef),
      attenuationDistance: 2.8,
      side: THREE.DoubleSide,
      depthWrite: false,
    });
    const glassEdge = new THREE.MeshPhysicalMaterial({ color: 0xe9fff9, transparent: true, opacity: 0.74, transmission: 0.72, thickness: 0.25, ior: 1.46, roughness: 0.045, clearcoat: 1, depthWrite: false });
    // Nested transmissive meshes are absent from Three.js's refraction buffer.
    // Render the colored liquid in the opaque pass so the glass can refract it.
    const liquid = new THREE.MeshPhysicalMaterial({ color: 0xffffff, roughness: 0.12, clearcoat: 1, ior: 1.33, side: THREE.DoubleSide });
    const liquidEdge = new THREE.MeshPhysicalMaterial({ color: 0xdff47b, roughness: 0.08, clearcoat: 1, side: THREE.DoubleSide });

    const flaskProfile = [
      new THREE.Vector2(0.98, -1.68), new THREE.Vector2(1.06, -1.58), new THREE.Vector2(1.08, -1.42),
      new THREE.Vector2(0.78, -0.2), new THREE.Vector2(0.48, 0.82), new THREE.Vector2(0.36, 1.02),
      new THREE.Vector2(0.36, 1.72), new THREE.Vector2(0.46, 1.78), new THREE.Vector2(0.46, 1.9),
      new THREE.Vector2(0.36, 1.96),
    ];
    const flask = new THREE.Mesh(new THREE.LatheGeometry(flaskProfile, 128), glass);
    flask.renderOrder = 10;
    const base = new THREE.Mesh(new THREE.TorusGeometry(0.94, 0.055, 18, 128), glassEdge);
    base.rotation.x = Math.PI / 2;
    base.position.y = -1.64;
    const rimRing = new THREE.Mesh(new THREE.TorusGeometry(0.44, 0.07, 18, 96), glassEdge);
    rimRing.rotation.x = Math.PI / 2;
    rimRing.position.y = 1.88;

    const liquidGeometry = new THREE.CylinderGeometry(0.82, 0.99, 0.86, 128, 32);
    const liquidColors: number[] = [];
    const liquidPositions = liquidGeometry.attributes.position as THREE.BufferAttribute;
    const cyan = new THREE.Color(0x08b9f0);
    const yellow = new THREE.Color(0xffdf25);
    const magenta = new THREE.Color(0xf021bd);
    const blue = new THREE.Color(0x1359dd);
    for (let index = 0; index < liquidPositions.count; index += 1) {
      const x = liquidPositions.getX(index);
      const y = liquidPositions.getY(index);
      const mix = THREE.MathUtils.clamp((x + 1) * 0.5, 0, 1);
      const color = mix < 0.5 ? cyan.clone().lerp(yellow, mix * 2) : yellow.clone().lerp(magenta, (mix - 0.5) * 2);
      if (y < -0.25) color.lerp(blue, THREE.MathUtils.clamp((-y - 0.25) * 1.7, 0, 0.55));
      liquidColors.push(color.r, color.g, color.b);
    }
    liquidGeometry.setAttribute("color", new THREE.Float32BufferAttribute(liquidColors, 3));
    liquid.vertexColors = true;
    liquid.color.set(0xffffff);
    const liquidBody = new THREE.Mesh(liquidGeometry, liquid);
    liquidBody.position.y = -1.15;
    const surfaceGeometry = new THREE.RingGeometry(0, 0.82, 128, 16);
    const liquidSurface = new THREE.Mesh(surfaceGeometry, liquidEdge);
    liquidSurface.rotation.x = -Math.PI / 2;
    liquidSurface.position.y = -0.719;
    const meniscus = new THREE.Mesh(new THREE.TorusGeometry(0.76, 0.045, 16, 96), liquidEdge);
    meniscus.rotation.x = Math.PI / 2;
    meniscus.position.y = -0.69;
    const liquidGroup = new THREE.Group();
    liquidGroup.add(liquidBody, liquidSurface, meniscus);
    const surfacePositions = surfaceGeometry.attributes.position as THREE.BufferAttribute;
    const surfaceBase = Float32Array.from(surfacePositions.array as ArrayLike<number>);
    const bodyBase = Float32Array.from(liquidPositions.array as ArrayLike<number>);
    const meniscusPositions = meniscus.geometry.attributes.position as THREE.BufferAttribute;
    const meniscusBase = Float32Array.from(meniscusPositions.array as ArrayLike<number>);
    const slosh = { x: 0, z: 0 };
    let targetWave = 0.006;
    let waveStrength = 0.006;

    const glowBlobs = [
      [-0.5, -1.27, 0.2, 0x10bdf2],
      [0, -1.08, 0.32, 0xffd72a],
      [0.5, -1.23, 0.18, 0xf02ac5],
    ] as const;
    glowBlobs.forEach(([x, y, z, color]) => {
      const blob = new THREE.Mesh(
        new THREE.SphereGeometry(0.34, 32, 32),
        new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.34, blending: THREE.AdditiveBlending, depthWrite: false }),
      );
      blob.position.set(x, y, z);
      blob.scale.y = 0.72;
      liquidGroup.add(blob);
    });

    lab.add(flask, base, rimRing, liquidGroup);

    const cyanLight = new THREE.PointLight(0x12c9ff, 8, 3.4);
    cyanLight.position.set(-0.58, -1.15, 0.35);
    const yellowLight = new THREE.PointLight(0xffd72a, 10, 3.2);
    yellowLight.position.set(0, -0.98, 0.5);
    const magentaLight = new THREE.PointLight(0xff35d1, 8, 3.4);
    magentaLight.position.set(0.62, -1.12, 0.3);
    lab.add(cyanLight, yellowLight, magentaLight);

    const bubbles = new THREE.Group();
    const bubbleMaterial = new THREE.MeshPhysicalMaterial({ color: 0xfaffdf, transparent: true, opacity: 0.5, transmission: 0.55, roughness: 0.04, ior: 1.1 });
    for (let index = 0; index < 18; index += 1) {
      const radius = 0.018 + (index % 4) * 0.009;
      const bubble = new THREE.Mesh(new THREE.SphereGeometry(radius, 16, 16), bubbleMaterial);
      const angle = index * 2.19;
      const distance = 0.18 + (index % 5) * 0.115;
      bubble.position.set(Math.cos(angle) * distance, -1.5 + (index % 9) * 0.09, Math.sin(angle) * distance);
      bubbles.add(bubble);
    }
    liquidGroup.add(bubbles);

    const particleColors = [0xf1d35b, 0xcf6476, 0x8fbf67, 0xe9934f];
    const particles = new THREE.Group();
    for (let index = 0; index < 26; index += 1) {
      const size = 0.035 + (index % 4) * 0.014;
      const particle = new THREE.Mesh(new THREE.SphereGeometry(size, 18, 18), new THREE.MeshStandardMaterial({ color: particleColors[index % particleColors.length], emissive: particleColors[index % particleColors.length], emissiveIntensity: 0.18 }));
      const angle = (index / 26) * Math.PI * 2;
      const radius = 1.35 + (index % 3) * 0.18;
      particle.position.set(Math.cos(angle) * radius, -0.1 + ((index % 7) - 3) * 0.34, Math.sin(angle) * radius * 0.55);
      particles.add(particle);
    }
    lab.add(particles);

    const glowGeometry = new THREE.RingGeometry(1.35, 1.39, 96);
    const glowMaterial = new THREE.MeshBasicMaterial({ color: 0xd7ef62, transparent: true, opacity: 0.38, side: THREE.DoubleSide });
    const glow = new THREE.Mesh(glowGeometry, glowMaterial);
    glow.rotation.x = Math.PI / 2;
    glow.position.y = -1.72;
    scene.add(glow);

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    gsap.fromTo(lab.scale, { x: 0.58, y: 0.58, z: 0.58 }, { x: 0.9, y: 0.9, z: 0.9, duration: 1.35, ease: "expo.out" });
    const floatTween = reduceMotion ? null : gsap.to(lab.position, { y: 0.12, duration: 2.8, ease: "sine.inOut", yoyo: true, repeat: -1 });
    const orbitTween = reduceMotion ? null : gsap.to(particles.rotation, { y: Math.PI * 2, duration: 16, ease: "none", repeat: -1 });
    const bubbleTween = reduceMotion ? null : gsap.to(bubbles.position, { y: 0.14, duration: 2.2, ease: "sine.inOut", yoyo: true, repeat: -1 });

    const onPointerMove = (event: PointerEvent) => {
      if (reduceMotion) return;
      const bounds = host.getBoundingClientRect();
      const x = THREE.MathUtils.clamp((event.clientX - bounds.left) / Math.max(bounds.width, 1) - 0.5, -0.5, 0.5);
      const y = THREE.MathUtils.clamp((event.clientY - bounds.top) / Math.max(bounds.height, 1) - 0.5, -0.5, 0.5);
      gsap.to(lab.rotation, { x: 0.06 - y * 0.16, y: -0.25 + x * 0.28, z: -0.035 - x * 0.08, duration: 0.8, overwrite: "auto" });
      gsap.to(slosh, { x: -x * 0.1, z: y * 0.1, duration: 0.55, ease: "power2.out", overwrite: "auto" });
      targetWave = 0.014 + (Math.abs(x) + Math.abs(y)) * 0.012;
      gsap.to(camera.position, { x: x * 0.2, y: 0.35 - y * 0.16, duration: 0.8, overwrite: "auto" });
    };
    const onPointerLeave = () => {
      if (reduceMotion) return;
      gsap.to(slosh, { x: 0, z: 0, duration: 1.35, ease: "elastic.out(1, 0.35)", overwrite: "auto" });
      targetWave = 0.006;
    };
    const resize = () => {
      const width = host.clientWidth;
      const height = host.clientHeight;
      renderer.setSize(width, height, false);
      camera.aspect = width / Math.max(height, 1);
      camera.updateProjectionMatrix();
    };
    const observer = new ResizeObserver(resize);
    observer.observe(host);
    host.addEventListener("pointermove", onPointerMove);
    host.addEventListener("pointerleave", onPointerLeave);

    let frame = 0;
    const render = () => {
      const time = performance.now() * 0.001;
      waveStrength += (targetWave - waveStrength) * 0.06;
      // Vertical-only deformation keeps the base fixed and the sides inside the glass.
      const heightAt = (x: number, z: number) => {
        const distance = Math.min(1, Math.hypot(x, z) / 0.82);
        const wave = Math.sin(x * 8 + time * 2.5) + Math.cos(z * 9 - time * 2.1) + Math.sin((x + z) * 12 + time * 3.2) * 0.35;
        return THREE.MathUtils.clamp(x * slosh.x + z * slosh.z + wave * waveStrength * (0.35 + distance * 0.65), -0.09, 0.09);
      };
      for (let index = 0; index < liquidPositions.count; index += 1) {
        const offset = index * 3;
        const y = bodyBase[offset + 1];
        const weight = THREE.MathUtils.clamp((y + 0.43) / 0.86, 0, 1);
        liquidPositions.setY(index, y + heightAt(bodyBase[offset], bodyBase[offset + 2]) * weight * weight);
      }
      liquidPositions.needsUpdate = true;
      liquidGeometry.computeVertexNormals();
      for (let index = 0; index < surfacePositions.count; index += 1) {
        const offset = index * 3;
        const x = surfaceBase[offset];
        const y = surfaceBase[offset + 1];
        surfacePositions.setZ(index, heightAt(x, -y));
      }
      surfacePositions.needsUpdate = true;
      surfaceGeometry.computeVertexNormals();
      for (let index = 0; index < meniscusPositions.count; index += 1) {
        const offset = index * 3;
        meniscusPositions.setZ(index, meniscusBase[offset + 2] - heightAt(meniscusBase[offset], meniscusBase[offset + 1]));
      }
      meniscusPositions.needsUpdate = true;
      meniscus.geometry.computeVertexNormals();
      glowMaterial.opacity = 0.31 + Math.sin(time * 1.5) * 0.07;
      renderer.render(scene, camera);
      frame = requestAnimationFrame(render);
    };
    render();

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      host.removeEventListener("pointermove", onPointerMove);
      host.removeEventListener("pointerleave", onPointerLeave);
      floatTween?.kill();
      orbitTween?.kill();
      bubbleTween?.kill();
      gsap.killTweensOf([lab.scale, lab.rotation, camera.position, slosh]);
      lab.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.geometry.dispose();
          const materials = Array.isArray(child.material) ? child.material : [child.material];
          materials.forEach((material) => material.dispose());
        }
      });
      glowGeometry.dispose();
      glowMaterial.dispose();
      bubbleMaterial.dispose();
      environment.dispose();
      environmentGenerator.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  return <div ref={hostRef} className="product-scene" aria-label="Animación tridimensional de formulación y muestra de sabor"><div className="model-fallback" aria-hidden="true">FS</div></div>;
}
