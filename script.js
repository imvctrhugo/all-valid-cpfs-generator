const {
  Worker,
  isMainThread,
  parentPort,
  workerData,
} = require("worker_threads");
const fs = require("fs");

function CPFisValid(cpf) {
  // Remover todos os caracteres que não sejam dígitos
  cpf = cpf.replace(/[^\d]/g, "");

  // Verificar se o CPF tem 11 dígitos
  if (cpf.length !== 11) {
    return false;
  }

  // Verificar se todos os dígitos são iguais
  const digitosIguais = /^(\d)\1+$/g;
  if (digitosIguais.test(cpf)) {
    return false;
  }

  // Validar os dois dígitos verificadores
  const calcularDigito = (cpf, peso) => {
    let soma = 0;
    for (let i = 0; i < cpf.length; i++) {
      soma += parseInt(cpf.charAt(i)) * peso[i];
    }
    const resto = (soma * 10) % 11;
    return resto === 10 || resto === 11 ? 0 : resto;
  };

  const cpfSemDigitos = cpf.substring(0, 9);
  const digito1 = calcularDigito(cpfSemDigitos, [10, 9, 8, 7, 6, 5, 4, 3, 2]);
  const digito2 = calcularDigito(
    cpfSemDigitos + digito1,
    [11, 10, 9, 8, 7, 6, 5, 4, 3, 2]
  );

  // Verificar se os dígitos verificadores calculados são iguais aos do CPF
  if (cpf.charAt(9) == digito1 && cpf.charAt(10) == digito2) {
    return true;
  } else {
    return false;
  }
}

function generateCpfs(start, end) {
  let count = 0;
  for (let i = start; i <= end; i++) {
    count++;
    const cpf = i.toString().padStart(11, "0");
    if (CPFisValid(cpf)) fs.appendFileSync("cpfs.txt", `${cpf}\n`);
  }
  return count;
}

if (isMainThread) {
  const maxCpf = 99999999999;
  const threadCount = 4;
  const numbersPerThread = Math.floor(maxCpf / threadCount);

  const threads = [];
  let totalCount = 0;

  for (let i = 0; i < threadCount; i++) {
    const start = i * numbersPerThread;
    const end = i == threadCount - 1 ? maxCpf : start + numbersPerThread - 1;

    const worker = new Worker(__filename, {
      workerData: { start, end },
    });

    worker.on("message", (count) => {
      totalCount += count;
      if (threads.every((w) => w.isExited)) {
        console.log("Todos os CPFs válidos foram gerados.");
      }
    });

    threads.push(worker);
  }
} else {
  const { start, end } = workerData;
  const count = generateCpfs(start, end);
  parentPort.postMessage(count);
}
