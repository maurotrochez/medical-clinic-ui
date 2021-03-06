import React, { useState, useEffect, useContext } from "react";
import { TextField, MenuItem, Button, CssBaseline, Container } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import * as constant from "../../utils/constants";
import { useHistory } from "react-router-dom";
import AuthGlobal from "../../context/store/AuthGlobal";

const useStyles = makeStyles((theme) => ({
    root: {
        '& .MuiTextField-root': {
            margin: theme.spacing(1),
            width: '25ch',
        },
    },
    textField: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
        width: 200,
    },
}));

export default function ManageAppointment(props) {
    const classes = useStyles();
    const history = useHistory();
    const context = useContext(AuthGlobal);

    const [appointment, setAppointment] = useState({
        notes: "",
        appointmentTypeId: 1,
        patientId: 1,
        date: "",
        isCancelled: false,

    });
    const [patients, setPatients] = useState([{ id: 1 }]);
    const [appointmentTypes, setAppointmentTypes] = useState([{ id: 1 }]);
    const [error, setError] = useState("");
    const [showChild, setShowChild] = useState(false);

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

        const fetchAppTypes = async () => {
            try {
                const data = await fetch(`${constant.API_URL}/api/appointmentTypes`,
                    {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `bearer ${jwt}`
                        },
                    });

                setAppointmentTypes(await data.json());
            } catch (error) {

            }
        }

        fecthPatients();
        fetchAppTypes();

    }, [context.stateUser.isAuthenticated, props.history]);

    const handleChanging = (event) => {
        const { name, value } = event.target;
        setAppointment((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const onSave = async (e) => {
        e.preventDefault();
        const jwt = localStorage.getItem("jwt");
        try {
            const data = await fetch(`${constant.API_URL}/api/appointments`, {
                method: "POST",
                headers: { "Content-Type": "application/json", Authorization: `bearer ${jwt}` },
                body: JSON.stringify(appointment)
            });

            if (data.ok) history.push("/");
            else setError((await data.json()).errorMessage)

        } catch (error) {
            console.log(error);
        }
    }
    if (!showChild) return null;
    return (
        <Container >
            <CssBaseline />
            <form autoComplete="off" className={classes.root}>
                <div>
                    <TextField
                        id="appointmentTypeId"
                        select
                        label="Appointment type"
                        value={appointment.appointmentTypeId}
                        onChange={handleChanging}
                        name="appointmentTypeId"
                        helperText="Please select an appointment type"
                    >
                        {appointmentTypes.map((option) => (
                            <MenuItem key={option.id} value={option.id}>
                                {option.description}
                            </MenuItem>
                        ))}
                    </TextField>
                    <TextField
                        id="patientId"
                        select
                        label="Patient"
                        value={appointment.patientId}
                        onChange={handleChanging}
                        name="patientId"
                        helperText="Please select a patient"
                    >
                        {patients.map((option) => (
                            <MenuItem key={option.id} value={option.id}>
                                {`${option.firstName} ${option.lastName} (${option.identificationNumber})`}
                            </MenuItem>
                        ))}
                    </TextField>
                    <TextField
                        id="date"
                        label="Date appointment"
                        type="datetime-local"
                        name="date"
                        className={classes.textField}
                        InputLabelProps={{
                            shrink: true,
                        }}
                        value={appointment.date}
                        onChange={handleChanging}
                        required
                    />
                </div>
                <div>
                    <TextField required id="notes" label="Notes" type="text" value={appointment.notes} name="notes" onChange={handleChanging} multiline
                        rows={4} />
                </div>
                {error &&
                    <div>
                        <span>{error}</span>
                    </div>
                }

                <Button variant="contained" color="primary" onClick={onSave} disabled={!!(!appointment.date || !appointment.notes || !appointment.patientId)}>
                    Save
                </Button>
            </form>
        </Container>
    )
}
