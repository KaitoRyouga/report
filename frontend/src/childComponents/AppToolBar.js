import React from 'react'

import {
    IconButton,
    Button,
    Typography,
    Toolbar,
    AppBar
} from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';

import Cookies from 'universal-cookie';

import {
    Link,
    useHistory
} from "react-router-dom";

import useStyles from '../styles/App';

const cookies = new Cookies();

const AppToolBar = ({ login, username, setlogin }) => {

    const history = useHistory()
    const classes = useStyles();

    const logout = () => {

        cookies.remove("jwt")
        setlogin(false)
        history.push('/login')
    }

    return (

        <div className={classes.root}>

            <AppBar position="static">

                <Toolbar>

                    <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
                        <MenuIcon />
                    </IconButton>

                    <Typography variant="h6" className={classes.title}>
                        Report
                    </Typography>

                    {
                        login && (
                            <>
                                <Button color="inherit">
                                    <Link className={classes.link} to="/">
                                        <p>Home</p>
                                    </Link>
                                </Button>

                                <Button color="inherit">
                                    <Link className={classes.link} to="/info">
                                        <p>Info</p>
                                    </Link>
                                </Button>

                                {
                                    username === "kaito" && (
                                        <Button color="inherit">
                                            <Link className={classes.link} to="/admin">
                                                <p>Admin</p>
                                            </Link>
                                        </Button>
                                    )
                                }

                                <Button onClick={logout} color="inherit">
                                    Logout
                                </Button>
                            </>
                        )
                    }

                </Toolbar>

            </AppBar>

        </div>

    )
}

export default AppToolBar
