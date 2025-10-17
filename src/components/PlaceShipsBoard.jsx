import { useState } from 'react'
import { Button } from 'react-bootstrap'

//kun tämä on valmis ja toimii, niin tämän voisi yhdistää tuon DrawBoard komponentin
//kanssa ehkä samaksi? sillä loogisesti hyvin samanlainen
const PlaceShipsBoard = ({ board, ships, setGamePhase}) => {
    const [currentShipIndex, setCurrentShipIndex] = useState(1)
    const [currentShip, setCurrentShip] = useState(ships[0])
    const [isHorizontal, setIsHorizontal] = useState(true)

    //maybe this can be done more reasonably
    const handleClick = (event, rowIndex, cellIndex) => {
        console.log(rowIndex, cellIndex)
        const shipAmount = ships.length
        setCurrentShipIndex(currentShipIndex + 1)
        if (currentShipIndex >= shipAmount) setGamePhase('playPhase')//laita gamePhase eteenpäin
        else setCurrentShip(ships[currentShipIndex])
        //validatePlacement ja jos true niin laita laiva
    }

    const handleMouseEnter = event => {
        //hoitaa ruudun vihreäksi värittämisen
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
                            return <div onClick={() => handleClick(event, rowIndex, cellIndex)} onMouseEnter={handleMouseEnter}
                                key={cellIndex} 
                                style={{flex: 1, aspectRatio: '1'}} 
                                className='cell border border-primary d-flex align-items-center justify-content-center'>{cell}</div>
                        })}
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