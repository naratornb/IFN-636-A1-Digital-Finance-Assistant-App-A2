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

class ConsoleLogger {
  update(message) {
    console.log(`[CONSOLE] ${new Date().toISOString()}: ${message}`);
  }
}

const logger = new Logger();
logger.addObserver(new ConsoleLogger());

module.exports = logger;