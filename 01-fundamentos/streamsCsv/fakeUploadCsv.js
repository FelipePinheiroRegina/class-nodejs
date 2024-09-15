import fs from 'node:fs';
import { parse } from 'csv-parse';
import { fileURLToPath } from 'node:url'

// Converte a URL para um caminho de arquivo
const csvPath = fileURLToPath(new URL('csv.txt', import.meta.url));

const processFile = async () => {
  const parser = fs
    .createReadStream(csvPath) // Usa o caminho convertido
    .pipe(parse({
      
    }));
  
  const records = [];
  for await (const record of parser) {
    records.push(
      { title: record[0].trim(),
        description: record[1].trim()
      }
    );
  }

  records.shift()
  return records;
};

const sendLine = async (line) => {
  // Converte a linha para um objeto JSON. Ajuste a conversão conforme necessário.
  const jsonLine = JSON.stringify({ data: line });
  
  try {
    const response = await fetch('http://localhost:3334', {
      method: 'POST',
      body: jsonLine,
      headers: {
        'Content-Type': 'application/json', // Tipo de conteúdo JSON
        'Content-Length': Buffer.byteLength(jsonLine) // Comprimento do conteúdo JSON
      }
    });
    
    const responseText = await response.text();
    console.log(`${responseText}`);
  } catch (err) {
    console.error(`Request failed for line`);
  }
};

(async () => {
  const records = await processFile();
  
  await sendLine(records);
  
})();
