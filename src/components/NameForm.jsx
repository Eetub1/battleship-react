import { Form, Button } from 'react-bootstrap'

const NameForm = ({ setPlayerName, setGamePhase }) => {
    const handleSubmit = event => {
        event.preventDefault()
        setPlayerName(event.target.p1name.value)
        setGamePhase('placePhase')
    }

    return (
        <Form className='d-flex flex-column align-items-center mt-5' onSubmit={handleSubmit}>
            <Form.Group className="d-flex flex-column align-items-center mb-3" controlId="p1name">
                <Form.Control style={{maxWidth: '20rem'}} name="p1name" type="text" placeholder="Enter your name" />
            </Form.Group>

            <Button style={{maxWidth: '5rem'}} variant="primary" type="submit">
            Submit
            </Button>
        </Form>
    )
}

export default NameForm