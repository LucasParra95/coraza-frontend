import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { createWrapper, MakeStore } from 'next-redux-wrapper'; // Importa MakeStore
import cartReducer from './reducers/cart';
import userReducer from './reducers/user';
import productsReducer from './reducers/products';
import storage from 'redux-persist/lib/storage';
import { persistStore, persistReducer } from 'redux-persist';

// COMBINING ALL REDUCERS
const rootReducer = combineReducers({
  cart: cartReducer,
  user: userReducer,
  products: productsReducer,
});

// Persist config para redux-persist
const persistConfig = {
  key: 'shoppingcart',
  whitelist: ['cart', 'user', 'products'],
  storage,
};

// Reducer persistido
const persistedReducer = persistReducer(persistConfig, rootReducer);

const makeStore: MakeStore = () => {
  const isServer = typeof window === 'undefined';

  if (isServer) {
    // Si está en el servidor, crear la store sin persistencia
    return configureStore({
      reducer: rootReducer,
    });
  } else {
    // Si está en el cliente, crear la store con persistencia
    const store = configureStore({
      reducer: persistedReducer,
      middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
          serializableCheck: {
            ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
          },
        }),
    });

    // Crear el persistor en el cliente
    // @ts-ignore:next-line
    store.__persistor = persistStore(store);

    return store;
  }
};

// Infer the `RootState` type from the root reducer
export type RootState = ReturnType<typeof rootReducer>;

// Infer `AppDispatch` type from the store itself
export type AppDispatch = ReturnType<typeof makeStore>['dispatch'];

// Create the wrapper for next-redux-wrapper
export const wrapper = createWrapper<RootState>(makeStore, { debug: true });
