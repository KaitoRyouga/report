import { Button, Grid, TextField } from '@material-ui/core'
import { Alert } from '@material-ui/lab'
import React, { useState } from 'react'
import Cookies from 'universal-cookie';
import '../assets/style.css'    

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
        <div>
            <section className="ftco-section">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-md-6 text-center mb-5">
              <h2 className="heading-section">Login #10</h2>
            </div>
          </div>
          <div className="row justify-content-center">
            <div className="col-md-6 col-lg-4">
              <div className="login-wrap p-0">
                <h3 className="mb-4 text-center">Have an account?</h3>
                <form action="#" className="signin-form">
                  <div className="form-group">
                    <input type="text" className="form-control" onKeyPress={onHandleLoginWithEnter} onChange={e => setuser({ ...user, username: e.target.value })} placeholder="Username" required />
                  </div>
                  <div className="form-group">
                    <input id="password-field" type="password" className="form-control" onKeyPress={onHandleLoginWithEnter} onChange={e => setuser({ ...user, password: e.target.value })} placeholder="Password" required />
                    <span toggle="#password-field" className="fa fa-fw fa-eye field-icon toggle-password" />
                  </div>
                  {
                 checkErr && (
                     <Grid item xs={8}>
                         <Alert severity='error'>{message.body.message}</Alert>
                     </Grid>
                 )
             }
                  <div className="form-group">
                    <button onClick={onHandleLogin} className="form-control btn btn-primary submit px-3">Sign In</button>
                  </div>
                  <div className="form-group d-md-flex">
                    <div className="w-50">
                      <label className="checkbox-wrap checkbox-primary">Remember Me
                        <input type="checkbox" defaultChecked />
                        <span className="checkmark" />
                      </label>
                    </div>
                    <div className="w-50 text-md-right">
                      <a href="#" style={{color: '#fff'}}>Forgot Password</a>
                    </div>
                  </div>
                </form>
                <p className="w-100 text-center">— Or Sign In With —</p>
                <div className="social d-flex text-center">
                  <a href="#" className="px-2 py-2 mr-md-1 rounded"><span className="ion-logo-facebook mr-2" /> Facebook</a>
                  <a href="#" className="px-2 py-2 ml-md-1 rounded"><span className="ion-logo-twitter mr-2" /> Twitter</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
        </div>

        // <Grid spacing={5} direction="row" justify="center" alignItems="center" style={{ marginTop: '1em' }} container>

        //     <Grid item xs={8}>
        //         <TextField onKeyPress={onHandleLoginWithEnter} onChange={e => setuser({ ...user, username: e.target.value })} label="Username"></TextField>
        //     </Grid>

        //     <Grid item xs={8}>
        //         <TextField onKeyPress={onHandleLoginWithEnter} onChange={e => setuser({ ...user, password: e.target.value })} label="Password"></TextField>
        //     </Grid>

        //     {
        //         checkErr && (
        //             <Grid item xs={8}>
        //                 <Alert severity='error'>{message.body.message}</Alert>
        //             </Grid>
        //         )
        //     }

        //     <Grid item xs={5}>
        //         <Button onClick={onHandleLogin}>Login</Button>
        //     </Grid>

        // </Grid>

    )
}

export default Login
