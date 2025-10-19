const DrawComputerBoard = ({ boardObject, handleComputerBoardClick }) => {
    const board = boardObject.getBoard()

    return (
        <div>
            <div className=' d-flex flex-column align-items-center border border-primary'>
                {board.map((row, rowIndex) => {
                    return <div
                        key={rowIndex} 
                        style={{width: '40vw', maxWidth: '450px'}} 
                        className='d-flex flex-row border border-primary'>
                        {row.map((cell, cellIndex) => {
                            const styles = {flex: 1, aspectRatio: '1'}
                            
                            //muista poistaa alempi rivi!
                            if (board[rowIndex][cellIndex] !== 'o') styles.backgroundColor = 'blue'

                            return <div 
                                onClick={() => {handleComputerBoardClick(rowIndex, cellIndex)}}
                                key={cellIndex} 
                                style={styles} 
                                className='cell border border-primary d-flex align-items-center justify-content-center'>
                            </div>
                        })}
                    </div>
                })}
            </div>
        </div>
    )
} 

export default DrawComputerBoard