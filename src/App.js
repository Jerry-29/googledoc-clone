import logo from './logo.svg';
import './App.css';
import { Texteditor } from './Texteditor';
import { BrowserRouter ,Route,Routes,Navigate} from 'react-router-dom';
import {v4 as uuidV4} from 'uuid'
function App() {
  return (
    <div className="App">
      <BrowserRouter>
      <Routes>
        <Route path='/' element={<Navigate to={`/documents/${uuidV4()}`}/>}>
        </Route>
        <Route path='/documents/:id' element={<Texteditor/>} />
      </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
