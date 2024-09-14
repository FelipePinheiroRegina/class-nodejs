import fs from 'node:fs';
import { parse } from 'csv-parse';
import { fileURLToPath } from 'node:url';

// Converte a URL para um caminho de arquivo
const csvPath = fileURLToPath(new URL('csv.txt', import.meta.url));

const processFile = async () => {
  const records = [];
  const parser = fs
    .createReadStream(csvPath) // Usa o caminho convertido
    .pipe(parse({
      // CSV options if any
    }));
  for await (const record of parser) {
    // Work with each record
    records.push(record);
  }
  return records;
};

(async () => {
  const records = await processFile();
  //console.info(records);

  // Cria um buffer do conteúdo do CSV para enviar
  const csvBuffer = Buffer.from(records.map(record => record.join(',')).join('\n'));

  // Faz a requisição POST com o buffer
  fetch('http://localhost:3334', {
    method: 'POST',
    body: csvBuffer,
    headers: {
      'Content-Type': 'text/csv', // Ajuste o cabeçalho conforme necessário
      'Content-Length': csvBuffer.length
    }
  })
  .then(response => response.text())
  .then(data => {
    console.log(data);
  })
  .catch(err => {
    console.error('Request failed', err);
  });
})();
