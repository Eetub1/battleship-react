import { useState } from 'react'

import Gameboard from './classes/gameboard'
import Ship from './classes/ship'

import DrawBoard from './components/DrawBoard'
import PlaceShipsBoard from './components/PlaceShipsBoard'

import { Form, Button } from 'react-bootstrap'

function App() {
  const [boardObject] = useState(new Gameboard(10))
  const [gamePhase, setGamePhase] = useState('placePhase')

  const [p1name, setP1Name] = useState('')
  const [p2name, setP2Name] = useState('')

  const ships = [
    new Ship('carrier'),
    new Ship('battleship'),
    new Ship('cruiser'),
    new Ship('submarine'),
    new Ship('destroyer'),
  ]

  //row col ishorizontal ship
  /*boardObject.placeShip(0, 5, true, ships[0])
  boardObject.placeShip(1, 5, true, ships[1])
  boardObject.placeShip(5, 4, false, ships[2])
  boardObject.placeShip(6, 9, false, ships[3])
  boardObject.placeShip(9, 0, true, ships[4])*/

  const handleSubmit = event => {
    event.preventDefault()
    setP1Name(event.target.p1name.value)
    setP2Name(event.target.p2name.value)
    setGamePhase('placePhase')
  }

  return (
  <>
    {p1name && (
      <div>
        <div>{p1name}</div>
        <div>{p2name}</div>
        <div>current phase: {gamePhase}</div>
      </div>
    )}

    {gamePhase === 'beginPhase' && (
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

    {gamePhase === 'placePhase' && (
      <div className='d-flex justify-content-center'>
        <PlaceShipsBoard boardObject={boardObject} ships={ships} setGamePhase={setGamePhase} />
      </div>
    )}

    {gamePhase === 'playPhase' && (
      <div className='d-flex justify-content-center'>
        <DrawBoard boardObject={boardObject} />
      </div>
    )}

    {gamePhase === 'endPhase' && (
      <div>game ended</div>
    )}
  </>
  )
}

export default App
