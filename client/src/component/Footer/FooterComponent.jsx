import React from 'react';


const FooterComponent = () => {
  return (

    
     
      <div className='grid grid-flow-col w-full h-50 p-5 bg-smalt-500 items-center pr-10 pl-10 '>
      
          <img
            className="footer__icon"
            src="/icons/logo.svg"
            alt="Footer logo image"
          />
        

        {/* Контент футера */}
        <div className="flex flex-row gap-10 ">
          {/* Секция "Додатково" */}
          <div className="flex flex-col gap-2">
            <p className="font-montserrat font-semibold text-2xl">Додатково</p>
            <p className="footer__information-block-column-info-text">Публічна оферта</p>
            <p className="footer__information-block-column-info-text">
              Політика використання <br />
              файлів cookie
            </p>
          </div>

          {/* Секция "Інформація" */}
          <div className="flex flex-col gap-2">
            <p className="font-montserrat font-semibold text-2xl">Інформація</p>
            
              <p className="footer__information-block-column-info-text">Доставка</p>
              <p className="footer__information-block-column-info-text">Оплата</p>
              <p className="footer__information-block-column-info-text">Про продукцію</p>
            
          </div>

          {/* Секция "Служба підтримки" */}
          <div className="flex flex-col gap-2">
            <p className="font-montserrat font-semibold text-2xl">Служба підтримки:</p>
            
              <p className="footer__information-block-column-info-text">@2024Ecofriendly</p>
              <p className="footer__information-block-column-info-text">0 456 278 836</p>
            </div>
          
        </div>
      </div>
    

  );
};

export default FooterComponent;