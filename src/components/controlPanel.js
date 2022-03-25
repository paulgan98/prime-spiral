import React, { useEffect } from "react";
import * as spiral from "../spiralMethods";
import { MAXLENGTH } from "../App";

// Controls component for modifying Canvas
function ControlPanel(props) {
  // update function to be called only when spiral length changes
  const updateSpiralImage = (n) => {
    props.setSpiralLength(n);
    props.setSpiralCorners(
      spiral.buildSpiral(n, props.spiralCorners, props.dataArr)
    );
    props.setPrimes(spiral.getPrimes(n, props.primes));
    props.setNPrimes(spiral.numPrimes(n, props.primes));
    props.setPrimesPos(
      spiral.makePrimesArr(n, props.spiralCorners, props.primes)
    );
  };

  const handleSpiralLengthInput = () => {
    var inp = document.getElementById("Spiral-length-input");
    let v = parseInt(inp.value) || 1;
    v = checkValidInput(v);
    updateSpiralImage(v);
  };

  const checkValidInput = (n) => {
    return Math.min(Math.max(1, n), MAXLENGTH);
  };

  const centerCanvas = () => props.setCenterCanvasBool(true);

  const toggleShowSpiral = () => {
    var elem = document.getElementById("Show-spiral-button");
    if (props.showSpiral) {
      elem.innerHTML = "Show Spiral";
      props.setShowSpiral(false);
    } else {
      elem.innerHTML = "Hide Spiral";
      props.setShowSpiral(true);
    }
  };

  const toggleCrazyMode = () => {
    const elem = document.getElementById("Crazy-mode-button");
    if (props.crazyMode) {
      elem.innerHTML = "Crazy Mode";
      props.setCrazyMode(false);
    } else {
      elem.innerHTML = "Normal Mode";
      props.setCrazyMode(true);
      props.setColors(props.generateRandomColors);
    }
  };

  return (
    <div className="Controls-div">
      <button
        className="Button-short"
        onClick={() => {
          updateSpiralImage(checkValidInput(props.spiralLength - 1));
        }}
      >
        ▼
      </button>
      <input
        className="Spiral-length-input"
        id="Spiral-length-input"
        type="quantity"
        value={props.spiralLength}
        defaultValue="1"
        onInput={handleSpiralLengthInput}
      ></input>
      <button
        className="Button-short"
        onClick={() => {
          updateSpiralImage(checkValidInput(props.spiralLength + 1));
        }}
      >
        ▲
      </button>
      <button
        className="Button-max"
        onClick={() => {
          updateSpiralImage(MAXLENGTH);
        }}
      >
        Max
      </button>
      <button className="Button-long" onClick={centerCanvas}>
        Center
      </button>
      <div className="Controls-div">
        <button
          className="Button-longer"
          id="Show-spiral-button"
          onClick={toggleShowSpiral}
        >
          Hide Spiral
        </button>
        <button
          id="Crazy-mode-button"
          className="Button-longer"
          onClick={toggleCrazyMode}
        >
          Crazy Mode
        </button>
      </div>
    </div>
  );
}
export default ControlPanel;
