import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'


import Login from './modules/Login';
import NotFound from './components/NotFound';

const App = () => {
  return (
    <Router basename={process.env.PUBLIC_URL}> 
      <Routes>
        <Route exact path="/" element={<Login />}/>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  )
}

export default App;