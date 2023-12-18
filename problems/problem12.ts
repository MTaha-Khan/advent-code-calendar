import { readLines } from "../helper";

const groups: {line: string, counts: number[]}[] = [];

export async function part1() {
    await extractData();    
    let total = 0;
    let idx = 1;
    for (const g of groups) {
        const arr = countA(g.line, g.counts);       
        total += arr;
        // console.log(idx++, g, arr);
    }
   
    console.log(" Total arrangements possible: ", total);
}

export async function part2() {
    await extractData(5);    
    let total = 0;
    let idx = 1;
    for (const g of groups) {
        const arr = countA(g.line, g.counts);
        total += arr;
        console.log(idx++, g.line, arr, total);        
    }
   
    console.log(" Total arrangements possible: ", total);
}

// calculate and count arrangements for groups
function countA(line: string, counts: number[]): number {
    let arrangements = 0;

    const uidx = line.indexOf('?');
    if (uidx === -1) {
        const newCombos = line.split('.').filter(n => n).map(n => n.length);
        if (compare(newCombos, counts)) return 1;
        return 0;
    }
    else 
    {        
        const knownl = line.substring(0, uidx);
        
        const newCombos = knownl.split('.').filter(n => n).map(n => n.length);
        if (newCombos.length > 0 && knownl.length > 2) {
            for (let i = 0; i < newCombos.length; i++) {
                if (i === newCombos.length - 1) { 
                    if (newCombos[i] > counts[i]) return 0;
                } else if (newCombos[i] !== counts[i]) return 0;
            }
        }
    
        arrangements += countA(knownl + '.' + line.substring(uidx + 1), counts);
        arrangements += countA(knownl + '#' + line.substring(uidx + 1), counts);
    }    
    return arrangements;
}

async function extractData(stuff: number = 1) {
    const lines = await readLines('../input/input12.txt'); // sampleInput.split('\n')  // 
    for (const line of lines) {
        const splits = line.split(' ');
        let lineStr = splits[0];
        let countStr = splits[1];
        if (stuff > 1) {
           lineStr = Array(stuff).fill(lineStr).join('?');
           countStr = Array(stuff).fill(countStr).join(',');
        }
        const counts = countStr.split(',').map(n => +n);
        groups.push({ line: lineStr, counts });
    }    
}

const sampleInput = `???.### 1,1,3
.??..??...?##. 1,1,3
?#?#?#?#?#?#?#? 1,3,1,6
????.#...#... 4,1,1
????.######..#####. 1,6,5
?###???????? 3,2,1`;

function compare(a: number[], b: number[]): boolean {
    return a.length === b.length && a.every((element, index) => element === b[index]);
}


