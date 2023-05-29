import React, {Fragment, useState} from "react";
import axios from "axios";
import {
    Box,
    Button,
    Card,
    CardContent,
    Container, Modal,
    TextField,
    Typography
} from "@mui/material";
import {ErrorRounded, CheckCircle} from "@mui/icons-material";
import Header from "../layouts/Header";

function Register() {
    const [user, setUser] = useState({});
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [openModal, setOpenModal] = useState(false);
    const [error, setError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const handleFirstName = (e) => {
        setFirstName(e.target.value);
    }

    const handleLastName = (e) => {
        setLastName(e.target.value);
    }

    const handleEmail = (e) => {
        setEmail(e.target.value);
    }

    const handlePassword = (e) => {
        setPassword(e.target.value);
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.post('http://localhost:8000/api/register', {
            firstName: firstName,
            lastName: lastName,
            email: email,
            password: password
        }).then(function(res) {
            if(res.data.user) {
                localStorage.setItem('user', JSON.stringify(res.data.user));
                setUser(res.data.user);
                setOpenModal(!openModal);
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
            <Container className="register-container" fixed>
                <div className="register-wrapper">
                    <div className="register-box-wrapper">
                        <Box sx={{
                            width: '100%',
                            maxWidth: 450
                        }}>
                            <Card variant="outlined">
                                <CardContent>
                                    <Typography variant="h4" align="center" gutterBottom>
                                        Register
                                    </Typography>
                                    <form className="register-form" onSubmit={handleSubmit}>
                                        <TextField fullWidth
                                                   required
                                                   variant="outlined"
                                                   id="user-first-name"
                                                   label="First Name"
                                                   margin="normal"
                                                   type="text"
                                                   onChange={handleFirstName}
                                        />
                                        <TextField fullWidth
                                                   required
                                                   variant="outlined"
                                                   id="user-last-name"
                                                   label="Last Name"
                                                   margin="normal"
                                                   type="text"
                                                   onChange={handleLastName}
                                        />
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
                                                id="register-submit">
                                            Register
                                        </Button>
                                    </form>
                                </CardContent>
                            </Card>
                        </Box>
                    </div>
                </div>
                <Modal
                    open={openModal}
                    onClose={() => setOpenModal(!openModal)}
                    >
                    <Box sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        display: 'flex',
                        flexFlow: 'column nowrap',
                        justifyContent: 'flex-start',
                        p: 2,
                        width: 400,
                        bgcolor: 'background.paper',
                        boxShadow: 24,
                    }}>
                        <div className="icon-wrapper">
                            {Object.keys(user).length > 0 &&
                                <CheckCircle color="success" sx={{ fontSize: 40}} />
                            }
                            {error &&
                                <ErrorRounded color="error" sx={{ fontSize: 40}} />
                            }
                        </div>
                        <div className="text-wrapper">
                            {Object.keys(user).length > 0 &&
                                <Fragment>
                                    <Typography variant="h4" align="center" gutterBottom>
                                        User is successfully created!
                                    </Typography>
                                    <Typography variant="subtitle1" align="center" gutterBottom>
                                        Please click continue to set preferences.
                                    </Typography>
                                    <Button type="submit"
                                            variant="contained"
                                            color="primary"
                                            fullWidth={true}
                                            href="/preferences"
                                            id="preference-submit">
                                        Continue
                                    </Button>
                                </Fragment>
                            }
                            {error &&
                                <Typography variant="h4" align="center" gutterBottom>
                                    {errorMessage}
                                </Typography>
                            }
                        </div>
                    </Box>
                </Modal>
            </Container>
        </Fragment>
    )
}

export default Register;