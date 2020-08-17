import React, { useContext } from "react";
import AuthGlobal from "../../context/store/AuthGlobal";
import { logout } from "../../context/actions/authentication.action";
import { List, ListItem, ListItemIcon, ListItemText } from "@material-ui/core";
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import AccountCircleOutlinedIcon from '@material-ui/icons/AccountCircleOutlined';

export default function AuthNavBar() {
    const context = useContext(AuthGlobal);

    const onLogout = () => {
        logout(context.dispatch);
    };

    return (
        <List>
            {context.stateUser.isAuthenticated ? (
                <>
                    <ListItem button>
                        <ListItemIcon><AccountCircleOutlinedIcon /></ListItemIcon>
                        <ListItemText primary={context.stateUser.user.username} />
                    </ListItem>
                    <ListItem button onClick={onLogout}>
                        <ListItemIcon><ExitToAppIcon /></ListItemIcon>
                        <ListItemText primary="Exit" />
                    </ListItem>
                </>
            ) : null}

        </List>
    )
}
