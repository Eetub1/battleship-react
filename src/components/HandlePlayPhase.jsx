import DrawPlayerBoard from './DrawPlayerBoard'
import DrawComputerBoard from './DrawComputerBoard'
import Gameboard from '../classes/gameboard'

const HandlePlayPhase = ({ playerBoardObject, computerObject, setGamePhase }) => {

    //tee niin että kun ei ole sinun vuorosi niin ei saa painaa
    //tietokoneen lautaa
    const handleComputerBoardClick = (rowIndex, cellIndex) => {
        const hitInfo = computerObject.validateHit(rowIndex, cellIndex)
        if (!hitInfo.wasValid) {
            console.log('iskusi oli epävalidi!')
            return
        }
        console.log(playerBoardObject)
        playerBoardObject.calculateRandomResponse()
    }

    return (
        <>
            <DrawPlayerBoard playerBoardObject={playerBoardObject} />
            <DrawComputerBoard boardObject={computerObject} handleComputerBoardClick={handleComputerBoardClick}/>
        </>

    )
}

export default HandlePlayPhase