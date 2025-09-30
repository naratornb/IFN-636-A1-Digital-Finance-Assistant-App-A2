// Observer Pattern: Allows multiple objects to observe state changes

class Logger {
  constructor() {
    this.observers = [];
  }

  addObserver(observer) {
    this.observers.push(observer);
  }

  removeObserver(observer) {
    const index = this.observers.indexOf(observer);
    if (index !== -1) {
      this.observers.splice(index, 1);
    }
  }

  notifyObservers(message) {
    for (const observer of this.observers) {
      observer.update(message);
    }
  }

  log(message) {
    this.notifyObservers(message);
  }
}

// Concrete observers
class ConsoleLogger {
  update(message) {
    console.log(`[CONSOLE] ${new Date().toISOString()}: ${message}`);
  }
}

// TODO: remove in case of no use
// class FileLogger {
//   update(message) {
//     // In a real implementation, write to a file
//     console.log(`[FILE] ${new Date().toISOString()}: ${message}`);
//   }
// }

// Create logger instance and add observers
const logger = new Logger();
logger.addObserver(new ConsoleLogger());
// logger.addObserver(new FileLogger());

module.exports = logger;