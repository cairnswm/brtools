import { useState } from 'react';
import { Link } from 'react-router-dom';
import StadiumIcon from './StadiumIcon';

function IconMenu() {
  const [showStadiumTooltip, setShowStadiumTooltip] = useState(false);

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-6">
      <div className="flex justify-center space-x-6">
        <div className="relative">
          <Link 
            to="/stadium-calculator"
            className="block p-2 hover:bg-gray-100 rounded-lg transition-colors"
            onMouseEnter={() => setShowStadiumTooltip(true)}
            onMouseLeave={() => setShowStadiumTooltip(false)}
          >
            <StadiumIcon 
              width={32} 
              height={32} 
              className="text-gray-600 hover:text-gray-900" 
            />
          </Link>
          {showStadiumTooltip && (
            <div className="absolute left-1/2 transform -translate-x-1/2 mt-2 px-3 py-2 bg-gray-800 text-white text-sm rounded-lg shadow-lg z-10 whitespace-nowrap">
              Stadium Calculator
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default IconMenu;