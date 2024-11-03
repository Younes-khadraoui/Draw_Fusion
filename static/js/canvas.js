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

  resize();
  document.addEventListener("mousedown", startPainting);
  document.addEventListener("mouseup", stopPainting);
  document.addEventListener("mousemove", sketch);
  window.addEventListener("resize", resize);
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
  ctx.beginPath();
  ctx.lineWidth = 5;
  ctx.lineCap = "round";
  ctx.strokeStyle = "black";
  ctx.moveTo(coord.x, coord.y);
  getPosition(event);
  ctx.lineTo(coord.x, coord.y);
  ctx.stroke();
}

function changeTheme() {
  const currentTheme = new URLSearchParams(window.location.search).get("theme");

  if (currentTheme === "dark") {
    history.pushState({}, "", window.location.pathname);
    document.documentElement.classList.remove("dark");
    document.getElementById("canvas").style.filter = "invert(0)";
    document.querySelector("svg").style.filter = "invert(0)";
  } else {
    history.pushState({}, "", `${window.location.pathname}?theme=dark`);
    document.documentElement.classList.add("dark");
    document.getElementById("canvas").style.filter = "invert(1)";
    document.querySelector("svg").style.filter = "invert(1)";
  }
}
