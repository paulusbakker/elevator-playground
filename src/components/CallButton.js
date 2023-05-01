import React from "react";

function CallButton({ upButton, elevatorCallButton, handleElevatorCall }) {
  return (
    <button
      style={{
        backgroundColor:
          (upButton && elevatorCallButton.up) ||
          !upButton & elevatorCallButton.down
            ? "red"
            : "grey",
        visibility:
          (upButton && elevatorCallButton.up === null) ||
          (!upButton && elevatorCallButton.down === null)
            ? "hidden"
            : "visible",
      }}
      className="callButton"
      onClick={() => handleElevatorCall(elevatorCallButton.floor, upButton)}
    >
      {upButton ? "up" : "down"}
    </button>
  );
}

export default CallButton;
