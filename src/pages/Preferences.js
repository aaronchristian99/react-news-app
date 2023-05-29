import React, {Fragment, useState, useEffect} from "react";
import {useNavigate} from "react-router-dom";
import axios from "axios";
import {
    Box,
    Button,
    Checkbox,
    Container,
    FormControlLabel, Paper,
    Typography
} from "@mui/material";
import Header from "../layouts/Header";
import {ErrorRounded} from "@mui/icons-material";

function Preferences() {
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));
    const [preferences, setPreferences] = useState({categories: [], authors: [], sources: []});
    const [data, setData] = useState({});
    const[step, setStep] = useState({});
    const [error, setError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const navigate = useNavigate();

    useEffect(() => {
        setError(false);

        axios.get('http://localhost:8000/api/fetch-preference-list')
            .then(function(res) {
                if(res.data.preferences) {
                    setData(res.data.preferences)
                    setStep({
                        id: 1,
                        name: 'categories'
                    });
                }
            })
            .catch(function(error) {
                console.log(error);
            });
    }, []);

    const handleCheckboxChange = (e) => {
        const { value, checked } = e.target;

        if(checked) {
            setPreferences({
                ...preferences,
                [step.name]: [...preferences[step.name], parseInt(value)]
            });
        } else {
            setPreferences({
                ...preferences,
                [step.name]: preferences[step.name].filter(item => item !== parseInt(value))
            });
        }
    }

    const handleNext = (e) => {
        e.preventDefault();

        switch(step.id) {
            case 1:
                setStep({
                    id: 2,
                    name: 'sources'
                });
                break;

            case 2:
                setStep({
                    id: 3,
                    name: 'authors'
                });
                break;

            case 3:
                handlePreferences();
                break;

            default:
                break;
        }
    }

    const handleBack = (e) => {
        e.preventDefault();

        switch(step.id) {
            case 2:
                setStep({
                    id: 1,
                    name: 'categories'
                });
                break;

            case 3:
                setStep({
                    id: 2,
                    name: 'sources'
                });
                break;

            default:
                break;
        }
    }

    const handlePreferences = () => {
        setError(false);

        axios.post('http://localhost:8000/api/store-user-preferences', {
            userId: user.id,
            sources: preferences.sources,
            categories: preferences.categories,
            authors: preferences.authors
            }).then(function(res) {
                if(res.data.sources && res.data.categories && res.data.authors) {
                    navigate('/');
                } else {
                    setError(true);
                    setErrorMessage('Something went wrong. Please try again later');
                }
            }).catch(function(error) {
                setError(true);
                setErrorMessage(error.response ? error.response.data.message : 'Oops, something went wrong!');
            });
    }

    return(
        <Fragment>
            <Header />
            <Container className="preference-container" fixed>
                <div className="preference-wrapper">
                    <Typography variant="h4" align="center" gutterBottom>
                        Select Preferences - <span className="preference-type">{step.name && step.name}</span>
                    </Typography>
                    {error &&
                        <Paper elevation="2" sx={{
                            p: 2,
                            bgcolor: '#1e1e1e',
                            color: 'white',
                            display: 'flex',
                            flexFlow: 'row nowrap',
                            justifyContent: 'flex-start',
                            alignItems: 'center',
                            columnGap: 2
                        }}>
                            <ErrorRounded color="error" size="large" />
                            {errorMessage}
                        </Paper>
                    }
                    <Box sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        flexWrap: 'wrap',
                        ml: 20,
                        mt: 20
                    }}>
                        <div className="checkbox-wrapper">
                            {data && data[step.name] && data[step.name].length !== 0 &&
                                data[step.name].map(datum => {
                                    return (
                                        <FormControlLabel
                                            key={datum.id}
                                            control={<Checkbox
                                                checked={preferences && preferences[step.name] &&  preferences[step.name].includes(datum.id)}
                                                onChange={handleCheckboxChange}
                                                inputProps={{ 'aria-label': `${datum.name} checkbox`}}
                                                value={datum.id}
                                            /> }
                                            label={datum.name}
                                        />
                                    )
                                })}
                        </div>
                    </Box>
                    <Box sx={{
                        padding: '20px',
                        ml: 20
                    }}>
                        {data && data[step.name] && data[step.name].length !== 0 &&
                            <div className="next-prev-button-container">
                                {step.id !== 1 &&
                                    <Button variant="contained"
                                            color="primary"
                                            id="prev-button"
                                            onClick={handleBack}>
                                        Back
                                    </Button>
                                }
                                <Button variant="contained"
                                        color="primary"
                                        id="next-button"
                                        onClick={handleNext}>
                                    {step.id === 3 ? 'Done' : 'Next'}
                                </Button>
                            </div>
                        }
                    </Box>
                </div>
            </Container>
        </Fragment>
    )
}

export default Preferences;