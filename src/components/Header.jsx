import { Modal, Button } from 'react-bootstrap'
import { useState } from 'react'

const Header = () => {
    const [show, setShow] = useState(false)
    const handleShow = () => {setShow(true)}
    const handleClose = () => {setShow(false)}

    return (
        <div style={{minHeight: '70px'}} className='d-flex align-items-center text-white bg-dark'>
            <Button className='ms-2' variant='secondary' onClick={handleShow}>Info</Button>

            <Modal
                show={show}
                onHide={handleClose}
                centered
                animation={true}
                dialogClassName="info-modal">

                <Modal.Header closeButton>
                    <Modal.Title>Game Rules</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <h5>How to Play</h5>
                    <ul>
                        <li>Place your ships on the board</li>
                        <li>Try to predict where the enemy ships are located</li>
                        <li>First to eliminate their enemy's ships wins!</li>
                    </ul>
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                </Modal.Footer>

            </Modal>
        </div>

        
    )
} 

export default Header