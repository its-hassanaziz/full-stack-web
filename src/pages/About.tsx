import React from 'react';
import { Shield, Users, Download, Star } from 'lucide-react';

const About: React.FC = () => {
  const features = [
    {
      icon: Shield,
      title: 'Legal & Safe',
      description: 'All mods are verified to be legal and safe, distributed with proper permissions and licensing.'
    },
    {
      icon: Users,
      title: 'Community Driven',
      description: 'Built by gamers, for gamers. Our platform showcases the best community-created modifications.'
    },
    {
      icon: Download,
      title: 'Easy Downloads',
      description: 'Simple, fast downloads with no hidden fees or complicated registration processes.'
    },
    {
      icon: Star,
      title: 'Quality Assured',
      description: 'Every mod is tested and reviewed to ensure the highest quality gaming experience.'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              About ModHub
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto">
              Your trusted platform for discovering and downloading legal game modifications
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Mission Statement */}
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
            Our Mission
          </h2>
          <p className="text-lg text-gray-700 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed">
            ModHub was created to provide a safe, legal, and user-friendly platform for game modification distribution. 
            We believe in enhancing the gaming experience through community creativity while respecting intellectual 
            property rights and maintaining the highest standards of quality and safety.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 text-center border border-gray-200 dark:border-gray-700"
              >
                <div className="bg-blue-100 dark:bg-blue-900/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <Icon className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Story Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 border border-gray-200 dark:border-gray-700">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 text-center">
            Our Story
          </h2>
          <div className="prose dark:prose-invert max-w-none">
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
              ModHub was born from a passion for gaming and a recognition of the incredible creativity within 
              the gaming community. We noticed that while there were many talented modders creating amazing 
              content, there wasn't a centralized, trustworthy platform that prioritized both quality and legality.
            </p>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
              Our team consists of experienced developers, gaming enthusiasts, and legal experts who work 
              together to ensure that every mod on our platform meets our strict standards for quality, 
              safety, and legal compliance. We work directly with mod creators and game developers to 
              ensure proper licensing and permissions.
            </p>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              Today, ModHub serves thousands of gamers worldwide, providing them with access to carefully 
              curated modifications that enhance their gaming experience while supporting the creative 
              community that makes it all possible.
            </p>
          </div>
        </div>

        {/* Values Section */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
            Our Values
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                Integrity
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                We maintain the highest ethical standards in all our operations, ensuring transparency 
                and honesty in everything we do.
              </p>
            </div>
            <div className="text-center">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                Community
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                We believe in the power of community and work to support and celebrate the talented 
                creators who make gaming better for everyone.
              </p>
            </div>
            <div className="text-center">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                Innovation
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                We continuously improve our platform and services to provide the best possible 
                experience for both creators and users.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;