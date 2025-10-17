const DrawBoard = ({ board }) => {
    return (
        <div>
            {board.map(row => {
                return <div>
                    {row.map(cell => {
                        return <div>{cell}</div>
                    })}
                </div>
            })}
        </div>
    )
} 

export default DrawBoard