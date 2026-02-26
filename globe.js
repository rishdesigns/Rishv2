/**
 * Abstract Global Network Orb
 * Premium hero visual for worldwide client reach
 */

(function () {
  'use strict';

  function initGlobe() {
    if (typeof THREE === 'undefined') {
      setTimeout(initGlobe, 100);
      return;
    }

    const canvas = document.getElementById('globeCanvas');
    if (!canvas) return;

    const container = canvas.parentElement;

    // Scene setup
    const scene = new THREE.Scene();

    // Camera
    const camera = new THREE.PerspectiveCamera(
      50,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 0.2, 2.3);
    camera.lookAt(0, 0, 0);

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance'
    });
    renderer.setClearColor(0x000000, 0);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(container.clientWidth, container.clientHeight);

    // === NETWORK STRUCTURE ===
    const networkPoints = [];
    const networkConnections = [];
    const pointCount = 600;

    // Generate network points on sphere surface
    for (let i = 0; i < pointCount; i++) {
      const phi = Math.acos(1 - 2 * (i + 0.5) / pointCount);
      const theta = Math.PI * (1 + Math.sqrt(5)) * i;

      const radius = 1;
      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.sin(phi) * Math.sin(theta);
      const z = radius * Math.cos(phi);

      networkPoints.push({
        position: new THREE.Vector3(x, y, z),
        baseSize: 0.015 + Math.random() * 0.01,
        baseBrightness: 0.3 + Math.random() * 0.4
      });
    }

    // Create short connecting lines between nearby points
    for (let i = 0; i < networkPoints.length; i++) {
      const p1 = networkPoints[i];
      for (let j = i + 1; j < networkPoints.length; j++) {
        const p2 = networkPoints[j];
        const dist = p1.position.distanceTo(p2.position);

        // Only connect nearby points (creates web structure)
        if (dist < 0.2 && Math.random() > 0.7) {
          networkConnections.push({ start: p1.position, end: p2.position });
        }
      }
    }

    // Render network lines
    const lineGeometry = new THREE.BufferGeometry();
    const linePositions = [];
    networkConnections.forEach(conn => {
      linePositions.push(conn.start.x, conn.start.y, conn.start.z);
      linePositions.push(conn.end.x, conn.end.y, conn.end.z);
    });
    lineGeometry.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));

    const lineMaterial = new THREE.LineBasicMaterial({
      color: 0x4488ff,
      transparent: true,
      opacity: 0.12,
      blending: THREE.AdditiveBlending
    });
    const linesMesh = new THREE.LineSegments(lineGeometry, lineMaterial);
    scene.add(linesMesh);

    // Render network points
    const pointGeometry = new THREE.BufferGeometry();
    const pointPositions = new Float32Array(networkPoints.length * 3);
    const pointSizes = new Float32Array(networkPoints.length);

    networkPoints.forEach((p, i) => {
      pointPositions[i * 3] = p.position.x;
      pointPositions[i * 3 + 1] = p.position.y;
      pointPositions[i * 3 + 2] = p.position.z;
      pointSizes[i] = p.baseSize;
    });

    pointGeometry.setAttribute('position', new THREE.BufferAttribute(pointPositions, 3));
    pointGeometry.setAttribute('size', new THREE.BufferAttribute(pointSizes, 1));

    const pointMaterial = new THREE.PointsMaterial({
      size: 0.02,
      color: 0x88aaff,
      transparent: true,
      opacity: 0.6,
      sizeAttenuation: true,
      blending: THREE.AdditiveBlending
    });
    const pointsMesh = new THREE.Points(pointGeometry, pointMaterial);
    scene.add(pointsMesh);

    // === CLUSTERED NODE REGIONS (Well-spaced global markers) ===
    const clusterRegions = [
      { lat: 37, lon: -95 },    // USA
      { lat: 56, lon: -106 },   // Canada
      { lat: 54, lon: -3 },     // UK
      { lat: 50, lon: 10 },     // Central Europe
      { lat: 46, lon: 8 },      // Switzerland
      { lat: 20, lon: 78 },     // India
      { lat: 35, lon: 139 },    // Japan
      { lat: -14, lon: -51 },   // Brazil
      { lat: -33, lon: 151 },   // Australia
      { lat: -26, lon: 28 }     // South Africa
    ];

    const clusters = [];

    clusterRegions.forEach((region, idx) => {
      const clusterGroup = new THREE.Group();
      const phi = (90 - region.lat) * (Math.PI / 180);
      const theta = (region.lon + 180) * (Math.PI / 180);
      const radius = 1.05;

      const basePos = new THREE.Vector3(
        -(radius * Math.sin(phi) * Math.cos(theta)),
        radius * Math.cos(phi),
        radius * Math.sin(phi) * Math.sin(theta)
      );

      // Create 2-3 nodes per cluster (less cluttered)
      const nodeCount = 2 + Math.floor(Math.random() * 2);
      const nodes = [];

      for (let i = 0; i < nodeCount; i++) {
        const offset = new THREE.Vector3(
          (Math.random() - 0.5) * 0.08,
          (Math.random() - 0.5) * 0.08,
          (Math.random() - 0.5) * 0.08
        );

        const nodeGeometry = new THREE.SphereGeometry(0.018, 8, 8);
        const nodeMaterial = new THREE.MeshBasicMaterial({
          color: 0xFF5A38, // Coral orange
          transparent: true,
          opacity: 0
        });
        const node = new THREE.Mesh(nodeGeometry, nodeMaterial);
        node.position.copy(basePos).add(offset);

        // Glow halo
        const glowGeometry = new THREE.SphereGeometry(0.03, 8, 8);
        const glowMaterial = new THREE.MeshBasicMaterial({
          color: 0xFF6A48, // Slightly brighter coral for glow
          transparent: true,
          opacity: 0,
          blending: THREE.AdditiveBlending
        });
        const glow = new THREE.Mesh(glowGeometry, glowMaterial);
        glow.position.copy(node.position);

        clusterGroup.add(node);
        clusterGroup.add(glow);
        nodes.push({ node, glow, offset });
      }

      scene.add(clusterGroup);
      clusters.push({ group: clusterGroup, nodes, basePos, index: idx });
    });

    // === INTERNAL PARTICLE DRIFT ===
    const driftCount = 100;
    const driftPositions = new Float32Array(driftCount * 3);
    const driftVelocities = [];

    for (let i = 0; i < driftCount; i++) {
      const radius = Math.random() * 0.8;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      driftPositions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      driftPositions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      driftPositions[i * 3 + 2] = radius * Math.cos(phi);

      driftVelocities.push({
        x: (Math.random() - 0.5) * 0.002,
        y: (Math.random() - 0.5) * 0.002,
        z: (Math.random() - 0.5) * 0.002
      });
    }

    const driftGeometry = new THREE.BufferGeometry();
    driftGeometry.setAttribute('position', new THREE.BufferAttribute(driftPositions, 3));

    const driftMaterial = new THREE.PointsMaterial({
      size: 0.025,
      color: 0x6699ff,
      transparent: true,
      opacity: 0.2,
      sizeAttenuation: true,
      blending: THREE.AdditiveBlending
    });
    const driftParticles = new THREE.Points(driftGeometry, driftMaterial);
    scene.add(driftParticles);



    // === RADIAL GLOW BACKGROUND ===
    const glowGeometry = new THREE.PlaneGeometry(4, 4);
    const glowMaterial = new THREE.ShaderMaterial({
      transparent: true,
      uniforms: {
        time: { value: 0 }
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        varying vec2 vUv;
        uniform float time;
        void main() {
          vec2 center = vec2(0.5, 0.5);
          float dist = distance(vUv, center);
          float glow = 1.0 - smoothstep(0.0, 0.6, dist);
          glow = pow(glow, 2.0);
          vec3 color = mix(vec3(0.2, 0.3, 0.6), vec3(0.3, 0.5, 0.8), glow);
          gl_FragColor = vec4(color, glow * 0.15);
        }
      `
    });
    const glowPlane = new THREE.Mesh(glowGeometry, glowMaterial);
    glowPlane.position.z = -0.5;
    scene.add(glowPlane);

    // === ROTATION & INTERACTION ===
    let autoRotate = true;
    let rotationSpeed = 0.001;
    let targetRotationY = 0;
    let targetRotationX = 0.05;

    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };

    canvas.addEventListener('mousedown', (e) => {
      isDragging = true;
      autoRotate = false;
      previousMousePosition = { x: e.clientX, y: e.clientY };
    });

    canvas.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      const deltaX = e.clientX - previousMousePosition.x;
      const deltaY = e.clientY - previousMousePosition.y;
      targetRotationY += deltaX * 0.005;
      targetRotationX += deltaY * 0.005;
      targetRotationX = Math.max(-Math.PI / 6, Math.min(Math.PI / 6, targetRotationX));
      previousMousePosition = { x: e.clientX, y: e.clientY };
    });

    canvas.addEventListener('mouseup', () => {
      isDragging = false;
      setTimeout(() => { autoRotate = true; }, 2000);
    });

    canvas.addEventListener('mouseleave', () => {
      isDragging = false;
    });

    // === ANIMATION LOOP ===
    let time = 0;
    let rafId = null;
    let isGlobeVisible = false;

    function animate() {
      rafId = requestAnimationFrame(animate);
      time += 0.016;

      if (autoRotate) {
        targetRotationY += rotationSpeed;
      }

      // Network rotation with easing
      const rotY = targetRotationY + (targetRotationY - pointsMesh.rotation.y) * 0.08;
      const rotX = targetRotationX + (targetRotationX - pointsMesh.rotation.x) * 0.08;

      pointsMesh.rotation.y += (rotY - pointsMesh.rotation.y) * 0.1;
      pointsMesh.rotation.x += (rotX - pointsMesh.rotation.x) * 0.1;
      linesMesh.rotation.copy(pointsMesh.rotation);

      // Update network point brightness with depth falloff
      const positions = pointGeometry.attributes.position.array;
      networkPoints.forEach((p, i) => {
        const rotatedPos = p.position.clone();
        rotatedPos.applyAxisAngle(new THREE.Vector3(1, 0, 0), pointsMesh.rotation.x);
        rotatedPos.applyAxisAngle(new THREE.Vector3(0, 1, 0), pointsMesh.rotation.y);

        const depth = (rotatedPos.z + 1) / 2; // 0 to 1
        const opacity = Math.pow(depth, 2) * p.baseBrightness;
        // Store for per-point opacity (approximated via overall material opacity)
      });

      // Update clusters with pulsing and visibility
      const pulseSpeed = 1.2;
      clusters.forEach((cluster, idx) => {
        const { group, nodes, basePos, index } = cluster;

        const offset = index * 0.4;
        const pulse = 0.7 + Math.sin((time + offset) * pulseSpeed) * 0.3;

        nodes.forEach(({ node, glow, offset }) => {
          const rotatedPos = basePos.clone().add(offset);
          rotatedPos.applyAxisAngle(new THREE.Vector3(1, 0, 0), pointsMesh.rotation.x);
          rotatedPos.applyAxisAngle(new THREE.Vector3(0, 1, 0), pointsMesh.rotation.y);

          const isFacing = rotatedPos.z > -0.1;
          const visibility = Math.max(0, Math.pow((rotatedPos.z + 0.1) / 1.1, 1.5));

          node.position.copy(rotatedPos);
          glow.position.copy(rotatedPos);

          if (isFacing) {
            node.material.opacity = visibility * pulse * 0.8;
            node.scale.setScalar(0.8 + pulse * 0.4);
            glow.material.opacity = visibility * pulse * 0.4;
            glow.scale.setScalar(0.8 + pulse * 0.5);
          } else {
            node.material.opacity = 0;
            glow.material.opacity = 0;
          }
        });
      });

      // Drift particles
      const driftPos = driftGeometry.attributes.position.array;
      for (let i = 0; i < driftCount; i++) {
        driftPos[i * 3] += driftVelocities[i].x;
        driftPos[i * 3 + 1] += driftVelocities[i].y;
        driftPos[i * 3 + 2] += driftVelocities[i].z;

        const dist = Math.sqrt(
          driftPos[i * 3] ** 2 +
          driftPos[i * 3 + 1] ** 2 +
          driftPos[i * 3 + 2] ** 2
        );

        if (dist > 0.9) {
          driftPos[i * 3] *= 0.5;
          driftPos[i * 3 + 1] *= 0.5;
          driftPos[i * 3 + 2] *= 0.5;
        }
      }
      driftGeometry.attributes.position.needsUpdate = true;




      // Update glow shader
      glowMaterial.uniforms.time.value = time;

      renderer.render(scene, camera);
    }

    // === VISIBILITY OBSERVER (pause/resume rAF when out of viewport) ===
    function startLoop() {
      if (rafId === null) {
        animate();
      }
    }

    function stopLoop() {
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
    }

    const globeSection = document.querySelector('.card-reach');
    if (globeSection) {
      const globeVisibilityObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            isGlobeVisible = true;
            startLoop();
          } else {
            isGlobeVisible = false;
            stopLoop();
          }
        });
      }, { threshold: 0.1 });

      globeVisibilityObserver.observe(globeSection);
    } else {
      // Fallback: start immediately if section not found
      startLoop();
    }

    // Resize handler
    function handleResize() {
      const width = container.clientWidth;
      const height = container.clientHeight;
      if (width === 0 || height === 0) return;

      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    }

    window.addEventListener('resize', handleResize);
    setTimeout(handleResize, 150);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initGlobe);
  } else {
    initGlobe();
  }
})();
