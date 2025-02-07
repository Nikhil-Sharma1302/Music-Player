
import { BrowserRouter, Route, Router, Routes } from 'react-router-dom';
import './App.css';
import Home from './Components/Home';
import Musicdetails from './Components/Musicdetails';

function App() {
 
  
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Home/>} />
          <Route path='/Musicdetails' element={<Musicdetails/>} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
