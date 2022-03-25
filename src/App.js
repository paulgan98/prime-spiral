import React, { useEffect, useState } from "react";
import Canvas from "./components/canvas.js";
import ControlPanel from "./components/controlPanel";
import * as spiral from "./spiralMethods";
import "./App.css";

//              App
//            /     \
//  ControlPanel     Canvas

var SPIRALLENGTH = 2000;
export const MAXLENGTH = 1000000;

function App() {
  // State hooks; will be passed as props to ControlPanel and Canvas

  // [adPtr, steps, counter, i]
  const [dataArr, _] = useState([0, 1, 2, 2]);
  const [spiralLength, setSpiralLength] = useState(SPIRALLENGTH);
  const [primes, setPrimes] = useState(spiral.getPrimes(SPIRALLENGTH, [2]));
  const [spiralCorners, setSpiralCorners] = useState(
    spiral.buildSpiral(SPIRALLENGTH, [[0, 0, 1]], dataArr)
  );
  const [primesPos, setPrimesPos] = useState(
    spiral.makePrimesArr(SPIRALLENGTH, spiralCorners, primes)
  );
  const [nPrimes, setNPrimes] = useState(
    spiral.numPrimes(SPIRALLENGTH, primes)
  );
  // canvas dimensions
  const [windowDims, setWindowDims] = useState({
    Width: window.innerWidth - 60,
    Height: window.innerHeight - 160,
  });
  const [centerCanvasBool, setCenterCanvasBool] = useState(false);
  const [showSpiral, setShowSpiral] = useState(true);
  const [crazyMode, setCrazyMode] = useState(false);

  const _colors = generateRandomColors;
  const [colors, setColors] = useState(_colors);

  // Methods
  const handleResize = () => {
    setWindowDims({
      Width: window.innerWidth - 60,
      Height: window.innerHeight - 160,
    });
  };

  const generateRandomColors = () => {
    var colors = [];
    for (let i = 0; i < spiralLength; i++) {
      const randomColor = "#".concat(
        Math.floor(Math.random() * 16777215).toString(16)
      );
      colors.push(randomColor);
    }
    return colors;
  };

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="Div1">
      <h1 className="Title">The Prime Spiral</h1>
      <p className="By-text"> A React app by Paul Gan</p>
      <Canvas
        className="Canvas"
        spiralLength={spiralLength}
        primesPos={primesPos}
        nPrimes={nPrimes}
        spiralCorners={spiralCorners}
        windowDims={windowDims}
        centerCanvasBool={centerCanvasBool}
        setCenterCanvasBool={setCenterCanvasBool}
        showSpiral={showSpiral}
        crazyMode={crazyMode}
        colors={colors}
      />
      <ControlPanel
        spiralLength={spiralLength}
        primesPos={primesPos}
        nPrimes={nPrimes}
        spiralCorners={spiralCorners}
        primes={primes}
        dataArr={dataArr}
        setSpiralLength={setSpiralLength}
        setPrimesPos={setPrimesPos}
        setNPrimes={setNPrimes}
        setSpiralCorners={setSpiralCorners}
        setPrimes={setPrimes}
        windowDims={windowDims}
        setCenterCanvasBool={setCenterCanvasBool}
        showSpiral={showSpiral}
        setShowSpiral={setShowSpiral}
        crazyMode={crazyMode}
        setCrazyMode={setCrazyMode}
        setColors={setColors}
        generateRandomColors={generateRandomColors}
      />
    </div>
  );
}

export default App;
