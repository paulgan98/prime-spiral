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

  // const toggleSpiral = () => {};

  const toggleShowSpiralButton = () => {
    var elem = document.getElementById("Show-spiral-button");
    if (props.showSpiral) {
      elem.innerHTML = "Show Spiral";
      props.setShowSpiral(false);
    } else {
      elem.innerHTML = "Hide Spiral";
      props.setShowSpiral(true);
    }
  };

  // const sendToParent = (field, val) => {
  //   const data = props.controlPanelData;
  //   switch (field) {
  //     case "center":
  //       data.center = val;
  //       break;
  //   }
  //   // props.setControlPanelData(data);
  //   props.getControlPanelData(data);
  // };

  // useEffect(() => {}, [props.controlPanelData]);

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
        className="Button-long"
        onClick={centerCanvas}
        // onClick={() => {
        //   sendToParent("center", true);
        // }}
      >
        Center
      </button>
      <button
        className="Button-long"
        id="Show-spiral-button"
        onClick={toggleShowSpiralButton}
      >
        Hide Spiral
      </button>
    </div>
  );
}
export default ControlPanel;
