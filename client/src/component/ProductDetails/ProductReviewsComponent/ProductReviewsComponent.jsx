import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { getReviews, addReview } from "../../../config/ApiCustomer";

const ReviewWriteComponent = ({ newReview, setNewReview, handleInputChange, handleRatingChange, handleSubmitReview, setWriteReview, errorMessage }) => {
  return (
    <div className="bg-smalt-100 p-5 flex flex-col rounded-2xl mt-10">
      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-2">
          <input
            type="text"
            name="firstName"
            placeholder="Ваше ім'я"
            value={newReview.firstName}
            onChange={handleInputChange}
            className="h-10 rounded-md font-montserrat font-semibold focus:outline-none pl-4"
          />

          <div className="flex flex-row gap-0.5 ml-3.5">
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
          name="reviewText"
          placeholder="Напишіть ваш відгук"
          value={newReview.reviewText}
          onChange={handleInputChange}
          className="rounded-md font-montserrat font-normal focus:outline-none pl-4"
        />


        <div className="flex justify-end">
          <button className="p-3 border-2 w-50 border-smalt-500 font-medium rounded-xl cursor-pointer hover:bg-smalt-600 hover:border-smalt-600 duration-300 active:bg-smalt-700 active:border-smalt-700 hover:text-white font-montserrat" onClick={handleSubmitReview}>
            <p className="font-montserrat">Надіслати відгук</p>
          </button>
        </div>
        {errorMessage && <p className="reviews__frame-body-review-group-error">{errorMessage}</p>}
        <button className="flex justify-end font-montserrat text-sm text-gray-500 mt-2" onClick={() => setWriteReview(false)}>Скасувати</button>
      </div>
    </div>
  );
};

const ReviewsComponent = ({ productId }) => {
  const [reviews, setReviews] = useState([]);
  const [writeReview, setWriteReview] = useState(false);
  const [newReview, setNewReview] = useState({ firstName: "", rating: 0, reviewText: "" });
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
    if (!newReview.firstName || !newReview.reviewText || newReview.rating === 0) {
      setErrorMessage("Будь ласка, заповніть усі поля.");
      return;
    }
    try {
      await addReview(productId, newReview);
      setReviews((prev) => [newReview, ...prev]);
      setNewReview({ firstName: "", rating: 0, reviewText: "" });
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
          className="p-3 border-2 border-smalt-500 font-medium rounded-xl cursor-pointer
           hover:bg-smalt-600 hover:border-smalt-600 duration-300 active:bg-smalt-700 active:border-smalt-700 hover:text-white font-montserrat"
          onClick={() => setWriteReview(true)}
        >
          <p className="font-montserrat">Написати відгук</p>
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

      <div className="mt-10 gap-10 flex flex-col ">
        {reviews.length === 0 ? (
          <p className="text-gray-500">Поки що немає відгуків</p>
        ) : (
          reviews.map((review, index) => (
            <div key={index} className="flex flex-col gap-5 bg-smalt-100 rounded-xl pl-10 pr-10 pt-5 pb-10">
              <div className="flex flex-col gap-2">
                <div className="flex flex-row justify-between">
                  <p className="font-montserrat font-semibold text-xl">
                    {review.firstName}
                  </p>
                  <p className="reviews__frame-body-review-group-header-date">
                    {new Date().toLocaleDateString("uk-UA")}
                  </p>
                </div>
                <div className="flex flex-row gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <img
                      key={i}
                      src={i < review.rating ? "/icons/filled-star.svg" : "/icons/empty-star.svg"}
                      alt="rating star"
                      
                    />
                  ))}
                </div>
              </div>

              <div className="">
                <p className="font-montserrat font-normal text-lg">{review.reviewText}</p>
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
