import { Card } from 'react-bootstrap'

const Footer = () => {
    return (
        <Card className='footer'>
            <Card.Body>
                <Card.Text className='d-flex justify-content-center'>
                    <a href="https://github.com/Eetub1/battleship-react">Project repository</a>
                </Card.Text>
            </Card.Body>
        </Card>
    )
}

export default Footer