import React, { useEffect, useState } from "react";
import * as constant from "../../utils/constants";
import { List, ListItem, ListItemSecondaryAction, IconButton, Divider, ListItemText, Button, Container } from "@material-ui/core";
import EditIcon from "@material-ui/icons/Edit";
import CancelIcon from '@material-ui/icons/Cancel';
import { useHistory } from "react-router-dom";

export default function AppointmentList() {
    const [appointments, setAppointments] = useState([]);

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

    const onClickCancelAppointment = (id) => {
        console.log(id);
    }

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
                                    onClick={() => onClickCancelAppointment(el.id)}>
                                    <CancelIcon />
                                </IconButton>
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
