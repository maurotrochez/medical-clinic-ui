import React from 'react'
import {BrowserRouter as Router, Link, Switch, Route} from "react-router-dom";
import AppointmentList from '../appointment/AppointmentList';
import PatientList from '../patient/PatientList';
import ManageAppointment from '../appointment/ManageAppointment';

export default function Header() {
    return (
        <Router>
            <div>
                <Link to="/">Home</Link> | <Link to="/patients">Patients</Link>
            </div>
            <Switch>
                <Route exact path="/" component={AppointmentList}/>
                <Route path="/patients" component={PatientList}/>
                <Route path="/appointments/:id" component={ManageAppointment}/>
                <Route exact path="/appointments/new" component={ManageAppointment}/>
            </Switch>
        </Router>
    )
}
