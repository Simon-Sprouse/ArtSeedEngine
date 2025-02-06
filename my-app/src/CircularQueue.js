class CircularQueue { 

    constructor(capacity) { 
        this.capacity = capacity;
        this.buffer = Array(capacity).fill(null);
        this.totalOnScreen = 0; // distance between start and end
        this.maxOnScreen = 100; // max distance between start and end
        this.start = 0;
        this.end = 0;
        this.total = 0;
    }

    getIndex(index) { 
        return index % this.capacity;
    }

    addState(state) { 
        this.buffer[this.getIndex(this.end)] = structuredClone(state);
        this.end++;
        this.total++;
        
        this.totalOnScreen = this.end - this.start;

        if (this.totalOnScreen > this.maxOnScreen) {
            this.start++;
        }
        
    }


    getOnScreen() { 
        const renderArr = [];
        for (let i = 0; i < this.totalOnScreen - 1; i++) { 
            let index = this.getIndex(this.start + i);
            renderArr.push(this.buffer[index]);
        }
        return renderArr;
    }


    undo() { 
        if (this.end > 0) { 
            this.end--;
        }
        if (this.start > 0) { 
            this.start--;
        }

        // need to return the last state in q
        return this.buffer[this.getIndex(this.end)];
    }

    undoMultiple(n) { 

        this.end = Math.max(0, this.end - n);
        this.start = Math.max(0, this.start - n);

        return this.buffer[this.getIndex(this.end)];

    }







    redo() { 

        // still incomplete


        // if catching up
        if (this.end < this.total) { 
            this.start++;
            this.end++
        }

        // 







    }

    clear() { 
        this.buffer = Array(this.capacity).fill(null);
        this.start = 0;
        this.end = 0;
        this.totalOnScreen = 0;
    }




}

export default CircularQueue;