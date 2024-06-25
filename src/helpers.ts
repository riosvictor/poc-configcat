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