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

    if (!placaCarroUtils.isPlacaCarro(placa)) {
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

    veiculos_container.innerHTML = `
        <div class="btn_veiculo" onclick="openModal()">
                <div class="conteudo_adicionar">
                    <span class="plus">+</span>
                </div>

                <span class="adicionar">Adicionar</span>
            </div>
    `;

    if (veiculos && veiculos.length > 0) {
        veiculos.forEach(element => {
            veiculos_container.innerHTML += `
                <div class="btn_veiculo placa_veiculo" data-veiculo='${JSON.stringify(element)}' onclick='openModal(this)'>
                    <div class="header_veiculo">
                        <p>${element.marca} - ${element.modelo}</p>
                    </div>
                    <div class="info_veiculo">
                        <p>${element.placa}</p>
                    </div>
                </div>
            `;
        });
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
    if (!placaCarroUtils.isPlacaCarro(veiculo.placa)) {
        alert("Placa inválida");
        return;
    }

    const resultado = await veiculoService.atualizar(veiculo.id, veiculo);

    if (resultado) {
        console.log("Veículo atualizado com sucesso");
        listarVeiculos();
    } else {
        console.log("Erro ao atualizar veículo");
    }
}

window.openModal = function openModal(data) {
    if (data) {
        const veiculo = JSON.parse(data.dataset.veiculo);

        veiculo_id.value = veiculo.id;
        placa.value = veiculo.placa;
        modelo.value = veiculo.modelo;
        marca.value = veiculo.marca;
        porte.value = veiculo.porte;
        cor.value = veiculo.cor;
        ano.value = veiculo.ano;
    }

    const modal = document.getElementById("modal_container");
    modal.style.visibility = "visible";
    modal.style.opacity = "1";
    btn_excluir_veiculo.style.display = data ? "block" : "none";
    btn_excluir_veiculo.onclick = data ? function () { deletarVeiculo(veiculo_id.value); closeModal(); } : null;
}

window.closeModal = function closeModal() {
    const modal = document.getElementById("modal_container");
    modal.style.visibility = "hidden";
    modal.style.opacity = "0";
    veiculo_form.reset();
    veiculo_id.value = "";
}

function salvarModal() {
    if (veiculo_id.value) {
        const veiculo = {
            id: veiculo_id.value,
            placa: placa.value,
            modelo: modelo.value,
            marca: marca.value,
            porte: porte.value,
            cor: cor.value,
            ano: ano.value,
            clienteId: sessionStorage.getItem("clienteId")
        }
        atualizarVeiculo(veiculo);
    } else {
        cadastrar();
    }

    closeModal();
}

document.getElementById('veiculo_form').addEventListener('submit', function (e) {
    e.preventDefault();
    salvarModal();
});