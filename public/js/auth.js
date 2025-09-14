validaSessao();

function validaSessao() {
    const sessao = sessionStorage.getItem('clienteId');

    if (!sessao) {
        window.location.href = '/login';
    }
}

function logout() {
    sessionStorage.removeItem('clienteId');

    window.location.href = '/login';
}