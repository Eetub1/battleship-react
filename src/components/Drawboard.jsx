const DrawBoard = ({ board }) => {
    return (
        <div className='border border-primary'>
            {board.map(row => {
                return <div className='d-flex flex-row'>
                    {row.map(cell => {
                        return <div>{cell}</div>
                    })}
                </div>
            })}
        </div>
    )
} 

export default DrawBoard