
export interface IQueue<T> {
    enqueue(item: T): void;
    dequeue(): T | undefined;
    get size(): number;
    toArray(): T[];
}

export class Queue<T> implements IQueue<T> {
    private storage: T[] = [];
  
    constructor(private capacity: number = Infinity) {}
  
    public enqueue(item: T): void {
      if (this.size === this.capacity) {
        throw Error("Queue has reached max capacity, you cannot add more items");
      }
      this.storage.push(item);
    }
    
    public dequeue(): T | undefined {
      return this.storage.shift();
    }
    
    public get size(): number {
      return this.storage.length;
    }

    public toArray(): T[] {
        return this.storage;
    }
}


interface IStack<T> {
    push(item: T): void;
    pop(): T | undefined;
    peek(): T | undefined;
    get size(): number;
}


export class Stack<T> implements IStack<T> {
    private storage: T[] = [];

    constructor(private capacity: number = Infinity) {}

    push(item: T): void {
      if (this.size === this.capacity) {
        throw Error("Stack has reached max capacity, you cannot add more items");
      }
      this.storage.push(item);
    }

    pop(): T | undefined {
      return this.storage.pop();
    }

    peek(): T | undefined {
      return this.storage[this.size - 1];
    }

    get size(): number {
      return this.storage.length;
    }
}
