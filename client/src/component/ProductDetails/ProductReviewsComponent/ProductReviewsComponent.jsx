import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { getReviews, addReview } from "../../../config/ApiCustomer";
import "./ProductReviewsComponent.scss";

const ReviewsComponent = ({ productId }) => {
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({
    username: "",
    rating: 0,
    text: "",
  });
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const data = await getReviews(productId);
        setReviews(data);
      } catch (error) {
        console.error("Ошибка при загрузке отзывов:", error);
      }
    };

    fetchReviews();
  }, [productId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewReview((prev) => ({ ...prev, [name]: value }));
  };

  const handleRatingChange = (rating) => {
    setNewReview((prev) => ({ ...prev, rating }));
  };

  const handleSubmitReview = async () => {
    if (!newReview.username || !newReview.text || newReview.rating === 0) {
      setErrorMessage("Будь ласка, заповніть усі поля.");
      return;
    }

    try {
      await addReview(productId, newReview);
      setReviews((prev) => [newReview, ...prev]);
      setNewReview({ username: "", rating: 0, text: "" });
      setErrorMessage(null);
    } catch (error) {
      console.error("Ошибка при добавлении отзыва:", error);
    }
  };

  return (
    <section className="reviews__container">
      {/* Заголовок */}
      <div className="reviews__frame-header">
        <p className="reviews__frame-header-title">Відгуки</p>
        <button
          className="reviews__frame-header-button"
          onClick={() => setNewReview({ username: "", rating: 0, text: "" })}
        >
          <p className="reviews__frame-header-button-text">Написати відгук</p>
        </button>
      </div>

      {/* Список отзывов */}
      <div className="reviews__frame-body">
        {reviews.map((review, index) => (
          <div key={index} className="reviews__frame-body-review">
            <div className="reviews__frame-body-review-group">
              <div className="reviews__frame-body-review-group-header">
                <div className="reviews__frame-body-review-group-header-title">
                  <p className="reviews__frame-body-review-group-header-title-username-text">
                    {review.username}
                  </p>
                </div>
                <div className="reviews__frame-body-review-group-header-rating">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <img
                      key={i}
                      src={i < review.rating ? "/icons/filled-star.svg" : "/icons/empty-star.svg"}
                      alt="rating star"
                      className="reviews__frame-body-review-group-header-rating-icon"
                    />
                  ))}
                </div>
                <p className="reviews__frame-body-review-group-header-date">
                  {new Date().toLocaleDateString("uk-UA")}
                </p>
              </div>
              <div className="reviews__frame-body-review-group-content">
                <p className="reviews__frame-body-review-group-content-text">{review.text}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Форма для нового отзыва */}
      <div className="reviews__frame-body-review">
        <div className="reviews__frame-body-review-group">
          <div className="reviews__frame-body-review-group-header">
            <input
              type="text"
              name="username"
              placeholder="Ваше ім'я"
              value={newReview.username}
              onChange={handleInputChange}
              className="reviews__frame-body-review-group-header-title-username-input"
            />
            <div className="reviews__frame-body-review-group-header-rating">
              {Array.from({ length: 5 }).map((_, i) => (
                <img
                  key={i}
                  src={i < newReview.rating ? "/icons/filled-star.svg" : "/icons/empty-star.svg"}
                  alt="rating star"
                  onClick={() => handleRatingChange(i + 1)}
                  className="reviews__frame-body-review-group-header-rating-icon"
                />
              ))}
            </div>
          </div>
          <textarea
            name="text"
            placeholder="Напишіть ваш відгук"
            value={newReview.text}
            onChange={handleInputChange}
            className="reviews__frame-body-review-group-content-textarea"
          />
        </div>
        <button className="reviews__frame-header-button" onClick={handleSubmitReview}>
          <p className="reviews__frame-header-button-text">Надіслати відгук</p>
        </button>
        {errorMessage && <p className="reviews__frame-body-review-group-error">{errorMessage}</p>}
      </div>
    </section>
  );
};

ReviewsComponent.propTypes = {
  productId: PropTypes.number.isRequired,
};

export default ReviewsComponent;