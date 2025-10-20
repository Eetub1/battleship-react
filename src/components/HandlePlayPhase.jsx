import DrawBoard from './DrawBoard'
import { useState } from 'react'

const HandlePlayPhase = ({ playerBoardObject, computerObject, playerName }) => {
    const [message, setMessage] = useState('')
    const [hitMessage, setHitMessage] = useState('')
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
            setHitMessage('')
        }, 750)
        if (!hitInfo.wasValid) return


        setIsComputerTurn(true)
        setMessage('Calculating response...')
        setTimeout(() => {
            playerBoardObject.calculateRandomResponse()
            setMessage(`Your turn, ${playerName}...`)
            setIsComputerTurn(false)
            checkIfGameOver()
            //handle starting a new game here
        }, (Math.random() + 1) * 1000) //put this to 1000 when ready
    }

    return (
        <div className='d-flex flex-column justify-content-center'>
            <div style={{minHeight: '5rem'}} className='d-flex flex-column align-items-center text-white mt-4'>
                <h4>{message}</h4>
            </div>
            <div className='d-flex justify-content-center'></div>
            <div className='d-flex justify-content-center gap-5'>
                <DrawBoard boardObject={playerBoardObject} isComputerBoard={false}/>
                <DrawBoard boardObject={computerObject} isComputerBoard={true} handleComputerBoardClick={handleComputerBoardClick}/>
            </div>
            <div style={{minHeight: '5rem'}} className='d-flex flex-column align-items-center text-white mt-4'>
                <h4>{hitMessage}</h4> 
            </div>
        </div>
    )
}

export default HandlePlayPhase