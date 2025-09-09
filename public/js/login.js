import { login } from "./services/authService.js"

window.handleLogin = async function handleLogin() {
    const email = input_email.value;
    const senha = input_senha.value;

    if (email && senha) {
        const result = await login(email, senha);

        console.log(result);

        if (result != undefined) {
            input_email.style.borderColor = "green";
            input_senha.style.borderColor = "green";

            sessionStorage.setItem("clienteId", result.id);

            setTimeout(() => {
                window.location.href = "/";
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

window.teste = function teste() {
    console.log("teste");
}