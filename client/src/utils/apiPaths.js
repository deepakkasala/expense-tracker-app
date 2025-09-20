export const VITE_API_URL = "http://localhost:3080";
export const API_PATHS = {
  AUTH: {
    LOGIN: "/api/auth/login",
    REGISTER: "/api/auth/register",
    GET_USER_INFO: "/api/auth/get-user-info",
  },
  DASHBOARD: {
    GET_DATA: "/api/dashboard/",
  },
  INCOME: {
    ADD_INCOME: "/api/income/add-income",
    GET_ALL_INCOMES: "/api/income/get-all-incomes",
    DELETE_INCOME: (incomeId) => `/api/income/${incomeId}`,
    DOWNLOAD_INCOME: "/api/income/download-excel",
  },
  EXPENSE: {
    ADD_EXPENSE: "/api/expense/add-income",
    GET_ALL_EXPENSES: "/api/income/get-all-expenses",
    DELETE_EXPENSE: (expenseId) => `/api/expense/${expenseId}`,
    DOWNLOAD_EXPENSE: "/api/expense/download-excel",
  },
  IMAGE: {
    UPLOAD_IMAGE: "/api/auth/upload-image",
  },
};
