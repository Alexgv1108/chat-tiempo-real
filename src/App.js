import { BrowserRouter as Router} from 'react-router-dom'

import Main from './components/Main';

const App = () => {
  return (
    <Router basename={process.env.PUBLIC_URL}> 
      <Main />
    </Router>
  )
}

export default App;