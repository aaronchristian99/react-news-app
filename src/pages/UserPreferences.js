import React, {Fragment, useState, useEffect} from "react";
import {useNavigate} from "react-router-dom";
import axios from "axios";
import {Delete, ErrorRounded} from "@mui/icons-material";
import {
    Box,
    Button,
    Checkbox,
    Container,
    FormControlLabel,
    Modal, Paper,
    TextField,
    Typography
} from "@mui/material";
import Header from "../layouts/Header";

function UserPreferences() {
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));
    const [userPreferences, setUserPreferences] = useState({categories: [], sources: [], authors: []});
    const [preferences, setPreferences] = useState({categories: [], sources: [], authors: []})
    const [data, setData] = useState({});
    const [newPassword, setNewPassword] = useState('');
    const [newConfirmPassword, setNewConfirmPassword] = useState('');
    const [removeModal, setRemoveModal] = useState(false);
    const [addModal, setAddModal] = useState(false);
    const [currentModal, setCurrentModal] = useState('');
    const [error, setError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const navigate = useNavigate();
    let tempPassword = '';

    useEffect(() => {
        setError(false);
        const requestUserPreferences = axios.get('http://localhost:8000/api/fetch-user-preferences', {
            params: {userId: user.id}
        });
        const requestPreferencesList = axios.get('http://localhost:8000/api/fetch-preference-list');

        axios.all([requestUserPreferences, requestPreferencesList])
            .then(function(res) {
                if(res[0].data.userPreferences) {
                    setUserPreferences(res[0].data.userPreferences);
                } else {
                    setError(true);
                    setErrorMessage('Unable to get user preferences.');
                }

                if(res[1].data.preferences) {
                    setData(res[1].data.preferences);
                } else {
                    setError(true);
                    setErrorMessage('Unable to get user preferences.');
                }
            }).catch(function(error) {
                setError(true);
                setErrorMessage(error.response ? error.response.data.message : 'Oops, something went wrong!');
            });
    }, []);

    const handleCheckboxChange = (e) => {
        const { value, checked } = e.target;
        if(checked) {
            setPreferences(prevPreferences => ({
                ...prevPreferences,
                [currentModal]: [...prevPreferences[currentModal], value]
            }));
        } else {
            setPreferences(prevPreferences => ({
                ...prevPreferences,
                [currentModal]: prevPreferences[currentModal].filter(item => item !== value)
            }));
        }
    }

    const handleNewPassword = (e) => {
        tempPassword = e.target.value;
    }

    const handleConfirmNewPassword = (e) => {
        setNewPassword(e.target.value);
    }

    const handlePasswordChange = (e) => {
        setError(false);
        e.preventDefault();
        axios.post('/api/change-password', {
            userId: user.id,
            newPassword: newPassword,
            tempPassword: tempPassword
        }).then(function(res) {
            if(res.data.user) {
                console.log('Successfully changed the password!');
            } else {
                console.log('Unable to change the password!');
            }
        }).catch(function(error) {
            setError(true);
            setErrorMessage(error.response ? error.response.data.message : 'Oops, something went wrong!');
        });
    }

    const handleRemoveCategory = (e) => {
        e.preventDefault();
        setRemoveModal(!removeModal);
        setCurrentModal('categories');
    }

    const handleAddCategory = (e) => {
        e.preventDefault();
        setAddModal(!addModal);
        setCurrentModal('categories');
    }

    const handleRemoveSource = (e) => {
        e.preventDefault();
        setRemoveModal(!removeModal);
        setCurrentModal('sources');
    }

    const handleAddSource = (e) => {
        e.preventDefault();
        setAddModal(!addModal);
        setCurrentModal('sources');
    }

    const handleRemoveAuthor = (e) => {
        e.preventDefault();
        setRemoveModal(!removeModal);
        setCurrentModal('authors');
    }

    const handleAddAuthor = (e) => {
        e.preventDefault();
        setAddModal(!addModal);
        setCurrentModal('authors');
    }

    const removePreference = (preference, preferenceId) => {
        setPreferences(prevPreferences => ({
            ...prevPreferences,
            [preference]: {...prevPreferences, preferenceId}
        }));
    }

    const removePreferences = (preference) => {
        setError(false);
        axios.post(`/api/remove-user-preferences`, {
            preferences: preferences
        }).then(function(res) {
            if(res.data.preferences) {
                console.log('The preferences have been changed');
                setPreferences({});
            }
        }).catch(function(error) {
            console.log(error);
        });
    }

    const addPreferences = (preference) => {
        setError(false);
        axios.post('/api/store-user-preferences', {
            [preference]: preferences[preference]
        }).then(function(res) {
            if(res.data.preference) {
                console.log('The preferences have been changed');
                setPreferences({});
            } else {
                setError(true);
                setErrorMessage('Something went wrong. Please try again later');
            }
        }).catch(function(error) {
            setError(true);
            setErrorMessage(error.response ? error.response.data.message : 'Oops, something went wrong!');
        });
    }

    const handleLogout = (e) => {
        e.preventDefault();

        axios.post('http://localhost:8000/api/logout')
            .then(function(res) {
                if(res.data.success) {
                localStorage.removeItem('user');
                navigate('/');
            }
            }).catch(function(error) {
                setError(true);
                setErrorMessage(error.response ? error.response.data.message : 'Oops, something went wrong!');
            })
    }

    return(
        <Fragment>
            <Header />
            <Container className="user-preference-container" fixed>
                <div className="user-preference-wrapper">
                    <Typography variant="h4" align="left" gutterBottom>
                        User Preferences
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
                        mt: 5
                    }}>
                        <div className="user-email-wrapper">
                            <Typography variant="h5" align="left" gutterBottom>
                                User Email Address:
                            </Typography>
                            <Typography variant="h5" align="left" gutterBottom>
                                {user.email}
                            </Typography>
                        </div>
                        <div className="user-password-wrapper">
                            <Typography variant="h5" align="left" gutterBottom>
                                Change user password
                            </Typography>
                            <form className="user-password-change-form">
                                {tempPassword !== newPassword &&
                                    <Typography variant="body1" align="left" gutterBottom color="error">
                                        Passwords does not match!
                                    </Typography>
                                }
                                <TextField required
                                           variant="outlined"
                                           id="new-user-password"
                                           label="New Password"
                                           type="password"
                                           margin="normal"
                                           onChange={handleNewPassword}
                                />
                                <TextField required
                                           variant="outlined"
                                           id="confirm-new-user-password"
                                           label="Confirm New Password"
                                           type="password"
                                           margin="normal"
                                           onChange={handleConfirmNewPassword}
                                           error={tempPassword !== newPassword}
                                />
                                <Button variant="contained"
                                        color="primary"
                                        onClick={handlePasswordChange}>
                                    Change user password
                                </Button>
                            </form>
                        </div>
                        <div className="user-categories user-preference-select-wrapper">
                            <Typography variant="h5" align="left" gutterBottom>
                                Category Preference
                            </Typography>
                            {userPreferences.categories.length != 0 &&
                            userPreferences.categories.map(category => {
                                return(
                                    <div className="user-category" key={category.id}>
                                        {category.name}
                                    </div>
                                )
                            })}
                            <div className="button-container">
                                <Button variant="contained"
                                        color="primary"
                                        onClick={handleRemoveCategory}>
                                    Remove preference
                                </Button>
                                <Button variant="contained"
                                        color="primary"
                                        onClick={handleAddCategory}>
                                    Add preference
                                </Button>
                            </div>
                        </div>
                        <div className="user-sources user-preference-select-wrapper">
                            <Typography variant="h5" align="left" gutterBottom>
                                Source Preference
                            </Typography>
                            {userPreferences.sources.length != 0 &&
                                userPreferences.sources.map(source => {
                                    return(
                                        <div className="user-source" key={source.id}>
                                            {source.name}
                                        </div>
                                    )
                                })}
                            <div className="button-container">
                                <Button variant="contained"
                                        color="primary"
                                        onClick={handleRemoveSource}>
                                    Remove preference
                                </Button>
                                <Button variant="contained"
                                        color="primary"
                                        onClick={handleAddSource}>
                                    Add preference
                                </Button>
                            </div>
                        </div>
                        <div className="user-authors user-preference-select-wrapper">
                            <Typography variant="h5" align="left" gutterBottom>
                                Author Preference
                            </Typography>
                            {userPreferences.authors.length != 0 &&
                                userPreferences.authors.map(author => {
                                    return(
                                        <div className="user-author" key={author.id}>
                                            {author.name}
                                        </div>
                                    )
                                })}
                            <div className="button-container">
                                <Button variant="contained"
                                        color="primary"
                                        onClick={handleRemoveAuthor}>
                                    Remove preference
                                </Button>
                                <Button variant="contained"
                                        color="primary"
                                        onClick={handleAddAuthor}>
                                    Add preference
                                </Button>
                            </div>
                        </div>
                        <div className="logout-wrapper">
                            <Button variant="contained"
                                    color="primary"
                                    onClick={handleLogout}>
                                Logout
                            </Button>
                        </div>
                        <Modal
                            open={removeModal}
                            onClose={() => setRemoveModal(!removeModal)}
                            className="remove-modal">
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
                                <div className="preferences-checkbox-wrapper">
                                    {userPreferences && userPreferences[currentModal] && userPreferences[currentModal].length !== 0 &&
                                        userPreferences[currentModal].map(preference => {
                                            return(
                                                <div className="remove-preference" key={preference.id}>
                                                    <Delete onClick={(e) => removePreference(currentModal, preference.id)} />
                                                    <p>{preference.name}</p>
                                                </div>
                                            )
                                        })
                                    }
                                    <Button variant="contained"
                                            color="primary"
                                            id="remove-preference-submit"
                                            onClick={(e) => removePreferences(currentModal)}>
                                        Remove Preferences
                                    </Button>
                                </div>
                            </Box>
                        </Modal>
                        <Modal
                            open={addModal}
                            onClose={() => setAddModal(!addModal)}
                            className="add-modal">
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
                                <div className="preferences-checkbox-wrapper">
                                    {data && data[currentModal] && data[currentModal].length !== 0 &&
                                        data[currentModal].filter(datum => !userPreferences[currentModal].includes(datum)).map(preference => {
                                            return(
                                                <FormControlLabel
                                                    key={preference.id}
                                                    control={<Checkbox checked={preferences && preferences[currentModal] && preferences[currentModal].includes(preference.id)}
                                                                       onChange={handleCheckboxChange}
                                                                       inputProps={{ 'aria-label': `${preference.name} checkbox`}}
                                                                       value={preference.id}
                                                    />}
                                                    label={preference.name}
                                                />
                                            )
                                        })
                                    }
                                </div>
                                <Button variant="contained"
                                        color="primary"
                                        onClick={(e) => addPreferences(currentModal)}
                                        id="add-preference-submit">
                                    Add Preferences
                                </Button>
                            </Box>
                        </Modal>
                    </Box>
                </div>
            </Container>
        </Fragment>
    )
}

export default UserPreferences;