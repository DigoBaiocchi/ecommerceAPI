import './App.css'
import Header from '../src/components/header';
import Login from './pages/login';
import { 
  RouterProvider,
  createBrowserRouter, 
  createRoutesFromElements,
  Route
} from 'react-router-dom';

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
    <RouterProvider router={router} />
  )
}

export default App
