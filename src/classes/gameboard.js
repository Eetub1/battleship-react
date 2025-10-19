class Gameboard {
    constructor(size=10) {
        this.size = size
        this.board = this.setBoard()
        this.ships = []
    }

    CONSTANTS = {
        EMPTY: 'o',
        HIT: 'x',
        MISS: 'm'
    }

    getBoardSize() {
        return this.size
    }

    getBoard() {
        return this.board
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

    calculateRandomResponse() {
        while (true) {
            let randomRow = Math.floor(Math.random() * this.size)
            let randomCol = Math.floor(Math.random() * this.size)
            if (this.validateHit(randomRow, randomCol).wasValid) break
        }
    }

    markHit(row, col) {
        console.log(this.ships)
        console.log('Tälläsee osuttiin: ', this.board[row][col])
        const hitShip = this.ships.find(ship => ship.marker === this.board[row][col])
        console.log('Osuttu laivaolio: ', hitShip);
        hitShip.markHitOnShip()
    }

    //validates if the strike on a given square is a hit
    //then it marks the square as either hit or missed
    validateHit(row, col) {
        const hitInfo = {
            wasValid: true,
            wasHit: false,
            message: 'You missed!'
        }

        //jos ruudussa on hit tai miss, niin sitä ei voi painaa
        if (this.board[row][col] === this.CONSTANTS.HIT || this.board[row][col] === this.CONSTANTS.MISS) {
            hitInfo.wasValid = false
            hitInfo.message = 'Not a valid square!'
            return hitInfo
        } else if (this.board[row][col] === this.CONSTANTS.EMPTY) {
            this.board[row][col] = this.CONSTANTS.MISS
        } else {
            hitInfo.wasHit = true
            this.markHit(row, col)
            this.board[row][col] = this.CONSTANTS.HIT
            hitInfo.message = 'Nice hit!'
        }
        return hitInfo
    }
}

export default Gameboard