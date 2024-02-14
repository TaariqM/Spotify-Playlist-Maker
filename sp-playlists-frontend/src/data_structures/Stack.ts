// This class implements the IStack interface

import IStack from "../interfaces/IStack";

class Stack<T> implements IStack<T> {
  private storage: T[] = [];
  private capacity: number;

  constructor() {
    this.capacity = Infinity;
  }

  public push(item: T): void {
    if (this.size() === this.capacity) {
      throw Error("Stack has reached max capacity, you cannot add more");
    }

    this.storage.push(item);
  }

  public pop(): T | undefined {
    return this.storage.pop();
  }

  public peek(): T | undefined {
    return this.storage[this.size() - 1];
  }

  public size(): number {
    return this.storage.length;
  }
}

export default Stack;
