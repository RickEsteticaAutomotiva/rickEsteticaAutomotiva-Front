import { cadastrar } from "./services/authService.js";

window.handleCadastrar = async function handleCadastrar() {
    const email = input_email.value;
    const senha = input_senha.value;

    if (email && senha) {
        const result = await cadastrar(email, senha);

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
