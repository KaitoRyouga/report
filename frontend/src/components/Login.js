import { Button, Grid, TextField } from '@material-ui/core'
import { Alert } from '@material-ui/lab'
import React, { useState } from 'react'
import Cookies from 'universal-cookie';

import config from '../data/config';

import {
    useHistory
} from "react-router-dom";

import axios from 'axios'

const cookies = new Cookies();

const Login = ({ setlogin }) => {

    console.log("Login")

    let history = useHistory();

    const [user, setuser] = useState({
        username: "",
        password: ""
    })
    const [checkErr, setcheckErr] = useState(false)
    const [message, setmessage] = useState({})

    const onHandleLoginWithEnter = (e) => {
        if (e.nativeEvent.key === "Enter") {
            onHandleLogin()
        }
    }

    const onHandleLogin = async () => {
        
        if (user.username === "" || user.password === "") {

            setcheckErr(true)
            setmessage({
                status: false,
                body: {
                    message: "Missing username/password!"
                }
            })
    
        } else {

            let res = await axios.post(`${config.REACT_APP_API}/login`, user)
            res = res.data

            if (res.status) {

                cookies.set('jwt', res.body.data.jwt)
                setlogin(true)
                history.push("/")

            } else {

                setmessage(res)
                setcheckErr(true)

            }
        }
    }

    return (

        <Grid spacing={5} direction="row" justify="center" alignItems="center" style={{ marginTop: '1em' }} container>

            <Grid item xs={8}>
                <TextField onKeyPress={onHandleLoginWithEnter} onChange={e => setuser({ ...user, username: e.target.value })} label="Username"></TextField>
            </Grid>
            
            <Grid item xs={8}>
                <TextField onKeyPress={onHandleLoginWithEnter} onChange={e => setuser({ ...user, password: e.target.value })} label="Password"></TextField>
            </Grid>
            
            {
                checkErr && (
                    <Grid item xs={8}>
                        <Alert severity='error'>{message.body.message}</Alert>
                    </Grid>
                )
            }

            <Grid item xs={5}>
                <Button onClick={onHandleLogin}>Login</Button>
            </Grid>

        </Grid>

    )
}

export default Login
