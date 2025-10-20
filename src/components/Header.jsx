import { Button } from 'react-bootstrap'

const Header = () => {
    const buttonStyle = {border: 'none', marginLeft: '5px', borderRadius: '7px', width: '70px', height: '30px', color: 'white', backgroundColor: 'grey'}

    return (
        <div style={{minHeight: '50px'}} className=' d-flex align-items-center text-white bg-dark'>
            <button style={buttonStyle}>Info</button>
        </div>
    )
} 

export default Header