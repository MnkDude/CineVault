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
    <header className="bg-black/30 backdrop-blur-md border-b border-purple-500/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">CV</span>
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              CineVault
            </h1>
          </div>

          {/* User Actions */}
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <button className="p-2 text-gray-400 hover:text-purple-400 transition-colors">
                  <Bell size={20} />
                </button>
                <button className="p-2 text-gray-400 hover:text-purple-400 transition-colors">
                  <Settings size={20} />
                </button>
                <button
                  onClick={onProfileClick}
                  className="flex items-center space-x-3 bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/20 rounded-lg px-3 py-2 transition-all duration-200"
                >
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-6 h-6 rounded-full"
                  />
                  <span className="text-white text-sm">{user.name}</span>
                </button>
              </>
            ) : (
              <button
                onClick={onAuthClick}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-2 rounded-lg font-medium transition-all duration-200 transform hover:scale-105"
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