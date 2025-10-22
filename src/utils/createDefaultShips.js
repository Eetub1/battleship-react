import Ship from '../classes/ship'

const createDefaultShips = () => {
    return [
        new Ship('carrier'),
        new Ship('battleship'),
        new Ship('cruiser'),
        new Ship('submarine'),
        new Ship('destroyer'),
    ]
}

export default createDefaultShips