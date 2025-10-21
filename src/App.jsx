import { useState } from 'react'

import Gameboard from './classes/gameboard'
import Ship from './classes/ship'

import HandlePlacePhase from './components/handlePlacePhase'
import HandlePlayPhase from './components/HandlePlayPhase'
import NameForm from './components/NameForm'
import Footer from './components/Footer'
import Header from './components/Header'


function App() {
    const boardSize = 10

    const ships = [
        new Ship('carrier'),
        new Ship('battleship'),
        new Ship('cruiser'),
        new Ship('submarine'),
        new Ship('destroyer'),
    ]

    const computerShips = [
        new Ship('carrier'),
        new Ship('battleship'),
        new Ship('cruiser'),
        new Ship('submarine'),
        new Ship('destroyer'),
    ]


    const [gamePhase, setGamePhase] = useState('beginPhase')
    const [playername, setPlayerName] = useState('')

    const [playerBoardObject, setPlayerBoardObject] = useState(new Gameboard(boardSize))
    playerBoardObject.setShips(ships)

    const computerBoardObject = new Gameboard(boardSize)
    computerBoardObject.setShips(ships)
    computerBoardObject.placeShipsRandomly(computerShips)

    return (
        <>
            <Header/>

            {gamePhase === 'beginPhase' && (
                <>
                    <NameForm 
                        setPlayerName={setPlayerName}
                        setGamePhase={setGamePhase}/>
                </>
            )}

            {gamePhase === 'placePhase' && (
                <>
                    <HandlePlacePhase playerBoardObject={playerBoardObject} setPlayerBoardObject={setPlayerBoardObject} ships={ships} setGamePhase={setGamePhase} />
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
