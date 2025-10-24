import DrawBoard from './DrawBoard'
import { useState, useMemo } from 'react'
import { Button } from 'react-bootstrap'

import Gameboard from '../classes/gameboard'
import createDefaultShips from '../utils/createDefaultShips'

const HandlePlayPhase = ({ playerBoardObject, playerName, setGamePhase, boardSize }) => {
    const [computerIntelligence, setComputerIntelligence] = useState('dumb')
    const [message, setMessage] = useState(`Your turn, ${playerName}...`)
    const [hitMessage, setHitMessage] = useState('')
    const [isComputerTurn, setIsComputerTurn] = useState(false)
    const [isGameOver, setIsGameOver] = useState(false)

    const computerBoardObject = useMemo(() => {
        const computerBoardObject = new Gameboard(boardSize)
        const computerShips = createDefaultShips()
        computerBoardObject.setShips(computerShips)
        computerBoardObject.placeShipsRandomly(computerShips)
        return computerBoardObject
    }, [boardSize])

    const checkIfGameOver = () => {
        if (playerBoardObject.checkIfAllShipsSunk() || computerBoardObject.checkIfAllShipsSunk()) {
            setIsGameOver(true)
            setMessage('The game is now over')
        }
    }

    const handleNewGame = () => {
        setGamePhase('placePhase')
    }

    const computerMove = () => {
        setMessage('Calculating response...')
        setTimeout(() => {
            if (computerIntelligence === 'dumb') playerBoardObject.calculateRandomResponse()
            else playerBoardObject.calculateSmartResponse()

            setMessage(`Your turn, ${playerName}...`)
            setIsComputerTurn(false)
            checkIfGameOver()
        }, (Math.random() + 1) * 100) //put this to 1000 when ready   
    }

    const handleComputerBoardClick = (rowIndex, cellIndex) => {
        if (isGameOver || isComputerTurn) return

        const hitInfo = computerBoardObject.validateHit(rowIndex, cellIndex)
        setHitMessage(hitInfo.message)
        setTimeout(() => setHitMessage(''), 1000)
        if (!hitInfo.wasValid) return
        setIsComputerTurn(true)
        computerMove()
    }

    const toggleDifficulty = () => {
        setComputerIntelligence(computerIntelligence === 'dumb' ? 'smart' : 'dumb')
    }

    return (
        <div className='d-flex flex-column justify-content-center'>
            <div style={{minHeight: '5rem'}} className='d-flex flex-column align-items-center text-white mt-4'>
                <h4>{message}</h4>
            </div>
            <div className='d-flex justify-content-center'></div>
            <div className='d-flex justify-content-center gap-5'>
                <DrawBoard boardObject={playerBoardObject} isComputerBoard={false}/>
                <DrawBoard boardObject={computerBoardObject} isComputerBoard={true} handleComputerBoardClick={handleComputerBoardClick}/>
            </div>
            <div style={{minHeight: '5rem'}} className='d-flex flex-column align-items-center text-white mt-4'>
                <h4>{hitMessage}</h4> 
                <Button style={{display: isGameOver ? 'block' : 'none'}} onClick={handleNewGame}>Start new game?</Button>
                <h4>Current computer level: {computerIntelligence}</h4> 
                <Button onClick={toggleDifficulty}>Switch difficulty</Button>
            </div>
        </div>
    )
}

export default HandlePlayPhase