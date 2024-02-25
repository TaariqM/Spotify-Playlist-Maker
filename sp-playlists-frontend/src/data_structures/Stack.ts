// This class implements the IStack interface

import IStack from "../interfaces/IStack";

class Stack<T> implements IStack<T> {
  private storage: T[] = [];
  private capacity: number;

  constructor();
  constructor(initialStack: Stack<T>);
  constructor(initialItems: T[]);
  constructor(arg?: undefined | Stack<T> | T[]) {
    this.capacity = Infinity;
    if (Array.isArray(arg)) {
      // If an array is provided, initialize the stack with its elements
      this.storage = arg.slice();
    } else if (arg instanceof Stack) {
      //If a Stack object is provided, initialize the stack with its elements
      const initialStack = arg as Stack<T>;
      this.storage = initialStack.toArray();
    } else {
    }
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

  public toArray(): T[] {
    return this.storage.slice();
  }
}

export default Stack;
