import DrawBoard from './DrawBoard'
import { useState, useMemo } from 'react'

import { Button } from 'react-bootstrap'

import Gameboard from '../classes/gameboard'

import createDefaultShips from '../utils/createDefaultShips'

//bring this as a prop perhaps?
const BOARDSIZE = 10

const HandlePlayPhase = ({ playerBoardObject, playerName, setGamePhase }) => {
    const [message, setMessage] = useState(`Your turn, ${playerName}...`)
    const [hitMessage, setHitMessage] = useState('')
    const [isComputerTurn, setIsComputerTurn] = useState(false)
    const [isGameOver, setIsGameOver] = useState(false)

    //The computerboardobject is now set here inside a useMemo hook, so that
    //its only ever done once per game
    const computerBoardObject = useMemo(() => {
        const computerBoardObject = new Gameboard(BOARDSIZE)
        const computerShips = createDefaultShips()
        computerBoardObject.setShips(computerShips)
        computerBoardObject.placeShipsRandomly(computerShips)
        return computerBoardObject
    }, [])

    const checkIfGameOver = () => {
        if (playerBoardObject.checkIfAllShipsSunk() || computerBoardObject.checkIfAllShipsSunk()) {
            setIsGameOver(true)
            setMessage('The game is now over')
        }
    }

    const handleNewGame = () => {
        setGamePhase('placePhase')
    }

    const handleComputerBoardClick = (rowIndex, cellIndex) => {
        if (isGameOver) return
        if (isComputerTurn) return

        const hitInfo = computerBoardObject.validateHit(rowIndex, cellIndex)
        //console.log(hitInfo)
        setHitMessage(hitInfo.message)
        setTimeout(() => {
            setHitMessage('')
        }, 1000)
        if (!hitInfo.wasValid) return


        setIsComputerTurn(true)
        setMessage('Calculating response...')
        setTimeout(() => {
            playerBoardObject.calculateRandomResponse()
            setMessage(`Your turn, ${playerName}...`)
            setIsComputerTurn(false)
            checkIfGameOver()
        }, (Math.random() + 1) * 100) //put this to 1000 when ready
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
            </div>
        </div>
    )
}

export default HandlePlayPhase