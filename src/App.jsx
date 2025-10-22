import { useState, useMemo } from 'react'

import Gameboard from './classes/gameboard'

import createDefaultShips from './utils/createDefaultShips'

import HandlePlacePhase from './components/handlePlacePhase'
import HandlePlayPhase from './components/HandlePlayPhase'
import NameForm from './components/NameForm'
import Footer from './components/Footer'
import Header from './components/Header'

const BOARDSIZE = 10

function App() {
    const initialShips = useMemo(() => createDefaultShips(), [])
    const [gamePhase, setGamePhase] = useState('beginPhase')
    const [playerName, setPlayerName] = useState('')

    const [playerBoardObject, setPlayerBoardObject] = useState(() => {
        const board = new Gameboard(BOARDSIZE)
        board.setShips(initialShips)
        return board
    })

    const computerBoardObject = useMemo(() => {
        const board = new Gameboard(BOARDSIZE)
        const computerShips = createDefaultShips()
        board.setShips(computerShips)
        board.placeShipsRandomly(computerShips)
        return board
    }, [])

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
