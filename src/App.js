import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'


import Login from './modules/Login';

const App = () => {
  return (
    <Router> 
      <Routes>
        <Route exact path="/" element={<Login />} asename={process.env.PUBLIC_URL}/>
      </Routes>
    </Router>
  )
}

export default App;