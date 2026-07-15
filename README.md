# 🎪 WONDERLAND

A premium full-stack travel marketplace and lodging platform that enables users to discover luxury properties, explore locations via Mapbox maps, upload property images, review hosts, bookmark favorites, and manage listings dynamically.

<p align="center">

![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white)
![Bootstrap](https://img.shields.io/badge/Bootstrap-5-7952B3?logo=bootstrap&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6-F7DF1E?logo=javascript&logoColor=black)
![Node.js](https://img.shields.io/badge/Node.js-Express-339933?logo=node.js)
![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?logo=mongodb)
![Mapbox](https://img.shields.io/badge/Mapbox-GL-000000?logo=mapbox&logoColor=white)
![Cloudinary](https://img.shields.io/badge/Cloudinary-Media-3448C5?logo=cloudinary&logoColor=white)

</p>

---

# 🌐 Live Demo

Experience **Wonderland** live and explore the complete travel listing workflow—from authentication and property discovery to Mapbox target flying animations, Cloudinary uploads, reviews, and a personalized bookmark favorites manager.

<p align="center">
  <a href="https://wonderland-8sm7.onrender.com" target="_blank">
    <img src="https://img.shields.io/badge/🚀%20Launch%20Wonderland-Live%20Application-fe424d?style=for-the-badge" alt="Launch Wonderland">
  </a>
</p>

<p align="center">
  <strong>🔗 Live URL</strong><br>
  👉 <a href="https://wonderland-8sm7.onrender.com">
    https://wonderland-8sm7.onrender.com
  </a>
</p>

> **🔒 Default Admin Credentials:** Log in using **`admin`** and password **`admin123`** to test full landlord edit, deletion, and property ownership controls.

---

# ✨ Features

## 👤 User Features

- Browse curated luxury properties across multiple dynamic categories (Trending, Rooms, Castles, Mountains, Pools, Farms, Arctic)
- View complete listing information, amenities, pricing, availability, and owner details
- Interactive Mapbox GL maps displaying listing coordinates, custom markers, and location popups
- Map target fly controls (`map.flyTo`) to snap back to the property coordinates
- Dynamic AJAX-based Favorites system with slide-in notifications
- Leave, edit, and delete ratings and comments on properties
- Substring-scoped full-text search by Title or Location
- Responsive UI optimized for mobile, tablet, and widescreen viewports

---

## 🛠 Landlord / Admin Features

- Create listings with dynamic address geocoding via Mapbox API
- Resilient geocoding that retries 5 times on network failure before falling back to coordinates
- Secure image uploads stored in Cloudinary
- Edit property titles, pricing, descriptions, categories, availability, and amenities
- Restrict property modifications to the owner only (RBAC)
- Clean deletion of listings that automatically cleans up all associated reviews in database and media images in Cloudinary
- Seed script to instantly clear database and reset 29 default listings and default admin

---

# 🚀 Tech Stack

## Frontend

- EJS Templating Engine
- EJS Mate Layout Boilerplates
- CSS3 (Custom Glassmorphism, animations, loading keyframes)
- Bootstrap 5 (Responsive containers & spacing)
- FontAwesome Icons
- Mapbox GL JS SDK
- Starability CSS (Interactive star ratings)

---

## Backend

- Node.js
- Express.js
- MongoDB Atlas (Cloud NoSQL)
- Mongoose ODM (Data modeling & schemas)
- Passport.js (Authentication & secure local hashing)
- Multer (Form data parser)
- Cloudinary Storage SDK
- Dotenv (Environment configuration)
- Compression & Morgan (Production optimization & logging)

---

#  Project Architecture

```
                     EJS Template (HTML/CSS/JS)
                                 │
                                 │
                         HTTP REST API Requests
                                 │
                                 ▼
                         Express Backend
                                 │
       ┌─────────────────────────┼─────────────────────────┐
       │                         │                         │
       ▼                         ▼                         ▼
 MongoDB Atlas              Mapbox API                Cloudinary API
 (Lodging, User, Reviews)   (Geocoding / Maps)        (Image Uploads via Multer)
```

---

# 📁 Project Structure

```
Wonderland/
│
├── controllers/          # Business logic controllers
│   ├── listings.js
│   ├── reviews.js
│   └── user.js
│
├── init/                 # Database initialization and seeding
│   ├── data.js
│   └── index.js
│
├── models/               # Mongoose Schemas & Models
│   ├── listing.js
│   ├── review.js
│   └── user.js
│
├── public/               # Public assets served statically
│   ├── css/              # style.css, rating.css
│   └── js/               # script.js, map.js
│
├── routes/               # Express Routes mapping
│   ├── listings.js
│   ├── reviews.js
│   └── user.js
│
├── utility/              # Custom error handling classes and wrappers
│   ├── ExpressError.js
│   └── asyncWrap.js
│
├── views/                # EJS Templates
│   ├── includes/         # navbar, footer, flash alerts
│   ├── layouts/          # boilerplate layout wrap
│   ├── listings/         # index, show, edit, new, favorites
│   ├── reviews/          # edit
│   └── users/            # login, signup
│
├── app.js                # Server entry point
├── vercel.json           # Vercel serverless routing configuration
├── package.json          # Dependency packages
└── README.md
```

---

# ⚙️ Key Functionalities

### Authentication & Authorization

- Salted password hashing and registration handled via Passport.
- Dual-sign-in support: Allows users to log in using **either** their Email or Username.
- Role-based control: Users can only edit or delete listings they own, and can only delete reviews they wrote.

### Location Services

- Node server automatically geocodes text locations into coordinates via Mapbox.
- Built-in 5-attempt retry loop on Mapbox connection timeouts, with a fallback to New Delhi coordinates to prevent server crashes.

### Bookmarking System

- Custom bookmarks view page.
- AJAX-based bookmark addition and removal that prompts users to log in first and returns them right back to their origin page afterwards.

### Cloud Image Storage

- Multer handles multipart file streams.
- Uploads images to Cloudinary, saving the remote URL in the database.
- Automatically destroys the cloud image when a listing is deleted.

---

# 🔐 Environment Variables

Create a `.env` file in the root directory:

```env
ATLAS_DBURL=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/wonderland_db

SECRET=your_express_session_crypto_secret

MAP_TOKEN=your_mapbox_public_token

CLOUD_NAME=your_cloudinary_cloud_name
CLOUD_API_KEY=your_cloudinary_api_key
CLOUD_API_SECRET=your_cloudinary_api_secret

NODE_ENV=development
```

---

# 💻 Installation

Clone the repository:
```bash
git clone https://github.com/mihirgupta665/Wonderland-Project.git
```

Move into the project folder:
```bash
cd Wonderland-Project
```

Install dependencies:
```bash
npm install
```

---

# ▶ Running the Project

Seed the database with sample data:
```bash
node init/index.js
```

Start the development server with live watch mode:
```bash
npm start
```

Access the application at:
```
http://localhost:8080
```

---

# 📦 Available Scripts

```bash
npm start
```

Runs the application in hot-reloading mode using `node --watch app.js`.

```bash
node init/index.js
```

Wipes the database and inserts fresh, styled seed data.

---

# 🔄 User Bookmark Workflow

```
User Explores Listing
          │
          ▼
    Click Bookmark (Heart)
          │
    Is Logged In? 
     ├── Yes ──► Toggle Favorite (AJAX Request) ──► Show Custom Alert
     └── No  ──► Capture Referer ──► Redirect to /login
                                           │
                                           ▼
                                   User Logs In
                                           │
                                           ▼
                             Redirect Back to Listing Page
```

---

# 🚀 Deployment

- **Hosting**: Render (Web Service Node.js configuration)
- **Routing**: `trust proxy` enabled for secure cookie preservation behind Render's load balancer.
- **Database**: MongoDB Atlas (Cloud NoSQL Cluster)
- **Media**: Cloudinary CDN
- **Maps**: Mapbox GL CDN

---

# 🤝 Contributing

Contributions are welcome! Please fork this repository, make your changes, and open a Pull Request.

---

# 📄 License

This project is open-source and intended for education and learning purposes.

---

# 👨‍💻 Author

**Mihir Gupta**

If you found this project helpful, consider giving it a ⭐ on GitHub!
