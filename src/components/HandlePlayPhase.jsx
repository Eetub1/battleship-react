import DrawBoard from './DrawBoard'
import { useState } from 'react'

const HandlePlayPhase = ({ playerBoardObject, computerObject }) => {
    const [message, setMessage] = useState('')
    const [hitMessage, setHitMessage] = useState('m')
    const [isComputerTurn, setIsComputerTurn] = useState(false)
    const [isGameOver, setIsGameOver] = useState(false)

    const checkIfGameOver = () => {
        if (playerBoardObject.checkIfAllShipsSunk() || computerObject.checkIfAllShipsSunk()) {
            setIsGameOver(true)
            setMessage('The game is now over')
        }
    }

    const handleComputerBoardClick = (rowIndex, cellIndex) => {
        if (isGameOver) return
        if (isComputerTurn) return

        const hitInfo = computerObject.validateHit(rowIndex, cellIndex)
        setHitMessage(hitInfo.message)
        setTimeout(() => {
            setHitMessage('m')
        }, 750)
        if (!hitInfo.wasValid) return

        setIsComputerTurn(true)
        setMessage('Calculating response...')
        setTimeout(() => {
            playerBoardObject.calculateRandomResponse()
            setMessage('Your turn, human...')
            setIsComputerTurn(false)
            checkIfGameOver()
            //handle starting a new game here
        }, (Math.random() + 1) * 100) //put this to 1000 when ready
    }

    return (
        <div className='d-flex flex-column justify-content-center gap-5'>
            <div className='d-flex justify-content-center'>{hitMessage}</div>
            <div className='d-flex justify-content-center'>{message}</div>
            <div className='d-flex justify-content-center gap-5'>
                <DrawBoard boardObject={playerBoardObject} isComputerBoard={false}/>
                <DrawBoard boardObject={computerObject} isComputerBoard={true} handleComputerBoardClick={handleComputerBoardClick}/>
            </div>
        </div>
    )
}

export default HandlePlayPhase