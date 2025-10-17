import { useState } from 'react'
import Gameboard from './classes/gameboard'
import Ship from './classes/ship'

import Drawboard from './components/Drawboard'

function App() {
  const boardObject = new Gameboard(10)
  const [boardArray, setBoardArray] = useState(boardObject.getBoard())

  const ships = [
    new Ship('carrier'),
    new Ship('battleship'),
    new Ship('cruiser'),
    new Ship('submarine'),
    new Ship('destroyer'),
  ]

                                        //row col ishorizontal ship
  const wasSuccess = boardObject.placeShip(0, 0, true, ships[0])
  console.log(wasSuccess)

  return (
    <div>
      <Drawboard board={boardArray}/>
    </div>
  )
}

export default App
