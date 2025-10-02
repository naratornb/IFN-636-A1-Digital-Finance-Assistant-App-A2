export class BudgetLogger {
    update(event, data) {
      console.log(`[Budget ${event}] ID: ${data._id}`);
    }
  }