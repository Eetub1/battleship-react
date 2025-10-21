import { useState, useMemo } from 'react'

import Gameboard from './classes/gameboard'
import Ship from './classes/ship'

import HandlePlacePhase from './components/handlePlacePhase'
import HandlePlayPhase from './components/HandlePlayPhase'
import NameForm from './components/NameForm'
import Footer from './components/Footer'
import Header from './components/Header'


function App() {
    const boardSize = 10

    const initialShips = useMemo(() => [
        new Ship('carrier'),
        new Ship('battleship'),
        new Ship('cruiser'),
        new Ship('submarine'),
        new Ship('destroyer'),
    ], [])

    const [gamePhase, setGamePhase] = useState('beginPhase')
    const [playerName, setPlayerName] = useState('')

    const [playerBoardObject, setPlayerBoardObject] = useState(() => {
        const board = new Gameboard(boardSize)
        board.setShips(initialShips)
        return board
    })

    const computerBoardObject = useMemo(() => {
        const board = new Gameboard(boardSize)
        board.setShips(initialShips)
        board.placeShipsRandomly(initialShips)
        return board
    }, [boardSize, initialShips])

    const renderPhase = () => {
        switch (gamePhase) {
            case 'beginPhase':
                return <NameForm setPlayerName={setPlayerName} setGamePhase={setGamePhase} />
            case 'placePhase':
                return (
                    <HandlePlacePhase
                        playerBoardObject={playerBoardObject}
                        setPlayerBoardObject={setPlayerBoardObject}
                        ships={initialShips}
                        setGamePhase={setGamePhase}/>
                )
            case 'playPhase':
                return (
                    <HandlePlayPhase
                        playerBoardObject={playerBoardObject}
                        computerObject={computerBoardObject}
                        playerName={playerName}/>
                )
            case 'endPhase':
                return <div>game ended</div>
            default:
                return null
        }
    }

    return (
        <>
            <Header />
            {renderPhase()}
            <Footer />
        </>
    )
}

export default App
