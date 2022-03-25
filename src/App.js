import React, { useEffect, useState } from "react";
import Canvas from "./components/canvas.js";
import ControlPanel from "./components/controlPanel";
import * as spiral from "./spiralMethods";
import "./App.css";

//              App
//            /     \
//  ControlPanel     Canvas

var SPIRALLENGTH = 20000;
export const MAXLENGTH = 800000;

function App() {
  // [adPtr, steps, counter, i]
  const [dataArr, _] = useState([0, 1, 2, 2]);
  // var controlPanelData = { center: false };

  // State hooks; will be passed as props to ControlPanel and Canvas
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
  // const [controlPanelData, setControlPanelData] = useState({ center: false });
  const [showSpiral, setShowSpiral] = useState(true);

  const handleResize = () => {
    setWindowDims({
      Width: window.innerWidth - 60,
      Height: window.innerHeight - 160,
    });
  };

  // const getControlPanelData = (data) => {
  //   setControlPanelData(data);
  // };

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
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
        centerCanvasBool={centerCanvasBool}
        setCenterCanvasBool={setCenterCanvasBool}
        showSpiral={showSpiral}
        // controlPanelData={controlPanelData}
        // setControlPanelData={setControlPanelData}
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

        // controlPanelData={controlPanelData}
        // setControlPanelData={setControlPanelData}
        // getControlPanelData={getControlPanelData}
      />
    </div>
  );
}

export default App;
