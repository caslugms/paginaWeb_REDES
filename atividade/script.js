document.addEventListener("DOMContentLoaded", function() {

    const botaoDeEnviar = document.getElementById("botaoEnviar");
    const caixaDeCodigo = document.getElementById("areaCodigo");
    const caixaDeResposta = document.getElementById("areaResposta");
    const seletorLinguagem = document.getElementById("linguagem");

    const entrada1 = document.getElementById("input1");
    const esperado1 = document.getElementById("output1");

    const entrada2 = document.getElementById("input2");
    const esperado2 = document.getElementById("output2");

    const entrada3 = document.getElementById("input3");
    const esperado3 = document.getElementById("output3");

    const URL_DO_PROFESSOR = "https://judge.darlon.com.br/submissions?base64_encoded=true&wait=true";

    function rodaUmTeste(codigoFonte, entrada, linguagemId) {
        const codigoBase64 = btoa(codigoFonte);
        const entradaBase64 = btoa(entrada);

        const pacoteDeDados = {
            source_code: codigoBase64,
            language_id: linguagemId,
            stdin: entradaBase64,
            base64_encoded: true,
            wait: true
        };

        return fetch(URL_DO_PROFESSOR, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(pacoteDeDados)
        }).then(response => response.json());
    }

    botaoDeEnviar.addEventListener("click", function() {
        const codigoFonte = caixaDeCodigo.value;
        const linguagemId = seletorLinguagem.value;

        const valorEntrada1 = entrada1.value;
        const valorEntrada2 = entrada2.value;
        const valorEntrada3 = entrada3.value;

        const valorEsperado1 = esperado1.value;
        const valorEsperado2 = esperado2.value;
        const valorEsperado3 = esperado3.value;

        const listaDeTestes = [
            rodaUmTeste(codigoFonte, valorEntrada1, linguagemId),
            rodaUmTeste(codigoFonte, valorEntrada2, linguagemId),
            rodaUmTeste(codigoFonte, valorEntrada3, linguagemId)
        ];

        Promise.all(listaDeTestes)
            .then(respostas => {
                let contadorDeAcertos = 0;
                let relatorioFinal = "";

                function verificarTeste(num, resposta, esperado) {
                    let saida = "";
                    if (resposta.stdout) saida = atob(resposta.stdout);
                    const taCerto = saida.trim() === esperado.trim();
                    if (taCerto) contadorDeAcertos++;
                    relatorioFinal += `Teste ${num}: ${taCerto ? "Correto" : "Incorreto"}\n`;
                    if (!taCerto) {
                        relatorioFinal += `  Esperado: '${esperado}'\n`;
                        relatorioFinal += `  Recebido: '${saida}'\n`;
                    }
                }

                verificarTeste(1, respostas[0], valorEsperado1);
                verificarTeste(2, respostas[1], valorEsperado2);
                verificarTeste(3, respostas[2], valorEsperado3);

                const porcentagem = (contadorDeAcertos / 3) * 100;
                relatorioFinal += "\n-----------------\n";
                relatorioFinal += "Resultado Final:\n";
                relatorioFinal += `${contadorDeAcertos} de 3 testes corretos.\n`;
                relatorioFinal += `Porcentagem: ${porcentagem.toFixed(2)}%`;

                caixaDeResposta.value = relatorioFinal;
            })
            .catch(error => {
                console.error("Deu erro:", error);
                caixaDeResposta.value = "Erro ao conectar ao servidor.";
            });
    });
});
