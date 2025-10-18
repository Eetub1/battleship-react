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

    validatePlacement(row, col, isHorizontal, shipLength) {
        const boardSize = this.getBoardSize()

        if (isHorizontal) {
            if (col + shipLength > boardSize) return false

            for (let i = col; i < col + shipLength; i++) {
                if (this.board[row][i] !== this.CONSTANTS.EMPTY) return false
            }
        } else {
            if (row + shipLength > boardSize) return false

            for (let i = row; i < row + shipLength; i++) {
                if (this.board[i][col] !== this.CONSTANTS.EMPTY) return false
            }
        }
        return true
    }

    placeShip(row, col, isHorizontal, ship) {
        const shipMarker = ship.getShipMarker()
        const shipLength = ship.getShipLength()

        if (!this.validatePlacement(row, col, isHorizontal, shipLength)) return false

        //these two if branches could probably be connected with a little trickery
        if (isHorizontal) {
            for (let i = col; i < col + shipLength; i++) {
                this.board[row][i] = shipMarker
            }
        } else {
            for (let i = row; i < row + shipLength; i++) {
                this.board[i][col] = shipMarker
            }
        }
        return true
    }

    placeShipsRandomly(ships) {
        //clearing the board of all previously placed ships
        this.board = this.setBoard()

        for (const ship of ships) {
            while (true) {
                let randomRow = Math.floor(Math.random() * this.size)
                let randomCol = Math.floor(Math.random() * this.size)
                let orientation = Math.random() > 0.5 ? true : false
                if (this.placeShip(randomRow, randomCol, orientation, ship)) break
            }
        }
    }

    getBoard() {
        return this.board
    }
}

export default Gameboard