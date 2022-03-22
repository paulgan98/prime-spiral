import React, { useEffect, useState } from "react";
import Canvas from "./components/canvas.js";
import ControlPanel from "./components/controlPanel";
import * as spiral from "./spiralMethods";
import "./App.css";

//              App
//            /     \
//  ControlPanel     Canvas

var SPIRALLENGTH = 10000;
export const MAXLENGTH = 600000;

function App() {
  // [adPtr, steps, counter, i]
  var dataArr = [0, 1, 2, 2]; // contains data used in building spiral array

  // State hooks; will be passed as props to ControlPanel and Canvas
  const [spiralLength, setSpiralLength] = useState(SPIRALLENGTH);
  const [primes, setPrimes] = useState(spiral.getPrimes(spiralLength, [2]));
  const [spiralCorners, setSpiralCorners] = useState(
    spiral.buildSpiral(spiralLength, [[0, 0, 1]], dataArr)
  );
  const [primesPos, setPrimesPos] = useState(
    spiral.makePrimesArr(spiralLength, spiralCorners, primes)
  );
  const [nPrimes, setNPrimes] = useState(
    spiral.numPrimes(spiralLength, primes)
  );

  // canvas dimensions
  const [windowDims, setWindowDims] = useState({
    Width: window.innerWidth - 60,
    Height: window.innerHeight - 160,
  });

  const handleResize = () => {
    setWindowDims({
      Width: window.innerWidth - 60,
      Height: window.innerHeight - 160,
    });
  };

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => {
      window.addEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="Div">
      <h1 className="Title">The Prime Spiral</h1>
      <p className="By-text"> A React app by Paul Gan</p>
      <Canvas
        className="Canvas"
        spiralLength={spiralLength}
        primesPos={primesPos}
        nPrimes={nPrimes}
        spiralCorners={spiralCorners}
        windowDims={windowDims}
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
      />
    </div>
  );
}

export default App;
