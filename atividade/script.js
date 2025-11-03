document.addEventListener("DOMContentLoaded", function() {

    const botaoDeEnviar = document.getElementById("botaoEnviar");
    const caixaDeCodigo = document.getElementById("areaCodigo");
    const caixaDeResposta = document.getElementById("areaResposta");

    const entrada1 = document.getElementById("input1");
    const esperado1 = document.getElementById("output1");

    const entrada2 = document.getElementById("input2");
    const esperado2 = document.getElementById("output2");

    const entrada3 = document.getElementById("input3");
    const esperado3 = document.getElementById("output3");

    const URL_DO_PROFESSOR = "https://judge.darlon.com.br/submissions?base64_encoded=true&wait=true";

    function rodaUmTeste(codigoFonte, entrada) {
        const codigoBase64 = btoa(codigoFonte);
        const entradaBase64 = btoa(entrada);

        const pacoteDeDados = {
            source_code: codigoBase64,
            language_id: 71,
            stdin: entradaBase64,
            base64_encoded: true,
            wait: true
        };

        return fetch(URL_DO_PROFESSOR, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(pacoteDeDados)
        }).then(response => response.json());
    }

    botaoDeEnviar.addEventListener("click", function() {
        
        const codigoFonte = caixaDeCodigo.value;
        
        const valorEntrada1 = entrada1.value;
        const valorEntrada2 = entrada2.value;
        const valorEntrada3 = entrada3.value;

        const valorEsperado1 = esperado1.value;
        const valorEsperado2 = esperado2.value;
        const valorEsperado3 = esperado3.value;


        const listaDeTestes = [
            rodaUmTeste(codigoFonte, valorEntrada1),
            rodaUmTeste(codigoFonte, valorEntrada2),
            rodaUmTeste(codigoFonte, valorEntrada3)
        ];

        Promise.all(listaDeTestes)
            .then(respostas => {
                
                let contadorDeAcertos = 0;
                let relatorioFinal = "";


                let saida1 = "";
                if (respostas[0].stdout) {
                    saida1 = atob(respostas[0].stdout);
                }

                const taCerto1 = saida1.trim() === valorEsperado1.trim();
                if (taCerto1) contadorDeAcertos++;
                
                if (taCerto1) {
                    relatorioFinal += "Teste 1: Correto\n";
                } else {
                    relatorioFinal += "Teste 1: Incorreto\n";
                }
                
                if (!taCerto1) {
                    relatorioFinal += "  Esperado: '" + valorEsperado1 + "'\n";
                    relatorioFinal += "  Recebido: '" + saida1 + "'\n";
                }
                
                let saida2 = "";
                if (respostas[1].stdout) {
                    saida2 = atob(respostas[1].stdout);
                }

                const taCerto2 = saida2.trim() === valorEsperado2.trim();
                if (taCerto2) contadorDeAcertos++;

                if (taCerto2) {
                    relatorioFinal += "Teste 2: Correto\n";
                } else {
                    relatorioFinal += "Teste 2: Incorreto\n";
                }

                if (!taCerto2) {
                    relatorioFinal += "  Esperado: '" + valorEsperado2 + "'\n";
                    relatorioFinal += "  Recebido: '" + saida2 + "'\n";
                }

                let saida3 = "";
                if (respostas[2].stdout) {
                    saida3 = atob(respostas[2].stdout);
                }

                const taCerto3 = saida3.trim() === valorEsperado3.trim();
                if (taCerto3) contadorDeAcertos++;

                if (taCerto3) {
                    relatorioFinal += "Teste 3: Correto\n";
                } else {
                    relatorioFinal += "Teste 3: Incorreto\n";
                }

                if (!taCerto3) {
                    relatorioFinal += "  Esperado: '" + valorEsperado3 + "'\n";
                    relatorioFinal += "  Recebido: '" + saida3 + "'\n";
                }


                const porcentagem = (contadorDeAcertos / 3) * 100;
                relatorioFinal += "\n-----------------\n";
                relatorioFinal += "Resultado Final:\n";
                relatorioFinal += contadorDeAcertos + " de 3 testes corretos.\n";
                relatorioFinal += "Porcentagem: " + porcentagem.toFixed(2) + "%"; 

                caixaDeResposta.value = relatorioFinal;

            })
            .catch(error => {
                console.error("Deu erro:", error);
                caixaDeResposta.value = "Erro ao ligar no servidor.";
            });
    });
});