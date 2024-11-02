import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { newsletterService } from '../services/api';
import { 
  FaFacebookF, 
  FaTwitter, 
  FaInstagram, 
  FaPinterestP,
  FaCreditCard,
  FaPaypal,
  FaCcVisa,
  FaCcMastercard
} from 'react-icons/fa';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email) {
      toast.error('Please enter your email address');
      return;
    }

    setIsLoading(true);
    try {
      const response = await newsletterService.subscribe(email);
      toast.success(response.message);
      setEmail(''); // Clear the input after successful subscription
    } catch (error) {
      toast.error(error.message || 'Failed to subscribe. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <footer className="bg-gray-900 text-gray-300">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <h2 className="text-2xl font-light text-white bg-gradient-to-r from-indigo-600 to-pink-500 bg-clip-text text-transparent">
              FripiKa
            </h2>
            <p className="text-sm text-gray-400">
              Discover the latest trends in fashion with our curated collection of stylish clothing and accessories.
            </p>
            <div className="flex space-x-4">
              <SocialLink href="#" Icon={FaFacebookF} />
              <SocialLink href="#" Icon={FaTwitter} />
              <SocialLink href="#" Icon={FaInstagram} />
              <SocialLink href="#" Icon={FaPinterestP} />
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-medium text-white mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <FooterLink to="/collection" text="Shop" />
              <FooterLink to="/about" text="About Us" />
              <FooterLink to="/contact" text="Contact" />
              <FooterLink to="/faq" text="FAQ" />
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="text-lg font-medium text-white mb-4">Customer Service</h3>
            <ul className="space-y-2">
              <FooterLink to="/shipping" text="Shipping Information" />
              <FooterLink to="/returns" text="Returns & Exchanges" />
              <FooterLink to="/size-guide" text="Size Guide" />
              <FooterLink to="/privacy-policy" text="Privacy Policy" />
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-lg font-medium text-white mb-4">Newsletter</h3>
            <p className="text-sm text-gray-400 mb-4">
              Subscribe to receive updates, access to exclusive deals, and more.
            </p>
            <form onSubmit={handleSubmit} className="space-y-2">
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:border-indigo-500 text-gray-300 text-sm"
              />
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full px-4 py-2 bg-gradient-to-r from-indigo-600 to-pink-500 text-white rounded-lg text-sm hover:opacity-90 transition-opacity duration-300 ${
                  isLoading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {isLoading ? 'Subscribing...' : 'Subscribe'}
              </button>
            </form>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="flex flex-wrap justify-center gap-4">
            <PaymentIcon Icon={FaCreditCard} />
            <PaymentIcon Icon={FaPaypal} />
            <PaymentIcon Icon={FaCcVisa} />
            <PaymentIcon Icon={FaCcMastercard} />
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-gray-950 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-gray-400">
            © {currentYear} FripiKa. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

// Helper Components
const SocialLink = ({ href, Icon }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-800 hover:bg-indigo-600 transition-colors duration-300"
  >
    <Icon className="w-4 h-4" />
  </a>
);

const FooterLink = ({ to, text }) => (
  <li>
    <Link
      to={to}
      className="text-sm text-gray-400 hover:text-white transition-colors duration-300"
    >
      {text}
    </Link>
  </li>
);

const PaymentIcon = ({ Icon }) => (
  <div className="text-gray-400">
    <Icon className="w-8 h-8" />
  </div>
);

export default Footer;