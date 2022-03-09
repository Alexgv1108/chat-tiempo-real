import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'


import Login from './modules/Login';
import NotFound from './components/NotFound';

const App = () => {
  return (
    <Router> 
      <Routes>
        <Route exact path="/" element={<Login />} asename={process.env.PUBLIC_URL}/>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  )
}

export default App;