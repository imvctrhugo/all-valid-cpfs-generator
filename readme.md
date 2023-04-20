# Gerando todos os CPFs válidos e os salvando em um .txt
Este script faz uma contagem de 00000000000 à 99999999999, validando entre cada iteração se o CPF é valido.
Caso o CPF seja válido, seu número é armazenado em cpfs.txt.
A contagem é feita em multithread, onde cada thread fica responsável por um range de CPF para gerar e validar.

# Desempenho
Rodando em um i3-9100f, o script foi capaz de gerar cerca de 9000 CPFs válidos por segundo.
Ainda assim, para percorrer todos os possíveis 99999999999 CPFs, a uma média de 9000CPF/s, o script levaria 129 dias para finalizar sua tarefa.