import { readLines } from "../helper";

let initialBricks: Brick[] = [];

export async function part1() {
    await extractData();    
      
    console.log(fall().safeToRemoveAmount)
   
}

export async function part2() {
    await extractData();  
    
    const { supportedBy, supportsAbove, cantBeRemoved } = fall();
    console.log(getSumOfFallingBricks(supportedBy, supportsAbove, cantBeRemoved))
}


async function extractData() {
    let lines = [];
    
    if (!sample) lines = await readLines('../input/input22.txt');
    else lines = sampleInput.split('\n')

    const bricks: Brick[] = [];
    for (const line of lines) {
        bricks.push(line
            .split('~')
            .map(cube => cube.split(',').map(Number))
            .map(p => ({ x: p[0], y: p[1], z: p[2] }))
            .sort((a, b) => a.z - b.z) as Brick);
    }    

    initialBricks = bricks.sort(
        (a, b) => Math.min(b[0].z, b[1].z) - Math.min(a[0].z, a[1].z)
    ) as Brick[];
}

const sample = false;
const sampleInput = `1,0,1~1,2,1
0,0,2~2,0,2
0,2,3~2,2,3
0,0,4~0,2,4
2,0,5~2,2,5
0,1,6~2,1,6
1,1,8~1,1,9`;


type Position = { x: number, y: number, z: number }
type Brick = [Position, Position]
  
function getAllCubes(brick: Brick): Position[] {
    if (brick[0].z !== brick[1].z) {
      const [min, max] = [brick[0].z, brick[1].z] // already sorted
      return Array(max - min + 1)
        .fill(null)
        .map((_, i) => ({ x: brick[0].x, y: brick[0].y, z: min + i }))
    }
  
    if (brick[0].x !== brick[1].x) {
      const [min, max] = [brick[0].x, brick[1].x].sort((a, b) => a - b)
      return Array(max - min + 1)
        .fill(null)
        .map((_, i) => ({ x: min + i, y: brick[0].y, z: brick[0].z }))
    }
  
    const [min, max] = [brick[0].y, brick[1].y].sort((a, b) => a - b)
    return Array(max - min + 1)
      .fill(null)
      .map((_, i) => ({ x: brick[0].x, y: min + i, z: brick[0].z }))
}
  
function getBottomSurface(brick: Brick): Position[] {
    if (brick[0].z !== brick[1].z) return [{ ...brick[0] }]
    return getAllCubes(brick)
}
  
function getPosBelow(pos: Position): Position {
    return { ...pos, z: pos.z - 1 }
}
  
function fall() {
    const landedBricks: Brick[] = []
    const bricks = [...initialBricks];
    const supportedBy = new Map<Brick, Set<Brick>>()
    const supportsAbove = new Map<Brick, Set<Brick>>()
  
    const landedCubes = new Map<string, Brick>()
    const key = (pos: Position) => `${pos.x},${pos.y},${pos.z}`
  
    while (bricks.length) {
        const cur = bricks.pop()
      
        if (cur) {
            const bottomSurface = getBottomSurface(cur)  
            const curSupports = new Set<Brick>()
    
            for (let z = cur[0].z; z > 0; z--) {
                for (let cube of bottomSurface) {
                    const cubeBelow = getPosBelow({ ...cube, z })
                    if (landedCubes.has(key(cubeBelow))) {
                        const br = landedCubes.get(key(cubeBelow))
                        if (br) curSupports.add(br)
                    }
                }
                if (curSupports.size || z === 1) {
                    landedBricks.push(cur)
                    supportedBy.set(cur, curSupports)
    
                    for (let brick of curSupports) {
                        if (supportsAbove.has(brick)) {
                            const br = supportsAbove.get(brick);
                            if (br) br.add(cur)
                        } else {
                        supportsAbove.set(brick, new Set([cur]))
                        }
                    }
    
                    for (let cube of getAllCubes(cur)) {
                        landedCubes.set(key(cube), cur)
                    }
                    break
                }
                cur[0].z -= 1
                cur[1].z -= 1
            }
        }
    }
    const cantBeRemoved = new Set<Brick>()
  
    for (let curSupports of supportedBy.values()) {
      if (curSupports.size === 1) {
        cantBeRemoved.add(curSupports.keys().next().value)
      }
    }
  
    return {
      supportedBy,
      supportsAbove,
      cantBeRemoved,
      safeToRemoveAmount: landedBricks.length - cantBeRemoved.size,
    }
  }
  
  export function getSumOfFallingBricks(
    supportedBy: Map<Brick, Set<Brick>>,
    supportsAbove: Map<Brick, Set<Brick>>,
    bricksToFall: Set<Brick>
  ) {
    const falls = [...bricksToFall].map(brick => {
      let currents = [brick]
  
      const fallen = new Set<Brick>([brick])
  
      while (currents.length) {
        const aboves = new Set<Brick>()
  
        for (let cur of currents) {
            if (supportsAbove.has(cur)) {
                const br = supportsAbove.get(cur)
                if (br) br.forEach(brick => aboves.add(brick))
            }
        }
        const next: Brick[] = []
  
        for (let above of aboves) {
            const br = supportedBy.get(above)
            if (br) {
                const isFalling = [...br].every(below =>
                    fallen.has(below)
                )
                if (isFalling) {
                    fallen.add(above)
                    next.push(above)
                }
            }
        }
        currents = next
      }
  
      return fallen.size - 1
    })
  
    return falls.reduce((a, b) => a + b)
  }

  
  