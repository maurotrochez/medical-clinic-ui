import React, { useEffect, useState } from "react";
import * as constant from "../../utils/constants";
import { List } from "@material-ui/core";

export default function AppointmentList() {
    const [appointments, setAppointments] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const data = await fetch(`${constant.API_URL}/api/appointments`,
                { method: "GET", headers: { "Content-Type": "application/json" } });
            setAppointments(await data.json());
        };
        fetchData();

    }, [])
    return (
        <div>
            <List>
                {appointments && appointments.map((el) => (
                    <div key={el.id}>{el.patient.firstName}</div>
                ))}
            </List>
        </div>
    )
}
