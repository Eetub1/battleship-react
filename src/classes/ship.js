class Ship {
    constructor(name) {
        this.name = name
        this.isSunk = false
        this.marker = null
        this.shipLength = null
        this.setShipLengthAndMarker()
        this.hitPoints = this.shipLength
    }

    getShipLength() {
        return this.shipLength
    }

    getShipMarker() {
        return this.marker
    }

    setShipLengthAndMarker() {
        switch(this.name) {
            case 'carrier':
                this.shipLength = 5
                this.marker = 'c'
                break
            case 'battleship':
                this.shipLength = 4
                this.marker = 'b'
                break
            case 'cruiser':
                this.shipLength = 3
                this.marker = 'r'
                break
            case 'submarine':
                this.shipLength = 3
                this.marker = 's'
                break
            case 'destroyer':
                this.shipLength = 2
                this.marker = 'd'
                break
            default:
                this.shipLength = 5
                break
        }
    }

    markHitOnShip() {
        const shipInfo = {
            name: this.name,
            wasSunk: false
        }
        if (this.hitPoints === 0) return shipInfo
        this.hitPoints -= 1
        if (this.hitPoints === 0) {
            this.isSunk = true
            shipInfo.wasSunk = true
            console.log(`${this.name} has been sunk`, this)
        }
        console.log(`Osuttiin laivaan nimeltä ${this.name} onko upotettu: ${shipInfo.wasSunk}`)
        return shipInfo
    }
}

export default Ship