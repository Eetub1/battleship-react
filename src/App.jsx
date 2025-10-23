import { useState } from 'react'

import Gameboard from './classes/gameboard'

import HandlePlacePhase from './components/handlePlacePhase'
import HandlePlayPhase from './components/HandlePlayPhase'
import NameForm from './components/NameForm'
import Footer from './components/Footer'
import Header from './components/Header'

const BOARDSIZE = 10

function App() {
    const [gamePhase, setGamePhase] = useState('beginPhase')
    const [playerName, setPlayerName] = useState('')

    const [playerBoardObject, setPlayerBoardObject] = useState(() => {
        return new Gameboard(BOARDSIZE)
    })

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
                        setGamePhase={setGamePhase}/>
                )
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
