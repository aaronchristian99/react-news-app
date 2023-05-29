import React, {Fragment, useState} from "react";
import {useNavigate} from "react-router-dom";
import axios from "axios";
import {
    Box,
    Button,
    Card,
    CardContent,
    Container,
    FormControl,
    InputLabel,
    Link,
    TextField, Typography
} from "@mui/material";
import Header from "../layouts/Header";

function Login() {
    let [email, setEmail] = useState('');
    let [password, setPassword] = useState('');
    let [error, setError] = useState(false);
    let [errorMessage, setErrorMessage] = useState('');

    const navigate = useNavigate();

    const handleEmail = (e) => {
        setEmail(e.target.value);
    }

    const handlePassword = (e) => {
        setPassword(e.target.value);
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.post('http://localhost:8000/api/login', {
            email: email,
            password: password
        }).then(function(res) {
            if(res.data.user) {
                localStorage.setItem('user', JSON.stringify(res.data.user));
                navigate('/');
            } else {
                setError(true);
                setErrorMessage('Something went wrong. Please try agian later');
            }
        }).catch(function(error) {
            setError(true);
            setErrorMessage(error.response ? error.response.data.message : 'Oops, something went wrong!');
        });
    }

    return(
        <Fragment>
            <Header />
            <Container className="login-container" fixed>
                <div className="login-wrapper">
                    <div className="login-box-wrapper">
                        <Box sx={{
                            width: '100%',
                            maxWidth: 300,
                        }}>
                            <Card variant="outlined">
                                <CardContent>
                                    <Typography variant="h4" align="center" gutterBottom>
                                        Login
                                    </Typography>
                                    <form className="login-form" onSubmit={handleSubmit}>
                                        <TextField fullWidth
                                                   required
                                                   variant="outlined"
                                                   id="user-email"
                                                   label="Email Address"
                                                   margin="normal"
                                                   type="email"
                                                   onChange={handleEmail}
                                        />
                                        <TextField fullWidth
                                                   required
                                                   variant="outlined"
                                                   id="user-password"
                                                   label="Password"
                                                   type="password"
                                                   margin="normal"
                                                   onChange={handlePassword}
                                        />
                                        <Button type="submit"
                                                variant="contained"
                                                color="primary"
                                                fullWidth={true}
                                                id="login-submit">
                                            Login
                                        </Button>
                                    </form>
                                </CardContent>
                            </Card>
                            <div className="login-register-user">
                                <p>
                                    Do not have an account?
                                    <Link href="/register"
                                          color="primary"
                                          id="register-link">
                                        Register here
                                    </Link>
                                    .
                                </p>
                            </div>
                        </Box>
                    </div>
                </div>
            </Container>
        </Fragment>
    )
}

export default Login;