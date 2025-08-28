export function validaCpf(cpf) {
    if (!isCpf(cpf)) return false;

    var cpfLimpo = cpf.replace(/[^\d]+/g, '');
    var cpfBase = cpfLimpo.slice(0,9);

    const calcularDigito = () => {
        var arrayNumeros = Array.from(cpfBase).map(numero => parseInt(numero));

        var cpfMultiplicado = arrayNumeros.map((numero, index) => {
            if (arrayNumeros.length == 9) return numero * (index + 1);

            return numero * index;
        });

        var somaCpf = cpfMultiplicado.reduce((acc, num) => acc + num, 0);

        var digitoVerificador = somaCpf % 11;
        if (digitoVerificador == 10) digitoVerificador = 0;

        return digitoVerificador;
    }

    const digitoVerificador1 = calcularDigito();
    cpfBase += digitoVerificador1.toString();
    
    const digitoVerificador2 = calcularDigito();
    cpfBase += digitoVerificador2.toString();

    return cpfBase === cpfLimpo;
}

export function isCpf(cpf) {
    if (!cpf) return false;

    const regexCpf = /^(\d{11}|\d{3}\.\d{3}\.\d{3}\-\d{2})$/;
    return regexCpf.test(cpf);
}

export function formatarCpf(cpf) {
    if (!validaCpf(cpf)) return false;

    var cpfLimpo = cpf.replace(/[^\d]+/g, '');

    if (cpf !== cpfLimpo) return cpfLimpo;

    return cpfLimpo.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
}