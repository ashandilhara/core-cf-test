import { configureStore } from '@reduxjs/toolkit';
import sectionsSlice from './features/sectionsSlice';
import outcomesSlice from './features/outcomesSlice';
import {TypedUseSelectorHook, useSelector} from 'react-redux';

export const store = configureStore({
    reducer: {
        sectionsSlice,
        outcomesSlice
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck: false
      }),

});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector