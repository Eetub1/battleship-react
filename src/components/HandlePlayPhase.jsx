import DrawBoard from './DrawBoard'
import Gameboard from '../classes/gameboard'

const HandlePlayPhase = ({ boardObject, computerObject, setGamePhase }) => {

    return (
        <>
            <DrawBoard boardObject={boardObject} isComputerBoard={false} />
            <DrawBoard boardObject={computerObject} isComputerBoard={true}/>
        </>

    )
}

export default HandlePlayPhase