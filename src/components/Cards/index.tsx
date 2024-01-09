import { Dispatch, SetStateAction, useState } from "react";

import axios from "axios";
import swal from "sweetalert";

import { Button, Card, Modal } from "react-bootstrap";

import { FormNotes } from "../Forms/Notes";

type Props = {
    notes: Note[];
    setNotes: Dispatch<SetStateAction<Note[]>>,
}

export function Cards({ notes, setNotes }: Props) {
    const [showEditModal, setShowEditModal] = useState(false);

    const handleShow = () => setShowEditModal(true);
    const handleClose = () => setShowEditModal(false);

    const [note, setNote] = useState<Note>({} as Note);

    async function deleteNote(id: number) {
        try {
            const response = await axios.delete(`http://localhost:8090/api/notes/${id}`);

            if (response.status === 204) {
                swal({
                    icon: 'success',
                    title: 'Deletado com sucesso!',
                    buttons: [false, true]
                })
            }
        } catch (error) {
            console.error(error)
        }
    }

    function sweetRemove(id: number) {
        swal({
            title: 'Você tem certeza?',
            icon: 'warning',
            buttons: [true, true],
            dangerMode: true,
        }).then(async willDelete => {
            if (willDelete) {
                deleteNote(id)

                setNotes(notes.filter(note => note.id != id));
            }
        })
    }

    function clickEditButton(id: number) {
        handleShow()
        setNote(notes.filter(note => note.id == id)[0])
    }

    return (
        <>
            {notes.length > 0 ? (
                notes.map(note => (
                    <Card className="d-flex text-start col-lg-3" key={note.id}>
                        <Card.Body>
                            {note.title && (<Card.Title>{note.title}</Card.Title>)}
                            <Card.Text>
                                {note.content}
                            </Card.Text>
                            <div className="d-flex">
                                <Card.Link><Button type="button" variant="success" onClick={() => clickEditButton(note.id)}>Editar</Button></Card.Link>
                                <Card.Link><Button type="button" variant="danger" onClick={() => sweetRemove(note.id)}>Remover</Button></Card.Link>
                            </div>
                        </Card.Body>
                    </Card>
                ))
            ) : (
                <p>Não há notas disponíveis</p>
            )}
            <Modal show={showEditModal} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Editar Nota</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <FormNotes notes={notes} setNotes={setNotes} data={note} isUpdate closeModal={handleClose} />
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>Close</Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}
