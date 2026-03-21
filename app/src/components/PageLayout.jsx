import { useState, useContext } from "react";
import {Col, Collapse, Row, Spinner} from "react-bootstrap";
import {Link, useNavigate, Outlet, useLocation, useParams} from "react-router-dom";

import Filters from "./Filters.jsx";
import FilmForm from "./FilmForm.jsx";
import FilmList from "./FilmList.jsx";

import FeedbackContext from "../contexts/FeedbackContext.js";
import API from "../API.js";

export function FilmLibraryLayout(props) {

    return (
        <Row className="flex-grow-1">
            { props.loggedIn && 
                <Collapse id="films-filters" in={props.isSidebarExpanded} className="col-md-3 bg-light d-md-block">
                    <div className="py-4">
                        <h5 className="mb-3">Filters</h5>
                        <Filters items={props.filters}/>
                    </div>
                </Collapse>
            }
            <Col md={9} className="pt-3">
                <Outlet/>
            </Col>
        </Row>
    );
}

export function FilmListLayout(props) {
    const {filterLabel} = useParams();
    const filterName = props.filters[filterLabel] ? props.filters[filterLabel].label : 'All';

    const location = useLocation();
    const {setFeedbackFromError, refreshFilms, updateFilmInState} = useContext(FeedbackContext);

    const onDelete = (filmId) => {
        API.deleteFilm(filmId)
            .then(() => refreshFilms())
            .catch(e => setFeedbackFromError(e));
    };

    const onUpdateFavorite = (filmId, nextFavorite) => {
        API.updateFilmFavorite(filmId, nextFavorite)
            .then(() => updateFilmInState({ ...props.films.find(f => f.id === filmId), favorite: nextFavorite }))
            .catch(e => setFeedbackFromError(e));
    }

    const onUpdateRating = (filmId, nextRating) => {
        API.updateFilmRating(filmId, nextRating)
            .then(() => updateFilmInState({ ...props.films.find(f => f.id === filmId), rating: nextRating }))
            .catch(e => setFeedbackFromError(e));
    }

    return (
        <>
            <Row><Col><h1><span id="filter-title">{filterName}</span> films</h1></Col></Row>
            {props.loading ? (
            <div className="text-center my-5">
                <Spinner animation="border" role="status" />
                <p className="mt-2 text-muted">Loading films...</p>
            </div>
            ) : props.films.length === 0 ? (
            <p className="text-muted my-4">
                No films match this filter.
            </p>
            ) : (
            <FilmList
                films={props.films}
                updateFilmFavorite={onUpdateFavorite}
                updateFilmRating={onUpdateRating}
                deleteFilm={onDelete}
            />
            )}
            <Row><Col>
                <Link className="btn btn-primary rounded-circle fixed-right-bottom" to="/add"
                      state={{ background: location}}>
                    <i className="bi bi-plus"/>
                </Link>
            </Col></Row>
        </>
    );
}

export function EditLayout(props) {
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(true);
    const {filmId} = useParams();
    const editableFilm = props.films && props.films.find(f => f.id === Number(filmId));

    const {setFeedbackFromError, updateFilmInState} = useContext(FeedbackContext);

    const updateFilm = (film) => {
        return API.updateFilm(film)
            .then(() => updateFilmInState(film))
            .catch(e => setFeedbackFromError(e));
    };

    const cancel = () => { setIsOpen(false); navigate(-1); }

    return (!editableFilm ?
            <Row>
                <Col>
                    <p className="lead mt-3">Error: film not found!</p>
                    <Link className="btn btn-primary mx-auto" to="../../" relative="path">Go Home!</Link>
                </Col>
            </Row>
            : <Row><Col><FilmForm film={editableFilm} onSubmit={updateFilm} isOpen={isOpen}
            cancel={cancel}/></Col></Row>
    );
}

export function CreateLayout() {
    const navigate = useNavigate();
    const {setFeedbackFromError, refreshFilms} = useContext(FeedbackContext);
    const [isOpen, setIsOpen] = useState(true);

    const addFilm = (film) => {
        return API.addFilm(film)
            .then(() => refreshFilms())
            .catch(e => setFeedbackFromError(e));
    };

    const cancel = () => { setIsOpen(false); navigate(-1); }

    return <FilmForm 
                onSubmit={addFilm} 
                isOpen={isOpen}
                cancel={cancel}
            />;
}

export function NotFoundLayout() {
    return (
        <>
            <Row><Col><h2>Error: page not found!</h2></Col></Row>
            <Row><Col> <img src="/GitHub404.png" alt="page not found" className="my-3" style={{display: 'block'}}/>
            </Col></Row>
            <Row><Col> <Link to="/" className="btn btn-primary mt-2 my-5">Go Home!</Link> </Col></Row>
        </>
    );
}