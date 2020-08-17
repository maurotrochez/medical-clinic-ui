import React, { useEffect, useContext, useState } from "react";
import { login } from "../../context/actions/authentication.action";
import AuthGlobal from "../../context/store/AuthGlobal";
import { TextField, Button } from "@material-ui/core";

export default function Login(props) {

    const context = useContext(AuthGlobal);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [showChild, setShowChild] = useState(false);

    useEffect(() => {
        console.log(context.stateUser.isAuthenticated);
        if (context.stateUser.isAuthenticated === true) {
            props.history.push("/");
        }
        setShowChild(true);
    }, [context.stateUser.isAuthenticated, props.history]);

    const onLogin = (e) => {
        e.preventDefault();

        const user = {
            username,
            password
        };
        if (username === "" || password === "") {
            setError("Type username and password");
        } else {
            login(user, context.dispatch, setError);
        }
    };

    if (!showChild) {
        return null;
    }
    else {
        return (
            <div>
                <form autoComplete="off">
                    <div>
                        <TextField required
                            id="username"
                            label="Username"
                            type="text"
                            value={username}
                            name="username"
                            onChange={(e) => setUsername(e.target.value)} />
                    </div>
                    <div>
                        <TextField required
                            id="password"
                            label="Password"
                            type="password"
                            value={password}
                            name="password"
                            onChange={(e) => setPassword(e.target.value)} />
                    </div>
                    <Button variant="contained" color="primary" onClick={onLogin} disabled={!!(!username || !password)}>
                        Login
                    </Button>
                    {error ? <div><span>{error}</span></div> : null}
                </form>
            </div>
        )
    }
}
