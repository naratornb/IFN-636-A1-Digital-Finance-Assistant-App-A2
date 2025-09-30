//
// const chai = require('chai');
// const chaiHttp = require('chai-http');
// const mongoose = require('mongoose');
// const sinon = require('sinon');
// const { updateReport, getReports, addReport, deleteReport } = require('../controllers/reportController');
// const Goal = require('../models/Goal');
// const { updateGoal, getGoals, addGoal, deleteGoal } = require('../controllers/goalController');
// const Expense = require('../models/Expense');
// const { updateExpense, getExpenses, addExpense, deleteExpense } = require('../controllers/expenseController');
// // const Budget = require('../models/Budget');
// // const { updateBudget, getBudgets, addBudget, deleteBudget } = require('../controllers/budgetController');
// const { expect } = chai;
//
// chai.use(chaiHttp);
// let server;
// let port;
// //
// // describe('AddReport Function Test', () => {
// //
// //   it('should create a new report successfully', async () => {
// //     const req = {
// //       user: { id: new mongoose.Types.ObjectId() },
// //       body: { title: "New Report", description: "Report description", reportdate: "2025-12-31" }
// //     };
// //
// //     const createdReport = { _id: new mongoose.Types.ObjectId(), ...req.body, userId: req.user.id };
// //
// //     const createStub = sinon.stub(Report, 'create').resolves(createdReport);
// //
// //     const res = {
// //       status: sinon.stub().returnsThis(),
// //       json: sinon.spy()
// //     };
// //
// //     await addReport(req, res);
// //
// //     expect(createStub.calledOnceWith({ userId: req.user.id, ...req.body })).to.be.true;
// //     expect(res.status.calledWith(201)).to.be.true;
// //     expect(res.json.calledWith(createdReport)).to.be.true;
// //
// //     createStub.restore();
// //   });
// //
// //   it('should return 500 if an error occurs', async () => {
// //     const createStub = sinon.stub(Report, 'create').throws(new Error('DB Error'));
// //
// //     const req = {
// //       user: { id: new mongoose.Types.ObjectId() },
// //       body: { title: "New Report", description: "Report description", reportdate: "2025-12-31" }
// //     };
// //
// //     const res = {
// //       status: sinon.stub().returnsThis(),
// //       json: sinon.spy()
// //     };
// //
// //     await addReport(req, res);
// //
// //     expect(res.status.calledWith(500)).to.be.true;
// //     expect(res.json.calledWithMatch({ message: 'DB Error' })).to.be.true;
// //
// //     createStub.restore();
// //   });
// //
// // });
// //
// // describe('Update Function Test', () => {
// //
// //   it('should update report successfully', async () => {
// //     const reportId = new mongoose.Types.ObjectId();
// //     const existingReport = {
// //       _id: reportId,
// //       title: "Old Report",
// //       description: "Old Description",
// //       reportdate: "2025-01-01",
// //       save: sinon.stub().resolvesThis(),
// //     };
// //
// //     const findByIdStub = sinon.stub(Report, 'findById').resolves(existingReport);
// //
// //     const req = {
// //       params: { id: reportId },
// //       body: { title: "New Report", description: "Updated Description", reportdate: "2025-12-31" }
// //     };
// //     const res = {
// //       json: sinon.spy(),
// //       status: sinon.stub().returnsThis()
// //     };
// //
// //     await updateReport(req, res);
// //
// //     expect(existingReport.title).to.equal("New Report");
// //     expect(existingReport.description).to.equal("Updated Description");
// //     expect(existingReport.reportdate).to.equal("2025-12-31");
// //     expect(res.status.called).to.be.false;
// //     expect(res.json.calledOnce).to.be.true;
// //
// //     findByIdStub.restore();
// //   });
// //
// //   it('should return 404 if report is not found', async () => {
// //     const findByIdStub = sinon.stub(Report, 'findById').resolves(null);
// //
// //     const req = { params: { id: new mongoose.Types.ObjectId() }, body: {} };
// //     const res = {
// //       status: sinon.stub().returnsThis(),
// //       json: sinon.spy()
// //     };
// //
// //     await updateReport(req, res);
// //
// //     expect(res.status.calledWith(404)).to.be.true;
// //     expect(res.json.calledWith({ message: 'Report not found' })).to.be.true;
// //
// //     findByIdStub.restore();
// //   });
// //
// //   it('should return 500 on error', async () => {
// //     const findByIdStub = sinon.stub(Report, 'findById').throws(new Error('DB Error'));
// //
// //     const req = { params: { id: new mongoose.Types.ObjectId() }, body: {} };
// //     const res = {
// //       status: sinon.stub().returnsThis(),
// //       json: sinon.spy()
// //     };
// //
// //     await updateReport(req, res);
// //
// //     expect(res.status.calledWith(500)).to.be.true;
// //     expect(res.json.called).to.be.true;
// //
// //     findByIdStub.restore();
// //   });
// //
// // });
// //
// // describe('GetReport Function Test', () => {
// //
// //   it('should return reports for the given user', async () => {
// //     const userId = new mongoose.Types.ObjectId();
// //
// //     const reports = [
// //       { _id: new mongoose.Types.ObjectId(), title: "Report 1", description: "Desc 1", reportdate: "2025-01-01", userId },
// //       { _id: new mongoose.Types.ObjectId(), title: "Report 2", description: "Desc 2", reportdate: "2025-02-01", userId }
// //     ];
// //
// //     const findStub = sinon.stub(Report, 'find').resolves(reports);
// //
// //     const req = { user: { id: userId } };
// //     const res = {
// //       json: sinon.spy(),
// //       status: sinon.stub().returnsThis()
// //     };
// //
// //     await getReports(req, res);
// //
// //     expect(findStub.calledOnceWith({ userId })).to.be.true;
// //     expect(res.json.calledWith(reports)).to.be.true;
// //     expect(res.status.called).to.be.false;
// //
// //     findStub.restore();
// //   });
// //
// //   it('should return 500 on error', async () => {
// //     const findStub = sinon.stub(Report, 'find').throws(new Error('DB Error'));
// //
// //     const req = { user: { id: new mongoose.Types.ObjectId() } };
// //     const res = {
// //       json: sinon.spy(),
// //       status: sinon.stub().returnsThis()
// //     };
// //
// //     await getReports(req, res);
// //
// //     expect(res.status.calledWith(500)).to.be.true;
// //     expect(res.json.calledWithMatch({ message: 'DB Error' })).to.be.true;
// //
// //     findStub.restore();
// //   });
// //
// // });
// //
// // describe('DeleteReport Function Test', () => {
// //
// //   it('should delete a report successfully', async () => {
// //     const req = { params: { id: new mongoose.Types.ObjectId().toString() } };
// //
// //     const report = { remove: sinon.stub().resolves() };
// //
// //     const findByIdStub = sinon.stub(Report, 'findById').resolves(report);
// //
// //     const res = {
// //       status: sinon.stub().returnsThis(),
// //       json: sinon.spy()
// //     };
// //
// //     await deleteReport(req, res);
// //
// //     expect(findByIdStub.calledOnceWith(req.params.id)).to.be.true;
// //     expect(report.remove.calledOnce).to.be.true;
// //     expect(res.json.calledWith({ message: 'Report deleted' })).to.be.true;
// //
// //     findByIdStub.restore();
// //   });
// //
// //   it('should return 404 if report is not found', async () => {
// //     const findByIdStub = sinon.stub(Report, 'findById').resolves(null);
// //
// //     const req = { params: { id: new mongoose.Types.ObjectId().toString() } };
// //
// //     const res = {
// //       status: sinon.stub().returnsThis(),
// //       json: sinon.spy()
// //     };
// //
// //     await deleteReport(req, res);
// //
// //     expect(findByIdStub.calledOnceWith(req.params.id)).to.be.true;
// //     expect(res.status.calledWith(404)).to.be.true;
// //     expect(res.json.calledWith({ message: 'Report not found' })).to.be.true;
// //
// //     findByIdStub.restore();
// //   });
//
// //   it('should return 500 if an error occurs', async () => {
// //     const findByIdStub = sinon.stub(Report, 'findById').throws(new Error('DB Error'));
// //
// //     const req = { params: { id: new mongoose.Types.ObjectId().toString() } };
// //
// //     const res = {
// //       status: sinon.stub().returnsThis(),
// //       json: sinon.spy()
// //     };
// //
// //     await deleteReport(req, res);
// //
// //     expect(res.status.calledWith(500)).to.be.true;
// //     expect(res.json.calledWithMatch({ message: 'DB Error' })).to.be.true;
// //
// //     findByIdStub.restore();
// //   });
// //
// // });
//
// describe('AddGoal Function Test', () => {
//
//     it('should create a new goal successfully', async () => {
//       const req = {
//         user: { id: new mongoose.Types.ObjectId() },
//         body: { name: "New Goal", amount: 1000, deadline: "2025-12-31" }
//       };
//
//       const createdGoal = { _id: new mongoose.Types.ObjectId(), ...req.body, userId: req.user.id };
//
//       const createStub = sinon.stub(Goal, 'create').resolves(createdGoal);
//
//       const res = {
//         status: sinon.stub().returnsThis(),
//         json: sinon.spy()
//       };
//
//       await addGoal(req, res);
//
//       expect(createStub.calledOnceWith({ userId: req.user.id, ...req.body })).to.be.true;
//       expect(res.status.calledWith(201)).to.be.true;
//       expect(res.json.calledWith(createdGoal)).to.be.true;
//
//       createStub.restore();
//     });
//
//     it('should return 500 if an error occurs', async () => {
//       const createStub = sinon.stub(Goal, 'create').throws(new Error('DB Error'));
//
//       const req = {
//         user: { id: new mongoose.Types.ObjectId() },
//         body: { name: "New Goal", amount: 1000, deadline: "2025-12-31" }
//       };
//
//       const res = {
//         status: sinon.stub().returnsThis(),
//         json: sinon.spy()
//       };
//
//       await addGoal(req, res);
//
//       expect(res.status.calledWith(500)).to.be.true;
//       expect(res.json.calledWithMatch({ message: 'DB Error' })).to.be.true;
//
//       createStub.restore();
//     });
//
//   });
//
//   describe('UpdateGoal Function Test', () => {
//
//     it('should update goal successfully', async () => {
//       const goalId = new mongoose.Types.ObjectId();
//       const existingGoal = {
//         _id: goalId,
//         name: "Old Goal",
//         amount: 500,
//         deadline: "2025-01-01",
//         save: sinon.stub().resolvesThis(),
//       };
//
//       const findByIdStub = sinon.stub(Goal, 'findById').resolves(existingGoal);
//
//       const req = {
//         params: { id: goalId },
//         body: { name: "New Goal", amount: 1000, deadline: "2025-12-31" }
//       };
//       const res = {
//         json: sinon.spy(),
//         status: sinon.stub().returnsThis()
//       };
//
//       await updateGoal(req, res);
//
//       expect(existingGoal.name).to.equal("New Goal");
//       expect(existingGoal.amount).to.equal(1000);
//       expect(existingGoal.deadline).to.equal("2025-12-31");
//       expect(res.status.called).to.be.false;
//       expect(res.json.calledOnce).to.be.true;
//
//       findByIdStub.restore();
//     });
//
//     it('should return 404 if goal is not found', async () => {
//       const findByIdStub = sinon.stub(Goal, 'findById').resolves(null);
//
//       const req = { params: { id: new mongoose.Types.ObjectId() }, body: {} };
//       const res = {
//         status: sinon.stub().returnsThis(),
//         json: sinon.spy()
//       };
//
//       await updateGoal(req, res);
//
//       expect(res.status.calledWith(404)).to.be.true;
//       expect(res.json.calledWith({ message: 'Goal not found' })).to.be.true;
//
//       findByIdStub.restore();
//     });
//
//     it('should return 500 on error', async () => {
//       const findByIdStub = sinon.stub(Goal, 'findById').throws(new Error('DB Error'));
//
//       const req = { params: { id: new mongoose.Types.ObjectId() }, body: {} };
//       const res = {
//         status: sinon.stub().returnsThis(),
//         json: sinon.spy()
//       };
//
//       await updateGoal(req, res);
//
//       expect(res.status.calledWith(500)).to.be.true;
//       expect(res.json.called).to.be.true;
//
//       findByIdStub.restore();
//     });
//
//   });
//
//   describe('GetGoals Function Test', () => {
//
//     it('should return goals for the given user', async () => {
//       const userId = new mongoose.Types.ObjectId();
//
//       const goals = [
//         { _id: new mongoose.Types.ObjectId(), name: "Goal 1", amount: 500, deadline: "2025-01-01", userId },
//         { _id: new mongoose.Types.ObjectId(), name: "Goal 2", amount: 1000, deadline: "2025-02-01", userId }
//       ];
//
//       const findStub = sinon.stub(Goal, 'find').resolves(goals);
//
//       const req = { user: { id: userId } };
//       const res = {
//         json: sinon.spy(),
//         status: sinon.stub().returnsThis()
//       };
//
//       await getGoals(req, res);
//
//       expect(findStub.calledOnceWith({ userId })).to.be.true;
//       expect(res.json.calledWith(goals)).to.be.true;
//       expect(res.status.called).to.be.false;
//
//       findStub.restore();
//     });
//
//     it('should return 500 on error', async () => {
//       const findStub = sinon.stub(Goal, 'find').throws(new Error('DB Error'));
//
//       const req = { user: { id: new mongoose.Types.ObjectId() } };
//       const res = {
//         json: sinon.spy(),
//         status: sinon.stub().returnsThis()
//       };
//
//       await getGoals(req, res);
//
//       expect(res.status.calledWith(500)).to.be.true;
//       expect(res.json.calledWithMatch({ message: 'DB Error' })).to.be.true;
//
//       findStub.restore();
//     });
//
//   });
//
//   describe('DeleteGoal Function Test', () => {
//
//     it('should delete a goal successfully', async () => {
//       const req = { params: { id: new mongoose.Types.ObjectId().toString() } };
//
//       const goal = { remove: sinon.stub().resolves() };
//
//       const findByIdStub = sinon.stub(Goal, 'findById').resolves(goal);
//
//       const res = {
//         status: sinon.stub().returnsThis(),
//         json: sinon.spy()
//       };
//
//       await deleteGoal(req, res);
//
//       expect(findByIdStub.calledOnceWith(req.params.id)).to.be.true;
//       expect(goal.remove.calledOnce).to.be.true;
//       expect(res.json.calledWith({ message: 'Goal deleted' })).to.be.true;
//
//       findByIdStub.restore();
//     });
//
//     it('should return 404 if goal is not found', async () => {
//       const findByIdStub = sinon.stub(Goal, 'findById').resolves(null);
//
//       const req = { params: { id: new mongoose.Types.ObjectId().toString() } };
//
//       const res = {
//         status: sinon.stub().returnsThis(),
//         json: sinon.spy()
//       };
//
//       await deleteGoal(req, res);
//
//       expect(findByIdStub.calledOnceWith(req.params.id)).to.be.true;
//       expect(res.status.calledWith(404)).to.be.true;
//       expect(res.json.calledWith({ message: 'Goal not found' })).to.be.true;
//
//       findByIdStub.restore();
//     });
//
//     it('should return 500 if an error occurs', async () => {
//       const findByIdStub = sinon.stub(Goal, 'findById').throws(new Error('DB Error'));
//
//       const req = { params: { id: new mongoose.Types.ObjectId().toString() } };
//
//       const res = {
//         status: sinon.stub().returnsThis(),
//         json: sinon.spy()
//       };
//
//       await deleteGoal(req, res);
//
//       expect(res.status.calledWith(500)).to.be.true;
//       expect(res.json.calledWithMatch({ message: 'DB Error' })).to.be.true;
//
//       findByIdStub.restore();
//     });
//
//   });
//
//
// // TODO: Add Expense Tests
// // describe('AddExpense Function Test', () => {
// //
// //   it('should create a new expense successfully', async () => {
// //     const req = {
// //       user: { id: new mongoose.Types.ObjectId() },
// //       body: {
// //         name: "New Expense",
// //         amount: 200,
// //         deadline: "2025-11-30",
// //         paymentMethod: "Credit Card",
// //         description: "Monthly subscription"
// //       }
// //     };
// //
// //     const createdExpense = { _id: new mongoose.Types.ObjectId(), ...req.body, userId: req.user.id };
// //
// //     const createStub = sinon.stub(Expense, 'create').resolves(createdExpense);
// //
// //     const res = {
// //       status: sinon.stub().returnsThis(),
// //       json: sinon.spy()
// //     };
// //
// //     await addExpense(req, res);
// //
// //     expect(createStub.calledOnceWith({ userId: req.user.id, ...req.body })).to.be.true;
// //     expect(res.status.calledWith(201)).to.be.true;
// //     expect(res.json.calledWith(createdExpense)).to.be.true;
// //
// //     createStub.restore();
// //   });
// //
// //   it('should return 500 if an error occurs', async () => {
// //     const createStub = sinon.stub(Expense, 'create').throws(new Error('DB Error'));
// //
// //     const req = {
// //       user: { id: new mongoose.Types.ObjectId() },
// //       body: { name: "New Expense", amount: 200, deadline: "2025-11-30" }
// //     };
// //
// //     const res = {
// //       status: sinon.stub().returnsThis(),
// //       json: sinon.spy()
// //     };
// //
// //     await addExpense(req, res);
// //
// //     expect(res.status.calledWith(500)).to.be.true;
// //     expect(res.json.calledWithMatch({ message: 'DB Error' })).to.be.true;
// //
// //     createStub.restore();
// //   });
// //
// // });
// //
// // describe('UpdateExpense Function Test', () => {
// //
// //   it('should update expense successfully', async () => {
// //     const expenseId = new mongoose.Types.ObjectId();
// //     const existingExpense = {
// //       _id: expenseId,
// //       name: "Old Expense",
// //       amount: 150,
// //       deadline: "2025-10-01",
// //       paymentMethod: "Cash",
// //       description: "Old desc",
// //       save: sinon.stub().resolvesThis(),
// //     };
// //
// //     const findByIdStub = sinon.stub(Expense, 'findById').resolves(existingExpense);
// //
// //     const req = {
// //       params: { id: expenseId },
// //       body: {
// //         name: "Updated Expense",
// //         amount: 250,
// //         deadline: "2025-12-15",
// //         paymentMethod: "Bank Transfer",
// //         description: "Updated desc"
// //       }
// //     };
// //     const res = {
// //       json: sinon.spy(),
// //       status: sinon.stub().returnsThis()
// //     };
// //
// //     await updateExpense(req, res);
// //
// //     expect(existingExpense.name).to.equal("Updated Expense");
// //     expect(existingExpense.amount).to.equal(250);
// //     expect(existingExpense.deadline).to.equal("2025-12-15");
// //     expect(existingExpense.paymentMethod).to.equal("Bank Transfer");
// //     expect(existingExpense.description).to.equal("Updated desc");
// //     expect(res.status.called).to.be.false;
// //     expect(res.json.calledOnce).to.be.true;
// //
// //     findByIdStub.restore();
// //   });
// //
// //   it('should return 404 if expense is not found', async () => {
// //     const findByIdStub = sinon.stub(Expense, 'findById').resolves(null);
// //
// //     const req = { params: { id: new mongoose.Types.ObjectId() }, body: {} };
// //     const res = {
// //       status: sinon.stub().returnsThis(),
// //       json: sinon.spy()
// //     };
// //
// //     await updateExpense(req, res);
// //
// //     expect(res.status.calledWith(404)).to.be.true;
// //     expect(res.json.calledWith({ message: 'Expense not found' })).to.be.true;
// //
// //     findByIdStub.restore();
// //   });
// //
// //   it('should return 500 on error', async () => {
// //     const findByIdStub = sinon.stub(Expense, 'findById').throws(new Error('DB Error'));
// //
// //     const req = { params: { id: new mongoose.Types.ObjectId() }, body: {} };
// //     const res = {
// //       status: sinon.stub().returnsThis(),
// //       json: sinon.spy()
// //     };
// //
// //     await updateExpense(req, res);
// //
// //     expect(res.status.calledWith(500)).to.be.true;
// //     expect(res.json.called).to.be.true;
// //
// //     findByIdStub.restore();
// //   });
// //
// // });
// //
// // describe('GetExpenses Function Test', () => {
// //
// //   it('should return expenses for the given user', async () => {
// //     const userId = new mongoose.Types.ObjectId();
// //
// //     const expenses = [
// //       { _id: new mongoose.Types.ObjectId(), name: "Expense 1", amount: 100, deadline: "2025-05-01", paymentMethod: "Cash", description: "Test", userId },
// //       { _id: new mongoose.Types.ObjectId(), name: "Expense 2", amount: 200, deadline: "2025-06-01", paymentMethod: "Card", description: "Test2", userId }
// //     ];
// //
// //     const findStub = sinon.stub(Expense, 'find').resolves(expenses);
// //
// //     const req = { user: { id: userId } };
// //     const res = {
// //       json: sinon.spy(),
// //       status: sinon.stub().returnsThis()
// //     };
// //
// //     await getExpenses(req, res);
// //
// //     expect(findStub.calledOnceWith({ userId })).to.be.true;
// //     expect(res.json.calledWith(expenses)).to.be.true;
// //     expect(res.status.called).to.be.false;
// //
// //     findStub.restore();
// //   });
// //
// //   it('should return 500 on error', async () => {
// //     const findStub = sinon.stub(Expense, 'find').throws(new Error('DB Error'));
// //
// //     const req = { user: { id: new mongoose.Types.ObjectId() } };
// //     const res = {
// //       json: sinon.spy(),
// //       status: sinon.stub().returnsThis()
// //     };
// //
// //     await getExpenses(req, res);
// //
// //     expect(res.status.calledWith(500)).to.be.true;
// //     expect(res.json.calledWithMatch({ message: 'DB Error' })).to.be.true;
// //
// //     findStub.restore();
// //   });
// //
// // });
// //
// // describe('DeleteExpense Function Test', () => {
// //
// //   it('should delete an expense successfully', async () => {
// //     const req = { params: { id: new mongoose.Types.ObjectId().toString() } };
// //
// //     const expense = { remove: sinon.stub().resolves() };
// //
// //     const findByIdStub = sinon.stub(Expense, 'findById').resolves(expense);
// //
// //     const res = {
// //       status: sinon.stub().returnsThis(),
// //       json: sinon.spy()
// //     };
// //
// //     await deleteExpense(req, res);
// //
// //     expect(findByIdStub.calledOnceWith(req.params.id)).to.be.true;
// //     expect(expense.remove.calledOnce).to.be.true;
// //     expect(res.json.calledWith({ message: 'Expense deleted' })).to.be.true;
// //
// //     findByIdStub.restore();
// //   });
// //
// //   it('should return 404 if expense is not found', async () => {
// //     const findByIdStub = sinon.stub(Expense, 'findById').resolves(null);
// //
// //     const req = { params: { id: new mongoose.Types.ObjectId().toString() } };
// //
// //     const res = {
// //       status: sinon.stub().returnsThis(),
// //       json: sinon.spy()
// //     };
// //
// //     await deleteExpense(req, res);
// //
// //     expect(findByIdStub.calledOnceWith(req.params.id)).to.be.true;
// //     expect(res.status.calledWith(404)).to.be.true;
// //     expect(res.json.calledWith({ message: 'Expense not found' })).to.be.true;
// //
// //     findByIdStub.restore();
// //   });
// //
// //   it('should return 500 if an error occurs', async () => {
// //     const findByIdStub = sinon.stub(Expense, 'findById').throws(new Error('DB Error'));
// //
// //     const req = { params: { id: new mongoose.Types.ObjectId().toString() } };
// //
// //     const res = {
// //       status: sinon.stub().returnsThis(),
// //       json: sinon.spy()
// //     };
// //
// //     await deleteExpense(req, res);
// //
// //     expect(res.status.calledWith(500)).to.be.true;
// //     expect(res.json.calledWithMatch({ message: 'DB Error' })).to.be.true;
// //
// //     findByIdStub.restore();
// //   });
// //
// // });
// // TODO: Add Budget Tests
// //
// // describe('AddBudget Function Test', () => {
// //
// //   it('should create a new budget successfully', async () => {
// //     const req = {
// //       user: { id: new mongoose.Types.ObjectId() },
// //       body: {
// //         name: "New Budget",
// //         saved: 500,
// //         amount: 1000,
// //         deadline: "2025-12-31",
// //         status: "In Progress",
// //         description: "Budget description"
// //       }
// //     };
// //
// //     const createdBudget = { _id: new mongoose.Types.ObjectId(), ...req.body, userId: req.user.id };
// //
// //     const createStub = sinon.stub(Budget, 'create').resolves(createdBudget);
// //
// //     const res = {
// //       status: sinon.stub().returnsThis(),
// //       json: sinon.spy()
// //     };
// //
// //     await addBudget(req, res);
// //
// //     expect(createStub.calledOnceWith({ userId: req.user.id, ...req.body })).to.be.true;
// //     expect(res.status.calledWith(201)).to.be.true;
// //     expect(res.json.calledWith(createdBudget)).to.be.true;
// //
// //     createStub.restore();
// //   });
// //
// //   it('should return 500 if an error occurs', async () => {
// //     const createStub = sinon.stub(Budget, 'create').throws(new Error('DB Error'));
// //
// //     const req = {
// //       user: { id: new mongoose.Types.ObjectId() },
// //       body: { name: "New Budget", saved: 500, amount: 1000, deadline: "2025-12-31", status: "In Progress", description: "Budget description" }
// //     };
// //
// //     const res = {
// //       status: sinon.stub().returnsThis(),
// //       json: sinon.spy()
// //     };
// //
// //     await addBudget(req, res);
// //
// //     expect(res.status.calledWith(500)).to.be.true;
// //     expect(res.json.calledWithMatch({ message: 'DB Error' })).to.be.true;
// //
// //     createStub.restore();
// //   });
// //
// // });
// //
// // describe('UpdateBudget Function Test', () => {
// //
// //   it('should update budget successfully', async () => {
// //     const budgetId = new mongoose.Types.ObjectId();
// //     const existingBudget = {
// //       _id: budgetId,
// //       name: "Old Budget",
// //       saved: 200,
// //       amount: 800,
// //       deadline: "2025-01-01",
// //       status: "Pending",
// //       description: "Old description",
// //       save: sinon.stub().resolvesThis(),
// //     };
// //
// //     const findByIdStub = sinon.stub(Budget, 'findById').resolves(existingBudget);
// //
// //     const req = {
// //       params: { id: budgetId },
// //       body: {
// //         name: "Updated Budget",
// //         saved: 500,
// //         amount: 1000,
// //         deadline: "2025-12-31",
// //         status: "Completed",
// //         description: "Updated description"
// //       }
// //     };
// //     const res = {
// //       json: sinon.spy(),
// //       status: sinon.stub().returnsThis()
// //     };
// //
// //     await updateBudget(req, res);
// //
// //     expect(existingBudget.name).to.equal("Updated Budget");
// //     expect(existingBudget.saved).to.equal(500);
// //     expect(existingBudget.amount).to.equal(1000);
// //     expect(existingBudget.deadline).to.equal("2025-12-31");
// //     expect(existingBudget.status).to.equal("Completed");
// //     expect(existingBudget.description).to.equal("Updated description");
// //     expect(res.status.called).to.be.false;
// //     expect(res.json.calledOnce).to.be.true;
// //
// //     findByIdStub.restore();
// //   });
// //
// //   it('should return 404 if budget is not found', async () => {
// //     const findByIdStub = sinon.stub(Budget, 'findById').resolves(null);
// //
// //     const req = { params: { id: new mongoose.Types.ObjectId() }, body: {} };
// //     const res = {
// //       status: sinon.stub().returnsThis(),
// //       json: sinon.spy()
// //     };
// //
// //     await updateBudget(req, res);
// //
// //     expect(res.status.calledWith(404)).to.be.true;
// //     expect(res.json.calledWith({ message: 'Budget not found' })).to.be.true;
// //
// //     findByIdStub.restore();
// //   });
// //
// //   it('should return 500 on error', async () => {
// //     const findByIdStub = sinon.stub(Budget, 'findById').throws(new Error('DB Error'));
// //
// //     const req = { params: { id: new mongoose.Types.ObjectId() }, body: {} };
// //     const res = {
// //       status: sinon.stub().returnsThis(),
// //       json: sinon.spy()
// //     };
// //
// //     await updateBudget(req, res);
// //
// //     expect(res.status.calledWith(500)).to.be.true;
// //     expect(res.json.called).to.be.true;
// //
// //     findByIdStub.restore();
// //   });
// //
// // });
// //
// // describe('GetBudgets Function Test', () => {
// //
// //   it('should return budgets for the given user', async () => {
// //     const userId = new mongoose.Types.ObjectId();
// //
// //     const budgets = [
// //       { _id: new mongoose.Types.ObjectId(), name: "Budget 1", saved: 100, amount: 500, deadline: "2025-05-01", status: "In Progress", description: "Desc 1", userId },
// //       { _id: new mongoose.Types.ObjectId(), name: "Budget 2", saved: 200, amount: 1000, deadline: "2025-06-01", status: "Completed", description: "Desc 2", userId }
// //     ];
// //
// //     const findStub = sinon.stub(Budget, 'find').resolves(budgets);
// //
// //     const req = { user: { id: userId } };
// //     const res = {
// //       json: sinon.spy(),
// //       status: sinon.stub().returnsThis()
// //     };
// //
// //     await getBudgets(req, res);
// //
// //     expect(findStub.calledOnceWith({ userId })).to.be.true;
// //     expect(res.json.calledWith(budgets)).to.be.true;
// //     expect(res.status.called).to.be.false;
// //
// //     findStub.restore();
// //   });
// //
// //   it('should return 500 on error', async () => {
// //     const findStub = sinon.stub(Budget, 'find').throws(new Error('DB Error'));
// //
// //     const req = { user: { id: new mongoose.Types.ObjectId() } };
// //     const res = {
// //       json: sinon.spy(),
// //       status: sinon.stub().returnsThis()
// //     };
// //
// //     await getBudgets(req, res);
// //
// //     expect(res.status.calledWith(500)).to.be.true;
// //     expect(res.json.calledWithMatch({ message: 'DB Error' })).to.be.true;
// //
// //     findStub.restore();
// //   });
// //
// // });
// //
// // describe('DeleteBudget Function Test', () => {
// //
// //   it('should delete a budget successfully', async () => {
// //     const req = { params: { id: new mongoose.Types.ObjectId().toString() } };
// //
// //     const budget = { remove: sinon.stub().resolves() };
// //
// //     const findByIdStub = sinon.stub(Budget, 'findById').resolves(budget);
// //
// //     const res = {
// //       status: sinon.stub().returnsThis(),
// //       json: sinon.spy()
// //     };
// //
// //     await deleteBudget(req, res);
// //
// //     expect(findByIdStub.calledOnceWith(req.params.id)).to.be.true;
// //     expect(budget.remove.calledOnce).to.be.true;
// //     expect(res.json.calledWith({ message: 'Budget deleted' })).to.be.true;
// //
// //     findByIdStub.restore();
// //   });
// //
// //   it('should return 404 if budget is not found', async () => {
// //     const findByIdStub = sinon.stub(Budget, 'findById').resolves(null);
// //
// //     const req = { params: { id: new mongoose.Types.ObjectId().toString() } };
// //
// //     const res = {
// //       status: sinon.stub().returnsThis(),
// //       json: sinon.spy()
// //     };
// //
// //     await deleteBudget(req, res);
// //
// //     expect(findByIdStub.calledOnceWith(req.params.id)).to.be.true;
// //     expect(res.status.calledWith(404)).to.be.true;
// //     expect(res.json.calledWith({ message: 'Budget not found' })).to.be.true;
// //
// //     findByIdStub.restore();
// //   });
// //
// //   it('should return 500 if an error occurs', async () => {
// //     const findByIdStub = sinon.stub(Budget, 'findById').throws(new Error('DB Error'));
// //
// //     const req = { params: { id: new mongoose.Types.ObjectId().toString() } };
// //
// //     const res = {
// //       status: sinon.stub().returnsThis(),
// //       json: sinon.spy()
// //     };
// //
// //     await deleteBudget(req, res);
// //
// //     expect(res.status.calledWith(500)).to.be.true;
// //     expect(res.json.calledWithMatch({ message: 'DB Error' })).to.be.true;
// //
// //     findByIdStub.restore();
// //   });
// //
// // });
