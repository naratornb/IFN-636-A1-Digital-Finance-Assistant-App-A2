import { createContext, useContext, useReducer, useCallback } from 'react';
import budgetService from '../services/BudgetService';
import { useAuth } from './AuthContext';

const initialState = {
  budgets: [],
  budget: null,
  isLoading: false,
  error: null,
  success: false
};

export const BudgetContext = createContext(initialState);

const budgetReducer = (state, action) => {
  switch (action.type) {
    case 'BUDGET_REQUEST':
      return {
        ...state,
        isLoading: true,
        error: null
      };
    case 'GET_BUDGETS':
      return {
        ...state,
        budgets: Array.isArray(action.payload) ? action.payload : [],
        isLoading: false
      };
    case 'GET_BUDGET':
      return {
        ...state,
        budget: action.payload,
        isLoading: false
      };
    case 'CREATE_BUDGET':
      return {
        ...state,
        budgets: [action.payload, ...state.budgets],
        isLoading: false,
        success: true
      };
    case 'UPDATE_BUDGET':
      return {
        ...state,
        budgets: state.budgets.map(budget =>
          budget._id === action.payload._id ? action.payload : budget
        ),
        budget: action.payload,
        isLoading: false,
        success: true
      };
    case 'DELETE_BUDGET':
      return {
        ...state,
        budgets: state.budgets.filter(budget => budget._id !== action.payload),
        isLoading: false,
        success: true
      };
    case 'BUDGET_ERROR':
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
    case 'CLEAR_BUDGET':
      return {
        ...state,
        budget: null
      };
    default:
      return state;
  }
};

export const BudgetProvider = ({ children }) => {
  const [state, dispatch] = useReducer(budgetReducer, initialState);
  const { user } = useAuth();

  const getBudgets = useCallback(async () => {
    try {
      dispatch({ type: 'BUDGET_REQUEST' });
      if (!user?.token) {
        throw new Error('No authentication token');
      }
      const response = await budgetService.getBudgets(user.token);

      let budgetsArray;
      if (Array.isArray(response)) {
        budgetsArray = response;
      } else if (response && typeof response === 'object') {
        budgetsArray = response.budgets || response.data || [];
        if (!Array.isArray(budgetsArray)) {
          console.warn('Unexpected budget data format:', response);
          budgetsArray = [];
        }
      } else {
        console.warn('Unexpected budget response:', response);
        budgetsArray = [];
      }

      dispatch({ type: 'GET_BUDGETS', payload: budgetsArray });
      return budgetsArray;
    } catch (error) {
      console.error('Error fetching budgets:', error);
      dispatch({
        type: 'BUDGET_ERROR',
        payload: error.response?.data?.message || error.message || 'Failed to fetch budgets'
      });
      return [];
    }
  }, [user?.token]); 

  const getBudget = useCallback(async (id) => {
    try {
      dispatch({ type: 'BUDGET_REQUEST' });
      if (!user?.token) {
        throw new Error('No authentication token');
      }
      const budget = await budgetService.getBudgetById(user.token, id);
      dispatch({ type: 'GET_BUDGET', payload: budget });
      return budget;
    } catch (error) {
      dispatch({
        type: 'BUDGET_ERROR',
        payload: error.response?.data?.message || error.message || 'Failed to fetch budget'
      });
      return null;
    }
  }, [user?.token]); 

  const createBudget = useCallback(async (budgetData) => {
    try {
      dispatch({ type: 'BUDGET_REQUEST' });
      if (!user?.token) {
        throw new Error('No authentication token');
      }
      const budget = await budgetService.createBudget(user.token, budgetData);
      dispatch({ type: 'CREATE_BUDGET', payload: budget });
      return true;
    } catch (error) {
      dispatch({
        type: 'BUDGET_ERROR',
        payload: error.response?.data?.message || error.message || 'Failed to create budget'
      });
      return false;
    }
  }, [user?.token]); 

  const updateBudget = useCallback(async (id, budgetData) => {
    try {
      dispatch({ type: 'BUDGET_REQUEST' });
      if (!user?.token) {
        throw new Error('No authentication token');
      }
      const budget = await budgetService.updateBudget(user.token, id, budgetData);
      dispatch({ type: 'UPDATE_BUDGET', payload: budget });
      return true;
    } catch (error) {
      dispatch({
        type: 'BUDGET_ERROR',
        payload: error.response?.data?.message || error.message || 'Failed to update budget'
      });
      return false;
    }
  }, [user?.token]); 

  const deleteBudget = useCallback(async (id) => {
    try {
      dispatch({ type: 'BUDGET_REQUEST' });
      if (!user?.token) {
        throw new Error('No authentication token');
      }
      await budgetService.deleteBudget(user.token, id);
      dispatch({ type: 'DELETE_BUDGET', payload: id });
      return true;
    } catch (error) {
      dispatch({
        type: 'BUDGET_ERROR',
        payload: error.response?.data?.message || error.message || 'Failed to delete budget'
      });
      return false;
    }
  }, [user?.token]); 

  const resetSuccess = useCallback(() => {
    dispatch({ type: 'RESET_SUCCESS' });
  }, []); 

  const clearBudget = useCallback(() => {
    dispatch({ type: 'CLEAR_BUDGET' });
  }, []); 

  return (
    <BudgetContext.Provider
      value={{
        ...state,
        getBudgets,
        getBudget,
        createBudget,
        updateBudget,
        deleteBudget,
        resetSuccess,
        clearBudget
      }}
    >
      {children}
    </BudgetContext.Provider>
  );
};

export const useBudgetContext = () => {
  return useContext(BudgetContext);
};
