class Gameboard {
    constructor(size=10) {
        this.size = size
        //this is a reference to an array
        this.board = this.setBoard()
    }

    CONSTANTS = {
        EMPTY: 'o'
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
        const shipMarker = "c"
        const boardSize = 10
        const shipLength = 5
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