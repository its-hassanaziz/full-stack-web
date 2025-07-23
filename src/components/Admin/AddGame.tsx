import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Upload, Save, X } from 'lucide-react';
import { gameAPI } from '../../services/api';
import { Game } from '../../types';
import toast from 'react-hot-toast';

interface GameFormData {
  name: string;
  logo: FileList;
  sections: {
    overview: { text: string; image: FileList };
    versions: { text: string; image: FileList };
    uses: { text: string; image: FileList };
    features: { text: string; image: FileList };
    system: { text: string; image: FileList };
  };
  alternatives: string[];
  downloadLink: string;
}

const AddGame: React.FC = () => {
  const [games, setGames] = useState<Game[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<GameFormData>();

  useEffect(() => {
    fetchGames();
  }, []);

  const fetchGames = async () => {
    try {
      const response = await gameAPI.getAll();
      setGames(response.data);
    } catch (error) {
      console.error('Error fetching games:', error);
    }
  };

  const onSubmit = async (data: GameFormData) => {
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      
      // Basic fields
      formData.append('name', data.name);
      formData.append('downloadLink', data.downloadLink);
      
      // Logo
      if (data.logo && data.logo[0]) {
        formData.append('logo', data.logo[0]);
      }
      
      // Sections
      const sections = ['overview', 'versions', 'uses', 'features', 'system'] as const;
      sections.forEach(section => {
        formData.append(`sections[${section}][text]`, data.sections[section].text);
        if (data.sections[section].image && data.sections[section].image[0]) {
          formData.append(`sections[${section}][image]`, data.sections[section].image[0]);
        }
      });
      
      // Alternatives
      data.alternatives.forEach(alt => {
        formData.append('alternatives[]', alt);
      });

      await gameAPI.create(formData);
      toast.success('Game added successfully!');
      reset();
    } catch (error: any) {
      console.error('Error adding game:', error);
      toast.error(error.response?.data?.message || 'Failed to add game');
    } finally {
      setIsSubmitting(false);
    }
  };

  const sections = [
    { key: 'overview', label: 'Overview' },
    { key: 'versions', label: 'Versions' },
    { key: 'uses', label: 'Uses' },
    { key: 'features', label: 'Features' },
    { key: 'system', label: 'System Requirements' },
  ] as const;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Add New Game
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Add a new game modification to the platform
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-8">
        {/* Basic Information */}
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Basic Information
          </h3>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Game Name *
            </label>
            <input
              type="text"
              {...register('name', { required: 'Game name is required' })}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="Enter game name"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {errors.name.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Game Logo
            </label>
            <div className="flex items-center space-x-4">
              <label className="flex items-center space-x-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                <Upload className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-700 dark:text-gray-300">Choose File</span>
                <input
                  type="file"
                  accept="image/*"
                  {...register('logo')}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Download Link *
            </label>
            <input
              type="url"
              {...register('downloadLink', { required: 'Download link is required' })}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="https://example.com/download"
            />
            {errors.downloadLink && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {errors.downloadLink.message}
              </p>
            )}
          </div>
        </div>

        {/* Sections */}
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Game Sections
          </h3>
          
          {sections.map((section) => (
            <div key={section.key} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
              <h4 className="text-md font-medium text-gray-900 dark:text-white mb-4">
                {section.label}
              </h4>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Text Content *
                  </label>
                  <textarea
                    rows={4}
                    {...register(`sections.${section.key}.text`, { required: `${section.label} text is required` })}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
                    placeholder={`Enter ${section.label.toLowerCase()} content...`}
                  />
                  {errors.sections?.[section.key]?.text && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                      {errors.sections[section.key].text?.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Section Image
                  </label>
                  <label className="flex items-center space-x-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    <Upload className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">Choose Image</span>
                    <input
                      type="file"
                      accept="image/*"
                      {...register(`sections.${section.key}.image`)}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Alternatives */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Alternative Games
          </h3>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Select Alternative Games
            </label>
            <select
              multiple
              {...register('alternatives')}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              size={5}
            >
              {games.map((game) => (
                <option key={game._id} value={game._id}>
                  {game.name}
                </option>
              ))}
            </select>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Hold Ctrl/Cmd to select multiple games
            </p>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200 dark:border-gray-700">
          <button
            type="button"
            onClick={() => reset()}
            className="px-6 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <X className="h-4 w-4 inline mr-2" />
            Reset
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg transition-all duration-300 flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            <span>{isSubmitting ? 'Adding...' : 'Add Game'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddGame;