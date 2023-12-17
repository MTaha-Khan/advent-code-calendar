import { readLines } from "../helper";
import { Queue } from "../lib/structures";

const map: number[][] = [];

type dir = "N" | "W" | "E" | "S";

let paths: Queue<Path> = new Queue();

const nodeScores: { [ key: number ]: number } = {};
const complete: Path[] = [];

const startNode: number = 0;
let endNode: number = 0;

class Path 
{
    //public visited: { [position: number] : number } = {};
    public visited: number[] = [];
    public direction: dir = "E";
    public dirCount = 1;
    public current: number = 0;
    public total: number = 0;

    constructor(curr: number, newDir: dir, path: Path | null = null) {
        this.current = curr;
        this.direction = newDir;
        if (path !== null) {
            //this.visited = Object.assign({}, path.visited);
            this.visited = [...path.visited];
            if(this.direction === path.direction) this.dirCount = path.dirCount + 1;
            this.total = path.total;
        }
        this.total += this.current === startNode ? 0 : getScore(curr);
        //this.visited[this.current] = this.total;
        this.visited.push(this.current);
    }

    public exists(num: number): boolean {
        //return this.visited[num] != null;
        return this.visited.includes(num);
    }
}

export async function part1() {
    await extractData();    
    endNode = convertXY(map.length - 1, map.length - 1);
    console.log("end node ", endNode);
    findCompletePaths();

    console.log("complete paths found ", complete.length);

    for (const p of complete) console.log(p.total, p.visited);


   
}

export async function part2() {
    await extractData();    

}

function findCompletePaths() {
    
    paths.enqueue(new Path(startNode, "E"));
    let path = null;

    while (paths.size > 0) {
        
        path = paths.dequeue();
        if (path) {
            if (path.current === endNode) complete.push(path);
            else
            {
                const node = path.current;
                const xy = getXY(node);

                switch (path.direction) {
                    case "E":
                        if (path.dirCount < 3 && xy.x < map.length - 1) tryAddPath(node + 1, "E", path);
                        if (xy.y > 0) tryAddPath(node - map.length, "N", path); 
                        if (xy.y < map.length - 1) tryAddPath(node + map.length, "S", path); 
                        break;
                    case "W":
                        if (path.dirCount < 3 && xy.x > 0) tryAddPath(node - 1, "W", path);
                        if (xy.y > 0) tryAddPath(node - map.length, "N", path); 
                        if (xy.y < map.length - 1) tryAddPath(node + map.length, "S", path); 
                        break;
                    case "S":
                        if (path.dirCount < 3 && xy.y < map.length - 1) tryAddPath(node + map.length, "S", path); 
                        if (xy.x > 0) tryAddPath(node - 1, "W", path);
                        if (xy.x < map.length - 1) tryAddPath(node + 1, "E", path);
                        break;
                    case "N":
                        if (path.dirCount < 3 && xy.y > 0) tryAddPath(node - map.length, "N", path); 
                        if (xy.x > 0) tryAddPath(node - 1, "W", path);
                        if (xy.x < map.length - 1) tryAddPath(node + 1, "E", path);
                        break;
                    default:
                        throw new Error(`direction not correct ${path.direction}`)
                }
                
            }
        }
    }
}

function tryAddPath(num: number, nd: dir, oldPath: Path) {
    const newTotal = oldPath.total + getScore(num);
    //if (num === 17) console.log(newTotal, nodeScores[num])
    if (nodeScores[num] == null || nodeScores[num] > newTotal) {
        // remove all other paths with coordinate num
        const pathsArray  = [...paths.toArray()];
        paths = new Queue();
        for (const p of pathsArray) {
            if (!p.exists(num)) paths.enqueue(p);
        } 

        if (!oldPath.exists(num)) paths.enqueue(new Path(num, nd, oldPath));
        nodeScores[num] = newTotal;
    } else {
        // console.log(num, nodeScores[num], oldPath.total + getScore(num));     
    }
}

function convertXY(x: number, y: number): number {
    return (y * map.length) + x;
}

function getXY(num: number): { x: number, y: number } {
    return { x: (num % map.length), y:  Math.floor(num / map.length) };
}

function getScore(num: number): number {
    const xy = getXY(num);
    return map[xy.y][xy.x];
}

async function extractData() {
    const lines = mapString.split('\n') // await readLines('../input/input17.txt'); // 
    for (const line of lines) {
        map.push(line.split('').map(n => +n));
    }    
}


const mapString: string = `2413432311323
3215453535623
3255245654254
3446585845452
4546657867536
1438598798454
4457876987766
3637877979653
4654967986887
4564679986453
1224686865563
2546548887735
4322674655533`;
