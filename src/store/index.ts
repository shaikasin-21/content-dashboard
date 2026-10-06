import { configureStore } from '@reduxjs/toolkit';
import { useDispatch, useSelector, TypedUseSelectorHook } from 'react-redux';
import { favSlice, feedSlice, prefsSlice, uiSlice } from './slices';
export const makeStore = () => configureStore({ reducer: { prefs: prefsSlice.reducer, favorites: favSlice.reducer, feed: feedSlice.reducer, ui: uiSlice.reducer } });
export const store = makeStore();
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
