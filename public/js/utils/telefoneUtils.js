export function formatarTelefone(telefone) {
    if (!isTelefone(telefone)) return false;

    var telefoneLimpo = telefone.replace(/[^\d]+/g, '');

    if (telefone !== telefoneLimpo) return telefoneLimpo;

    switch (telefoneLimpo.length) {
        case 13:
            return telefoneLimpo.replace(/(\d{2})(\d{2})(\d{5})(\d{4})/, '+$1 ($2) $3-$4');
        case 11:
            return telefoneLimpo.replace(/(\d{2})(\d{5})(\d{4})/, '+55 ($1) $2-$3');
        case 9:
            return telefoneLimpo.replace(/(\d{5})(\d{4})/, '+55 (11) $1-$2');
    }
}

export function isTelefone(telefone) {
    if (!telefone) return false;

    const regexTelefone = /^([+]?\d{2}?\s)?(\(?\d{2}\)?\s)?(\d{5,9})([-\s])?(\d{4})$/;
    return regexTelefone.test(telefone);
}