

class Logger {
  constructor() {
    this.observers = new Set(); // Using Set to prevent duplicates
  }

  /**
   * Adds an observer object.
   * @param {Object} observer - Must implement an update(message) method.
   */
  addObserver(observer) {
    this.observers.add(observer);
  }

  /**
   * Removes an observer object.
   * @param {Object} observer
   */
  removeObserver(observer) {
    this.observers.delete(observer);
  }

  /**
   * Notifies all observers with the message.
   * @param {string} message
   */
  notifyObservers(message) {
    this.observers.forEach(observer => {
      if (typeof observer.update === 'function') {
        observer.update(message);
      }
    });
  }

  /**
   * Log a message and notify observers.
   * @param {string} message
   */
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
const consoleLogger = new ConsoleLogger();

logger.addObserver(consoleLogger);
logger.log('This is a test message'); 