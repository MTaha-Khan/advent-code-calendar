
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