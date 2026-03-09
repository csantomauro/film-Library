import dayjs from 'dayjs';
import { useState } from 'react';
import PropTypes from 'prop-types';
import { Modal, Form, Button, Collapse } from 'react-bootstrap';
import { Film } from '../films.mjs';

const FilmForm = ({ film, onSubmit, isOpen, cancel}) => {
  const [errors, setErrors] = useState([]);
  const [animate, setAnimate] = useState(false);

  const [title, setTitle] = useState(film ? film.title : '');
  const [favorite, setFavorite] = useState(film ? film.favorite : false);
  const [watchDate, setWatchDate] = useState((film && film.watchDate) ? film.watchDate.format('YYYY-MM-DD') : "");
  const [rating, setRating] = useState(film && film.rating ? film.rating : 0);

  const validate = () => {
    const errs = [];
    if (!title.trim()) errs.push('Title cannot be empty');
    if (watchDate && dayjs(watchDate).isAfter(dayjs()))
      errs.push('Watch date cannot be in the future');
    if (rating !== '' && (rating < 0 || rating > 5))
      errs.push('Rating must be between 0 and 5');
    return errs;
  };

  const handleSubmit = e => {
    e.preventDefault();

    const errs = validate();
    if (errs.length) {
      setErrors(errs);
      return;
    }

    const newFilm = new Film(
      film?.id,
      title.trim(),
      favorite,
      watchDate || null,
      rating === '' ? null : rating
    );

    if(film) newFilm.id = film.id
  
    onSubmit(newFilm)
      .then(() => cancel())  // close modal after successful submission
      .catch(() => {});
  };

  return (
    <Modal
      show={isOpen}
      onHide={cancel}
      backdrop="static"
      centered
      onEnter={() => setAnimate(true)}
      onExit={() => setAnimate(false)}
    >
      <Modal.Header closeButton>
        <Modal.Title>{film ? 'Edit film' : 'Add film'}</Modal.Title>
      </Modal.Header>

      <Collapse in={animate}>
        <div>
          <Modal.Body>
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>Title</Form.Label>
                <Form.Control
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Check
                  label="Favorite"
                  checked={favorite}
                  onChange={e => setFavorite(e.target.checked)}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Watch date</Form.Label>
                <Form.Control
                  type="date"
                  value={watchDate}
                  onChange={e => setWatchDate(e.target.value)}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Rating (0–5)</Form.Label>
                <Form.Control
                  type="number"
                  min={0}
                  max={5}
                  value={rating}
                  onChange={e => setRating(e.target.value)}
                />
              </Form.Group>

              {errors.map((e, i) => (
                <p key={i} className="text-danger">
                  {e}
                </p>
              ))}

              <Button type="submit">Save</Button>
            </Form>
          </Modal.Body>
        </div>
      </Collapse>
    </Modal>
  );
};

FilmForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  cancel: PropTypes.func,
  film: PropTypes.object
};

export default FilmForm;
