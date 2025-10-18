import { useState } from 'react'

import Gameboard from './classes/gameboard'
import Ship from './classes/ship'

import PlaceShipsBoard from './components/PlaceShipsBoard'
import HandlePlayPhase from './components/HandlePlayPhase'
import NameForm from './components/NameForm'


function App() {
    const [playerBoardObject] = useState(new Gameboard(10))
    const [gamePhase, setGamePhase] = useState('beginPhase')

    const [playername, setPlayerName] = useState('')


    const ships = [
        new Ship('carrier'),
        new Ship('battleship'),
        new Ship('cruiser'),
        new Ship('submarine'),
        new Ship('destroyer'),
    ]
    playerBoardObject.ships = ships

    const computerBoardObject = new Gameboard(10)
    computerBoardObject.ships = ships
    computerBoardObject.placeShipsRandomly(ships)

    return (
        <>
            {playername && (
                <div>
                    <div>{playername}</div>
                    <div>current phase: {gamePhase}</div>
                </div>
            )}

            {gamePhase === 'beginPhase' && (
                <div>
                    <NameForm 
                        setPlayerName={setPlayerName}
                        setGamePhase={setGamePhase}/>
                </div>
            )}

            {gamePhase === 'placePhase' && (
                <div className='d-flex justify-content-center'>
                    <PlaceShipsBoard playerBoardObject={playerBoardObject} ships={ships} setGamePhase={setGamePhase} />
                </div>
            )}

            {gamePhase === 'playPhase' && (
                <div className='d-flex justify-content-center gap-5'>
                    <HandlePlayPhase playerBoardObject={playerBoardObject} computerObject={computerBoardObject} setGamePhase={setGamePhase}/>
                </div>
            )}

            {gamePhase === 'endPhase' && (
                <div>game ended</div>
            )}
        </>
    )
}

export default App
