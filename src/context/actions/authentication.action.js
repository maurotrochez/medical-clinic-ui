import jwt_decode from "jwt-decode";
import * as constants from "../../utils/constants";

export const SET_USER = "SET_USER";

export const login = (user, dispatch, setError) => {
    fetch(`${constants.API_URL}/api/auth/login`, {
        method: "POST",
        body: JSON.stringify(user),
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
        }
    })
        .then(res => res.json())
        .then(data => {
            if (data.token) {
                const token = data.token;
                localStorage.setItem("jwt", token);
                const decoded = jwt_decode(token);
                setError("")
                dispatch(setCurrentUser(decoded));
            } else {
                setError(data.errorMessage)
                logout(dispatch);
            }
        })
        .catch(err => {
            logout(dispatch);
        });

};

export const setCurrentUser = (decoded) => {
    return {
        type: SET_USER,
        payload: decoded
    };
};

export const logout = (dispatch) => {
    localStorage.removeItem("jwt");
    dispatch(setCurrentUser({}));
};