// import React, { useEffect } from "react";
// import { gsap } from "gsap";
// import { Draggable, InertiaPlugin, Physics2DPlugin } from "gsap/all";

// gsap.registerPlugin(Draggable, InertiaPlugin, Physics2DPlugin);

// const ParticleExplosion = () => {
//   useEffect(() => {
//     // Create container for explosion
//     const container = document.createElement("div");
//     container.style.cssText =
//       "position:absolute; left:0; top:0; overflow:visible; z-index:9999; pointer-events:none;";
//     document.body.appendChild(container);

//     // Config
//     const emitterSize = 100;
//     const dotQuantity = 25;
//     const dotSizeMax = 20;
//     const dotSizeMin = 10;
//     const speed = 3;
//     const gravity = 3;

//     // Pre-build explosion timeline
//     const explosion = createExplosion(container);

//     function createExplosion(container) {
//       const tl = gsap.timeline({ paused: true });
//       for (let i = 0; i < dotQuantity; i++) {
//         const dot = document.createElement("div");
//         dot.className = "dot";
//         dot.style.background =
//           "linear-gradient(45deg, #ff4d4d, #ffcc00, #66ff66, #3399ff)";
//         dot.style.borderRadius = "50%";
//         dot.style.position = "absolute";

//         const size = gsap.utils.random(dotSizeMin, dotSizeMax, 1);
//         container.appendChild(dot);

//         const angle = Math.random() * Math.PI * 2;
//         const length = Math.random() * (emitterSize / 2 - size / 2);

//         gsap.set(dot, {
//           x: Math.cos(angle) * length,
//           y: Math.sin(angle) * length,
//           width: size,
//           height: size,
//           xPercent: -50,
//           yPercent: -50,
//           force3D: true,
//         });

//         tl.to(
//           dot,
//           {
//             physics2D: {
//               angle: (angle * 180) / Math.PI,
//               velocity: (100 + Math.random() * 250) * speed,
//               gravity: 500 * gravity,
//             },
//             duration: 1 + Math.random(),
//           },
//           0
//         ).to(
//           dot,
//           { opacity: 0, duration: 0.2, ease: "power2.inOut" },
//           0.7
//         );
//       }
//       return tl;
//     }

//     function explodeAt(x, y) {
//       gsap.set(container, { x, y });
//       explosion.play(0);
//     }

//     // Global click listener
//     const handleClick = (e) => {
//       explodeAt(e.clientX, e.clientY);
//     };

//     document.addEventListener("click", handleClick);

//     return () => {
//       document.removeEventListener("click", handleClick);
//       container.remove();
//     };
//   }, []);

//   return null; // nothing visible, only effect
// };

// export default ParticleExplosion;
