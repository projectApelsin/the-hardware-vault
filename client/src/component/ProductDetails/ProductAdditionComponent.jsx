import React, { useState } from 'react'
import ProductDescriptionComponent from "./ProductDescriptionComponent/ProductDescriptionComponent.jsx"
import ProductReviewsComponent from "./ProductReviewsComponent/ProductReviewsComponent.jsx"
import ProductCharacteristicComponent from './ProductCharacteristicComponent.jsx'
import ProductBuyCard from './ProductBuyCard.jsx'


const ProductAdditionComponent = ({
    description,
    characteristics,
    image,
    title,
    discountPrice,
    price,
    
  }) => {
    const [activeTab, setActiveTab] = useState("description")


    return (
        <div className='flex flex-col gap-10 '>
            <h2 className='font-montserrat font-semibold text-3xl ml-25'>Детальніше про товар</h2>
            <div className='font-montserrat font-medium flex flex-row gap-5 text-2xl ml-40  rounded-2xl '>
                <label className={`p-5 rounded-2xl cursor-pointer ${activeTab === "description" ? "bg-smalt-500 duration-500 text-white" : "bg-smalt-50"
                    }`}
                    onClick={() => setActiveTab("description")}> Опис </label>
                <label className={`p-5 rounded-2xl cursor-pointer ${activeTab === "characteristics" ? "bg-smalt-500 duration-500 text-white" : "bg-smalt-50"
                    }`}
                    onClick={() => setActiveTab("characteristics")}> Характеристики </label>
                <label className={`p-5 rounded-2xl cursor-pointer ${activeTab === "reviews" ? "bg-smalt-500 duration-500 text-white" : "bg-smalt-50"
                    }`}
                    onClick={() => setActiveTab("reviews")}> Відгуки </label>
            </div>
            <div className="flex flex-row  ml-30 mr-30 gap-15 justify-between  ">
                <div className='max-w-5xl'>
                {activeTab === "description" && <ProductDescriptionComponent description={description} characteristics={characteristics}/>}
                {activeTab === "characteristics" && <ProductCharacteristicComponent characteristics={characteristics}/> }
                {activeTab === "reviews" && <ProductReviewsComponent/>}
                </div>
                <div className=' min-w-xl h-75'>
                <ProductBuyCard image={image} title={title} price={price} discountPrice={discountPrice}/>
                </div>

            </div>
        </div>
    )
}

export default ProductAdditionComponent