import React from 'react';
import PropTypes from 'prop-types';


const ProductInfo = ({
  description,
}) => {
  return (

    <div className="flex flex-col gap-5">
      <p className="font-montserrat font-semibold text-3xl"></p>
      <p className="font-montserrat font-normal text-lg">
        {description}
      </p>
    </div>


  );
};

// PropTypes для валидации данных
ProductInfo.propTypes = {
  description: PropTypes.string.isRequired,

};

export default ProductInfo;
