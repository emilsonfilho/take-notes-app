import { Dispatch, SetStateAction } from "react";

import axios from "axios";
import { useFormik } from "formik";
import swal from "sweetalert";

import { Button, FloatingLabel, Form } from "react-bootstrap";

import { notesInitalValues } from "../../../utils/initialValues/note";
import { noteSchema } from "../../../utils/validation/noteSchema";

type Props = {
    notes: Note[];
    setNotes: Dispatch<SetStateAction<Note[]>>
    data?: Note;
    isUpdate?: boolean;
    closeModal: () => void;
}

export function FormNotes({ notes, setNotes, data, isUpdate = false, closeModal }: Props) {
    const formik = useFormik({
        initialValues: data || notesInitalValues,
        validationSchema: noteSchema,
        onSubmit: (values) => {
            try {
                if (isUpdate) {
                    updateNote(data?.id, values);
                } else {
                    postNote(values);
                }

                closeModal()

            } catch (error) {
                console.error(error);
            }
        }
    });

    function showSwal() {
        return swal({
            title: 'Deu certo!',
            icon: 'success',
            buttons: [false, true]
        })
    }

    async function postNote(values: Note) {
        const response = await axios.post('http://localhost:8090/api/notes', values);

        if (response.status === 201) {
            setNotes([...notes, {
                id: response.data.data.id,
                title: response.data.data.title,
                content: response.data.data.content
            }]);
            showSwal()
        }
    }

    async function updateNote(id: number | undefined, values: Note) {
        const response = await axios.put(`http://localhost:8090/api/notes/${id}`, values);

        if (response.status === 200) {
            setNotes(notes.filter(note => note.id != id).concat(response.data.data))
            showSwal()
        }
    }

    return (
        <Form onSubmit={formik.handleSubmit}>
            <Form.Group
                className='mb-3'
            >
                <Form.Control
                    type='text'
                    placeholder='Título da nota'
                    name='title'
                    onChange={formik.handleChange}
                    value={formik.values.title}
                />
            </Form.Group>
            <FloatingLabel
                controlId="floatingTextarea"
                label="Conteúdo"
                className='mb-3'
            >
                <Form.Control as="textarea" placeholder='Diga o conteúdo da nota' required name='content' onChange={formik.handleChange} value={formik.values.content} />
            </FloatingLabel>
            <div className="d-flex justify-content-end">
                <Button type='submit'>Enviar</Button>
            </div>
        </Form>
    )
}
