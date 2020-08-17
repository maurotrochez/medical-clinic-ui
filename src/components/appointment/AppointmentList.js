import React, { useEffect, useState } from "react";
import * as constant from "../../utils/constants";
import { List, ListItem, ListItemSecondaryAction, IconButton, Divider, ListItemText, Button, Container, Popover, Typography } from "@material-ui/core";
import EditIcon from "@material-ui/icons/Edit";
import CancelIcon from '@material-ui/icons/Cancel';
import { useHistory } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
    typography: {
      padding: theme.spacing(2),
    },
  }));

export default function AppointmentList() {
    const classes = useStyles();
    const [appointments, setAppointments] = useState([]);
    const [anchorEl, setAnchorEl] = useState(null);
    const [error, setError] = useState("Loading...");

    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;

    let history = useHistory();

    useEffect(() => {
        const fetchData = async () => {
            const data = await fetch(`${constant.API_URL}/api/appointments`,
                { method: "GET", headers: { "Content-Type": "application/json" } });
            setAppointments(await data.json());
        };
        fetchData();

    }, [])

    const onClickEditAppointment = (id) => {
        console.log(id);

    };

    const onClickCancelAppointment = async (event, id) => {
        try {
            setAnchorEl(event.currentTarget);
            const data = await fetch(`${constant.API_URL}/api/appointments/${id}/cancel`,
                {
                    method: "POST", headers: { "Content-Type": "application/json" }
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
                                    onClick={() => onClickEditAppointment(el.id)}>
                                    <EditIcon />
                                </IconButton>
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
