import React from 'react'
import PropTypes from 'prop-types';

const ProductCharacteristicComponent = ({ characteristics }) => {
    return (
        <div className='flex flex-col justify-center mt-10 ml-20 gap-5'>
            {characteristics.map((characteristic,index) => (
                <div className='flex flex-row justify-between min-w-150 gap-15' key={index}>
                    <div className='font-montserrat font-medium text-lg'>{characteristic.title}</div>
                    <div className='font-montserrat font-normal text-lg'>{characteristic.value}</div>
                </div>
            ))}

           
        </div>
    )
}

export default ProductCharacteristicComponent

ProductCharacteristicComponent.propTypes = {

    characteristics: PropTypes.arrayOf(
        PropTypes.shape({
            title: PropTypes.string.isRequired,
            value: PropTypes.string.isRequired,
        })
    ).isRequired,
};
