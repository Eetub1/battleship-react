class Gameboard {
    constructor(size=10) {
        this.size = size
        //this is a reference to an array
        this.board = this.setBoard()
    }

    setBoard() {
        const board = []

        for (let i = 0; i < this.size; i++) {
            const row = []
            for (let j = 0; j < this.size; j++) {
                row.push('o')
            }
            board.push(row)
        }
        return board
    }

    placeShip(row, col, isHorizontal, board, ship) {
        //remove these constants when this method works
        const shipMarker = "jotaivitupaskaa"
        const boardSize = 10
        const shipLength = 5
        if (row >= boardSize || col >= boardSize) return false

        if (isHorizontal) {
            if (col + shipLength > boardSize) return false
            //tarkista onko tiellä mitään muita kuin tyhjiä merkkejä
            //jos ei niin laita laiva taulukkoon
        } else {
            if (row + shipLength > boardSize) return false
        }
        return true
    }

    getBoard() {
        return this.board
    }
}

export default Gameboard