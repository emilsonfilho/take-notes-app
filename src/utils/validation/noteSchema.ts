import * as Yup from "yup";

export const noteSchema = Yup.object().shape({
    title: Yup.string(),
    content: Yup.string()
        .required('O texto de conteúdo é obrigatório.')
        .max(255, 'O texto não pode ultrapassar 255 caracteres.')
});
