import { useState, useMemo } from 'react'
import { Button } from 'react-bootstrap'
import DrawShipPlacementBoard from './DrawShipPlacementBoard'

import Gameboard from '../classes/gameboard'
import createDefaultShips from '../utils/createDefaultShips'

const HandlePlacePhase = ({ playerBoardObject, setPlayerBoardObject, setGamePhase}) => {
    const ships = useMemo(() => {
        const ships = createDefaultShips()
        playerBoardObject.resetBoard()
        playerBoardObject.ships = ships
        return ships
    }, [playerBoardObject])
    
    const [currentShipIndex, setCurrentShipIndex] = useState(1)
    const [currentShip, setCurrentShip] = useState(ships[0])
    const [isHorizontal, setIsHorizontal] = useState(true)
    const [highlightedCells, setHighlightedCells] = useState([])
    const [isValidPlacement, setIsValidPlacement] = useState(null)
    const [confirmPlacementVisible, setConfirmPlacementVisible] = useState(false)
    //this variable tracks if random placement button has been pressed so you cant put ships manually
    const [isShipRandomPlacement, setIsShipRandomPlacement] = useState(false) 

    const shipAmount = ships.length
    const board = playerBoardObject.getBoard()
    const shipLength = currentShip.getShipLength()

    const handleClick = (rowIndex, cellIndex) => {
        if (isShipRandomPlacement) return
        if (isValidPlacement) playerBoardObject.placeShip(rowIndex, cellIndex, isHorizontal, currentShip)
        else return

        setCurrentShipIndex(currentShipIndex + 1)
        if (currentShipIndex >= shipAmount) setGamePhase('playPhase')
        else setCurrentShip(ships[currentShipIndex])
    }

    const handleMouseEnter = (rowIndex, cellIndex) => {
        if (isShipRandomPlacement) return
        setIsValidPlacement(playerBoardObject.validatePlacement(rowIndex, cellIndex, isHorizontal, shipLength))
        setHighlightedCells([])
        const cells = []
        if (isHorizontal) {
            for (let i = cellIndex; i < cellIndex + shipLength; i++) {
                cells.push([rowIndex, i])
            }
        } else {
            for (let i = rowIndex; i < rowIndex + shipLength; i++) {
                cells.push([i, cellIndex])
            }
        }
        setHighlightedCells(cells)
    }

    const handleRandomPlacement = () => {
        setIsShipRandomPlacement(true)
        playerBoardObject.placeShipsRandomly(ships)
        setConfirmPlacementVisible(true)
    }

    const placeShipsManually = () => {
        setIsShipRandomPlacement(false)
        setConfirmPlacementVisible(false)
        //we clear the board of already placed ships by creating a new board object
        //that is the same size as the previous
        setPlayerBoardObject(new Gameboard(playerBoardObject.size))
        playerBoardObject.setShips(ships)
        setCurrentShipIndex(1)
        setCurrentShip(ships[0])
    }

    return (
        <div className='d-flex justify-content-center'>
            <div className='d-flex flex-column align-items-center'>
                <h2 className='mt-3'>Place your {currentShip.name}</h2>

                <DrawShipPlacementBoard
                    board={board}
                    highlightedCells={highlightedCells}
                    setHighlightedCells={setHighlightedCells}
                    isValidPlacement={isValidPlacement}
                    handleClick={handleClick}
                    handleMouseEnter={handleMouseEnter}/>
                
                <div className='d-flex flex-column '>
                    <Button 
                        onClick={() => {setIsHorizontal(!isHorizontal)}}>{isHorizontal 
                            ? 'Set To Vertical' 
                            : 'Set To Horizontal'}
                    </Button>

                    <Button onClick={handleRandomPlacement}>
                        Random placement
                    </Button>

                    <Button style={{display: confirmPlacementVisible ? 'block' : 'none'}} 
                        onClick={() => setGamePhase('playPhase')}>
                        Confirm Placement?
                    </Button>

                    <Button style={{display: confirmPlacementVisible ? 'block' : 'none'}}
                        onClick={placeShipsManually}>
                        Place manually?
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default HandlePlacePhase