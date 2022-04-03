import Proton from "proton-engine";
import { useEffect } from "react";
import debounce from "lodash/debounce";

export default function renderParticles(canvasRef) {
  useEffect(() => {
    let destroy = () => {};

    function start() {
      let animationRequest;

      const canvas = canvasRef.current;

      const width = window.innerWidth;
      const height = window.innerHeight;

      const particles = createImages();
      const proton = new Proton();
      const emitter = createEmitter(width, height, particles);

      proton.addEmitter(emitter);
      proton.addRenderer(new Proton.CanvasRenderer(canvas));

      emitter.emit("once");

      canvas.width = width;
      canvas.height = height;

      function render() {
        proton.update();

        animationRequest = requestAnimationFrame(render);
      }

      render();

      destroy = function () {
        cancelAnimationFrame(animationRequest);
        proton.destroy();
      };
    }

    const onResize = debounce(function () {
      destroy();
      start();
    }, 300);

    window.addEventListener("resize", onResize);

    start();

    return () => {
      destroy();
      window.removeEventListener("resize", onResize);
    };
  }, []);
}

function createEmitter(width, height, particle) {
  const emitter = new Proton.Emitter();
  const rect = new Proton.RectZone(0, 0, width, height);

  emitter.rate = new Proton.Rate(Math.round((width * height) / 8000));

  emitter.addInitialize(new Proton.Position(rect));
  emitter.addInitialize(new Proton.Body(particle));

  emitter.addBehaviour(new Proton.Scale(Proton.getSpan(0.1, 1)));
  emitter.addBehaviour(new Proton.RandomDrift(5, 5, 0));
  emitter.addBehaviour(new Proton.CrossZone(rect, "cross"));

  emitter.addBehaviour({
    initialize: function (particle) {
      particle.maxAlpha = Math.random() * 0.3;
      particle.alphaIncrement = Math.random() * 0.01 * Math.PI;
      particle.alphaAngle = 0;
    },

    applyBehaviour: function (particle) {
      particle.alphaAngle += particle.alphaIncrement;

      if (particle.alphaAngle > 2 * Math.PI) {
        particle.alphaAngle -= 2 * Math.PI;
      }

      particle.alpha =
        ((Math.sin(particle.alphaAngle) + 1) / 2) * particle.maxAlpha;
    },
  });

  return emitter;
}

function hexToRgbA(hex, alpha = "1") {
  let c = hex.substring(1).split("");
  if (c.length == 3) {
    c = [c[0], c[0], c[1], c[1], c[2], c[2]];
  }
  c = "0x" + c.join("");
  return (
    "rgba(" +
    [(c >> 16) & 255, (c >> 8) & 255, c & 255].join(",") +
    "," +
    alpha +
    ")"
  );
}

function createImages() {
  return [
    "#ff00cf",
    "#4400ff",
    "#00c8ff",
    "#00ff36",
    "#fff900",
    "#ff3400",
    "#ffffff",
  ].map((hex) => {
    const offScreenCanvas = document.createElement("canvas");
    const offScreenContext = offScreenCanvas.getContext("2d");

    offScreenCanvas.width = 30;
    offScreenCanvas.height = 30;

    const x = 15,
      y = 15,
      innerRadius = 5,
      outerRadius = 15,
      radius = 15;

    const gradient = offScreenContext.createRadialGradient(
      x,
      y,
      innerRadius,
      x,
      y,
      outerRadius
    );

    gradient.addColorStop(0, hexToRgbA(hex));
    gradient.addColorStop(1, hexToRgbA(hex, "0"));

    offScreenContext.arc(x, y, radius, 0, 2 * Math.PI);

    offScreenContext.fillStyle = gradient;
    offScreenContext.fill();

    return offScreenCanvas.toDataURL("image/png");
  });
}
