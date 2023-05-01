import React from "react";

function ElevatorSendButton({ elevatorSendButton, handleElevatorSend }) {
  return (
    <button
      className="keypadItem"
      style={{ backgroundColor: elevatorSendButton.pressed && "red" }}
      onClick={() => handleElevatorSend(elevatorSendButton.floor)}
    >
      {elevatorSendButton.floor}
    </button>
  );
}

export default ElevatorSendButton;
