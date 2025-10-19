const DrawBoard = ({boardObject, isComputerBoard, handleComputerBoardClick}) => {
    const board = boardObject.getBoard()

    //function that doesn't do anything
    //its just there so that onClick property isn't undefined
    const noop = () => {}

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
                            
                            //mystery constants!
                            switch (board[rowIndex][cellIndex]) {
                                case 'o':
                                    break
                                case 'm':
                                    styles.backgroundColor = 'red'
                                    break
                                case 'x':
                                    styles.backgroundColor = 'green'
                                    break
                                default:
                                    styles.backgroundColor = 'blue'
                                    break
                            }

                            return <div 
                                onClick={isComputerBoard ? () => {handleComputerBoardClick(rowIndex, cellIndex)} : noop}
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

export default DrawBoard