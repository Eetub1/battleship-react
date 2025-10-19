import DrawPlayerBoard from './DrawPlayerBoard'
import DrawComputerBoard from './DrawComputerBoard'
import Gameboard from '../classes/gameboard'
import { useState } from 'react'

const HandlePlayPhase = ({ playerBoardObject, computerObject, setGamePhase }) => {
    const [message, setMessage] = useState('')

    //tee niin että kun ei ole sinun vuorosi niin ei saa painaa
    //tietokoneen lautaa
    const handleComputerBoardClick = (rowIndex, cellIndex) => {
        const hitInfo = computerObject.validateHit(rowIndex, cellIndex)
        setMessage(hitInfo.message)
        if (!hitInfo.wasValid) return
        console.log(playerBoardObject)
        playerBoardObject.calculateRandomResponse()
    }

    return (
        <div className='d-flex flex-column justify-content-center gap-5'>
            <div className='d-flex justify-content-center'>{message}</div>
            <div className='d-flex justify-content-center gap-5'>
                <DrawPlayerBoard playerBoardObject={playerBoardObject} />
                <DrawComputerBoard boardObject={computerObject} handleComputerBoardClick={handleComputerBoardClick}/>
            </div>
        </div>
    )
}

export default HandlePlayPhase