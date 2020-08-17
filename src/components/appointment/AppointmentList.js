import React, { useEffect, useState, useContext } from "react";
import * as constant from "../../utils/constants";
import { List, ListItem, ListItemSecondaryAction, IconButton, Divider, ListItemText, Button, Container, Popover, Typography } from "@material-ui/core";
import CancelIcon from '@material-ui/icons/Cancel';
import { useHistory } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import AuthGlobal from "../../context/store/AuthGlobal";

const useStyles = makeStyles((theme) => ({
    typography: {
        padding: theme.spacing(2),
    },
}));

export default function AppointmentList(props) {
    const classes = useStyles();
    const context = useContext(AuthGlobal);

    const [appointments, setAppointments] = useState([]);
    const [anchorEl, setAnchorEl] = useState(null);
    const [error, setError] = useState("Loading...");
    const [showChild, setShowChild] = useState(false);

    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;

    let history = useHistory();

    useEffect(() => {
        if (
            context.stateUser.isAuthenticated === false ||
            context.stateUser.isAuthenticated === null
        ) {
            props.history.push("/login");
        }
        setShowChild(true);

        const jwt = localStorage.getItem("jwt");

        const fetchData = async () => {
            try {
                const data = await fetch(`${constant.API_URL}/api/appointments`,
                    {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `bearer ${jwt}`
                        },
                    });

                setAppointments(await data.json());
            } catch (error) {
                console.log(error);
            }
        };
        fetchData();

    }, [context.stateUser.isAuthenticated, props.history])

    const onClickCancelAppointment = async (event, id) => {
        try {
            setAnchorEl(event.currentTarget);
            const jwt = localStorage.getItem("jwt");
            const data = await fetch(`${constant.API_URL}/api/appointments/${id}/cancel`,
                {
                    method: "POST", headers: { "Content-Type": "application/json", Authorization: `bearer ${jwt}` }
                });
            if (data.ok) {
                setAnchorEl(null);
                setAppointments((prev) => prev.filter(x => x.id !== id));
            }
            else {
                const response = await data.json();
                setError(response.errorMessage);
            }

        } catch (error) {
            console.log(error);
        }
    }

    const handleClose = () => {
        setAnchorEl(null);
    };

    const convertDate = (date) => new Date(date).toLocaleString("en-US", { hour: "numeric", minute: "numeric", hour12: true, year: "numeric", month: "short", day: "numeric" });

    const addNewAppointment = () => {
        history.push("/appointments/new");
    }

    if (!showChild) return null;
    return (
        <Container >
            <List>
                {appointments && appointments.map((el) => (
                    <div key={el.id}>
                        <ListItem button>
                            <ListItemText primary={`${el.patient.firstName} ${el.patient.lastName} (${el.patient.identificationNumber})`}
                                secondary={`${el.appointmentType.description} at ${convertDate(el.date)}`} />
                            <ListItemSecondaryAction>
                                <IconButton edge="end"
                                    aria-label="edit"
                                    onClick={(e) => onClickCancelAppointment(e, el.id)}>
                                    <CancelIcon />
                                </IconButton>
                                <Popover
                                    id={id}
                                    open={open}
                                    anchorEl={anchorEl}
                                    onClose={handleClose}
                                    anchorOrigin={{
                                        vertical: 'bottom',
                                        horizontal: 'center',
                                    }}
                                    transformOrigin={{
                                        vertical: 'top',
                                        horizontal: 'center',
                                    }}
                                >
                                    <Typography className={classes.typography}>{error}</Typography>
                                </Popover>
                            </ListItemSecondaryAction>

                        </ListItem>
                        <Divider />
                    </div>
                ))}
            </List>
            <Button variant="contained" color="primary" onClick={addNewAppointment}>
                New
            </Button>
        </Container>
    )
}
