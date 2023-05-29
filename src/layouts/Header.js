import React, {Fragment, useState} from "react";
import {Avatar, Button, Container, Typography} from "@mui/material";
import {NavLink} from "react-router-dom";
import {deepOrange} from "@mui/material/colors";

function Header() {
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));
    let userName = '';

    if(user !== null) {
        userName = user.first_name + ' ' + user.last_name;
    }

    function stringAvatar(name) {
        return {
            sx: {
                bgcolor: deepOrange[500],
                color: 'white'
            },
            children: `${name.split(' ')[0][0]}${name.split(' ')[1][0]}`,
        };
    }

    return(
        <header>
            <div className="header-wrapper">
                <NavLink to="/">
                    <Typography variant="h5" color="white" component="div">
                        New Aggregater App
                    </Typography>
                </NavLink>
                {user !== null &&
                    <div className="user-avatar-wrapper">
                        <NavLink className="links"
                                 to="/user-preferences">
                            <Avatar {...stringAvatar(userName)} className="user-avatar"/>
                            <Typography variant="h5" component="div" sx={{ml: 1}} className="user-avatar-name">
                                {userName}
                            </Typography>
                        </NavLink>
                    </div>
                }
            </div>
        </header>
    )
}

export default Header;