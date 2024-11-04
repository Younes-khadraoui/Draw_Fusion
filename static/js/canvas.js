import { initializeWebSocket, sendDrawingData } from "./websocket.js";

window.addEventListener("load", () => {
  const currentTheme = new URLSearchParams(window.location.search).get("theme");

  if (currentTheme === "dark") {
    document.documentElement.classList.add("dark");
    document.getElementById("canvas").style.filter = "invert(1)";
    document.querySelector("svg").style.filter = "invert(1)";
  } else {
    document.documentElement.classList.remove("dark");
    document.getElementById("canvas").style.filter = "invert(0)";
    document.querySelector("svg").style.filter = "invert(0)";
  }

  initializeWebSocket();

  resize();
  document.addEventListener("mousedown", startPainting);
  document.addEventListener("mouseup", stopPainting);
  document.addEventListener("mousemove", sketch);
  window.addEventListener("resize", resize);

  document.addEventListener("receiveDrawingData", (e) => {
    const { prevX, prevY, x, y } = e.detail;
    drawLine(prevX, prevY, x, y);
  });
});

const canvas = document.querySelector("#canvas");
const ctx = canvas.getContext("2d");

function resize() {
  canvas.width = document.documentElement.clientWidth;
  canvas.height = document.documentElement.clientHeight;
}

let coord = { x: 0, y: 0 };
let paint = false;

function getPosition(event) {
  coord.x = event.clientX - canvas.offsetLeft;
  coord.y = event.clientY - canvas.offsetTop;
}

function startPainting(event) {
  paint = true;
  getPosition(event);
}

function stopPainting() {
  paint = false;
}

function sketch(event) {
  if (!paint) return;
  
  const prevX = coord.x;
  const prevY = coord.y;

  ctx.beginPath();
  ctx.lineWidth = 5;
  ctx.lineCap = "round";
  ctx.strokeStyle = "black";
  ctx.moveTo(prevX, prevY);

  getPosition(event);

  const x = coord.x;
  const y = coord.y;
  ctx.lineTo(x, y);
  ctx.stroke();

  sendDrawingData(prevX, prevY, x, y);
}

function drawLine(prevX, prevY, x, y) {
  ctx.beginPath();
  ctx.lineWidth = 5;
  ctx.lineCap = "round";
  ctx.strokeStyle = "black";
  ctx.moveTo(prevX, prevY);
  ctx.lineTo(x, y);
  ctx.stroke();
}
