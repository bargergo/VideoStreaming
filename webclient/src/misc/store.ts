import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice';

const loadState = () => {
  try {
    const serializedState = sessionStorage.getItem('state');

    if (serializedState === null) {
      return undefined;
    }

    return JSON.parse(serializedState);
  } catch (error) {
    return undefined;
  }
};

const saveState = (state) => {
  try {
    const serializedState = JSON.stringify(state);
    sessionStorage.setItem('state', serializedState);
  } catch (error) {
    // Ignore write errors.
  }
};

const store = configureStore({
  reducer: {
    user: userReducer
  },
  preloadedState: loadState()
});

store.subscribe(() => {
  saveState(store.getState());
});

export default store;

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export type AppStore = typeof store;