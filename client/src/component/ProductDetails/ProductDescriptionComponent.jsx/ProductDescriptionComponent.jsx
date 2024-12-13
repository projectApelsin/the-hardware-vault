import React from 'react';
import PropTypes from 'prop-types';
import './ProductDescriptionComponent.scss';

const ProductInfo = ({
  description,
  characteristics,
}) => {
  return (
    <section className="product-info">
      <div className="product-info__container">
        <div className="product-info__description">
          <p className="product-info__description-title">Опис</p>
          <p className="product-info__description-text">
            {description}
          </p>
        </div>
        <div className="product-info__characteristics">
          <p className="product-info__characteristics-title">Характеристики</p>
          {characteristics.map((item, index) => (
            <div key={index} className="product-info__characteristics-row">
              <p className="product-info__characteristics-row-name">{item.title}</p>
              <p className="product-info__characteristics-row-value">{item.value}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// PropTypes для валидации данных
ProductInfo.propTypes = {
  description: PropTypes.string.isRequired,
  characteristics: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default ProductInfo;
