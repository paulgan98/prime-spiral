import React, { useRef, useEffect, useState } from "react";
import "../App.css";

var STEPSIZE = 15; // distance between current and next point
var STEPSCALE = 3; // scalar for STEPSIZE
var CIRCLESIZE = (STEPSIZE * STEPSCALE) / 5;

function Canvas(props) {
  // canvas variables
  const canvasRef = useRef(null);
  var canvas = null;
  var [Width, Height] = [props.windowDims.Width, props.windowDims.Height];
  const scale = window.devicePixelRatio || 1;

  // state hooks
  const [isMouseDown, setMouseDown] = useState(0);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [transformedMousePos, setTransformedMousePos] = useState([0, 0]);
  const [selectedNumber, setSelectedNumber] = useState("");
  const [scaleFactor, setScaleFactor] = useState(1); // how much to scale canvas by
  const [transform, setTransform] = useState([
    1,
    0,
    0,
    1,
    (props.windowDims.Width * scale) / 2,
    (props.windowDims.Height * scale) / 2,
  ]);

  // create HD canvas
  function createHiPPICanvas(w, h) {
    let cv = canvasRef.current;
    cv.width = w * scale;
    cv.height = h * scale;
    cv.style.width = w + "px";
    cv.style.height = h + "px";
    cv.getContext("2d").scale(scale, scale);
    return cv;
  }

  const centerCanvas = () => {
    const temp = [...transform];
    temp[4] = (props.windowDims.Width / 2) * scale;
    temp[5] = (props.windowDims.Height / 2) * scale;
    setTransform(temp);
    props.setCenterCanvasBool(false);
  };

  // updates relative and absolute mouse positions
  const updateMousePositions = (e) => {
    var rect = canvas.getBoundingClientRect();
    setMousePos({
      x: (e.clientX - rect.left) * scale,
      y: (e.clientY - rect.top) * scale,
    });
    setTransformedMousePos([
      (mousePos.x - transform[4]) / transform[0],
      (mousePos.y - transform[5]) / transform[3],
    ]);
  };

  const handleMouseDown = (e) => {
    setMouseDown(1);
  };

  const handleMouseUp = (e) => {
    setMouseDown(0);
  };

  // handles panning
  const handlePan = (e) => {
    e.preventDefault();
    // calculate how much mouse moved
    var rect = canvas.getBoundingClientRect();
    const xDiff = (e.clientX - rect.left) * scale - mousePos.x;
    const yDiff = (e.clientY - rect.top) * scale - mousePos.y;

    const temp = [...transform];
    temp[4] = temp[4] + xDiff;
    temp[5] = temp[5] + yDiff;

    setTransform(temp);
  };

  // sets mouse position
  const handleMouseMove = (e) => {
    updateMousePositions(e);
    if (isMouseDown) {
      handlePan(e);
    }
  };

  const handleZoom = (e) => {
    e.preventDefault();
    const zoomSpeed = 0.002;
    var s = scaleFactor + e.deltaY * -zoomSpeed;
    s = Math.min(Math.max(0.05, s), 7);
    if (scaleFactor !== s) {
      const temp = transform;
      temp[0] = s;
      temp[3] = s;
      temp[4] = mousePos.x - (mousePos.x - transform[4]) * (s / scaleFactor);
      temp[5] = mousePos.y - (mousePos.y - transform[5]) * (s / scaleFactor);
      setScaleFactor(s);
      setTransform(temp);
    }
  };

  const handleMouseLeave = (e) => {
    var rect = canvas.getBoundingClientRect();
    if (
      e.clientX <= rect.left ||
      e.clientY <= rect.top ||
      e.clientX >= Width ||
      e.clientY >= Height
    ) {
      setMouseDown(0);
    }
  };

  // draw all circles based on arr
  const drawPrimes = (n, arr, ctx) => {
    var selected = false;
    for (let i = 0; i < n; i++) {
      let coord = [...arr[i]];
      for (let j = 0; j < 2; j++) {
        coord[j] *= STEPSIZE * STEPSCALE;
      }

      // mouse is in circle
      if (isInCircle(transformedMousePos, coord, CIRCLESIZE + 2) && !selected) {
        drawCircle(coord[0], coord[1], CIRCLESIZE * 1.5, "red", ctx);
        selected = true;
        setSelectedNumber(coord[2].toString());
      } else {
        let color = props.crazyMode ? props.colors[i] : "black";
        drawCircle(coord[0], coord[1], CIRCLESIZE, color, ctx);
      }
    }
    if (!selected) {
      setSelectedNumber("");
    }
  };

  // show selected number
  const showSelectedNumber = (ctx) => {
    ctx.font = `${(20 / transform[0]) * scale}px Arial`;
    ctx.fillStyle = "#03C04A";
    ctx.fillText(
      selectedNumber,
      transformedMousePos[0] + 10,
      transformedMousePos[1] - 10
    );
  };

  // draw on canvas
  const draw = (ctx) => {
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.setTransform(...transform);

    if (props.showSpiral) {
      drawSpiral(props.spiralLength, props.spiralCorners, ctx); // draw spiral lines
    }
    drawPrimes(props.nPrimes, props.primesPos, ctx); // draw circles
    showSelectedNumber(ctx);
  };

  useEffect(() => {
    canvas = createHiPPICanvas(props.windowDims.Width, props.windowDims.Height);
    const context = canvas.getContext("2d");
    draw(context); // draw on canvas

    if (props.centerCanvasBool === true) {
      centerCanvas();
    }

    canvas.addEventListener("mousedown", handleMouseDown);
    canvas.addEventListener("touchstart", handleMouseDown);
    canvas.addEventListener("mouseup", handleMouseUp);
    canvas.addEventListener("touchend", handleMouseUp);
    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("touchmove", handleMouseMove);
    canvas.addEventListener("wheel", handleZoom);
    canvas.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      canvas.removeEventListener("mousedown", handleMouseDown);
      canvas.removeEventListener("touchstart", handleMouseDown);
      canvas.removeEventListener("mouseup", handleMouseUp);
      canvas.removeEventListener("touchend", handleMouseUp);
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("touchmove", handleMouseMove);
      canvas.removeEventListener("wheel", handleZoom);
      canvas.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [
    isMouseDown,
    props.spiralLength,
    props.windowDims,
    props.centerCanvasBool,
    props.showSpiral,
    props.crazyMode,
    scaleFactor,
    transform,
    mousePos,
    selectedNumber,
  ]);
  return (
    <div>
      <canvas ref={canvasRef} className="Canvas" />
      {/* <div>
        {toPrint[0]}/{toPrint[1]}/{toPrint[2]}/{toPrint[3]}
      </div>
      <div>
        {transformedMousePos[0]}/{transformedMousePos[1]}
      </div> */}
    </div>
  );
}

export default Canvas;

// draw function declarations

// draw circle at (x, y)
function drawCircle(x, y, size, color, ctx) {
  ctx.beginPath();
  ctx.arc(x, y, size, 0, 2 * Math.PI);
  ctx.fillStyle = color;
  ctx.fill();
}

// draw line between point 1 and point 2
function drawLine(p1, p2, ctx) {
  ctx.strokeStyle = "#D0D0D0"; // grey
  ctx.lineWidth = Math.max(1, (STEPSIZE * STEPSCALE) / 12);
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(p1[0], p1[1]);
  ctx.lineTo(p2[0], p2[1]);
  ctx.stroke();
}

// draw spiral lines from array of corner coords [x, y]
function drawSpiral(n, arr, ctx) {
  var curr = arr[0];
  var next = null;
  for (let i = 1; i < arr.length; i++) {
    next = arr[i];
    let p1 = [...curr];
    let p2 = [...next];
    for (let j = 0; j < 2; j++) {
      p1[j] *= STEPSIZE * STEPSCALE;
      p2[j] *= STEPSIZE * STEPSCALE;
    }
    // if next corner point is longer than what we need
    if (next[2] > n) {
      let s = (n - curr[2]) / (next[2] - curr[2]);
      let diffVec = [(p2[0] - p1[0]) * s, (p2[1] - p1[1]) * s];
      drawLine(p1, [p1[0] + diffVec[0], p1[1] + diffVec[1]], ctx);
      break;
    } else {
      drawLine(p1, p2, ctx);
      curr = next;
    }
  }
}

function isInCircle(p, circle, r) {
  // (x-h)^2 + (y-k)^2 ≤ r^2
  if (
    Math.pow(p[0] - circle[0], 2) + Math.pow(p[1] - circle[1], 2) <=
    Math.pow(r, 2)
  ) {
    return true;
  } else {
    return false;
  }
}
