import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Route, Routes, Switch } from "react-router-dom";
function App() {
  return (
    <div className="app">
  <Router>
    <Switch>
      <Route exact path="/" component={Login} />
    </Switch>
  </Router>
</div>
  );
}

export default App;
