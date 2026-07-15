# 🎪 WONDERLAND — Luxury Lodging & Booking Platform

[![Node.js Version](https://img.shields.io/badge/node-v24%2B-green.svg)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/framework-Express.js-blue.svg)](https://expressjs.com/)
[![MongoDB Atlas](https://img.shields.io/badge/database-MongoDB%20Atlas-emerald.svg)](https://www.mongodb.com/cloud/atlas)
[![Vercel Deployment](https://img.shields.io/badge/deployment-Vercel%20Serverless-black.svg)](https://vercel.com/)
[![Mapbox SDK](https://img.shields.io/badge/maps-Mapbox%20GL-blueviolet.svg)](https://www.mapbox.com/)
[![Cloudinary](https://img.shields.io/badge/storage-Cloudinary-lightblue.svg)](https://cloudinary.com/)

**Wonderland** is a premium, full-stack travel marketplace and lodging platform. Designed with modern aesthetics, the platform allows users to browse luxury properties, bookmark favorites, make precise substring searches, view locations on interactive Mapbox maps, upload property images, and share ratings and reviews.

---

## 🌟 Key Features

- **💎 Premium UX & Glassmorphic Design**: Customized widescreen grid wrapper layouts with Bootstrap gutters, responsive cards, micro-animations, and a custom slate glassmorphic loading spinner.
- **🔐 Dual-Field Authentication**: Secure signup and signin support using **either Email or Username** integrated natively with passport hashes.
- **🗺️ Resilient Mapbox Integration**: 
  - Dynamic maps showing listing locations with popups and custom icons.
  - Interactive recentering flight controls (`map.flyTo`) for easy map navigation.
  - Automated geocoding resiliency (up to 5 connection retries before falling back to default coordinates).
- **💖 Bookmarks & Favorites**: Interactive AJAX-based favorite bookmarks page. Toggling favorites automatically displays responsive, client-side slide-in flash alerts.
- **✍️ Reviews & Rating Engine**: Integrated property review system with starability stars, review counts, average ratings, and percentage distribution badges.
- **🔍 Scoped Search**: Substring-level filter matches that target **Title** or **Location** fields exclusively.

---

## 🛠️ Technology Stack

| Layer | Technologies & Packages Used |
| :--- | :--- |
| **Frontend** | HTML5, EJS Templating (ejs-mate), CSS3 (Custom Glassmorphism, animations), Bootstrap 5, FontAwesome Icons |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB Atlas, Mongoose ODM |
| **Authentication** | Passport.js, Passport-Local, Passport-Local-Mongoose (crypto salted hashes) |
| **Media Storage** | Cloudinary API, Multer, Multer Storage Cloudinary |
| **API Services** | Mapbox GL JS SDK, Mapbox Forward Geocoding |
| **Utilities** | Connect-Mongo (Session Storage), Connect-Flash (Notification system), Joi (Server-side schema validation), Compression |

---

## 🗺️ API Route Map

### Listings API (`/listings`)
- `GET /listings` — View all listings (Explore / Search results)
- `GET /listings/new` — Render create new listing form * (Auth required)
- `POST /listings` — Create a new listing with image upload and Mapbox geocoding * (Auth required)
- `GET /listings/favorites` — View bookmarked listings * (Auth required)
- `GET /listings/:id` — Show detailed view of a listing (incorporates Mapbox map and reviews)
- `GET /listings/:id/edit` — Render edit listing form * (Owner required)
- `PUT /listings/:id` — Update listing details and upload new media * (Owner required)
- `DELETE /listings/:id` — Remove listing and destroy Cloudinary media * (Owner required)
- `POST /listings/:id/favorite` — AJAX Toggle bookmark status * (Auth required)

### Reviews API (`/listings/:id/reviews`)
- `POST /listings/:id/reviews` — Post rating and comment * (Auth required)
- `DELETE /listings/:id/reviews/:reviewId` — Delete specific review * (Review Author required)

### Users API (`/`)
- `GET /signup` — Render signup form
- `POST /signup` — Register a new account
- `GET /login` — Render login form
- `POST /login` — Process login (Accepts Username or Email, custom fail alerts)
- `GET /logout` — Log out user session

---

## 📂 Codebase Architecture

```text
├── models/             # Mongoose Schemas (Listing, Review, User)
├── routes/             # Express Router split routing (listings, reviews, users)
├── controllers/        # Controllers containing logic (listings, reviews, users)
├── views/              # EJS Views
│   ├── includes/       # Reusable layout partials (navbar, footer, flash alerts)
│   ├── layouts/        # Boilerplate layout page wrapper (ejs-mate)
│   └── ...             # Listing, Review, and Authentication views
├── public/             # Static Assets
│   ├── css/            # Custom styling (style.css, rating.css)
│   └── js/             # Client script logic (script.js, map.js)
├── utility/            # Error handling classes and wrappers (ExpressError, asyncWrap)
├── schema.js           # Joi schemas for server-side validation
├── cloudConfig.js      # Cloudinary and Multer storage configurations
├── app.js              # Application entry point & configuration setup
└── vercel.json         # Vercel serverless routing configuration
```

---

## 🚀 Local Setup & Installation

### Prerequisites
- Node.js (v18+)
- MongoDB Atlas account (or Local MongoDB instance)

### 1. Clone & Install
```bash
git clone https://github.com/mihirgupta665/Wonderland-Project.git
cd Wonderland-Project
npm install
```

### 2. Configure Environment Variables
Create a `.env` file in the root directory based on `.env.example`:
```env
ATLAS_DBURL=mongodb+srv://...
SECRET=your_express_session_secret
MAP_TOKEN=your_mapbox_token
CLOUD_NAME=your_cloudinary_name
CLOUD_API_KEY=your_cloudinary_api_key
CLOUD_API_SECRET=your_cloudinary_api_secret
```

### 3. Seed Sample Database
Initialize and seed MongoDB Atlas with 29 curated listings:
```bash
node init/index.js
```
*(Default Admin login created: **`admin`** / **`admin123`**)*

### 4. Run Application
Run the local hot-reloading development server:
```bash
npm start
```
Open **`http://localhost:8080`** in your browser.

---

## ☁️ Deployment

This project is configured to run as a **Serverless Function** on **Vercel**.
- The serverless handler is exported in `app.js` via `module.exports = app;`.
- Routing constraints are declared inside `vercel.json`.
- When pushing updates to GitHub, Vercel automatically deploys updates. Just ensure your `.env` variables are added to your project's **Vercel Dashboard Environment Settings**.

---
*Created with ♥ by Mihir Gupta | WonderLand Private Limited | © All Rights Reserved*
