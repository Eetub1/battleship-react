import DrawPlayerBoard from './DrawPlayerBoard'
import DrawComputerBoard from './DrawComputerBoard'
import Gameboard from '../classes/gameboard'
import { useState } from 'react'

const HandlePlayPhase = ({ playerBoardObject, computerObject, setGamePhase }) => {
    const [message, setMessage] = useState('')
    const [hitMessage, setHitMessage] = useState('m')
    const [isComputerTurn, setIsComputerTurn] = useState(false)

    const handleComputerBoardClick = (rowIndex, cellIndex) => {
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
        }, (Math.random() + 1) * 1000)
    }

    return (
        <div className='d-flex flex-column justify-content-center gap-5'>
            <div className='d-flex justify-content-center'>{hitMessage}</div>
            <div className='d-flex justify-content-center'>{message}</div>
            <div className='d-flex justify-content-center gap-5'>
                <DrawPlayerBoard playerBoardObject={playerBoardObject} />
                <DrawComputerBoard boardObject={computerObject} handleComputerBoardClick={handleComputerBoardClick}/>
            </div>
        </div>
    )
}

export default HandlePlayPhase