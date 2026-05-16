import { CONSTANTS, AI_MODES, PLAYER_TYPES } from "../utils/constants"

class Gameboard {
    constructor(size=10, type=PLAYER_TYPES.PLAYER) {
        this.type = type
        this.size = size
        this.board = this.setBoard()
        this.ships = [],

        this.boardHitInfo = {
            strikeDirection: 'none',
            lastHitSquare: [],
            triedDirections : {
                top: null,
                right: null,
                bottom: null,
                left: null
            }
        }
        this.AIMODE = AI_MODES.HUNT // AI mode, 'hunt', 'kill' or 'strike'
        this.howManyAttempts = 0 // tells how many times the playerboard has been hit
    }

    getBoardSize() {return this.size}

    getBoard() {return this.board}

    setShips(ships) {this.ships = ships}

    setBoard() {
        const board = []

        for (let i = 0; i < this.size; i++) {
            const row = []
            for (let j = 0; j < this.size; j++) {
                row.push(CONSTANTS.EMPTY)
            }
            board.push(row)
        }
        return board
    }

    resetBoard() {this.board = this.setBoard()}

    checkIfAllShipsSunk() {
        console.log("laivat: ", this.ships)
        for (const ship of this.ships) {
            if (!ship.isSunk) return false 
        }
        return true
    }

    validatePlacement(row, col, isHorizontal, shipLength) {
        const boardSize = this.getBoardSize()

        if (isHorizontal) {
            if (col + shipLength > boardSize) return false

            for (let i = col; i < col + shipLength; i++) {
                if (this.board[row][i] !== CONSTANTS.EMPTY) return false
            }
        } else {
            if (row + shipLength > boardSize) return false

            for (let i = row; i < row + shipLength; i++) {
                if (this.board[i][col] !== CONSTANTS.EMPTY) return false
            }
        }
        return true
    }

    placeShip(row, col, isHorizontal, ship) {
        const shipMarker = ship.getShipMarker()
        const shipLength = ship.getShipLength()

        if (!this.validatePlacement(row, col, isHorizontal, shipLength)) return false

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
        const newBoardObject = new Gameboard(this.size, this.type)
        newBoardObject.ships = ships

        for (const ship of ships) {
            while (true) {
                let randomRow = Math.floor(Math.random() * this.size)
                let randomCol = Math.floor(Math.random() * this.size)
                let orientation = Math.random() > 0.5 ? true : false
                if (newBoardObject.placeShip(randomRow, randomCol, orientation, ship)) break
            }
        }
        return newBoardObject
    }

    //slightly different version of placeShipsRandomly that is used for computer board
    //doesn't return anything because we directly modify the computer board object instead of creating a new one
    placeShipsRandomlyComputer(ships) {
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
        if (this.AIMODE === AI_MODES.HUNT) {
            this.huntTarget()
        } else if (this.AIMODE === AI_MODES.KILL) {
            this.killTarget()
        } else if (this.AIMODE === AI_MODES.STRIKE) {
            this.strikeTarget()
        }
    }

    huntTarget() {
        if (this.howManyAttempts > 16) {
            this.calculateRandomResponse()
        } else this.calculateRandomResponseBiasCenter()
    }

    /**
     * We come into this function if AI was previously in HUNT mode and the previous strike was a hit
     * The purpose of this function is to determine the orientation of the ship
     */
    killTarget() {
        const [row, col] = this.boardHitInfo.lastHitSquare;
        const directions = [
            { r: -1, c: 0 }, // Top
            { r: 0, c: 1 },  // Right
            { r: 1, c: 0 },  // Bottom
            { r: 0, c: -1 }  // Left
        ];

        for (const dir of directions) {
            const tRow = row + dir.r
            const tCol = col + dir.c

            if (tRow >= 0 && tRow < this.size && tCol >= 0 && tCol < this.size) {
                if (this.board[tRow][tCol] === CONSTANTS.EMPTY) {
                    this.validateHit(tRow, tCol)
                    return
                }
            }
        }

        // 3. Fallback: If we checked all neighbors and found nowhere to shoot
        // (This happens if a ship is surrounded by misses or other ships)
        this.AIMODE = AI_MODES.HUNT
        this.huntTarget()
    }

    strikeTarget() {
        let [row, col] = this.boardHitInfo.lastHitSquare
        const direction = this.boardHitInfo.strikeDirection

        if (direction === 'top') row -= 1
        if (direction === 'right') col += 1
        if (direction === 'bottom') row += 1
        if (direction === 'left') col -= 1

        const isInsideBoard = row >= 0 && row < this.size && col >= 0 && col < this.size
        
        if (isInsideBoard && this.board[row][col] === CONSTANTS.EMPTY) {
            const result = this.validateHit(row, col)
            
            if (!result.wasHit) {
                this.AIMODE = AI_MODES.KILL
            }
        } else {
            this.AIMODE = AI_MODES.KILL
            this.killTarget()
        }
    }

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

    //validates if the strike on a given square is a hit and then mark the square as either hit or missed
    validateHit(row, col) {
        const hitInfo = {
            wasValid: true,
            wasHit: false,
            message: 'You missed!'
        }

        if (row < 0 || col < 0 || row >= this.size || col >= this.size) { // coordinates are out of bounds
            hitInfo.wasValid = false
            return hitInfo
        }
        if (this.board[row][col] === CONSTANTS.HIT || this.board[row][col] === CONSTANTS.MISS) { // already hit this square before
            hitInfo.wasValid = false
            hitInfo.message = 'Not a valid square!'
            return hitInfo
        } else if (this.board[row][col] === CONSTANTS.EMPTY) { // missed the shot
            this.howManyAttempts += 1
            this.board[row][col] = CONSTANTS.MISS
        } else { // else we hit a ship
            this.howManyAttempts += 1
            hitInfo.wasHit = true
            hitInfo.shipInfo = this.markHit(row, col)
            this.board[row][col] = CONSTANTS.HIT
            hitInfo.message = `Hit enemy ${hitInfo.shipInfo.name}!`

            if (this.type === PLAYER_TYPES.PLAYER) {
                this.boardHitInfo.lastHitSquare = [row, col]
                if (this.AIMODE === AI_MODES.HUNT) this.AIMODE = AI_MODES.KILL // we hit a ship and we kill it
            }
        }
        return hitInfo
    }
}

export default Gameboard