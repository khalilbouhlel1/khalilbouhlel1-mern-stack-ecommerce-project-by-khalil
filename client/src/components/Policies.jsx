import React from 'react';
import { FaShippingFast, FaExchangeAlt, FaShieldAlt, FaHeadset } from 'react-icons/fa';

const PolicyCard = ({ icon: Icon, title, description }) => (
  <div className="flex flex-col items-center p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1">
    <div className="w-16 h-16 flex items-center justify-center rounded-full bg-indigo-50 mb-4">
      <Icon className="w-8 h-8 text-indigo-600" />
    </div>
    <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
    <p className="text-center text-gray-600 text-sm">{description}</p>
  </div>
);

const Policies = () => {
  const policies = [
    {
      icon: FaShippingFast,
      title: "Free Shipping",
      description: "Free shipping on all orders over 150 dt across Tunisia"
    },
    {
      icon: FaExchangeAlt,
      title: "Easy Returns",
      description: "Hassle-free returns within 14 days of purchase"
    },
    {
      icon: FaShieldAlt,
      title: "Secure Payment",
      description: "Your payments are safe with our secure payment system"
    },
    {
      icon: FaHeadset,
      title: "24/7 Support",
      description: "Round-the-clock customer service for your needs"
    }
  ];

  return (
    <section className="py-16 px-4 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-light mb-4 bg-gradient-to-r from-indigo-600 to-pink-500 bg-clip-text text-transparent">
            Why Choose Us
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Shop with confidence knowing that we prioritize your satisfaction and security
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {policies.map((policy, index) => (
            <PolicyCard
              key={index}
              icon={policy.icon}
              title={policy.title}
              description={policy.description}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Policies;