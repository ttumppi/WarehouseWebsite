export class Queue{
    constructor(){
        this.items = [];
    }

    Enqueue(item){
        this.items.push(item);
    }

    Dequeue(item){
        const item = this.items[0];
        this.items.shift();
        return item;
    }

    Empty(){
        return this.items.length == 0;
    }
}