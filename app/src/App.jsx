/*
 * 01UDFOV Applicazioni Web I / 01TXYOV Web Applications I
 * Lab 11 - 2024
 */
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './App.css';

import { useEffect, useState } from 'react';
import { Container, Toast, ToastBody } from 'react-bootstrap/';
import { Route, Routes, Navigate, useLocation } from 'react-router-dom';

import Header from "./components/Header.jsx";
import { CreateLayout, EditLayout, FilmLibraryLayout, FilmListLayout, NotFoundLayout } from './components/PageLayout.jsx';
import { LoginForm } from './components/Auth.jsx';
import FeedbackContext from "./contexts/FeedbackContext.js";
import API from "./API.js";

function App() {
    /**
     * Defining a structure for Filters
     * Each filter is identified by a unique name and is composed by the following fields:
     * - A label to be shown in the GUI
     * - An ID (equal to the unique name), used as key during the table generation
     */
    const filters = {
        'filter-all': {label: 'All', url: ''},
        'filter-favorite': {label: 'Favorites', url: '/filters/filter-favorite'},
        'filter-best': {label: 'Best Rated', url: '/filters/filter-best'},
        'filter-lastmonth': {label: 'Seen Last Month', url: '/filters/filter-lastmonth'},
        'filter-unseen': {label: 'Unseen', url: '/filters/filter-unseen'}
    };

    // This state controls the expansion of the sidebar (on small breakpoints only)
    const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);

    // This state is used to store the feedback message to be shown in the toast
    const [feedback, setFeedback] = useState('');

    const setFeedbackFromError = (err) => {
        let message = '';
        if (err.message) message = err.message;
        else message = "Unknown Error";
        setFeedback(message); // Assuming only one error message at a time
    };

    const [films, setFilms] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const refreshFilms = (label = filterLabel) => {
        if (label === null) return;
        setLoading(true);
        API.getFilms(label || false)
            .then(films => setFilms(films))
            .catch(e => setFeedbackFromError(e))
            .finally(() => setLoading(false));
    };

    // Optimistically update a single film in local state, avoiding a full re-fetch
    const updateFilmInState = (updatedFilm) => {
        setFilms(prev => prev.map(f => f.id === updatedFilm.id ? updatedFilm : f));
    };

    const {pathname, state} = useLocation();
    const background = state?.background;
    // A null filter means we have no information about the filter to be applied
    let filterLabel = null;
    if(pathname.startsWith('/filters')) {
        filterLabel = pathname.split('/').pop();
    } else if (pathname === '/') {
        filterLabel = false; // false means no filter (all films)
    }

    const [user, setUser] = useState(null);
    const [loggedIn, setLoggedIn] = useState(false);

    useEffect(() => {
        // Checking if the user is already logged-in
        // This useEffect is called only the first time the component is mounted (i.e., when the page is (re)loaded.)
        API.getUserInfo()
            .then(user => {
                setLoggedIn(true);
                setUser(user);  // here you have the user info, if already logged in
            }).catch(e => {
                if(loggedIn)    // printing error only if the state is inconsistent (i.e., the app was configured to be logged-in)
                    setFeedbackFromError(e);
                setLoggedIn(false); setUser(null);
            }); 
    }, []);

    /**
     * This function handles the login process.
     * It requires a username and a password inside a "credentials" object.
     */
    const handleLogin = async (credentials) => {
        const user = await API.logIn(credentials);
        setUser(user); setLoggedIn(true);
        setFeedback("Welcome, "+user.name);
    };

    /**
     * This function handles the logout process.
     */ 
    const handleLogout = async () => {
        await API.logOut();
        // clean up everything
        setLoggedIn(false); setUser(null);
        setFilms([]);
    };

    useEffect(() => {
        refreshFilms();
    }, [filterLabel]);

    const filteredFilms = films.filter(film => {
        if (!searchQuery.trim()) return true;
        return film.title.toLowerCase().includes(searchQuery.toLowerCase());
      });

    return (
        <FeedbackContext.Provider value={{setFeedback, setFeedbackFromError, refreshFilms, updateFilmInState}}>
            <div className="min-vh-100 d-flex flex-column">
                <Header isSidebarExpanded={isSidebarExpanded} setIsSidebarExpanded={setIsSidebarExpanded}
                    logout={handleLogout} user={user} loggedIn={loggedIn} searchQuery={searchQuery} setSearchQuery={setSearchQuery}/>
                <Container fluid className="flex-grow-1 d-flex flex-column">
                    <Routes location={background || pathname}>
                        <Route
                            path="/" element={ /* If the user is not logged-in, redirect to log-in form*/
                                <FilmLibraryLayout
                                    films={filteredFilms}
                                    isSidebarExpanded={isSidebarExpanded}
                                    filters={filters}
                                    loggedIn={loggedIn}/>
                        }>
                            <Route path="*" element={<NotFoundLayout/>}/>
                            <Route index element={
                                !loggedIn ? <Navigate replace to='/login' />
                                : <FilmListLayout films={filteredFilms} filters={filters} loading={loading}/>}/>
                            <Route path="filters/:filterLabel" element={
                                !loggedIn ? <Navigate replace to='/login' />
                                : <FilmListLayout films={filteredFilms} filters={filters} loading={loading}/>}/>
                        </Route>
                        <Route path="/login" element={ /* If the user is ALREADY logged-in, redirect to root */
                            loggedIn ? <Navigate replace to='/' />
                            : <LoginForm login={handleLogin} />
                        } />
                    </Routes>
                    {background && (
                        <Routes>
                            <Route path="/add" element={<CreateLayout />} />
                            <Route path="/edit/:filmId" element={<EditLayout films={films} />} />
                        </Routes>
                    )}
                    <Toast
                        show={feedback !== ''}
                        autohide
                        onClose={() => setFeedback('')}
                        delay={4000}
                        position="top-end"
                        className="position-fixed end-0 m-3"
                    >
                        <ToastBody>
                            {feedback}
                        </ToastBody>
                    </Toast>
                </Container>
            </div>
        </FeedbackContext.Provider>
    );
}

export default App;