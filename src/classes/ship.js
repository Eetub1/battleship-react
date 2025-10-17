class Ship {
    constructor(name) {
        this.name = name
        this.isSunk = false
        this.shipLength = this.setShipLength()
        this.hitPoints = this.shipLength
    }

    getShipLength() {
        return this.shipLength
    }

    setShipLength() {
        switch(this.name) {
            case 'carrier':
                this.shipLength = 5
                break
            case 'battleship':
                this.shipLength = 4
                break
            case 'cruiser':
                this.shipLength = 3
                break
            case 'submarine':
                this.shipLength = 3
                break
            case 'destroyer':
                this.shipLength = 2
                break
            default:
                this.shipLength = 5
                break
            }
    }

    //jollain tavalla täytyy tuoda tieto laivasta johon osuttiin
    hitShip() {

    }
}

export default Ship