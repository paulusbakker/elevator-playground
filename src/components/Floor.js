import React from "react";
import CallButton from "./CallButton";
import ElevatorSendButton from "./ElevatorSendButton";

function Floor({
  elevatorCallButton,
  currentFloor,
  elevatorStatus,
  elevatorSendButtons,
  handleElevatorCall,
  handleElevatorSend,
}) {
  return (
    <div className="floor">
      <CallButton
        upButton={true}
        elevatorCallButton={elevatorCallButton}
        handleElevatorCall={handleElevatorCall}
      />
      <CallButton
        upButton={false}
        elevatorCallButton={elevatorCallButton}
        handleElevatorCall={handleElevatorCall}
      />
      <div
        className={`elevator ${
          currentFloor === elevatorCallButton.floor ? elevatorStatus : ""
        }`}
      >
        {currentFloor === elevatorCallButton.floor &&
          elevatorSendButtons.map((elevatorSendButton) => (
            <ElevatorSendButton
              elevatorSendButton={elevatorSendButton}
              handleElevatorSend={handleElevatorSend}
              key={elevatorSendButton.floor}
            />
          ))}
      </div>
    </div>
  );
}

export default Floor;
