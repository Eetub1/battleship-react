import { useState } from 'react'

import Gameboard from './classes/gameboard'
import Ship from './classes/ship'

import DrawBoard from './components/DrawBoard'

import { Form, Button } from 'react-bootstrap'

function App() {
  const boardObject = new Gameboard(10)
  const [boardArray, setBoardArray] = useState(boardObject.getBoard())
  const [gamePhase, setGamePhase] = useState('')

  const [p1name, setP1Name] = useState('')
  const [p2name, setP2Name] = useState('')
  //tyhjä merkkijono, niin ollaan nimien antamisvaiheessa
  //laivan paikanvalinta vaihe
  //peli käynnissä vaihe
  //peli loppunut vaihe

  const ships = [
    new Ship('carrier'),
    new Ship('battleship'),
    new Ship('cruiser'),
    new Ship('submarine'),
    new Ship('destroyer'),
  ]

  //row col ishorizontal ship
  //const wasSuccess = boardObject.placeShip(0, 0, true, ships[0])
  //console.log(wasSuccess)

  const handleSubmit = event => {
    event.preventDefault()
    setP1Name(event.target.p1name.value)
    setP2Name(event.target.p2name.value)
    setGamePhase('placePhase')
  }

  return (
  <>
    {gamePhase === 'placePhase' && (
      <div className='d-flex justify-content-center'>
        <DrawBoard board={boardArray} />
      </div>
    )}

    {gamePhase === '' && (
      <div>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="p1name">
            <Form.Label>Player 1 name:</Form.Label>
            <Form.Control name="p1name" type="text" placeholder="Enter Player 1 name" />
          </Form.Group>

          <Form.Group className="mb-3" controlId="p2name">
            <Form.Label>Player 2 name:</Form.Label>
            <Form.Control name="p2name" type="text" placeholder="Enter Player 2 name" />
          </Form.Group>

          <Button variant="primary" type="submit">
            Submit
          </Button>
        </Form>
      </div>
    )}
  </>
  )
}

export default App
