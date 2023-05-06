import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import "/node_modules/@fortawesome/fontawesome-free/css/all.min.css";
import { Provider } from "react-redux";
import {store} from "./redux/store"
import { PersistGate } from 'redux-persist/lib/integration/react.js';
import {persistStore} from "redux-persist";
import { GoogleOAuthProvider } from '@react-oauth/google';
let persistor = persistStore(store)

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <GoogleOAuthProvider clientId="821713582819-o6agrb82b46g7m0s71c96havtjd6d3m2.apps.googleusercontent.com">

<Provider store={store}>
  <PersistGate persistor={persistor}>
      <App />
  </PersistGate>
</Provider> 
  </GoogleOAuthProvider>

);

