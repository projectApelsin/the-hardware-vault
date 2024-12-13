import React from 'react';
import './FooterComponent.scss';

const FooterComponent = () => {
  return (

    <div className="footer__container">
      {/* Логотип футера */}
      <div className='footer__content'>
        <div className="footer__logo">
          <img
            className="footer__icon"
            src="/icons/logo.svg"
            alt="Footer logo image"
          />
        </div>

        {/* Контент футера */}
        <div className="footer__information-block">
          {/* Секция "Додатково" */}
          <div className="footer__information-block-column">
            <p className="footer__information-block-column-header-text">Додатково</p>
            <p className="footer__information-block-column-info-text">Публічна оферта</p>
            <p className="footer__information-block-column-info-text">
              Політика використання <br />
              файлів cookie
            </p>
          </div>

          {/* Секция "Інформація" */}
          <div className="footer__information-block-column">
            <p className="footer__information-block-column-header-text">Інформація</p>
            <div className='footer__information-block-column-info'>
              <p className="footer__information-block-column-info-text">Доставка</p>
              <p className="footer__information-block-column-info-text">Оплата</p>
              <p className="footer__information-block-column-info-text">Про продукцію</p>
            </div>
          </div>

          {/* Секция "Служба підтримки" */}
          <div className="footer__information-block-column">
            <p className="footer__information-block-column-header-text">Служба підтримки:</p>
            <div className='footer__information-block-column-info'>
              <p className="footer__information-block-column-info-text">@2024Ecofriendly</p>
              <p className="footer__information-block-column-info-text">0 456 278 836</p>
            </div>
          </div>
        </div>
      </div>
    </div>

  );
};

export default FooterComponent;