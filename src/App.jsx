import { useState } from 'react'
import Gameboard from './classes/gameboard'
import Drawboard from './components/Drawboard'

function App() {
  const boardClass = new Gameboard(5)

  const boardArray = boardClass.getBoard()
  console.log(boardArray)

  return (
    <div>
      <p>moi</p>
      <Drawboard board={boardArray}/>
    </div>
  )
}

export default App
