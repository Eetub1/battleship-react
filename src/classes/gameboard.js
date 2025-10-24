class Gameboard {
    constructor(size=10) {
        this.size = size
        this.board = this.setBoard()
        this.ships = [],
        this.boardHitInfo = {
            hits: [],
            killModeInfo: {
                initialFoundSquare: [],
                directions : {
                    top: null,
                    right: null,
                    bottom: null,
                    left: null
                }
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
            const row = this.boardHitInfo.killModeInfo.initialFoundSquare[0]
            const col = this.boardHitInfo.killModeInfo.initialFoundSquare[1]
            const directions = this.boardHitInfo.killModeInfo.directions
            console.log(directions)

            //first we check if any direction is true so that we know 
            //into which direction to continue our strikes
            for (const key in directions) {
                if (directions[key]) {
                    console.log('This direction should be tried next: ', key)
                    if (key === 'top') {
                        const hitInfo = this.validateHit(row - 1, col)
                        if (!hitInfo.wasValid || !hitInfo.wasHit) {
                            directions.top = false
                            this.AIMODE = 'hunt'
                            this.boardHitInfo.killModeInfo.directions =  {
                                top: null,
                                right: null,
                                bottom: null,
                                left: null
                            }
                            return
                        }
                    } else if (key === 'right') {
                        const hitInfo = this.validateHit(row, col + 1)
                        if (!hitInfo.wasValid || !hitInfo.wasHit) {
                            directions.right = false
                            this.AIMODE = 'hunt'
                            this.boardHitInfo.killModeInfo.directions =  {
                                top: null,
                                right: null,
                                bottom: null,
                                left: null
                            }
                            return
                        }
                    } else if (key === 'bottom') {
                        const hitInfo = this.validateHit(row + 1, col)
                        if (!hitInfo.wasValid || !hitInfo.wasHit) {
                            directions.bottom = false
                            this.AIMODE = 'hunt'
                            this.boardHitInfo.killModeInfo.directions =  {
                                top: null,
                                right: null,
                                bottom: null,
                                left: null
                            }
                            return
                        }
                    } else if (key === 'left') {
                        const hitInfo = this.validateHit(row, col - 1)
                        if (!hitInfo.wasValid || !hitInfo.wasHit) {
                            directions.left = false
                            this.AIMODE = 'hunt'
                            this.boardHitInfo.killModeInfo.directions =  {
                                top: null,
                                right: null,
                                bottom: null,
                                left: null
                            }
                            return
                        }
                    }
                }
            }
            //if no direction was true then we start trying every direction one by one
            //that isnt false. False means that that direction was tried already

            //do this with a loop!!!!
            if (directions.top === null) {
                const hitInfo = this.validateHit(row - 1, col)
                if (!hitInfo.wasValid || !hitInfo.wasHit) directions.top = false
                else {
                    directions.top = true
                    this.boardHitInfo.killModeInfo.initialFoundSquare = [row - 1, col]
                }
            } else if (directions.right === null) {
                const hitInfo = this.validateHit(row, col + 1)
                if (!hitInfo.wasValid || !hitInfo.wasHit) directions.right = false
                else {
                    directions.right = true
                    this.boardHitInfo.killModeInfo.initialFoundSquare = [row, col + 1]
                }
            } else if (directions.bottom === null) {
                const hitInfo = this.validateHit(row + 1, col)
                if (!hitInfo.wasValid || !hitInfo.wasHit) directions.bottom = false
                else {
                    directions.bottom = true
                    this.boardHitInfo.killModeInfo.initialFoundSquare = [row + 1, col]
                }
            } else if (directions.left === null) {
                const hitInfo = this.validateHit(row, col - 1)
                if (!hitInfo.wasValid || !hitInfo.wasHit) directions.left = false
                else {
                    directions.bottom = true
                    this.boardHitInfo.killModeInfo.initialFoundSquare = [row, col - 1]
                }
            }
        }
    }

    //has a bias towards the center of the board
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
    validateHit(row, col) {
        console.log(row, col);
        const hitInfo = {
            wasValid: true,
            wasHit: false,
            message: 'You missed!'
        }
        //if cell contains hit or miss, you can't strike it anymore
        if (this.board[row][col] === this.CONSTANTS.HIT || this.board[row][col] === this.CONSTANTS.MISS) {
            hitInfo.wasValid = false
            hitInfo.message = 'Not a valid square!'
            return hitInfo
        } else if (this.board[row][col] === this.CONSTANTS.EMPTY) {
            this.board[row][col] = this.CONSTANTS.MISS
        } else {
            hitInfo.wasHit = true
            //if was hit, then we add an a field to hitInfo that is an object
            //which contains the name and the info if the ship was sunk with the hit
            hitInfo.shipInfo = this.markHit(row, col)
            this.board[row][col] = this.CONSTANTS.HIT
            hitInfo.message = `Hit enemy ${hitInfo.shipInfo.name}!`
        }
        //record the hit coordinates so that computer can hunt ships in a smarter way
        if (hitInfo.wasValid) {
            const hitInfoObject = {
                row: row,
                col: col,
                info: {
                    wasHit: hitInfo.wasHit
                }
            }
            if (hitInfo.wasHit) {
                this.boardHitInfo.killModeInfo.initialFoundSquare = [row, col]
                this.AIMODE = 'kill'
            }
            this.boardHitInfo.hits.push(hitInfoObject)
            //for (const hit of this.boardHitInfo.hits) console.log(hit)
        }
        return hitInfo
    }
}

export default Gameboard