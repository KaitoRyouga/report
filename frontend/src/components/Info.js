import React, { useEffect, useState } from 'react'
import axios from 'axios'
import Cookies from 'universal-cookie';
import { useHistory, Redirect } from 'react-router-dom';
const cookies = new Cookies();

const Info = () => {

    const [login, setlogin] = useState(false)
    const history = useHistory();
    const jwt = cookies.get("jwt")

    useEffect(() => {

        const check = async () => {
            
            if (jwt !== undefined && jwt !== "" && jwt !== null) {
                let res = await axios.get(`${process.env.REACT_APP_API}/info`,
                    {
                        headers: { 'Authorization': `Bearer ${jwt}` }
                    }
                )

                res = res.data

                if (!res.status) {
                    setlogin(true)
                }
            }else{
                setlogin(true)
            }
        }
        
        check()

    }, [jwt, history])

    return (
        <div>
            {
                login && <Redirect to="/login" />
            }
            Info
        </div>
    )
}

export default Info
