import React, { useState, useEffect } from 'react';
import { Grid } from '@material-ui/core';

import config from '../data/config';

import axios from 'axios';

import Cookies from 'universal-cookie';

import ItemCard from '../childComponents/ItemCard';
import useStyles from '../styles/Admin';

import withWidth from '@material-ui/core/withWidth';

import {
    useHistory
} from "react-router-dom";

const cookies = new Cookies();

const sizes = {
    xs: 10,
    sm: 10,
    md: 6,
    lg: 4,
};

const justifys = {
    xs: "center",
    sm: "center",
    md: "flex-start",
    lg: "flex-start",
}


function Admin(props) {

    const { width, setadmin } = props;

    const size = sizes[width];
    const justify = justifys[width];

    const [user, setuser] = useState([])

    const classes = useStyles();

    const history = useHistory();
    const jwt = cookies.get("jwt")

    useEffect(() => {

        const check = async () => {

            if (jwt !== undefined && jwt !== "" && jwt !== null) {

                let res = await axios.get(`${config.REACT_APP_API}/admin`,
                    {
                        headers: { 'Authorization': `Bearer ${jwt}` }
                    }
                )

                res = res.data

                if (!res.status) {
                    history.push("/login")
                } else {

                    if (res.body.data.user.lenth !== 0) {
                        setuser(res.body.data.user)
                        setadmin({
                            status: true,
                            data: {
                                user: res.body.data.user
                            }
                        })
                    }

                }

            } else {
                history.push("/login")
            }
        }

        check()

    }, [jwt, history])


    return (
        <Grid container spacing={3} justify={justify} alignItems="center">

            {
                user.map((u, id) => {
                    return (
                        <Grid key={id} className={classes.grid} item xs={size}>
                            <ItemCard user={u} />
                        </Grid>
                    )
                })
            }

        </Grid>
    );
}

export default withWidth()(Admin);