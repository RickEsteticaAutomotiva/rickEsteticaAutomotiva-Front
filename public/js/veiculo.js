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
        listarVeiculos();
    } else {
        console.log("Erro ao cadastrar veículo");
    }
}

window.listarVeiculos = async function listarVeiculos() {
    const clienteId = sessionStorage.getItem("clienteId");
    const veiculos = await veiculoService.listarByCliente(clienteId);

    if (veiculos && veiculos.length > 0) {
        veiculosList.innerHTML = veiculos.map(veiculo => {
            return `Veículo: ${veiculo.placa}, Modelo: ${veiculo.modelo}, Marca: ${veiculo.marca}, Porte: ${veiculo.porte}, Cor: ${veiculo.cor}, Ano: ${veiculo.ano} <button onclick="deletarVeiculo(${veiculo.id})">Deletar</button>`;
        }).join("<br>");

    } else {
        veiculosList.innerHTML = "Nenhum veículo encontrado";
    }
}

window.deletarVeiculo = async function deletarVeiculo(veiculoId) {
    const resultado = await veiculoService.deletar(veiculoId);

    if (resultado) {
        console.log("Veículo deletado com sucesso");
        listarVeiculos();
    } else {
        console.log("Erro ao deletar veículo");
    }
}

window.atualizarVeiculo = async function atualizarVeiculo(veiculo) {
    const resultado = await veiculoService.atualizar(veiculo.id, veiculo);

    if (resultado) {
        console.log("Veículo atualizado com sucesso");
        listarVeiculos();
    } else {
        console.log("Erro ao atualizar veículo");
    }
}