import { readLines } from "../helper";

const steps: string[] = [];

type lenses = { label: string, focal: number }[];
const boxes: lenses[] = [];

export async function part1() {
    await extractData();    
    let total = 0;
    let idx = 1;
    for (const s of steps) {
        const arr = hash(s);
        //console.log(idx++, s, arr);
        total += arr;
    }
   
    console.log(" Sum of hashes: ", total);
}

export async function part2() {
    await extractData();       
    initialiseBoxes();

    let idx = 1;
    for (const s of steps) {
        const p = process(s);
        const a = hash(p.label);
        if (a < 0 || a >= 256) throw new Error(`index out of bounds for boxes ${a}`);
        if(p.op === "=") addBox(a, p.label, p.focal);
        if(p.op === "-") removeBox(a, p.label);
        
        //console.log(idx++, s, p.label, p.op, p.focal, a);
        //printBoxes();
    }
    // console.log(); console.log(); printBoxes();
   
    console.log(" Sum of hashes: ", calculateBoxes());

}

function addBox(box: number, label: string, focal: number) { 
    let idx = 0;
    let found = false;
    for (const b of boxes[box])
    {
        if (b.label === label) {
            found = true;
            break;
        }
        idx++;
    }
    if (found) boxes[box][idx].focal = focal;
    else boxes[box].push({ label, focal });
}

function removeBox(box: number, label: string) { 
    let idx = 0;
    let found = false;
    for (const b of boxes[box])
    {
        if (b.label === label) {
            found = true;
            break;
        }
        idx++;
    }
    if (found) boxes[box].splice(idx, 1);
}

function initialiseBoxes() { for (let i = 0; i < 256; i++) boxes[i] = []; }

function printBoxes() { 
    for (let i = 0; i < 256; i++) {
        if (boxes[i].length > 0)
        {
            for (const b of boxes[i]) console.log(`Box ${i + 1} ${b.label} : ${b.focal}`) 
        }        
    }
}

function process(str: string): { label: string, op: "=" | "-", focal: number } {
    
    if (str.indexOf("=") > 0) {
        const splits = str.split("=");
        return { label: splits[0], op: "=", focal: +splits[1] };
    } else if (str.endsWith("-")) {
        return { label: str.substring(0, str.length - 1), op: "-", focal: 0 };
    }

    throw new Error(`label not in correct format ${str}`);
}

function calculateBoxes(): number { 
    let total = 0;
    for (let i = 0; i < 256; i++) {
        let box = i + 1;
        let idx = 1;
        for (const l of boxes[i]) {
            total += (box * idx * l.focal);
            idx++;
        }
    }
    return total;
}

function hash(str: string): number {
    let val = 0;
    for (const c of [...str]) {
        val += c.charCodeAt(0);
        val *= 17;
        val %= 256;        
    }
    return val;
}


async function extractData() {
    const lines = await readLines('../input/input15.txt'); // sampleInput.split('\n'); // 
    for (const line of lines) {
        const splits = line.split(',');
        for (const s of splits) steps.push(s);
    }    

    console.log(steps.length);
}

const sampleInput: string = "rn=1,cm-,qp=3,cm=2,qp-,pc=4,ot=9,ab=5,pc-,pc=6,ot=7";
