class Gameboard {
    constructor(size=10, type='player') {
        //either 'player' or 'computer'
        this.type = type
        this.size = size
        this.board = this.setBoard()
        this.ships = [],
        this.boardHitInfo = {
            strikeDirection: 'none',
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
            //this.calculateRandomResponse()
            this.calculateRandomResponseBiasCenter()
        } else {
            //remember to put the mode back to hunt after done
            //this could be divided to 2 further modes: just 'kill' and 'strikeInDirection'
            //kill looks at directions one after another
            //after the correct direction is found, we continue striking
            if (this.AIMODE === 'kill') {
                //console.log('Täällä ollaa!');
                let [row, col] = this.boardHitInfo.hitSquare
                //console.log(row, col)
                let directions = this.boardHitInfo.directions

                for (const direction in directions) {
                    let testRow = row
                    let testCol = col

                    if (directions[direction] === null) {
                        if (direction === 'top') testRow -= 1
                        if (direction === 'right') testCol += 1
                        if (direction === 'bottom') testRow += 1
                        if (direction === 'left') testCol -= 1
                        
                        //console.log('Kokeillaan tätä suuntaa: ', direction)
                        //console.log(testRow, testCol)
                        const result = this.validateHit(testRow, testCol)
                        if (result.wasHit) {
                            directions[direction] = true
                            this.AIMODE = 'strikeInDirection'
                            this.boardHitInfo.directions = {
                                top: null,
                                right: null,
                                bottom: null,
                                left: null
                            }
                            this.boardHitInfo.strikeDirection = direction
                            this.boardHitInfo.hitSquare = [testRow, testCol]
                            return
                        } else {
                            directions[direction] = false
                        }
                    }
                }
            } else {
                console.log('Päästiin tänne')
                //AIMODE is strikeInDirection
                //tästä lähdetään iskemään tiettyyn suuntaan
                //muista resettaa boardHitInfo.strikeDirection
                let [row, col] = this.boardHitInfo.hitSquare
                const direction = this.boardHitInfo.strikeDirection
                if (direction === 'top') row -= 1
                if (direction === 'right') col += 1
                if (direction === 'bottom') row += 1
                if (direction === 'left') col -= 1

                const result = this.validateHit(row, col)

                if (!result.wasValid) {
                    this.calculateRandomResponse()
                } else {
                    if (result.wasHit) {
                        this.boardHitInfo.hitSquare = [row, col]
                        return
                    } else {
                        this.boardHitInfo.strikeDirection = 'none'
                    }
                }
                this.AIMODE = 'hunt'
            }
        }
    }

    //has a bias towards the center of the board
    //if there have been more than 20 hits then we start trying in a more random way
    //so that we dont target the center anymore
    calculateRandomResponseBiasCenter() {
        const nums = [2,3,4,5,6,7]
        while (true) {
            let randomRow = nums[Math.floor(Math.random() * nums.length)]
            let randomCol = nums[Math.floor(Math.random() * nums.length)]
            if (this.validateHit(randomRow, randomCol).wasValid) break
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
        const hitShip = this.ships.find(ship => ship.marker === this.board[row][col])
        const shipInfo = hitShip.markHitOnShip()
        return shipInfo
    }

    //validates if the strike on a given square is a hit
    //then it marks the square as either hit or missed
    //TODO refactor this method!!!!
    validateHit(row, col) {
        //console.log(row, col);
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

        //right now this is also done to computer board which is pointless because the human player 
        //puts the hits manually

        //record the hit coordinates so that computer can hunt ships in a smarter way
        if (this.type === 'player') {
            //we save the hit info
            if (hitInfo.wasValid && hitInfo.wasHit) {
                this.boardHitInfo.hitSquare = [row, col]
                this.AIMODE = 'kill'
            }
        }
        return hitInfo
    }
}

export default Gameboard