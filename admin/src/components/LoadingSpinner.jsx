import PropTypes from 'prop-types';

const LoadingSpinner = ({ size = 'medium' }) => {
  const sizeClasses = {
    small: 'h-4 w-4',
    medium: 'h-8 w-8',
    large: 'h-12 w-12'
  };

  return (
    <div className="flex justify-center items-center">
      <div className={`animate-spin rounded-full border-t-2 border-b-2 border-indigo-600 ${sizeClasses[size]}`}></div>
    </div>
  );
};

LoadingSpinner.propTypes = {
  size: PropTypes.oneOf(['small', 'medium', 'large'])
};

export default LoadingSpinner; 