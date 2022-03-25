import React, { useRef, useEffect, useState } from "react";
import "../App.css";

var STEPSIZE = 30; // distance between current and next point
var STEPSCALE = 0.4; // scalar for STEPSIZE

function Canvas(props) {
  // canvas variables
  const canvasRef = useRef(null);
  var canvas = null;
  var [Width, Height] = [props.windowDims.Width, props.windowDims.Height];
  const scale = 0.5 * window.devicePixelRatio || 1;

  // state hooks
  const [isMouseDown, setMouseDown] = useState(0);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [transform, setTransform] = useState([1, 0, 0, 1, 0, 0]);

  const modifyCanvas = (_canvas) => {
    // Set display size (css pixels).
    _canvas.style.width = Width * scale + "px";
    _canvas.style.height = Height * scale + "px";

    // Set actual size in memory (scaled to account for extra pixel density).
    _canvas.width = Width * scale;
    _canvas.height = Height * scale;
    return _canvas;
  };

  const centerCanvas = () => {
    const temp = transform;
    temp[4] = props.windowDims.Width / 2;
    temp[5] = props.windowDims.Height / 2;
    setTransform(temp);
  };

  const handleMouseDown = (e) => {
    setMouseDown(1);
  };

  const handleMouseUp = (e) => {
    setMouseDown(0);
  };

  const handlePan = (e) => {
    e.preventDefault();
    const rect = canvas.getBoundingClientRect;
    let xDiff = e.clientX - rect.left - mousePos.x;
    let yDiff = e.clientY - rect.top - mousePos.y;

    const temp = transform;
    temp[4] = 
    temp[5] = 
    // setMousePos({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e) => {
    if (!isMouseDown) {
      handlePan(e);
    }
    const rect = canvas.getBoundingClientRect();
    setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const handleZoom = (e) => {
    e.preventDefault();
    STEPSCALE += e.deltaY * -0.001;

    // Restrict scale
    STEPSCALE = Math.min(Math.max(0.25, STEPSCALE), 7);
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

  useEffect(() => {
    canvas = canvasRef.current;
    canvas = modifyCanvas(canvas);
    const ctx = canvas.getContext("2d");

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawSpiral(props.spiralLength, props.spiralCorners, ctx); // draw spiral lines
    drawPrimes(props.nPrimes, props.primesPos, ctx); // draw circles

    canvas.addEventListener("mousedown", handleMouseDown);
    canvas.addEventListener("mouseup", handleMouseUp);
    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("wheel", handleZoom);
    canvas.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      canvas.removeEventListener("mousedown", handleMouseDown);
      canvas.removeEventListener("mouseup", handleMouseUp);
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("wheel", handleZoom);
      canvas.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [mousePos, isMouseDown, props.spiralLength, props.windowDims]);
  return (
    <div>
      <canvas ref={canvasRef} className="Canvas" />
      <div className="Div-1">
        <button onClick={centerCanvas} className="Button-long">
          Center
        </button>
      </div>
    </div>
  );
}

export default Canvas;

// draw function declarations

// draw circle at (x, y)
function drawCircle(x, y, ctx) {
  ctx.beginPath();
  ctx.arc(x, y, Math.floor((STEPSIZE * STEPSCALE) / 5), 0, 2 * Math.PI);
  ctx.fill();
}

// draw line between point 1 and point 2
function drawLine(p1, p2, ctx) {
  ctx.strokeStyle = "#D0D0D0"; // grey
  ctx.lineWidth = Math.max(3, Math.floor((STEPSIZE * STEPSCALE) / 16));
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

// draw all circles based on hash table of {[x, y] : number}
function drawPrimes(n, arr, ctx) {
  for (let i = 0; i < n; i++) {
    let coord = [...arr[i]];
    for (let j = 0; j < 2; j++) {
      coord[j] *= STEPSIZE * STEPSCALE;
    }
    drawCircle(coord[0], coord[1], ctx);
  }
}
