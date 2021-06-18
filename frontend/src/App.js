import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';

// import css
import './styles/App.css'

// router
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    Redirect
} from "react-router-dom";

import Cookies from 'universal-cookie';

// import components
import Home from './components/Home'
import Login from './components/Login'
import Info from './components/Info'

const cookies = new Cookies();

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    menuButton: {
        marginRight: theme.spacing(2),
    },
    title: {
        flexGrow: 1,
    },
}));

function App() {

    const [logout, setlogout] = useState(false)
    const classes = useStyles();

    return (
        <div className="App">
            <Router>

                {
                    logout && <Redirect to="/login" />
                }

                <div>
                    <div className={classes.root}>
                        <AppBar position="static">
                            <Toolbar>
                                <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
                                    <MenuIcon />
                                </IconButton>
                                <Typography variant="h6" className={classes.title}>
                                    News
                                </Typography>
                                <Button color="inherit">
                                    <Link className="link" to="/">
                                        <p>Home</p>
                                    </Link>
                                </Button>
                                <Button color="inherit">
                                    <Link className="link" to="/login">
                                        <p>Login</p>
                                    </Link>
                                </Button>
                                <Button color="inherit">
                                    <Link className="link" to="/info">
                                        <p>Info</p>
                                    </Link>
                                </Button>
                                <Button onClick={() => {
                                    cookies.remove("jwt")
                                    setlogout(true)
                                }} color="inherit">
                                    Logout
                                </Button>

                            </Toolbar>
                        </AppBar>
                    </div>

                    <Switch>
                        <Route exact path="/">
                            <Home />
                        </Route>
                        <Route path="/login">
                            <Login />
                        </Route>
                        <Route path="/info">
                            <Info />
                        </Route>
                    </Switch>
                </div>
            </Router>
        </div>
    );
}

export default App;