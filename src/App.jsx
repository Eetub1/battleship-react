import { useState } from 'react'

import Gameboard from './classes/gameboard'

import HandlePlacePhase from './components/handlePlacePhase'
import HandlePlayPhase from './components/HandlePlayPhase'
import NameForm from './components/NameForm'
import Footer from './components/Footer'
import Header from './components/Header'

const BOARDSIZE = 10

function App() {
    const [gamePhase, setGamePhase] = useState('placePhase')
    const [playerName, setPlayerName] = useState('')
    const [playerBoardObject, setPlayerBoardObject] = useState(() => new Gameboard(BOARDSIZE))

    const renderPhase = () => {
        switch (gamePhase) {
            case 'beginPhase':
                return <NameForm setPlayerName={setPlayerName} setGamePhase={setGamePhase} />
            case 'placePhase':
                return (
                    <HandlePlacePhase
                        playerBoardObject={playerBoardObject}
                        setPlayerBoardObject={setPlayerBoardObject}
                        setGamePhase={setGamePhase}/>
                )
            case 'playPhase':
                return (
                    <HandlePlayPhase
                        playerBoardObject={playerBoardObject}
                        playerName={playerName}
                        setGamePhase={setGamePhase}
                        boardSize={BOARDSIZE}/>
                )
            default:
                return <div>Something went wrong with setting state</div>
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
