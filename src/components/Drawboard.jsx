const DrawBoard = ({ board }) => {
    return (
        <div className=' d-flex flex-column align-items-center border border-primary'>
            {board.map((row, rowIndex) => {
                return <div
                    key={rowIndex} 
                    style={{width: '80vw', maxWidth: '600px'}} 
                    className='d-flex flex-row border border-primary'>
                    {row.map((cell, cellIndex) => {
                        return <div 
                            key={cellIndex} 
                            style={{flex: 1, aspectRatio: '1'}} 
                            className='cell border border-primary d-flex align-items-center justify-content-center'>{cell}</div>
                    })}
                </div>
            })}
        </div>
    )
} 

export default DrawBoard