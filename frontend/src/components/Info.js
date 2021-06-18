import React, { useEffect } from 'react'
import axios from 'axios'
import Cookies from 'universal-cookie';
import { useHistory } from 'react-router-dom';
const cookies = new Cookies();

const Info = () => {

    let history = useHistory();
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
                    history.push("/login")
                }
            }else{
                history.push("/login")
            }
        }
        
        check()

    }, [jwt, history])

    return (
        <div>
            Info
        </div>
    )
}

export default Info
