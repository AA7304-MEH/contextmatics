// Contextmatics - Main Entry Point

class Contextmatics {
    constructor() {
        this.context = {};
        this.operations = [];
    }

    setContext(key, value) {
        this.context[key] = value;
        return this;
    }

    getContext(key) {
        return this.context[key];
    }

    calculate(operation, ...args) {
        const result = this.performOperation(operation, args);
        this.operations.push({ operation, args, result, timestamp: new Date() });
        return result;
    }

    performOperation(operation, args) {
        switch(operation) {
            case 'add':
                return args.reduce((sum, num) => sum + num, 0);
            case 'multiply':
                return args.reduce((product, num) => product * num, 1);
            case 'subtract':
                return args.length > 1 ? args[0] - args.slice(1).reduce((sum, num) => sum + num, 0) : -args[0];
            default:
                throw new Error(`Unknown operation: ${operation}`);
        }
    }

    getHistory() {
        return this.operations;
    }

    clearHistory() {
        this.operations = [];
        return this;
    }
}

module.exports = Contextmatics;

// Example usage
if (require.main === module) {
    const ctx = new Contextmatics();
    
    ctx.setContext('user', 'developer');
    console.log('Context set:', ctx.getContext('user'));
    
    console.log('Addition:', ctx.calculate('add', 5, 3, 2));
    console.log('Multiplication:', ctx.calculate('multiply', 4, 3));
    console.log('History:', ctx.getHistory());
}