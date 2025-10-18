import { useState } from 'react'
import { Button } from 'react-bootstrap'


//kun tämä on valmis ja toimii, niin tämän voisi yhdistää tuon DrawBoard komponentin
//kanssa ehkä samaksi? sillä loogisesti hyvin samanlainen
const PlaceShipsBoard = ({ boardObject, ships, setGamePhase}) => {
    const [currentShipIndex, setCurrentShipIndex] = useState(1)
    const [currentShip, setCurrentShip] = useState(ships[0])
    const [isHorizontal, setIsHorizontal] = useState(true)
    const [hoverCells, setHoverCells] = useState([])
    const [isValidPlacement, setIsValidPlacement] = useState(null)


    const shipAmount = ships.length
    const board = boardObject.getBoard()
    const shipLength = currentShip.getShipLength()

    const handleClick = (event, rowIndex, cellIndex) => {
        console.log(rowIndex, cellIndex)
        
        //const wasSuccess = boardObject.validatePlacement(rowIndex, cellIndex, isHorizontal, currentShip, shipLength)
        if (isValidPlacement) {
            boardObject.placeShip(rowIndex, cellIndex, isHorizontal, currentShip)
        } else return

        setCurrentShipIndex(currentShipIndex + 1)
        if (currentShipIndex >= shipAmount) setGamePhase('playPhase')//laita gamePhase eteenpäin
        else setCurrentShip(ships[currentShipIndex])
    }

    const handleMouseEnter = (event, rowIndex, cellIndex) => {
        setIsValidPlacement(boardObject.validatePlacement(rowIndex, cellIndex, isHorizontal, currentShip, shipLength))
        //kun ollaan ruudun yllä niin pitää värjätä ruutujen taustat joko punaiseksi tai vihreäksi riippuen
        //onko tämän hetkinen laivan paikka validi vai ei

        //lähdetään tämänhetkisestä kohdasta [rowIndex][cellIndex] ja mennään shipLengthin verran suuntaan isHorizontal
        //ja matkan varrella joko laitetaan backgroundi vihreäksi tai punaiseksi riippuen wasSuccess muuttujasta
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



        //ei tarvi kutsua validate placementia molemmissa funktioissa
    }

    const handleRandomPlacement = () => {

    }

    return (
        <div className='d-flex flex-column align-items-center'>
            <div>{currentShip.name}</div>
            <div>{isHorizontal ? 'horizontal' : 'vertical'}</div>

            <div className=' d-flex flex-column align-items-center border border-primary'>
                {board.map((row, rowIndex) => {
                    return <div
                        key={rowIndex} 
                        style={{width: '80vw', maxWidth: '600px'}} 
                        className='d-flex flex-row border border-primary'>
                        {row.map((cell, cellIndex) => {
                            //if the cell is the one that should be highlighted 
                            const styles = {
                                flex: 1, 
                                aspectRatio: '1'
                            }
                            if (hoverCells.find(cell => cell[0] === rowIndex && cell[1] === cellIndex)) {
                                if (isValidPlacement) styles.backgroundColor = 'green'
                                else styles.backgroundColor = 'red'
                            }

                            return <div 
                                onClick={() => handleClick(event, rowIndex, cellIndex)} 
                                onMouseEnter={() => {handleMouseEnter(event, rowIndex, cellIndex)}}
                                onMouseLeave={() => setHoverCells([])}
                                key={cellIndex} 
                                style={styles} 
                                className='cell border border-primary d-flex align-items-center justify-content-center'>{cell}
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
        </div>
    )
}

export default PlaceShipsBoard