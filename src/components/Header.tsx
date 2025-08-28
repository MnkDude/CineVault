import React from 'react';
import { User, Bell, Settings, LogOut } from 'lucide-react';
import type { User as UserType } from '../App';

interface HeaderProps {
  user: UserType | null;
  onAuthClick: () => void;
  onProfileClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ user, onAuthClick, onProfileClick }) => {
  return (
    <header className="bg-app-cinema border-b border-cinema-gold/20 shadow-cinema">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-[#bfa16a] to-[#181818] rounded-lg flex items-center justify-center border border-cinema-gold">
              <span className="text-cinema-secondary font-bold text-sm">CV</span>
            </div>
            <h1 className="text-2xl font-bold text-cinema-primary drop-shadow-cinema">
              CineVault
            </h1>
          </div>

          {/* User Actions */}
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <button className="p-2 text-cinema-muted hover:text-cinema-secondary transition-colors">
                  <Bell size={20} />
                </button>
                <button className="p-2 text-cinema-muted hover:text-cinema-secondary transition-colors">
                  <Settings size={20} />
                </button>
                <button
                  onClick={onProfileClick}
                  className="flex items-center space-x-3 bg-cinema-card hover:bg-[#23201a]/80 border border-cinema-gold/30 rounded-lg px-3 py-2 transition-all duration-200"
                >
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-6 h-6 rounded-full"
                  />
                  <span className="text-cinema-primary text-sm">{user.name}</span>
                </button>
              </>
            ) : (
              <button
                onClick={onAuthClick}
                className="bg-cinema-card hover:bg-[#23201a]/80 text-cinema-primary px-6 py-2 rounded-lg font-medium border border-cinema-gold/30 transition-all duration-200 transform hover:scale-105"
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;