import React, { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import '@fortawesome/fontawesome-free/css/all.min.css';
import './PricePopup.css';

function PricePopup({ onClose }) {
    const [activeIndex, setActiveIndex] = useState(1);
    const [plans, setPlans] = useState([]); 
    const [loading, setLoading] = useState(true); 
    const [error, setError] = useState(null); 
    const [selectedPlan, setSelectedPlan] = useState(null); 
    const [selectedAddons, setSelectedAddons] = useState([]); 
    const [showAddonSection, setShowAddonSection] = useState(false); 

    useEffect(() => {
        const fetchPlans = async () => {
            try {
                const response = await fetch('http://localhost:3000/api/plans');
                if (!response.ok) {
                    throw new Error('Failed to fetch plans');
                }
                const data = await response.json();
                setPlans(data);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };
        fetchPlans();
    }, []);

    const formatPrice = (price) => {
        if (price && price.$numberDecimal) {
            return parseFloat(price.$numberDecimal);
        }
        return parseFloat(price);
    };

    const handlePlanSelect = (plan) => {
        setSelectedPlan(plan);
        setSelectedAddons([]); 
        if (plan.price !== 'FREE') {
            setShowAddonSection(true);
        }
    };

    const handleAddonSelect = (addon) => {
        setSelectedAddons((prevAddons) => {
            const isAddonSelected = prevAddons.find((a) => a.title === addon.title);
            if (isAddonSelected) {
                return prevAddons.filter((a) => a.title !== addon.title); 
            } else {
                return [...prevAddons, addon]; 
            }
        });
    };

    const closeAddonSection = () => {
        setShowAddonSection(false);
    };

    const handleSkipCheckout = () => {
        console.log("Proceeding to checkout with plan:", selectedPlan, "and add-ons:", selectedAddons);
    };
    const calculateTotalPrice = () => {
        let total = formatPrice(selectedPlan.price);
        selectedAddons.forEach((addon) => {
            total += formatPrice(addon.price);
        });
        return total;
    };

    const totalPrice = selectedPlan ? calculateTotalPrice() : 0;
    const buttonText = selectedAddons.length === 0 ? `Skip & Continue- Rs ${totalPrice.toFixed(2)}` : `Proceed to Checkout - Rs ${totalPrice.toFixed(2)}`;

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <>
            <div className="popup-overlay">
                <div className="popup-content">
                    <button className="close-button" onClick={onClose}>
                        <i className="fas fa-times"></i>
                    </button>
                    {showAddonSection ? (
                        <div className="addon-section">
                            <button className="btn btn-secondary" onClick={closeAddonSection}>
                                <i className="fas fa-arrow-left me-2"></i>
                            </button>
                            <h3>Add-ons for {selectedPlan.title}</h3>
                            <Swiper
                                spaceBetween={20}
                                slidesPerView={4}
                                centeredSlides={true}
                                loop={true}
                                autoHeight={false}
                                pagination={{ clickable: true }}
                                style={{ height: '100%' }}
                            >
                                {selectedPlan.addon && selectedPlan.addon.length > 0 ? (
                                    selectedPlan.addon.map((addon, index) => (
                                        <SwiperSlide key={index}>
                                            <div className="card pricing-card">
                                                <div className="card-body text-center">
                                                    <h5 className="card-title">{addon.title}</h5>
                                                    <h2 className="card-price">Rs {formatPrice(addon.price)}/m</h2>
                                                    <p className="card-description">{addon.description}</p>
                                                    <button 
                                                        className="btn btn-primary" 
                                                        onClick={() => handleAddonSelect(addon)}
                                                    >
                                                        {selectedAddons.find(a => a.title === addon.title) ? 'Remove' : 'Add'}
                                                    </button>
                                                </div>
                                            </div>
                                        </SwiperSlide>
                                    ))
                                ) : (
                                    <div>No add-ons available for this plan</div>
                                )}
                            </Swiper>
                            <button
                                className="skip-checkout-btn"
                                onClick={handleSkipCheckout}
                            >
                                {buttonText}
                            </button>
                        </div>
                    ) : (
                        <div className="pricing-plan-container">
                            <Swiper
                                spaceBetween={30}
                                slidesPerView={3}
                                centeredSlides={true}
                                loop={true}
                                autoHeight={false}
                                onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
                                pagination={{ clickable: true }}
                                style={{ height: '100%' }}
                            >
                                {plans.map((plan, index) => (
                                    <SwiperSlide key={index}>
                                        <div
                                            className={`card pricing-card ${index === activeIndex ? 'active-slide' : ''}`}
                                            onClick={() => handlePlanSelect(plan)}
                                        >
                                            <div className="card-body text-center">
                                                <h5 className="card-title">{plan.title}</h5>
                                                <h2 className="card-price">Rs. {formatPrice(plan.price)}/m </h2>
                                                <p className="card-description">{plan.description}</p>
                                                <ul className="list-unstyled">
                                                    {plan.features && plan.features.length > 0 ? (
                                                        plan.features.map((feature, idx) => (
                                                            <li key={idx}>
                                                                <i className="fas fa-check-circle text-success me-2"></i>
                                                                {feature}
                                                            </li>
                                                        ))
                                                    ) : (
                                                        <li>No features available</li>
                                                    )}
                                                </ul>
                                                <button className="btn btn-primary">
                                                    {formatPrice(plan.price) === 0 ? 'Free Trial' : 'Buy Now'}
                                                </button>
                                            </div>
                                        </div>
                                    </SwiperSlide>
                                ))}
                            </Swiper>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

export default PricePopup;
