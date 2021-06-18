import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import "./App.css";
import Login from "./features/Login";
import Signup from "./features/Signup";
import OAuthCallback from "./features/OAuthCallback";
import Favorites from "./features/Favorites";
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
                        <li>
                            <Link to="/signup">Signup</Link>
                        </li>
                        <li>
                            <Link to="/favorites">My favorites</Link>
                        </li>
                        <li>
                            <Link to="/my-profile">My Profile</Link>
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
                    <Route path="/favorites">
                        <Favorites />
                    </Route>
                    <Route path="/oauth_callback">
                        <OAuthCallback />
                    </Route>
                </Switch>
            </Router>
        </Provider>
    );
}

export default App;
