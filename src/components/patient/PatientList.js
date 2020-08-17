import React, { useState, useContext, useEffect } from 'react'
import AuthGlobal from "../../context/store/AuthGlobal";
import { Container, List, ListItem, ListItemText, IconButton, ListItemSecondaryAction, Button, Divider, ListItemAvatar, Avatar } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import FaceIcon from '@material-ui/icons/Face';
import * as constant from "../../utils/constants";

export default function PatientList(props) {

    const [patients, setPatients] = useState([]);
    const [showChild, setShowChild] = useState(false);
    const context = useContext(AuthGlobal);

    useEffect(() => {
        if (
            context.stateUser.isAuthenticated === false ||
            context.stateUser.isAuthenticated === null
        ) {
            props.history.push("/login");
        }
        setShowChild(true);

        const jwt = localStorage.getItem("jwt");

        const fecthPatients = async () => {
            try {
                const data = await fetch(`${constant.API_URL}/api/patients`,
                    {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `bearer ${jwt}`
                        },
                    });

                setPatients(await data.json());
            } catch (error) {
                console.log(error);
            }
        }
        fecthPatients();
    }, [context.stateUser.isAuthenticated, props.history])

    if (!showChild) return null;
    return (
        <Container >
            <List>
                {patients && patients.map((el) => (
                    <div key={el.id}>
                        <ListItem button>
                            <ListItemAvatar>
                                <Avatar>
                                    <FaceIcon />
                                </Avatar>
                            </ListItemAvatar>
                            <ListItemText primary={`${el.firstName} ${el.lastName}`}
                                secondary={`${el.identificationNumber}`} />
                            <ListItemSecondaryAction>
                                <IconButton edge="end"
                                    aria-label="edit">
                                    <EditIcon />
                                </IconButton>
                                <IconButton edge="end"
                                    aria-label="delete">
                                    <DeleteIcon />
                                </IconButton>
                            </ListItemSecondaryAction>
                        </ListItem>
                        <Divider />
                    </div>
                ))}
            </List>
            <Button variant="contained" color="primary">
                New
            </Button>
        </Container>
    )
}
