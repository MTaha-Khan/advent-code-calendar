import * as fs from 'fs/promises';
import * as fsy from 'fs';
import * as path from 'path';

export async function readLines(file: string, readEmptyLines: boolean = false) : Promise<string[]> {
    const lines: string[] = [];
    try {
        const data = await fs.readFile(path.join(__dirname, file), { encoding: 'utf8' });
        data.split(/\r?\n/).forEach(line =>  {
            if (line.trim() || readEmptyLines) lines.push(line);
        });
    } catch (err) {
        console.log(err);
    }
    return lines;
}

export async function readAll(file: string, readEmptyLines: boolean = false) : Promise<string> {
    try {
        return await fs.readFile(path.join(__dirname, file), { encoding: 'utf8' });
    } catch (err) {
        console.log(err);
        throw new Error(`Error : ${err}`)
    }
}


export function readAllSync(file: string, readEmptyLines: boolean = false) : string {
    try {
        return fsy.readFileSync(path.join(__dirname, file), { encoding: 'utf8' });
    } catch (err) {
        console.log(err);
        throw new Error(`Error : ${err}`)
    }
}
