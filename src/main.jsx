import ReactDOM from 'react-dom/client'
import firebaseConfig from './DB/firbaseConfig.js'
import App from './App.jsx'
import './index.css'
import { Provider } from 'react-redux'
import store from './fetures/store.js'

ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <App />
  </Provider>
)
