import { createContext, useContext, useReducer, useCallback } from 'react';
import expenseService from '../services/ExpenseService';
import { useAuth } from './AuthContext';

const initialState = {
  expenses: [],
  expense: null,
  isLoading: false,
  error: null,
  success: false
};

export const ExpenseContext = createContext(initialState);

const expenseReducer = (state, action) => {
  switch (action.type) {
    case 'EXPENSE_REQUEST':
      return {
        ...state,
        isLoading: true,
        error: null
      };
    case 'GET_EXPENSES':
      return {
        ...state,
        expenses: action.payload,
        isLoading: false
      };
    case 'GET_EXPENSE':
      return {
        ...state,
        expense: action.payload,
        isLoading: false
      };
    case 'CREATE_EXPENSE':
      return {
        ...state,
        expenses: [action.payload, ...state.expenses],
        isLoading: false,
        success: true
      };
    case 'UPDATE_EXPENSE':
      return {
        ...state,
        expenses: state.expenses.map(expense =>
          expense._id === action.payload._id ? action.payload : expense
        ),
        isLoading: false,
        success: true
      };
    case 'DELETE_EXPENSE':
      return {
        ...state,
        expenses: state.expenses.filter(expense => expense._id !== action.payload),
        isLoading: false,
        success: true
      };
    case 'EXPENSE_ERROR':
      return {
        ...state,
        isLoading: false,
        error: action.payload
      };
    case 'RESET_SUCCESS':
      return {
        ...state,
        success: false
      };
    case 'CLEAR_EXPENSE':
      return {
        ...state,
        expense: null
      };
    default:
      return state;
  }
};

export const ExpenseProvider = ({ children }) => {
  const [state, dispatch] = useReducer(expenseReducer, initialState);
  const { user } = useAuth();

  const getExpenses = useCallback(async (params = {}) => {
    try {
      dispatch({ type: 'EXPENSE_REQUEST' });
      if (!user?.token) {
        throw new Error('No authentication token');
      }
      const response = await expenseService.getExpenses(user.token, params);

      let expensesArray;
      if (Array.isArray(response)) {
        expensesArray = response;
      } else if (response && typeof response === 'object') {
        expensesArray = response.expenses || response.data || [];
        if (!Array.isArray(expensesArray)) {
          console.warn('Unexpected expense data format:', response);
          expensesArray = [];
        }
      } else {
        console.warn('Unexpected expense response:', response);
        expensesArray = [];
      }

      dispatch({ type: 'GET_EXPENSES', payload: expensesArray });
      return expensesArray;
    } catch (error) {
      console.error('Error fetching expenses:', error);
      dispatch({
        type: 'EXPENSE_ERROR',
        payload: error.response?.data?.message || error.message || 'Failed to fetch expenses'
      });
      return [];
    }
  }, [user?.token]); 

  const getExpense = useCallback(async (id) => {
    try {
      dispatch({ type: 'EXPENSE_REQUEST' });
      if (!user?.token) {
        throw new Error('No authentication token');
      }
      const expense = await expenseService.getExpenseById(user.token, id);
      dispatch({ type: 'GET_EXPENSE', payload: expense });
      return expense;
    } catch (error) {
      dispatch({
        type: 'EXPENSE_ERROR',
        payload: error.response?.data?.message || error.message || 'Failed to fetch expense'
      });
      return null;
    }
  }, [user?.token]); 

  const createExpense = useCallback(async (expenseData) => {
    try {
      dispatch({ type: 'EXPENSE_REQUEST' });
      if (!user?.token) {
        throw new Error('No authentication token');
      }
      const expense = await expenseService.createExpense(user.token, expenseData);
      dispatch({ type: 'CREATE_EXPENSE', payload: expense });
      return true;
    } catch (error) {
      dispatch({
        type: 'EXPENSE_ERROR',
        payload: error.response?.data?.message || error.message || 'Failed to create expense'
      });
      return false;
    }
  }, [user?.token]); 

  const updateExpense = useCallback(async (id, expenseData) => {
    try {
      dispatch({ type: 'EXPENSE_REQUEST' });
      if (!user?.token) {
        throw new Error('No authentication token');
      }
      const expense = await expenseService.updateExpense(user.token, id, expenseData);
      dispatch({ type: 'UPDATE_EXPENSE', payload: expense });
      return true;
    } catch (error) {
      dispatch({
        type: 'EXPENSE_ERROR',
        payload: error.response?.data?.message || error.message || 'Failed to update expense'
      });
      return false;
    }
  }, [user?.token]);

  const deleteExpense = useCallback(async (id) => {
    try {
      dispatch({ type: 'EXPENSE_REQUEST' });
      if (!user?.token) {
        throw new Error('No authentication token');
      }
      await expenseService.deleteExpense(user.token, id);
      dispatch({ type: 'DELETE_EXPENSE', payload: id });
      return true;
    } catch (error) {
      dispatch({
        type: 'EXPENSE_ERROR',
        payload: error.response?.data?.message || error.message || 'Failed to delete expense'
      });
      return false;
    }
  }, [user?.token]); 

  const resetSuccess = useCallback(() => {
    dispatch({ type: 'RESET_SUCCESS' });
  }, []); 

  const clearExpense = useCallback(() => {
    dispatch({ type: 'CLEAR_EXPENSE' });
  }, []); 

  return (
    <ExpenseContext.Provider
      value={{
        ...state,
        getExpenses,
        getExpense,
        createExpense,
        updateExpense,
        deleteExpense,
        resetSuccess,
        clearExpense
      }}
    >
      {children}
    </ExpenseContext.Provider>
  );
};

export const useExpenseContext = () => {
  return useContext(ExpenseContext);
};
