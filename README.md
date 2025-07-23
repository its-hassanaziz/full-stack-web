# ModHub - Legal Game Mod Distribution Platform

A full-stack web application for distributing legal game modifications with a modern React frontend and Node.js backend.

## Features

### Public Features
- **Home Page**: Featured games grid with search functionality
- **Game Pages**: Detailed game information with sections for overview, versions, uses, features, and system requirements
- **Download System**: 10-second countdown timer before download initiation
- **Theme System**: Light/dark mode toggle with localStorage persistence
- **Responsive Design**: Mobile-first design that works on all devices
- **About & Contact Pages**: Information and contact form

### Admin Features
- **Secure Authentication**: JWT-based admin authentication
- **Game Management**: Add, edit, and delete game modifications
- **File Uploads**: Support for game logos and section images
- **Admin Management**: Create new admins and reset passwords
- **Dashboard**: Comprehensive admin control panel

### Technical Features
- **Security**: Rate limiting, input sanitization, XSS protection
- **Database**: MongoDB with Mongoose ODM
- **File Handling**: Multer for file uploads with validation
- **API**: RESTful API with proper error handling
- **Validation**: Client and server-side form validation

## Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **React Router** for navigation
- **React Hook Form** for form handling
- **Axios** for API calls
- **React Hot Toast** for notifications
- **Lucide React** for icons

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose
- **JWT** for authentication
- **Bcrypt** for password hashing
- **Multer** for file uploads
- **Express Rate Limit** for API protection
- **Helmet** for security headers
- **CORS** for cross-origin requests

## Installation

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- Git

### Backend Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd modhub
   ```

2. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Environment Configuration**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` with your configuration:
   ```env
   NODE_ENV=development
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/modhub
   JWT_SECRET=your-super-secret-jwt-key-here
   FRONTEND_URL=http://localhost:3000
   ```

4. **Seed the database** (optional)
   ```bash
   npm run seed
   ```
   This creates sample games and a default admin account:
   - Username: `admin`
   - Password: `admin123`

5. **Start the backend server**
   ```bash
   npm run dev
   ```
   The API will be available at `http://localhost:5000`

### Frontend Setup

1. **Install frontend dependencies**
   ```bash
   cd .. # Go back to root directory
   npm install
   ```

2. **Environment Configuration**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env`:
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```
   The application will be available at `http://localhost:3000`

## Usage

### For Users
1. Visit the homepage to browse available game mods
2. Use the search bar to find specific games
3. Click on any game to view detailed information
4. Navigate through different sections (Overview, Versions, Uses, Features, System Requirements)
5. Click the download button and wait for the 10-second countdown
6. Toggle between light and dark themes using the header button

### For Administrators
1. Navigate to `/admin/login`
2. Log in with admin credentials
3. Access the dashboard to:
   - Add new games with detailed information and images
   - Manage existing games (edit/delete)
   - Create new admin accounts
   - Reset admin passwords

## API Endpoints

### Public Endpoints
- `GET /api/games` - Get all games
- `GET /api/games/:slug` - Get single game by slug
- `POST /api/contact` - Submit contact form

### Admin Endpoints (Protected)
- `POST /api/admin/login` - Admin login
- `POST /api/admin/register` - Create new admin
- `POST /api/admin/reset-password` - Reset admin password
- `GET /api/admin/list` - Get all admins
- `POST /api/games` - Create new game
- `PUT /api/games/:id` - Update game
- `DELETE /api/games/:id` - Delete game

## File Structure

```
modhub/
├── backend/
│   ├── models/          # Database models
│   ├── routes/          # API routes
│   ├── middleware/      # Custom middleware
│   ├── scripts/         # Utility scripts
│   └── uploads/         # File upload directory
├── src/
│   ├── components/      # React components
│   ├── contexts/        # React contexts
│   ├── pages/          # Page components
│   ├── services/       # API services
│   └── types/          # TypeScript types
└── public/             # Static assets
```

## Security Features

- **Authentication**: JWT tokens with secure storage
- **Rate Limiting**: API and download rate limiting
- **Input Validation**: Server-side validation with express-validator
- **Data Sanitization**: MongoDB injection and XSS protection
- **File Upload Security**: File type and size validation
- **CORS Protection**: Configured for specific origins
- **Security Headers**: Helmet.js for security headers

## Deployment

### Backend Deployment (Hostinger)
1. Upload backend files to your hosting directory
2. Install dependencies: `npm install --production`
3. Set environment variables in hosting panel
4. Configure MongoDB connection
5. Start the application: `npm start`

### Frontend Deployment
1. Build the application: `npm run build`
2. Upload the `dist` folder contents to your web hosting
3. Configure your web server to serve the React app
4. Update API URL in environment variables

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes and commit: `git commit -m 'Add feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support and questions:
- Create an issue on GitHub
- Contact us through the website contact form
- Email: support@modhub.com

## Acknowledgments

- React and Node.js communities
- Tailwind CSS for the utility-first CSS framework
- MongoDB for the database solution
- All contributors and testers