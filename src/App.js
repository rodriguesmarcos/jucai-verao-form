import React, { useState } from "react";
import InputMask from "react-input-mask";
import { Form, Input } from "@rocketseat/unform";
import * as Yup from "yup";

import api from "./services/api";

import "./App.css";

const schema = Yup.object().shape({
  name: Yup.string()
    .required("Nome é obrigatório")
    .min(3, "Nome muito curto"),
  email: Yup.string()
    .email("Digite um email válido")
    .required("Email é obrigatório"),
  phone: Yup.string()
    .matches(/(\(\d{2}\)\s)?(\d{4,5}\-\d{4})/, "Telefone inválido")
    .required("Telefone é obrigatório")
});

function App() {
  const [name, updateName] = useState("");
  const [phone, updatePhone] = useState("");
  const [phoneMask, setPhoneMask] = useState("(99) 9999-9999?");
  const [apiError, updateApiError] = useState("");
  const [apiSuccess, updateApiSuccess] = useState("");

  async function handleSubmit(data) {
    updateName(data.name);
    updateApiError("");

    try {
      const response = await api.post("/leads", data);

      updateApiSuccess(true);
    } catch (e) {
      updateApiError(e.response.data.error);
    }
  }

  return (
    <div className="App">
      {!!!apiSuccess && (
        <>
          {!!apiError && <span className="error">{apiError}</span>}
          <Form schema={schema} onSubmit={handleSubmit}>
            <Input name="name" type="text" placeholder="Nome" />
            <Input name="email" type="email" placeholder="Email" />
            <InputMask
              formatChars={{ "9": "[0-9]", "?": "[0-9 ]" }}
              mask={phoneMask}
              maskChar={null}
              value={phone}
              onChange={e => {
                if (15 === e.target.value.length) {
                  setPhoneMask("(99) 99999-9999");
                } else {
                  setPhoneMask("(99) 9999-9999?");
                }
                return updatePhone(e.target.value);
              }}
            >
              {() => <Input name="phone" type="text" placeholder="Telefone" />}
            </InputMask>

            <button type="submit">Cadastrar</button>
          </Form>
        </>
      )}

      {!!apiSuccess && (
        <div className="hi">
          <p>
            {name}, muito obrigado por se cadastrar. <br />
            Em breve você receberá um e-mail.
          </p>
        </div>
      )}
    </div>
  );
}

export default App;
