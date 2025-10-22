import constants from "../utils/constants"
const CONSTANTS = constants()

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
                        className='d-flex flex-row'>
                        {row.map((cell, cellIndex) => {
                            const styles = {flex: 1, aspectRatio: '1'}
                            
                            switch (board[rowIndex][cellIndex]) {
                                case CONSTANTS.EMPTY:
                                    break
                                case CONSTANTS.MISS:
                                    styles.backgroundColor = 'rgba(184, 38, 38, 1)'
                                    break
                                case CONSTANTS.HIT:
                                    styles.backgroundColor = 'rgba(8, 124, 47, 1)'
                                    break
                                default:
                                    styles.backgroundColor = 'white'
                                    break
                            }

                            return <div 
                                onClick={isComputerBoard ? () => {handleComputerBoardClick(rowIndex, cellIndex)} : noop}
                                key={cellIndex} 
                                style={styles} 
                                className='cell border border-gray d-flex align-items-center justify-content-center'>
                            </div>
                        })}
                    </div>
                })}
            </div>
        </div>
    )
}

export default DrawBoard