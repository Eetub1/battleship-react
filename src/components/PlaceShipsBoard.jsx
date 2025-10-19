import { useState } from 'react'
import { Button } from 'react-bootstrap'

const PlaceShipsBoard = ({ playerBoardObject, ships, setGamePhase}) => {
    const [currentShipIndex, setCurrentShipIndex] = useState(1)
    const [currentShip, setCurrentShip] = useState(ships[0])
    const [isHorizontal, setIsHorizontal] = useState(true)
    const [hoverCells, setHoverCells] = useState([])
    const [isValidPlacement, setIsValidPlacement] = useState(null)
    const [confirmPlacementVisible, setConfirmPlacementVisible] = useState(false)

    //this variable tracks if random placement button has been pressed
    //so that you cant manually place ships if there are alreay random ships on board
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
        setHoverCells([])
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
        setHoverCells(cells)
    }

    const handleRandomPlacement = () => {
        setIsShipRandomPlacement(true)
        playerBoardObject.placeShipsRandomly(ships)

        //this row forces react to update the UI, doesnt actually do anything useful
        setHoverCells([...hoverCells])
        setConfirmPlacementVisible(true)
    }

    const placeShipsManually = () => {
        setIsShipRandomPlacement(false)
        setConfirmPlacementVisible(false)
        //TODO: need to clear the board of ships here
    }

    return (
        <div className='d-flex flex-column align-items-center'>
            <h2>Place your {currentShip.name}</h2>

            <div className='d-flex flex-column align-items-center border border-primary'>
                {board.map((row, rowIndex) => {
                    return <div
                        key={rowIndex} 
                        style={{width: '80vw', maxWidth: '600px'}} 
                        className='d-flex flex-row border border-primary'>
                        {row.map((cell, cellIndex) => {
                            const styles = {
                                flex: 1, 
                                aspectRatio: '1'
                            }

                            if (hoverCells.find(cell => cell[0] === rowIndex && cell[1] === cellIndex)) {
                                if (isValidPlacement) styles.backgroundColor = 'green'
                                else styles.backgroundColor = 'red'
                            }

                            //mystery constant variable fix later!
                            if (board[rowIndex][cellIndex] !== 'o') styles.backgroundColor = 'blue'

                            return <div 
                                onClick={() => handleClick(rowIndex, cellIndex)} 
                                onMouseEnter={() => {handleMouseEnter(rowIndex, cellIndex)}}
                                onMouseLeave={() => setHoverCells([])}
                                key={cellIndex} 
                                style={styles} 
                                className='cell border border-primary d-flex align-items-center justify-content-center'>
                            </div>
                        }
                        )}
                    </div>
                })}
            </div>
            
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
    )
}

export default PlaceShipsBoard