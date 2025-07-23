const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const Admin = require('../models/Admin');
const Game = require('../models/Game');

// Sample data
const sampleGames = [
  {
    name: "Minecraft Enhanced",
    sections: {
      overview: {
        text: "Minecraft Enhanced is a comprehensive modification pack that transforms your vanilla Minecraft experience into something extraordinary. This mod collection includes improved graphics, enhanced gameplay mechanics, and new content that seamlessly integrates with the base game. Perfect for players looking to refresh their Minecraft adventure with quality-of-life improvements and exciting new features.",
        image: "https://images.pexels.com/photos/442576/pexels-photo-442576.jpeg?auto=compress&cs=tinysrgb&w=800"
      },
      versions: {
        text: "Compatible with Minecraft versions 1.19.x and 1.20.x. The mod pack includes over 50 carefully selected mods that work together harmoniously. Regular updates ensure compatibility with the latest Minecraft releases. Supports both single-player and multiplayer environments.",
        image: "https://images.pexels.com/photos/442576/pexels-photo-442576.jpeg?auto=compress&cs=tinysrgb&w=800"
      },
      uses: {
        text: "Ideal for players who want to enhance their building experience with new blocks and materials. Great for survival players looking for additional challenges and rewards. Perfect for creative builders who need more decorative options. Excellent for multiplayer servers wanting to offer unique content to their players.",
        image: "https://images.pexels.com/photos/442576/pexels-photo-442576.jpeg?auto=compress&cs=tinysrgb&w=800"
      },
      features: {
        text: "• Enhanced graphics with improved textures and lighting\n• New biomes and structures to explore\n• Additional tools and weapons with unique abilities\n• Quality-of-life improvements for inventory management\n• New building blocks and decorative items\n• Improved mob AI and new creatures\n• Advanced crafting recipes and automation\n• Performance optimizations for smoother gameplay",
        image: "https://images.pexels.com/photos/442576/pexels-photo-442576.jpeg?auto=compress&cs=tinysrgb&w=800"
      },
      system: {
        text: "Minimum Requirements:\n• Minecraft Java Edition 1.19+\n• 8GB RAM allocated to Minecraft\n• Java 17 or higher\n• 2GB free storage space\n\nRecommended:\n• 12GB RAM allocated to Minecraft\n• Dedicated graphics card\n• SSD storage for faster loading\n• Stable internet connection for multiplayer",
        image: "https://images.pexels.com/photos/442576/pexels-photo-442576.jpeg?auto=compress&cs=tinysrgb&w=800"
      }
    },
    downloadLink: "https://example.com/minecraft-enhanced-download",
    alternatives: []
  },
  {
    name: "Skyrim Immersion Pack",
    sections: {
      overview: {
        text: "The Skyrim Immersion Pack is a carefully curated collection of mods designed to enhance the realism and immersion of The Elder Scrolls V: Skyrim. This pack focuses on improving graphics, weather systems, NPC behavior, and adding realistic survival elements that make your journey through Skyrim feel more authentic and engaging.",
        image: "https://images.pexels.com/photos/442576/pexels-photo-442576.jpeg?auto=compress&cs=tinysrgb&w=800"
      },
      versions: {
        text: "Compatible with Skyrim Special Edition and Anniversary Edition. Includes compatibility patches for major DLCs (Dawnguard, Hearthfire, Dragonborn). Works with SKSE64 and supports both Mod Organizer 2 and Vortex mod managers. Regular updates maintain compatibility with game patches.",
        image: "https://images.pexels.com/photos/442576/pexels-photo-442576.jpeg?auto=compress&cs=tinysrgb&w=800"
      },
      uses: {
        text: "Perfect for players seeking a more realistic and challenging Skyrim experience. Ideal for role-playing enthusiasts who want deeper immersion. Great for players who have completed the base game and want fresh content. Excellent for streamers and content creators looking for visually stunning gameplay.",
        image: "https://images.pexels.com/photos/442576/pexels-photo-442576.jpeg?auto=compress&cs=tinysrgb&w=800"
      },
      features: {
        text: "• Realistic weather and lighting systems\n• Enhanced NPC AI and dialogue\n• Survival mechanics (hunger, thirst, temperature)\n• Improved combat system with new animations\n• High-resolution texture overhauls\n• New quests and storylines\n• Realistic economy and trading\n• Enhanced magic system with new spells",
        image: "https://images.pexels.com/photos/442576/pexels-photo-442576.jpeg?auto=compress&cs=tinysrgb&w=800"
      },
      system: {
        text: "Minimum Requirements:\n• Skyrim Special Edition\n• 16GB system RAM\n• GTX 1060 / RX 580 or equivalent\n• 50GB free storage space\n• SKSE64 installed\n\nRecommended:\n• 32GB system RAM\n• RTX 3070 / RX 6700 XT or better\n• NVMe SSD storage\n• 4K monitor for best visual experience",
        image: "https://images.pexels.com/photos/442576/pexels-photo-442576.jpeg?auto=compress&cs=tinysrgb&w=800"
      }
    },
    downloadLink: "https://example.com/skyrim-immersion-download",
    alternatives: []
  },
  {
    name: "Cities Skylines Realism Mod",
    sections: {
      overview: {
        text: "Transform your Cities: Skylines experience with this comprehensive realism modification. This mod pack brings real-world urban planning challenges and solutions to your virtual city. Experience authentic traffic patterns, realistic population growth, and detailed economic systems that mirror real metropolitan areas.",
        image: "https://images.pexels.com/photos/442576/pexels-photo-442576.jpeg?auto=compress&cs=tinysrgb&w=800"
      },
      versions: {
        text: "Compatible with Cities: Skylines base game and all major DLCs including Sunset Harbor, Green Cities, and Plazas & Promenades. Supports the latest game version with automatic updates. Works seamlessly with the Steam Workshop and includes compatibility with popular asset collections.",
        image: "https://images.pexels.com/photos/442576/pexels-photo-442576.jpeg?auto=compress&cs=tinysrgb&w=800"
      },
      uses: {
        text: "Perfect for urban planning enthusiasts and city-building veterans. Ideal for educational purposes and understanding real urban challenges. Great for players who want more strategic depth in their city management. Excellent for creating realistic metropolitan areas and studying traffic flow patterns.",
        image: "https://images.pexels.com/photos/442576/pexels-photo-442576.jpeg?auto=compress&cs=tinysrgb&w=800"
      },
      features: {
        text: "• Realistic traffic AI and congestion modeling\n• Advanced public transportation systems\n• Detailed economic simulation with supply chains\n• Weather effects on city operations\n• Realistic population demographics and growth\n• Environmental impact and sustainability metrics\n• Advanced zoning tools and mixed-use development\n• Real-world inspired building assets and landmarks",
        image: "https://images.pexels.com/photos/442576/pexels-photo-442576.jpeg?auto=compress&cs=tinysrgb&w=800"
      },
      system: {
        text: "Minimum Requirements:\n• Cities: Skylines base game\n• 12GB system RAM\n• GTX 960 / RX 570 or equivalent\n• 20GB free storage space\n• Stable internet for asset downloads\n\nRecommended:\n• 32GB system RAM\n• GTX 1080 / RX 6600 or better\n• SSD storage for faster loading\n• High-resolution monitor for detailed city viewing",
        image: "https://images.pexels.com/photos/442576/pexels-photo-442576.jpeg?auto=compress&cs=tinysrgb&w=800"
      }
    },
    downloadLink: "https://example.com/cities-skylines-realism-download",
    alternatives: []
  }
];

async function seedDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/modhub');
    console.log('Connected to MongoDB');

    // Clear existing data
    await Admin.deleteMany({});
    await Game.deleteMany({});
    console.log('Cleared existing data');

    // Create default admin
    const defaultAdmin = new Admin({
      username: 'admin',
      password: 'admin123',
      role: 'super_admin'
    });
    await defaultAdmin.save();
    console.log('Created default admin (username: admin, password: admin123)');

    // Create sample games
    const createdGames = [];
    for (const gameData of sampleGames) {
      const game = new Game(gameData);
      await game.save();
      createdGames.push(game);
      console.log(`Created game: ${game.name}`);
    }

    // Set up alternatives (cross-reference games)
    if (createdGames.length > 1) {
      for (let i = 0; i < createdGames.length; i++) {
        const alternatives = createdGames.filter((_, index) => index !== i).slice(0, 2);
        await Game.findByIdAndUpdate(createdGames[i]._id, {
          alternatives: alternatives.map(alt => alt._id)
        });
      }
      console.log('Set up game alternatives');
    }

    console.log('\n✅ Database seeded successfully!');
    console.log('\nDefault admin credentials:');
    console.log('Username: admin');
    console.log('Password: admin123');
    console.log('\nYou can now start the server and access the admin panel.');

  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await mongoose.connection.close();
    console.log('Database connection closed');
  }
}

// Run the seed function
seedDatabase();