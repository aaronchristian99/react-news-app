import React, {Fragment, useState} from "react";
import {useNavigate} from "react-router-dom";
import {Box, Button, Container, Typography} from "@mui/material";
import News from "../layouts/News";
import Header from "../layouts/Header";

function Home() {
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));
    const navigate = useNavigate();

    const registerUser = () => {
        navigate('/register');
    }

    const loginUser = () => {
        navigate('/login');
    }

    return(
        <Fragment>
            <Header />
            <Container className="home-container">
                <div className="home-wrapper">
                    {user === null &&
                        <Box sx={{
                                p: 2
                            }}
                            className="home-box-wrapper">
                            <Typography variant="h2" align="center" gutterBottom component="div" color="white">
                                Read personalized news from over 80,000 + articles.
                            </Typography>
                            <div className="button-container">
                                <Button variant="contained"
                                        onClick={registerUser}>
                                    Get Started
                                </Button>
                                <Button variant="contained"
                                        onClick={loginUser}>
                                    Login
                                </Button>
                            </div>
                        </Box>
                    }
                    {user !== null &&
                        <News />
                    }
                </div>
            </Container>
        </Fragment>
    )
}

export default Home;