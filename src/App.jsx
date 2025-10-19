import { useState } from 'react'

import Gameboard from './classes/gameboard'
import Ship from './classes/ship'

import PlaceShipsBoard from './components/PlaceShipsBoard'
import HandlePlayPhase from './components/HandlePlayPhase'
import NameForm from './components/NameForm'
import Footer from './components/Footer'


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
                <div className='d-flex flex-column align-items-center border border-warning'>
                    <div>Player: {playername}</div>
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
                <>
                    <HandlePlayPhase playerBoardObject={playerBoardObject} computerObject={computerBoardObject}/>
                </>
            )}

            {gamePhase === 'endPhase' && (
                <div>game ended</div>
            )}

            <Footer/>
        </>
    )
}

export default App
