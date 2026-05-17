import { CONSTANTS, AI_MODES, PLAYER_TYPES } from '../utils/constants'

class Gameboard {
    constructor(size=10, type=PLAYER_TYPES.PLAYER) {
        this.type = type
        this.size = size
        this.board = this.setBoard()
        this.ships = []
        this.reverseDirections = {
            top: 'bottom',
            right: 'left',
            bottom: 'top',
            left: 'right'
        }
        this.boardHitInfo = {
            strikeDirection: null,
            firstHitSquare: [], // TODO tää pitää pitää muistissa
            lastHitSquare: [],
            triedDirections : {
                top: false,
                right: false,
                bottom: false,
                left: false
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
        //console.log("laivat: ", this.ships)
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

        // this could take a really long time if we have alot of ships or the board is small, but since we have a small board and only 5 ships it should be fine
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

    calculateRandomResponseBiasCenter() {
        const nums = [2,3,4,5,6,7]
        while (true) {
            let randomRow = nums[Math.floor(Math.random() * nums.length)]
            let randomCol = nums[Math.floor(Math.random() * nums.length)]
            const result = this.processBoardStrike(randomRow, randomCol)
            if (result.wasValid) return result
        }
    }

    calculateRandomResponse() {
        while (true) {
            let randomRow = Math.floor(Math.random() * this.size)
            let randomCol = Math.floor(Math.random() * this.size)
            const result = this.processBoardStrike(randomRow, randomCol)
            if (result.wasValid) return result
        }
    }

    calculateSmartResponse() {
        if (this.AIMODE === AI_MODES.HUNT) {
            return this.huntTarget()
        } else if (this.AIMODE === AI_MODES.KILL) {
            return this.killTarget()
        } else if (this.AIMODE === AI_MODES.STRIKE) {
            return this.strikeTarget()
        }
    }

    huntTarget() {
        if (this.howManyAttempts > 16) {
            return this.calculateRandomResponse()
        } else return this.calculateRandomResponseBiasCenter()
    }

    /**
     * We come into this function if AI was previously in HUNT mode and the previous strike was a hit
     * The purpose of this function is to determine the orientation of the ship
     */
    killTarget() {
        const hitInfo = this.boardHitInfo
        const [row, col] = hitInfo.lastHitSquare
        const directions = {
            'top': { row: -1, col: 0 },
            'right': { row: 0, col: 1 },
            'bottom': { row: 1, col: 0 },
            'left': { row: 0, col: -1 }
        }

        for (const [direction, tried] of Object.entries(hitInfo.triedDirections)) {
            if (tried) continue

            const newRow = row + directions[direction].row
            const newCol = col + directions[direction].col

            if (!this.isValidTarget(newRow, newCol)) {
                hitInfo.triedDirections[direction] = true
                continue
            }

            //else we found a valid square in current direction
            hitInfo.triedDirections[direction] = true
            const result = this.executeStrike(newRow, newCol)
            this.updateAIState(newRow, newCol, result, direction)
            return hitInfo
        }
    }

    strikeTarget() {

        let [row, col] = this.boardHitInfo.lastHitSquare
        const direction = this.boardHitInfo.strikeDirection
        let newRow = row
        let newCol = col

        if (direction === 'top') newRow -= 1
        if (direction === 'right') newCol += 1
        if (direction === 'bottom') newRow += 1
        if (direction === 'left') newCol -= 1

        if (!this.isValidTarget(newRow, newCol)) {
            this.boardHitInfo.strikeDirection = this.reverseDirections[direction]
            this.boardHitInfo.lastHitSquare = this.boardHitInfo.firstHitSquare
            return this.strikeTarget()
        }

        const hitInfo = this.executeStrike(newRow, newCol)

        if (!hitInfo.wasHit) {
            this.boardHitInfo.strikeDirection = this.reverseDirections[direction]
            this.boardHitInfo.lastHitSquare = this.boardHitInfo.firstHitSquare
        }
        this.updateAIState(newRow, newCol, hitInfo)
        return hitInfo
    }

    /**
     * Marks a hit on the hit ship
     */
    markHit(row, col) {
        const hitShip = this.ships.find(ship => ship.marker === this.board[row][col])
        const shipInfo = hitShip.markHitOnShip()
        return shipInfo
    }

    /**
     * Checks if the strike is in bounds of the board and the square hasn't already been hit before 
     */
    isValidTarget(row, col) {
        if (row < 0 || col < 0 || row >= this.size || col >= this.size) {
            return false
        }

        if (this.board[row][col] === CONSTANTS.HIT || this.board[row][col] === CONSTANTS.MISS) {
            return false
        }
        return true
    }

    /**
     * Executes a strike on the given coordinates. Assumes that the coordinates are valid
     * Use isValidTarget function to check if the strike is valid before calling this function :) 
     */
    executeStrike(row, col) {
        this.howManyAttempts += 1

        if (this.board[row][col] === CONSTANTS.EMPTY) {
            this.board[row][col] = CONSTANTS.MISS
            return { 
                wasHit: false, 
                message: this.type === PLAYER_TYPES.COMPUTER ? 'You missed!' : 'Computer missed!',
                shipInfo: {
                    name: null,
                    wasSunk: false
                }
            }
        }

        const shipInfo = this.markHit(row, col)
        this.board[row][col] = CONSTANTS.HIT
        
        return { 
            wasHit: true, 
            shipInfo: shipInfo, 
            message: this.type === PLAYER_TYPES.COMPUTER ? `Hit enemy ${shipInfo.name}!` : `Computer hit your ${shipInfo.name}!`
        }
    }

    updateAIState(row, col, result, strikeDirection=null) {
        if (this.type !== PLAYER_TYPES.PLAYER) return // we only track shots on a human player

        const isSunk = result.wasHit ? result.shipInfo.wasSunk : false

        console.log('Mikä on tekoälyn mode: ', this.AIMODE)
        console.log('Isku info objekti: ', this.boardHitInfo)
        console.log('Montako yritystä mennyt: ', this.howManyAttempts)
        console.log('Result objekti: ', result)
        console.log('=========================')
        if (result.wasHit) {
            if (isSunk) {
                // if we sunk the ship, then we go back to hunting ships
                this.AIMODE = AI_MODES.HUNT
                this.boardHitInfo.lastHitSquare = []
                this.boardHitInfo.firstHitSquare = []
                this.boardHitInfo.strikeDirection = null
                this.boardHitInfo.triedDirections = {
                    top: false,
                    right: false,
                    bottom: false,
                    left: false
                }
            } else {
                this.boardHitInfo.lastHitSquare = [row, col]
                if (this.AIMODE === AI_MODES.HUNT) {
                    this.boardHitInfo.firstHitSquare = [row, col]
                    this.AIMODE = AI_MODES.KILL
                } else if (this.AIMODE === AI_MODES.KILL) {
                    this.AIMODE = AI_MODES.STRIKE
                    this.boardHitInfo.strikeDirection = strikeDirection
                }
            }
        }

        console.log('Mikä on tekoälyn mode nyt: ', this.AIMODE)
        console.log('Isku info objekti nyt: ', this.boardHitInfo)
        console.log(' ')
    }

    processBoardStrike(row, col) {
        if (!this.isValidTarget(row, col)) {
            return { 
                wasValid: false, 
                message: this.type === PLAYER_TYPES.COMPUTER ? 'Not a valid square!' : 'Computer selected an invalid square!',
                shipInfo:{
                    name: null,
                    wasSunk: false
                }
            }
        }

        const result = this.executeStrike(row, col)

        if (this.type === PLAYER_TYPES.PLAYER) {this.updateAIState(row, col, result)}

        return {
            wasValid: true,
            ...result
        }
    }
}

export default Gameboard