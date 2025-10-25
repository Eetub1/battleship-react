class Gameboard {
    constructor(size=10) {
        this.size = size
        this.board = this.setBoard()
        this.ships = [],
        this.boardHitInfo = {
            hitSquare: [],
            directions : {
                top: null,
                right: null,
                bottom: null,
                left: null
            }
        }
        //artificial intelligence mode, either 'hunt' or 'kill
        this.AIMODE = 'hunt'
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

    setShips(ships) {this.ships = ships}

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

    resetBoard() {
        this.board = this.setBoard()
    }

    checkIfAllShipsSunk() {
        for (const ship of this.ships) {
            if (!ship.isSunk) return false 
        }
        //console.log('Kaikki laivat upotettu', this.ships)
        return true
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

    calculateSmartResponse() {
        if (this.AIMODE === 'hunt') {
            //make this use the bias to center function when ready
            this.calculateRandomResponse()
        } else {
            //these coordinates are the latest succesful hit
            let [row, col] = this.boardHitInfo.hitSquare
            const directions = this.boardHitInfo.directions
            console.log(directions)

            //first we check if any direction is true so that we know 
            //into which direction to continue our strikes
            for (const key in directions) {
                if (directions[key]) {
                    if (key === 'top') row -= 1
                    else if (key === 'right') col += 1
                    else if (key === 'bottom') row += 1
                    else col -= 1
                    
                    const hitInfo = this.validateHit(row, col)
                    if (!hitInfo.wasValid || !hitInfo.wasHit) {
                        this.boardHitInfo.directions[key] = false
                        this.AIMODE = 'hunt'
                        this.boardHitInfo.directions = {
                            top: null,
                            right: null,
                            bottom: null,
                            left: null
                        }
                        return
                    }
                }
            }

            //if no direction was true then we start trying every direction one by one
            //that isnt false. False means that that direction was tried already
            for (const key in directions) {
                if (directions[key] === null) {
                    if (key === 'top') row -= 1
                    else if (key === 'right') col += 1
                    else if (key === 'bottom') row += 1
                    else col -= 1

                    const hitInfo = this.validateHit(row, col)
                    if (!hitInfo.wasValid || !hitInfo.wasHit) directions[key] = false
                    else {
                        directions[key] = true
                        this.boardHitInfo.hitSquare = [row, col]
                    }
                }
            }
        }
    }

    //has a bias towards the center of the board
    //if there have been more than 20 hits then we start trying in a more random way
    //so that we dont target the center anymore
    calculateRandomResponseBiasCenter() {

    }

    calculateRandomResponse() {
        while (true) {
            let randomRow = Math.floor(Math.random() * this.size)
            let randomCol = Math.floor(Math.random() * this.size)
            if (this.validateHit(randomRow, randomCol).wasValid) break
        }
    }

    markHit(row, col) {
        const hitShip = this.ships.find(ship => ship.marker === this.board[row][col])
        const shipInfo = hitShip.markHitOnShip()
        return shipInfo
    }

    //validates if the strike on a given square is a hit
    //then it marks the square as either hit or missed
    //TODO refactor this method!!!!
    validateHit(row, col) {
        console.log(row, col);
        const hitInfo = {
            wasValid: true,
            wasHit: false,
            message: 'You missed!'
        }

        if (row < 0 || col < 0 || row >= this.size || col >= this.size) {
            hitInfo.wasValid = false
            return hitInfo
        }
        if (this.board[row][col] === this.CONSTANTS.HIT || this.board[row][col] === this.CONSTANTS.MISS) {
            hitInfo.wasValid = false
            hitInfo.message = 'Not a valid square!'
            return hitInfo
        } else if (this.board[row][col] === this.CONSTANTS.EMPTY) {
            this.board[row][col] = this.CONSTANTS.MISS
        } else {
            hitInfo.wasHit = true
            hitInfo.shipInfo = this.markHit(row, col)
            this.board[row][col] = this.CONSTANTS.HIT
            hitInfo.message = `Hit enemy ${hitInfo.shipInfo.name}!`
        }

        //record the hit coordinates so that computer can hunt ships in a smarter way
        if (hitInfo.wasValid && hitInfo.wasHit) {
            this.boardHitInfo.hitSquare = [row, col]
            this.AIMODE = 'kill'
        }
        return hitInfo
    }
}

export default Gameboard