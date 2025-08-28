import * as authService from "./services/authService.js";
import { cpfUtils, telefoneUtils } from "./utils/index.js";

window.handleCadastrar = async function handleCadastrar() {
    const nome = document.getElementById("input_nome").value;
    const cpf = document.getElementById("input_cpf").value;
    const email = document.getElementById("input_email").value;
    const telefone = document.getElementById("input_telefone").value;
    const senha = document.getElementById("input_senha").value;

    if (validarCampos()) {
        const result = await authService.cadastrar(nome, cpf, email, telefone, senha);

        if (result) {
            input_email.style.borderColor = "green";
            input_senha.style.borderColor = "green";

            setTimeout(() => {
                window.location.href = "/login";
            }, 1000);
        } else {
            input_email.style.borderColor = "red";
            input_senha.style.borderColor = "red";
        }
    } else {
        input_email.style.borderColor = "red";
        input_senha.style.borderColor = "red";
    }
}

window.validarCampos = function validarCampos() {
    const nome = document.getElementById("input_nome").value;
    const cpf = document.getElementById("input_cpf").value;
    const email = document.getElementById("input_email").value;
    const telefone = document.getElementById("input_telefone").value;
    const senha = document.getElementById("input_senha").value;
    const senhaRepetir = document.getElementById("input_senhaRepetir").value;

    document.getElementById("input_nome").style.borderColor = "";
    document.getElementById("input_cpf").style.borderColor = "";
    document.getElementById("input_email").style.borderColor = "";
    document.getElementById("input_telefone").style.borderColor = "";
    document.getElementById("input_senha").style.borderColor = "";

    if (!nome) {
        document.getElementById("input_nome").style.borderColor = "red";
        return false;
    }

    if (!cpf || !cpfUtils.validaCpf(cpf)) {
        document.getElementById("input_cpf").style.borderColor = "red";
        return false;
    }

    if (!email) {
        document.getElementById("input_email").style.borderColor = "red";
        return false;
    }

    if (!telefone || !telefoneUtils.isTelefone(telefone)) {
        document.getElementById("input_telefone").style.borderColor = "red";
        return false;
    }

    if (!senha) {
        document.getElementById("input_senha").style.borderColor = "red";
        return false;
    }

    if (senha !== senhaRepetir) {
        document.getElementById("input_senha").style.borderColor = "red";
        document.getElementById("input_senhaRepetir").style.borderColor = "red";
        return false;
    }

    return true;
}