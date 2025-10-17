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

    getBoard() {
        return this.board
    }
}

export default Gameboard