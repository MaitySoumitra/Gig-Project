// src/components/AddonPopup.js

import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

function AddonPopup({ selectedPlan, closeAddonPopup }) {
  // Example static addon data, this can be fetched dynamically if required
  const addonPlans = [
    {
      title: 'Addon 1',
      price: '$10/mo',
      description: 'Additional storage for your plan.',
      features: ['Extra 50GB', 'Priority Support'],
    },
    {
      title: 'Addon 2',
      price: '$20/mo',
      description: 'Advanced features for your plan.',
      features: ['All Features', 'Dedicated Support'],
    },
  ];

  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <button className="close-button" onClick={closeAddonPopup}>
          <i className="fas fa-times"></i>
        </button>
        <div className="addon-plan-container">
          <h3>Choose Addons for {selectedPlan.title}</h3>
          <Swiper
            spaceBetween={30}
            slidesPerView={1}
            centeredSlides={true}
            loop={true}
            autoHeight={false}
            pagination={{ clickable: true }}
            style={{ height: '100%' }}
          >
            {addonPlans.map((addon, index) => (
              <SwiperSlide key={index}>
                <div className="card addon-card">
                  <div className="card-body text-center">
                    <h5 className="card-title">{addon.title}</h5>
                    <h2 className="card-price">{addon.price}</h2>
                    <p className="card-description">{addon.description}</p>
                    <ul className="list-unstyled">
                      {addon.features.map((feature, idx) => (
                        <li key={idx}>
                          <i className="fas fa-check-circle text-success me-2"></i>
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <button className="btn btn-primary">Add to Plan</button>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </div>
  );
}

export default AddonPopup;
