import React, { useEffect, useState, lazy, Suspense } from 'react';

import axios from 'axios';

import Cookies from 'universal-cookie';

import CircularProgress from '@material-ui/core/CircularProgress';

import {
    Switch,
    Route,
    useHistory
} from "react-router-dom";

import config from './data/config';

const Login = lazy(() => import('./components/Login'));
const Home = lazy(() => import('./components/Home'));
const Info = lazy(() => import('./components/Info'));
const Admin = lazy(() => import('./components/Admin'));
const AppToolBar = lazy(() => import('./childComponents/AppToolBar'));

const cookies = new Cookies();

const Load = () => {
    return (
        <CircularProgress color="secondary" />
    )
}

function App() {

    console.log("App")

    const history = useHistory();
    const [login, setlogin] = useState(false)
    const [data, setdata] = useState({
        username: "",
        task: []
    })

    const jwt = cookies.get("jwt")

    useEffect(() => {

        const check = async () => {

            if (jwt !== undefined && jwt !== "" && jwt !== null) {

                let res = await axios.get(`${config.REACT_APP_API}/info`,
                    {
                        headers: { 'Authorization': `Bearer ${jwt}` }
                    }
                )

                res = res.data

                if (!res.status) {
                    history.push("/login")
                } else {

                    if (res.body.data.task[0] !== "") {

                        setdata({
                            username: res.body.data.username,
                            task: res.body.data.task
                        })

                    }

                }

            } else {
                history.push("/login")
            }
        }

        check()

    }, [jwt, history, login])

    return (
        <div className="App">

            <Suspense fallback={<Load />}>
                <AppToolBar login={login} username={data.username} setlogin={setlogin} />
            </Suspense>

            <div>
                <Switch>

                    <Route exact path="/">
                        <Suspense fallback={<Load />}>
                            <Home list={data.task} username={data.username} setList={e => setdata({ ...data, task: e })} />
                        </Suspense>
                    </Route>

                    <Route path="/login">
                        <Suspense fallback={<Load />}>
                            <Login setlogin={setlogin} />
                        </Suspense>
                    </Route>

                    <Route path="/info">
                        <Suspense fallback={<Load />}>
                            <Info username={data.username} />
                        </Suspense>
                    </Route>

                    <Route path="/admin">
                        <Suspense fallback={<Load />}>
                            <Admin username={data.username} />
                        </Suspense>
                    </Route>

                </Switch>
            </div>
        </div>
    );
}

export default App;
