import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Poll from './pages/Poll'

function App() {
  return (
    <div className="App">
        <Header/>
        <main>
        <article>
          <Router>
            <Switch>
              <Route path = "/:id" children = {<Poll />} />
              <Route path = "/" children = {<Home />} />
            </Switch>
          </Router>
        </article>
        </main>
        <Footer/>
    </div>
  );
}

export default App;
