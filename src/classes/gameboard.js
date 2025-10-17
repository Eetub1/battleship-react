class Gameboard {
    constructor(size=10) {
        this.size = size
        this.board = this.setBoard()
    }

    CONSTANTS = {
        EMPTY: 'o'
    }

    getBoardSize() {
        return this.size
    }

    setBoard() {
        const board = []

        for (let i = 0; i < this.size; i++) {
            const row = []
            for (let j = 0; j < this.size; j++) {
                row.push(this.CONSTANTS.EMPTY)
            }
            board.push(row)
        }
        return board
    }

    placeShip(row, col, isHorizontal, ship) {
        const boardSize = this.getBoardSize()
        const shipMarker = ship.getShipMarker()
        const shipLength = ship.getShipLength()

        if (row >= boardSize || col >= boardSize) return false

        if (isHorizontal) {
            if (col + shipLength > boardSize) return false

            for (let i = col; i < col + shipLength; i++) {
                if (this.board[row][i] !== this.CONSTANTS.EMPTY) return false
            }

            for (let i = col; i < col + shipLength; i++) {
                this.board[row][i] = shipMarker
            }
        } else {
            if (row + shipLength > boardSize) return false

            for (let i = row; i < row + shipLength; i++) {
                if (this.board[i][col] !== this.CONSTANTS.EMPTY) return false
            }

            for (let i = row; i < row + shipLength; i++) {
                this.board[i][col] = shipMarker
            }
        }
        return true
    }

    getBoard() {
        return this.board
    }
}

export default Gameboard