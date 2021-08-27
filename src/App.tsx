import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import "./App.css";
import Login from "./auth/components/Login";
import Signup from "./auth/components/Signup";
import { store } from "./state/store";
import { Provider } from "react-redux";

function App() {
    return (
        <Provider store={store}>
            <Router>
                <nav>
                    <ul>
                        <li>
                            <Link to="/">Home</Link>
                        </li>
                        <li>
                            <Link to="/login">Login</Link>
                        </li>
                    </ul>
                </nav>
                <Switch>
                    <Route path="/login">
                        <Login />
                    </Route>
                    <Route path="/signup">
                        <Signup />
                    </Route>
                </Switch>
            </Router>
        </Provider>
    );
}

export default App;
