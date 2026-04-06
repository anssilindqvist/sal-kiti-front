import "regenerator-runtime/runtime";
import { config } from "@vue/test-utils";

config.mocks.$t = (key) => key;
config.mocks.$tc = (key) => key;

HTMLCanvasElement.prototype.getContext = () => ({
  canvas: { width: 0, height: 0 },
  clearRect: () => {},
  beginPath: () => {},
  moveTo: () => {},
  lineTo: () => {},
  stroke: () => {},
  fill: () => {},
  arc: () => {},
  fillRect: () => {},
  strokeRect: () => {},
  measureText: () => ({ width: 0 }),
  setTransform: () => {},
  drawImage: () => {},
  save: () => {},
  fillText: () => {},
  restore: () => {},
  scale: () => {},
  translate: () => {},
  createLinearGradient: () => ({ addColorStop: () => {} }),
  createRadialGradient: () => ({ addColorStop: () => {} }),
  createPattern: () => ({})
});
