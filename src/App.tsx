import { useEffect, useState } from 'react';

import axios from 'axios';

import { Container, Row, Col, Button, Modal } from 'react-bootstrap';

import { Cards } from './components/Cards';
import { FormNotes } from './components/Forms/Notes';

import './App.css';
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css'

function App() {
    const [notes, setNotes] = useState<Note[]>([]);
    const [showNewNoteModal, setShowNewNoteModal] = useState(false);

    const handleShow = () => setShowNewNoteModal(true);
    const handleClose = () => setShowNewNoteModal(false);

    async function getNotes() {
        try {
            const { data } = await axios.get('http://localhost:8090/api/notes');

            setNotes(data.data);
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        getNotes();
    }, []);

    return (
        <div className="App">
            <Container className='d-flex justify-content-center mt-5'>
                <Col xs={8} lg={8}>
                    <Row className='gap-3 justify-content-center'>
                        <h1>Take-Notes</h1>
                        <div className='d-flex justify-content-end'><Button type='button' onClick={handleShow}>Nova Nota</Button></div>
                        <Cards notes={notes} setNotes={setNotes} />
                    </Row>
                </Col>
            </Container>
            <Modal show={showNewNoteModal} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Nova Nota</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <FormNotes notes={notes} setNotes={setNotes} closeModal={handleClose} />
                </Modal.Body>
                <Modal.Footer>
                    <Button variant='secondary' onClick={handleClose}>Close</Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default App;
