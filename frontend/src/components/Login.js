import { Button, Grid, TextField } from '@material-ui/core'
import { Alert } from '@material-ui/lab'
import React, { useState, useEffect } from 'react'
import Cookies from 'universal-cookie';
import { Redirect } from 'react-router-dom';

import axios from 'axios'

const cookies = new Cookies();

const Login = () => {

    const [login, setlogin] = useState(false)

    const [user, setuser] = useState({
        username: "",
        password: ""
    })
    const [check, setcheck] = useState(false)
    const [message, setmessage] = useState({
        status: false,
        body: {
            message: "1123"
        }
    })

    const onHandleLoginWithEnter = (e) => {
        if (e.nativeEvent.key === "Enter") {
            onHandleLogin()
        }
    }

    const onHandleLogin = async () => {
        if (user.username === "" || user.password === "") {
            setcheck(true)
            setmessage({
                status: false,
                body: {
                    message: "Error!"
                }
            })
        } else {

            // call api

            let res = await axios.post(`${process.env.REACT_APP_API}/login`, user)
            res = res.data

            console.log(res)

            if (res.status) {
                setcheck(true)
                setmessage(res)

                cookies.set('jwt', res.body.data.jwt)
                setlogin(true)

            } else {
                setcheck(true)
                setmessage(res)
            }
        }
    }

    const jwt = cookies.get('jwt')

    useEffect(() => {
        const check = async () => {
            try {
                if (jwt !== undefined) {

                    let res = await axios.get(`${process.env.REACT_APP_API}/info`, {
                        headers: {
                            Authorization: `Bearer ${jwt}`
                        }
                    })

                    res = res.data

                    if (res.status) {
                        setlogin(true)
                    }
                }
            } catch (error) {
                console.log(error)
            }
        }

        check()

    }, [jwt])

    return (
        <Grid spacing={5} direction="row" justify="center" alignItems="center" style={{ marginTop: '1em' }} container>

            {
                login && <Redirect to="/" />
            }

            <Grid item xs={8}>
                <TextField onKeyPress={onHandleLoginWithEnter} onChange={e => setuser({ ...user, username: e.target.value })} label="Username"></TextField>
            </Grid>
            <Grid item xs={8}>
                <TextField onKeyPress={onHandleLoginWithEnter} onChange={e => setuser({ ...user, password: e.target.value })} label="Password"></TextField>
            </Grid>
            {
                check && (
                    <Grid item xs={8}>
                        <Alert severity={(message.status && 'success') || 'error'}>{message.body.message}</Alert>
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
