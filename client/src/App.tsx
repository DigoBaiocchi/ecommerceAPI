import './App.css'
import Header from '../src/components/header';
import Login from './pages/login';
import { 
  RouterProvider,
  createBrowserRouter, 
  createRoutesFromElements,
  Route
} from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './store/store';

const router = createBrowserRouter(createRoutesFromElements(
  <>
  <Route path='/' element={<Header />}>
    {/* <Route path='/login' element={<Login />} /> */}
  </Route>
  <Route path='/login' element={<Login />} />
  </>
));

function App() {
  return (
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  )
}

export default App
