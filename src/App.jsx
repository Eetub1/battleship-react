import { useState } from 'react'

import Gameboard from './classes/gameboard'
import Ship from './classes/ship'

import HandlePlacePhase from './components/handlePlacePhase'
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
            {gamePhase === 'beginPhase' && (
                <>
                    <NameForm 
                        setPlayerName={setPlayerName}
                        setGamePhase={setGamePhase}/>
                </>
            )}

            {gamePhase === 'placePhase' && (
                <>
                    <HandlePlacePhase playerBoardObject={playerBoardObject} ships={ships} setGamePhase={setGamePhase} />
                </>
            )}

            {gamePhase === 'playPhase' && (
                <>
                    <HandlePlayPhase playerBoardObject={playerBoardObject} computerObject={computerBoardObject} playerName={playername}/>
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
