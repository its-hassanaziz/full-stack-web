import React from 'react';
import { Link } from 'react-router-dom';
import { Game } from '../../types';

interface GameCardProps {
  game: Game;
}

const GameCard: React.FC<GameCardProps> = ({ game }) => {
  return (
    <Link
      to={`/games/${game.slug}`}
      className="group bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-200 dark:border-gray-700"
    >
      <div className="aspect-video bg-gray-100 dark:bg-gray-700 overflow-hidden">
        <img
          src={game.logo || 'https://images.pexels.com/photos/442576/pexels-photo-442576.jpeg?auto=compress&cs=tinysrgb&w=400'}
          alt={game.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = 'https://images.pexels.com/photos/442576/pexels-photo-442576.jpeg?auto=compress&cs=tinysrgb&w=400';
          }}
        />
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
          {game.name}
        </h3>
        <p className="text-gray-600 dark:text-gray-400 text-sm mt-1 line-clamp-2">
          {game.sections.overview.text.substring(0, 100)}...
        </p>
      </div>
    </Link>
  );
};

export default GameCard;