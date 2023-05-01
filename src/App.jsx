import Floor from './components/Floor'
import {useEffect, useRef, useState} from 'react'

function App() {
    const [elevatorCallButtons, setElevatorCallButtons] = useState([
        {floor: 4, up: null, down: false},
        {floor: 3, up: false, down: false},
        {floor: 2, up: false, down: false},
        {floor: 1, up: false, down: false},
        {floor: 0, up: false, down: null},
    ])

    const [elevatorSendButtons, setElevatorSendButtons] = useState([
        {floor: 4, pressed: false},
        {floor: 3, pressed: false},
        {floor: 2, pressed: false},
        {floor: 1, pressed: false},
        {floor: 0, pressed: false},
    ])
    const elevatorCallButtonsRef = useRef(elevatorCallButtons)
    const elevatorSendButtonsRef = useRef(elevatorSendButtons)
    const ElevatorStatus = {
        CLOSED: 'closed',
        OPENING: 'opening',
        OPEN: 'open',
        CLOSING: 'closing',
    }
    const Direction = {
        UP: 'up',
        DOWN: 'down',
        IDLE: 'idle',
    }
    const Delay = 0.75
    const [direction, setDirection] = useState(Direction.IDLE)
    const [elevatorStatus, setElevatorStatus] = useState(ElevatorStatus.OPEN)
    const [currentFloor, setCurrentFloor] = useState(4)
    const [queueUp, setQueueUp] = useState([])
    const [queueDown, setQueueDown] = useState([])
    const [isTimeoutActive, setIsTimeoutActive] = useState(false)
    const timeoutRef = useRef(isTimeoutActive)

    const handleElevatorCall = (floor, up) => {
        if (floor === currentFloor) return
        setElevatorCallButtons((prevState) =>
            prevState.map((button) => {
                if (button.floor === floor) {
                    if (up) {
                        button.up = true
                    } else button.down = true
                }
                return button
            })
        )
    }
    const handleElevatorSend = (floor) => {
        if (floor === currentFloor) return
        setElevatorSendButtons((prevState) =>
            prevState.map((button) => {
                if (button.floor === floor) {
                    button.pressed = true
                }
                return button
            })
        )
    }

    // set Queues
    useEffect(() => {
        let newQueueUp = []
        let newQueueDown = []
        elevatorCallButtons.forEach((button) => {
            if (button.floor < currentFloor && (button.up || button.down))
                newQueueDown.push(button.floor)
            if (button.floor > currentFloor && (button.up || button.down))
                newQueueUp.push(button.floor)
        })
        elevatorSendButtons.forEach((button) => {
            if (button.floor < currentFloor && button.pressed)
                newQueueDown.push(button.floor)
            if (button.floor > currentFloor && button.pressed)
                newQueueUp.push(button.floor)
        })
        newQueueUp.sort((a, b) => a - b)
        newQueueDown.sort((a, b) => b - a)
        setQueueUp(newQueueUp)
        setQueueDown(newQueueDown)

        // geen dubbelen?
    }, [currentFloor, elevatorSendButtons, elevatorCallButtons])

    useEffect(() => {
        function clearButtons() {
            elevatorCallButtonsRef.current.forEach((button) => {
                if (button.floor === currentFloor) {
                    switch (direction) {
                        case Direction.UP:
                            if (button.up !== null) button.up = false
                            if (queueUp.length === 0 && button.down!== null) button.down = false
                            break
                        case Direction.DOWN:
                            if (button.down !== null) button.down = false
                            if (queueDown.length === 0 && button.up!==null) button.up = false
                            break
                        case Direction.IDLE:
                            if (button.up !== null) button.up = false
                            if (button.down !== null) button.down = false
                            break
                        default:
                    }
                }
            })
            elevatorSendButtonsRef.current.forEach((button) => {
                if (button.floor === currentFloor) {
                    button.pressed = false
                }
            })
            setElevatorCallButtons((prevButtons) => {
                if (prevButtons !== elevatorCallButtonsRef.current) {
                    return elevatorCallButtonsRef.current
                }
                return prevButtons
            })
            setElevatorSendButtons((prevButtons) => {
                if (prevButtons !== elevatorSendButtonsRef.current) {
                    return elevatorSendButtonsRef.current
                }
                return prevButtons
            })
        }
        if (!timeoutRef.current) {
            let waiting = false
            const timer = setTimeout(() => {
                switch (elevatorStatus) {
                    case ElevatorStatus.CLOSED:
                        switch (direction) {
                            case Direction.UP:
                                if (
                                    elevatorCallButtonsRef.current.find(
                                        (button) => button.floor === currentFloor && button.up
                                    ) !== undefined ||
                                    elevatorSendButtonsRef.current.find(
                                        (button) => button.floor === currentFloor && button.pressed
                                    ) !== undefined ||
                                    queueUp[0] === currentFloor
                                ) {
                                    setElevatorStatus(ElevatorStatus.OPENING)
                                    break
                                }
                                if (queueUp.length !== 0) {
                                    setCurrentFloor((prev) => prev + 1)
                                    if (queueUp[0] === currentFloor) {
                                        setElevatorStatus(ElevatorStatus.OPENING)
                                    }
                                    break
                                }
                                if (queueUp.length === 0) {
                                    if (queueDown.length === 0) {
                                        setDirection(Direction.IDLE)
                                        setElevatorStatus(ElevatorStatus.OPENING)
                                    } else {
                                        setDirection(Direction.DOWN)
                                    }
                                    break
                                }
                                break
                            case Direction.DOWN:
                                if (
                                    elevatorCallButtonsRef.current.find(
                                        (button) => button.floor === currentFloor && button.down
                                    ) !== undefined ||
                                    elevatorSendButtonsRef.current.find(
                                        (button) => button.floor === currentFloor && button.pressed
                                    ) !== undefined ||
                                    queueDown[0] === currentFloor
                                ) {
                                    setElevatorStatus(ElevatorStatus.OPENING)
                                    break
                                }
                                if (queueDown.length !== 0) {
                                    setCurrentFloor((prev) => prev - 1)
                                    if (queueDown[0] === currentFloor) {
                                        setElevatorStatus(ElevatorStatus.OPENING)
                                    }
                                    break
                                }
                                if (queueDown.length === 0) {
                                    if (queueUp.length === 0) {
                                        setDirection(Direction.IDLE)
                                        setElevatorStatus(ElevatorStatus.OPENING)
                                    } else {
                                        setDirection(Direction.UP)
                                    }
                                    break
                                }
                                break
                            default:
                                console.log('blob')
                        }
                        break
                    case ElevatorStatus.OPENING:
                        setElevatorStatus(ElevatorStatus.OPEN)
                        clearButtons()
                        break
                    case ElevatorStatus.OPEN:
                        switch (direction) {
                            case Direction.UP:
                                if (queueUp.length !== 0 || queueDown.length !== 0) {
                                    setElevatorStatus(ElevatorStatus.CLOSING)
                                } else setDirection(Direction.IDLE)
                                break
                            case Direction.DOWN:
                                if (queueDown.length !== 0 || queueUp.length !== 0) {
                                    setElevatorStatus(ElevatorStatus.CLOSING)
                                } else setDirection(Direction.IDLE)
                                break
                            case Direction.IDLE:
                                if (queueDown.length !== 0 || queueUp.length !== 0) {
                                    setElevatorStatus(ElevatorStatus.CLOSING)
                                } else {
                                    waiting = true
                                }
                                break
                            default:
                        }
                        break
                    case ElevatorStatus.CLOSING:
                        if (direction === Direction.IDLE) {
                            if (queueUp.length > queueDown.length) {
                                setDirection(Direction.UP)
                            } else {
                                setDirection(Direction.DOWN)
                            }
                        }
                        setElevatorStatus(ElevatorStatus.CLOSED)
                        break
                    default:
                        console.log('default case')
                }
                if (!waiting) timeoutRef.current = true
                if (timeoutRef.current !== isTimeoutActive) {
                    setIsTimeoutActive(true)
                }
            }, Delay * 1000)
            return () => {
                clearTimeout(timer)
                timeoutRef.current = false
                setIsTimeoutActive(false)
            }
        }
    }, [
        Direction.DOWN,
        Direction.IDLE,
        Direction.UP,
        ElevatorStatus.CLOSED,
        ElevatorStatus.CLOSING,
        ElevatorStatus.OPEN,
        ElevatorStatus.OPENING,
        currentFloor,
        direction,
        elevatorStatus,
        elevatorCallButtonsRef,
        elevatorSendButtonsRef,
        isTimeoutActive,
        queueDown,
        queueUp,
    ])
    return (
        <>
            {elevatorCallButtons.map((elevatorCallButton) => {
                return (
                    <Floor
                        elevatorCallButton={elevatorCallButton}
                        currentFloor={currentFloor}
                        elevatorStatus={elevatorStatus}
                        elevatorSendButtons={elevatorSendButtons}
                        handleElevatorCall={handleElevatorCall}
                        handleElevatorSend={handleElevatorSend}
                        key={elevatorCallButton.floor}
                    />
                )
            })}
        </>
    )
}

export default App
