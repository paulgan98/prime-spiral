import React from "react";
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

  return (
    <div className="Div-2">
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
    </div>
  );
}
export default ControlPanel;
