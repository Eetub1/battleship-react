const DrawShipPlacementBoard = ({
    board,
    hoverCells,
    setHoverCells,
    isValidPlacement,
    handleClick,
    handleMouseEnter }) => {
    return (
        <div className='d-flex flex-column align-items-center border border-primary'>
            {board.map((row, rowIndex) => {
                return <div
                    key={rowIndex} 
                    style={{width: '80vw', maxWidth: '600px'}} 
                    className='d-flex flex-row'>
                    {row.map((cell, cellIndex) => {
                        const styles = {
                            flex: 1, 
                            aspectRatio: '1'
                        }

                        if (hoverCells.find(cell => cell[0] === rowIndex && cell[1] === cellIndex)) {
                            if (isValidPlacement) styles.backgroundColor = 'rgba(8, 124, 47, 1)'
                            else styles.backgroundColor = 'rgba(184, 38, 38, 1)'
                        }

                        //mystery constant variable fix later!
                        if (board[rowIndex][cellIndex] !== 'o') styles.backgroundColor = 'white'

                        return <div 
                            onClick={() => handleClick(rowIndex, cellIndex)} 
                            onMouseEnter={() => {handleMouseEnter(rowIndex, cellIndex)}}
                            onMouseLeave={() => setHoverCells([])}
                            key={cellIndex} 
                            style={styles} 
                            className='cell border border-gray d-flex align-items-center justify-content-center'>
                        </div>
                    }
                    )}
                </div>
            })}
        </div>
    )
}

export default DrawShipPlacementBoard