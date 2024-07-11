import fs from 'fs';
import { Parser } from 'json2csv';

export const saveLogs = (filename:string, data: any) => {
  fs.writeFileSync(`${filename}.json`, JSON.stringify(data, null, 2));
}

export const readLogs = (filename: string) => {
  if (!fs.existsSync(`${filename}.json`)) return null;
  
  const data = fs.readFileSync(`${filename}.json`, 'utf8');
  return JSON.parse(data);
}

export const convertToCSV = (data: any, filename: string, fields?: any[]) => {
  const json2CsvParser = new Parser({ fields });
  const csv = json2CsvParser.parse(data);
  fs.writeFileSync(`${filename}.csv`, csv);
}

export const readCsvToJson = (filename: string) => {
  if (!fs.existsSync(`${filename}.csv`)) return null;

  const data = fs.readFileSync(`${filename}.csv`, 'utf8');
  return convertCsvToJson(data);
}

export const convertCsvToJson = (data: string, withHeaders = true) => {
  const lines = data.toString().split('\r');
  const result = [];
  const headers = withHeaders ? lines[0].split(',').map(h => h?.trim()) : [];

  let index = withHeaders ? 1 : 0;
  for (; index < lines.length; index++) {
    const obj: any = {};
    const currentLine = lines[index].split(',');

    headers.forEach((header, i) => {
      obj[header] = currentLine[i]?.trim();
    });

    result.push(obj);
  }

  return result;
}