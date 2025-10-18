import { useState } from 'react'
import { Button } from 'react-bootstrap'

const PlaceShipsBoard = ({ boardObject, ships, setGamePhase}) => {
    const [currentShipIndex, setCurrentShipIndex] = useState(1)
    const [currentShip, setCurrentShip] = useState(ships[0])
    const [isHorizontal, setIsHorizontal] = useState(true)
    const [hoverCells, setHoverCells] = useState([])
    const [isValidPlacement, setIsValidPlacement] = useState(null)
    const [confirmPlacementVisible, setConfirmPlacementVisible] = useState(false)

    const shipAmount = ships.length
    const board = boardObject.getBoard()
    const shipLength = currentShip.getShipLength()

    const handleClick = (rowIndex, cellIndex) => {
        if (isValidPlacement) boardObject.placeShip(rowIndex, cellIndex, isHorizontal, currentShip)
        else return

        setCurrentShipIndex(currentShipIndex + 1)
        if (currentShipIndex >= shipAmount) setGamePhase('playPhase')
        else setCurrentShip(ships[currentShipIndex])
    }

    const handleMouseEnter = (rowIndex, cellIndex) => {
        setIsValidPlacement(boardObject.validatePlacement(rowIndex, cellIndex, isHorizontal, shipLength))
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
        boardObject.placeShipsRandomly(ships)
        //this row forces react to update the UI
        //shamelessly copied this from ChatGPT
        setHoverCells([...hoverCells])
        setConfirmPlacementVisible(true)
    }

    return (
        <div className='d-flex flex-column align-items-center'>
            <div>Place your {currentShip.name}</div>
            <div>Current ship orientation: {isHorizontal ? 'horizontal' : 'vertical'}</div>

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

            <Button 
                onClick={() => {setIsHorizontal(!isHorizontal)}}>{isHorizontal 
                    ? 'set to Vertical' 
                    : 'set to Horizontal'}
            </Button>

            <Button onClick={handleRandomPlacement}>
                Random placement
            </Button>

            <Button style={{display: confirmPlacementVisible ? 'block' : 'none'}} 
                onClick={() => setGamePhase('playPhase')}>
                Confirm Placement?
            </Button>
        </div>
    )
}

export default PlaceShipsBoard