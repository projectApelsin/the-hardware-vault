import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { getReviews, addReview } from "../../../config/ApiCustomer";

const ReviewWriteComponent = ({ newReview, setNewReview, handleInputChange, handleRatingChange, handleSubmitReview, setWriteReview, errorMessage }) => {
  return (
    <div className="bg-smalt-100 p-5 flex flex-col rounded-2xl mt-10">
      <div className="">
        <div className="">
          <input
            type="text"
            name="username"
            placeholder="Ваше ім'я"
            value={newReview.username}
            onChange={handleInputChange}
            className="reviews__frame-body-review-group-header-title-username-input"
          />
          <div className="flex flex-row gap-0.5">
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
      <button className="text-sm text-gray-500 mt-2" onClick={() => setWriteReview(false)}>Скасувати</button>
    </div>
  );
};

const ReviewsComponent = ({ productId }) => {
  const [reviews, setReviews] = useState([]);
  const [writeReview, setWriteReview] = useState(false);
  const [newReview, setNewReview] = useState({ username: "", rating: 0, text: "" });
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
      setWriteReview(false);
    } catch (error) {
      console.error("Ошибка при добавлении отзыва:", error);
    }
  };

  return (
    <section className="flex flex-col w-230">
      <div className="flex flex-row justify-between items-center">
        <p className="font-montserrat font-semibold text-2xl">Відгуки</p>
        <button
          className="p-3 border-2 border-smalt-500 font-medium rounded-xl cursor-pointer hover:bg-smalt-600 hover:border-smalt-600 duration-300 active:bg-smalt-700 active:border-smalt-700 hover:text-white font-montserrat"
          onClick={() => setWriteReview(true)}
        >
          <p className="reviews__frame-header-button-text">Написати відгук</p>
        </button>
      </div>

      {writeReview && (
        <ReviewWriteComponent
          newReview={newReview}
          setNewReview={setNewReview}
          handleInputChange={handleInputChange}
          handleRatingChange={handleRatingChange}
          handleSubmitReview={handleSubmitReview}
          setWriteReview={setWriteReview}
          errorMessage={errorMessage}
        />
      )}

      <div className="reviews__frame-body">
        {reviews.length === 0 ? (
          <p className="text-gray-500">Поки що немає відгуків</p>
        ) : (
          reviews.map((review, index) => (
            <div key={index} className="reviews__frame-body-review">
              <div className="reviews__frame-body-review-group">
                <div className="reviews__frame-body-review-group-header">
                  <p className="reviews__frame-body-review-group-header-title-username-text">
                    {review.username}
                  </p>
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
          ))
        )}
      </div>
    </section>
  );
};

ReviewsComponent.propTypes = {
  productId: PropTypes.number.isRequired,
};

export default ReviewsComponent;
