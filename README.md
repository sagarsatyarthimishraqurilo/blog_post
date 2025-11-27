# 📝 BlogHub - Modern Blogging Platform

![BlogHub](https://img.shields.io/badge/BlogHub-Modern%20Blogging%20Platform-purple)
![Node.js](https://img.shields.io/badge/Node.js-18%2B-green)
![Express](https://img.shields.io/badge/Express-4.x-lightgrey)
![MongoDB](https://img.shields.io/badge/MongoDB-Database-green)
![EJS](https://img.shields.io/badge/EJS-Templating-orange)

A beautiful, modern, and feature-rich blogging platform built with Node.js, Express, MongoDB, and EJS. Create, manage, and share your blog posts with an intuitive and responsive interface.

## ✨ Features

### 🎯 Core Features
- **User Authentication** - Secure registration and login with JWT
- **Blog Management** - Create, edit, delete, and view blog posts
- **Like System** - Interactive like/unlike functionality
- **Responsive Design** - Beautiful UI that works on all devices
- **Real-time Interactions** - Smooth animations and transitions

### 🎨 User Experience
- **Modern Dashboard** - Clean and intuitive post management
- **Beautiful Profile** - Personal profile with post statistics
- **Interactive UI** - Hover effects and smooth animations
- **Mobile-Friendly** - Responsive design for all screen sizes

### 🔒 Security Features
- Password hashing with bcrypt
- JWT-based authentication
- Protected routes middleware
- Secure cookie management

## 🚀 Quick Start

### Prerequisites
- Node.js (18 or higher)
- MongoDB (Local or Atlas)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd blog-post
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the root directory:
   ```env
   PORT=3000
   DB_URI=your_mongodb_connection_string
   JWT_SECRET=your_super_secret_jwt_key
   JWT_EXPIRES_IN=1h
   NODE_ENV=development
   ```

4. **Start the application**
   ```bash
   # Development
   npm run dev

   # Production
   npm start
   ```

5. **Access the application**
   Open your browser and navigate to `http://localhost:3000`

## 📁 Project Structure

```
blog-post/
├── app.js                 # Main application file
├── config/
│   └── db.config.js      # Database configuration
├── models/
│   ├── user.models.js    # User schema and model
│   └── post.models.js    # Post schema and model
├── views/                # EJS templates
│   ├── index.ejs         # Landing page
│   ├── login.ejs         # Login page
│   ├── register.ejs      # Registration page
│   ├── dashboard.ejs     # User dashboard
│   ├── profile.ejs       # User profile
│   ├── 404.ejs          # Not found page
│   └── 500.ejs          # Server error page
├── public/               # Static assets
│   └── stylesheets/
│       └── style.css    # Custom styles
└── .env                 # Environment variables
```

## 🛠️ Technology Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **bcrypt** - Password hashing
- **dotenv** - Environment management

### Frontend
- **EJS** - Template engine
- **Tailwind CSS** - Utility-first CSS framework
- **Font Awesome** - Icons
- **JavaScript** - Client-side interactions

### Development Tools
- **nodemon** - Development server
- **cookie-parser** - Cookie management

## 📊 API Routes

### 🔐 Authentication Routes
| Method | Route | Description |
|--------|-------|-------------|
| GET | `/` | Home page |
| GET | `/login` | Login page |
| GET | `/register` | Registration page |
| POST | `/register` | User registration |
| POST | `/login` | User login |
| GET | `/logout` | User logout |

### 📝 Protected Routes
| Method | Route | Description |
|--------|-------|-------------|
| GET | `/dashboard` | User dashboard |
| GET | `/profile` | User profile |

### 🎯 Post Management Routes
| Method | Route | Description |
|--------|-------|-------------|
| POST | `/posts/create` | Create new post |
| POST | `/posts/:id/like` | Like/unlike post |
| POST | `/posts/:id/delete` | Delete post |
| POST | `/posts/:id/edit` | Edit post |

## 🎨 UI Components

### Pages Overview

1. **Home Page** (`/`)
   - Beautiful hero section
   - Feature highlights
   - Call-to-action buttons

2. **Login Page** (`/login`)
   - Clean authentication form
   - Social media-style design
   - Responsive layout

3. **Register Page** (`/register`)
   - User registration form
   - Password strength validation
   - Terms acceptance

4. **Dashboard** (`/dashboard`)
   - Post creation form
   - Posts feed with likes
   - User statistics
   - Real-time interactions

5. **Profile Page** (`/profile`)
   - User information
   - Post management
   - Edit/delete functionality
   - Like statistics

## 🔧 Configuration

### Database Models

#### User Model
```javascript
{
  username: String (unique, required),
  email: String (unique, required),
  password: String (required, hashed),
  name: String (required),
  posts: [ObjectId] (ref: 'Post')
}
```

#### Post Model
```javascript
{
  title: String (required),
  content: String (required),
  author: ObjectId (ref: 'User', required),
  date: Date (default: Date.now),
  likes: [ObjectId] (ref: 'User')
}
```

### Environment Variables
```env
PORT=3000
DB_URI=mongodb://localhost:27017/bloghub
JWT_SECRET=your_very_secure_secret_key
JWT_EXPIRES_IN=1h
NODE_ENV=development
```

## 🎯 Usage Guide

### For Users
1. **Registration**: Create a new account with email and password
2. **Login**: Access your dashboard with secure authentication
3. **Create Posts**: Write and publish blog posts
4. **Manage Content**: Edit or delete your existing posts
5. **Interact**: Like posts and track engagement

### For Developers
1. **Clone and setup** the project as described above
2. **Configure** your MongoDB connection
3. **Customize** the UI by modifying EJS templates
4. **Extend** functionality by adding new routes and features

## 🔄 Development

### Running in Development Mode
```bash
npm run dev
```
This starts the server with nodemon for automatic restarts on file changes.

### Building for Production
```bash
npm start
```

### Code Structure
The application follows MVC pattern:
- **Models**: Data schemas and database operations
- **Views**: EJS templates for rendering pages
- **Controllers**: Route handlers in app.js

## 🐛 Troubleshooting

### Common Issues

1. **Database Connection Error**
   - Verify MongoDB is running
   - Check DB_URI in .env file
   - Ensure network connectivity

2. **Authentication Issues**
   - Verify JWT_SECRET is set
   - Check token expiration settings
   - Clear browser cookies

3. **Template Errors**
   - Check EJS syntax in template files
   - Verify variable names match between routes and templates

### Debug Mode
Set `NODE_ENV=development` for detailed error messages and logging.

## 📈 Future Enhancements

### Planned Features
- [ ] Comment system on posts
- [ ] User following/followers
- [ ] Post categories and tags
- [ ] Rich text editor
- [ ] Image upload support
- [ ] Post search and filtering
- [ ] User notifications
- [ ] Admin dashboard
- [ ] API endpoints for mobile apps

### Technical Improvements
- [ ] Add input validation middleware
- [ ] Implement rate limiting
- [ ] Add comprehensive testing
- [ ] Improve error handling
- [ ] Add logging system
- [ ] Implement caching

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Development Guidelines
- Follow existing code style
- Write clear commit messages
- Test your changes thoroughly
- Update documentation as needed

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues or have questions:

1. **Check the documentation** - This README and code comments
2. **Search existing issues** - Someone might have had the same problem
3. **Create a new issue** - Provide detailed information about your problem

## 🙏 Acknowledgments

- **Express.js** team for the amazing web framework
- **MongoDB** for the flexible database solution
- **Tailwind CSS** for the utility-first CSS framework
- **Font Awesome** for the beautiful icons

---

<div align="center">

**Built with ❤️ using Modern Web Technologies**

</div>
