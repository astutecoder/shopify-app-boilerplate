import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './Home';
import Authenticate from './Authenticate';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" Component={Home} />
        <Route path="/authenticate" Component={Authenticate} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
