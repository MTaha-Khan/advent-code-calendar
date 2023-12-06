import * as fs from 'fs/promises';
import * as path from 'path';

export async function readLines(file: string) : Promise<string[]> {
    const lines: string[] = [];
    try {
        const data = await fs.readFile(path.join(__dirname, file), { encoding: 'utf8' });
        data.split(/\r?\n/).forEach(line =>  {
            if (line.trim()) lines.push(line);
        });
    } catch (err) {
        console.log(err);
    }
    return lines;
}