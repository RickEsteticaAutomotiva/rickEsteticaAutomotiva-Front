import * as veiculoService from "./services/veiculoService.js";
import { placaCarroUtils } from "./utils/index.js";

window.cadastrar = async function cadastrar() {
    const placa = document.getElementById("placa").value;
    const modelo = document.getElementById("modelo").value;
    const marca = document.getElementById("marca").value;
    const porte = document.getElementById("porte").value;
    const cor = document.getElementById("cor").value;
    const ano = document.getElementById("ano").value;
    const clienteId = sessionStorage.getItem("clienteId");

    if (!placaCarroUtils.validarPlaca(placa)) {
        console.log("Placa inválida");
        return;
    }

    const veiculo = { placa, modelo, marca, porte, cor, ano, clienteId };
    const resultado = await veiculoService.cadastrar(veiculo);

    if (resultado) {
        console.log("Veículo cadastrado com sucesso");
    } else {
        console.log("Erro ao cadastrar veículo");
    }
}

window.listarVeiculos = async function listarVeiculos() {
    const clienteId = sessionStorage.getItem("clienteId");
    const veiculos = await veiculoService.listarByCliente(clienteId);

    if (veiculos && veiculos.length > 0) {
        console.log("Veículos encontrados:", veiculos);
    } else {
        console.log("Nenhum veículo encontrado");
    }
}