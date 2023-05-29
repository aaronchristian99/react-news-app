import React, {Fragment, useState, useEffect} from "react";
import axios from "axios";
import {
    Box,
    Button,
    Card,
    CardActions,
    CardContent,
    CardMedia, Chip,
    Container,
    FormControl,
    Grid,
    InputLabel,
    MenuItem,
    OutlinedInput,
    Select,
    TextField,
    Typography
} from "@mui/material";
import {useTheme} from "@emotion/react";
import {ErrorRounded} from "@mui/icons-material";
import {grey} from "@mui/material/colors";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};

function News() {
    const theme = useTheme();
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));
    const [news, setNews] = useState([]);
    const [keyword, setKeyword] = useState('');
    const [searched, setSearched] = useState(false);
    const [filters, setFilters] = useState({authors: [], sources: [], categories: []});
    const [authors, setAuthors] = useState([]);
    const [sources, setSources] = useState([]);
    const [categories, setCategories] = useState([]);
    const [error, setError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        axios.get('http://localhost:8000/api/fetch-news', {
            params: {
                userId: user.id
            }
        }).then(function(res) {
            if(res.data.news.length > 0) {
                setNews(res.data.news);
            } else {
                setError(true);
                setErrorMessage('Something went wrong. Please try again later');
            }
        }).catch(function(error) {
            setError(true);
            setErrorMessage(error.response ? error.response.data.message : 'Oops, something went wrong!');
        });
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();

        axios.post('http://localhost:8000/api/search-news', {
            keyword: keyword
        }).then(function(res) {
            if(res.data.news.length > 0) {
                setNews(res.data.news);
                setFilters(res.data.filters);
                setSearched(true);
            } else {
                setError(true);
                setErrorMessage('Something went wrong. Please try again later');
            }
        }).catch(function(error) {
            setError(true);
            setErrorMessage(error.response ? error.response.data.message : 'Oops, something went wrong!');
        });
    }

    const handleFilter = (e) => {
        e.preventDefault();

        axios.post('http://localhost:8000/api/filter-news', {
            keyword: keyword,
            categories: categories,
            sources: sources,
            authors: authors
        }).then(function(res) {
            if(res.data.news.length > 0) {
                setNews(res.data.news);
            } else {
                setError(true);
                setErrorMessage('Something went wrong. Please try again later');
            }
        }).catch(function(error) {
            setError(true);
            setErrorMessage(error.response ? error.response.data.message : 'Oops, something went wrong!');
        });
    }

    const handleKeyword = (e) => {
        e.preventDefault();
        setKeyword(e.target.value);
    }

    const handleAuthorChange = (e) => {
        const {
            target: {value}
        } = e;
        setAuthors(
            typeof value === 'string' ? value.split(',') : value
        );
    }

    const handleCategoryChange = (e) => {
        const {
            target: {value}
        } = e;
        setCategories(
            typeof value === 'string' ? value.split(',') : value
        );
    }

    const handleSourceChange = (e) => {
        const {
            target: {value}
        } = e;
        setSources(
            typeof value === 'string' ? value.split(',') : value
        );
    }

    return(
        <Fragment>
            <Container className="news-container">
                <div className="news-wrapper">
                    <Box sx={{
                        p: 2
                    }}>
                        <form className="search-form" onSubmit={handleSearch}>
                            <TextField fullWidth
                                       variant="outlined"
                                       id="search"
                                       label="Search"
                                       margin="normal"
                                       color="primary"
                                       onChange={handleKeyword}
                            />
                            <Button variant="contained"
                                    color="primary"
                                    onClick={handleSearch}
                                    id="search-submit">
                                Search
                            </Button>
                        </form>
                        {searched &&
                            <form className="filter-form">
                                <FormControl sx={{m: 1, width: 300}}>
                                    <InputLabel id="select-author-label">Select Author</InputLabel>
                                    <Select
                                        labelId="select-author-label"
                                        id="select-author"
                                        multiple
                                        value={authors}
                                        onChange={handleAuthorChange}
                                        input={<OutlinedInput label="Select Author" />}
                                        MenuProps={MenuProps}>
                                        {filters.authors && filters.authors.map((author) => (
                                            <MenuItem
                                                key={author}
                                                value={author}>
                                                {author}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                                <FormControl sx={{m: 1, width: 300}}>
                                    <InputLabel id="select-category-label">Select Category</InputLabel>
                                    <Select
                                        labelId="select-category-label"
                                        id="select-category"
                                        multiple
                                        value={categories}
                                        onChange={handleCategoryChange}
                                        input={<OutlinedInput label="Select Category" />}
                                        MenuProps={MenuProps}>
                                        {filters.categories && filters.categories.map((category) => (
                                            <MenuItem
                                                key={category}
                                                value={category}>
                                                {category}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                                <FormControl sx={{m: 1, width: 300}}>
                                    <InputLabel id="select-source-label">Select Source</InputLabel>
                                    <Select
                                        labelId="select-source-label"
                                        id="select-source"
                                        multiple
                                        value={sources}
                                        onChange={handleSourceChange}
                                        input={<OutlinedInput label="Select Source" />}
                                        MenuProps={MenuProps}>
                                        {filters.sources && filters.sources.map((source) => (
                                            <MenuItem
                                                key={source}
                                                value={source}>
                                                {source}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                                <FormControl sx={{m: 1, width: 100}}>
                                    <Button variant="contained"
                                            color="primary"
                                            id="filter-submit"
                                            onClick={handleFilter}>
                                        Filter
                                    </Button>
                                </FormControl>
                        </form>
                        }
                    </Box>
                    {!error &&
                        <Box sx={{
                            maxWidth: 1650,
                            p:2
                        }}>
                            <Grid container spacing="20">
                                {news.length > 0 &&
                                    news.map(newsItem => {
                                        return (
                                            <Grid item xs={12} sm={6} md={4} lg={4} xl={4}>
                                                <Card sx={{backgroundColor: '#1e1e1e'}}>
                                                    <CardMedia
                                                        sx={{ height:250 }}
                                                        image={newsItem.image}
                                                        title={newsItem}
                                                    />
                                                    <CardContent>
                                                        <Typography gutterBottom variant="h5" component="div" color="white">
                                                            {newsItem.title}
                                                        </Typography>
                                                        <Typography variant="body2" color="white" gutterBottom>
                                                            {newsItem.excerpt}
                                                        </Typography>
                                                        <Typography variant="body2" color={grey[700]} gutterBottom>
                                                            {newsItem.author} | {newsItem.source}}
                                                        </Typography>
                                                        <Typography variant="body2" color={grey[700]}>
                                                            {new Date(newsItem.publishedDate).toLocaleDateString('en-US', {day: 'numeric', month: 'long', year: 'numeric'})}
                                                        </Typography>
                                                        <CardActions className="news-card-action">
                                                            <Button variant="contained" href={newsItem.url}>Learn More</Button>
                                                        </CardActions>
                                                    </CardContent>
                                                </Card>
                                            </Grid>
                                        )
                                    })
                                }
                            </Grid>
                        </Box>
                    }
                    {error &&
                        <Box sx={{
                            maxWidth: 1650,
                            p:2
                        }}>
                            <Card sx={{
                                backgroundColor: '#1e1e1e',
                                display: 'flex',
                                flexFlow: 'column nowrap',
                                justifyContent: 'flex-start',
                                alignItems: 'center',
                                rowGap: 2,
                            }}>
                                <CardContent>
                                    <div className="icon-wrapper">
                                        <ErrorRounded color="error" sx={{fontSize: 40}} />
                                    </div>
                                    <Typography variant="h5" gutterBottom color="white" component="div" align="center">
                                        {errorMessage}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Box>
                    }
                </div>
            </Container>
        </Fragment>
    )
}

export default News;