import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import "./App.css";
import Login from "./auth/components/Login";
import { store } from "./state/store";
import { Provider } from "react-redux";
import AuthTokenExpiryCheck from "./auth/utils/AuthTokenExpiryCheck";
import { useEffect } from "react";
import { checkIfAppIsLoggedOnOpen } from "./auth/communication/authentication";

function App() {
    useEffect(() => {
        checkIfAppIsLoggedOnOpen();
    }, []);

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
                </Switch>
            </Router>
            <AuthTokenExpiryCheck />
        </Provider>
    );
}

export default App;
