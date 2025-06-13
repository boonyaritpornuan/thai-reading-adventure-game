
import React from 'react';

interface HeaderProps {
  title: string;
  onHomeClick?: () => void; // Optional: Callback for home button
}

const Header: React.FC<HeaderProps> = ({ title, onHomeClick }) => {
  return (
    <header className="bg-gradient-to-r from-[#ff6b6b] to-[#ff8e53] text-white p-5 text-center shadow-md relative">
      {onHomeClick && (
        <button
          onClick={onHomeClick}
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-200 text-2xl p-2 z-20"
          aria-label="กลับหน้าหลัก"
        >
          <i className="fas fa-home"></i>
        </button>
      )}
      <div className="text-[1.8rem] md:text-[2.2rem] font-bold tracking-wide" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.2)' }}>
        {title}
      </div>
    </header>
  );
};

export default Header;
