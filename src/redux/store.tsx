
import { createStore } from 'redux';
import  rootReducer  from './reducers';
import { persistStore, persistReducer } from 'redux-persist'
// import storage from 'redux-persist/lib/storage' 
import AsyncStorage from '@react-native-async-storage/async-storage'

const persistConfig = {
  key: 'huudepzai',
  storage:AsyncStorage,
  blacklist: ['useReducer','exChangeReducer']
}

const persistedReducer = persistReducer(persistConfig, rootReducer)

export default () => {
  let store = createStore(persistedReducer)
  let persistor = persistStore(store)
  return { store, persistor }
}
// const store = createStore(rootReducer)
// export default store;