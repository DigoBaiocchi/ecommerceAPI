import './App.css';
import Login from './pages/Login/login';
import Categories from './pages/categories/categories';
import Products from './pages/Products/Products';
import Home from './pages/Home/Home';

import { 
  RouterProvider,
  createBrowserRouter, 
  createRoutesFromElements,
  Route
} from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store/store';

const router = createBrowserRouter(createRoutesFromElements(
  <>
    <Route path='/' element={<Home />} />
    <Route path='/login' element={<Login />} />
    <Route path='/categories' element={<Categories />} />
    <Route path='/products' element={<Products />} />
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
