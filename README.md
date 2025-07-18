# Node Blog Application

## Project Overview

This is a simple blog application built with Node.js and Express.js. The goal of this project is to explore the basics of building a web application using Node and Express, focusing on implementing full CRUD (Create, Read, Update, Delete) functionalities. Instead of a database, the application uses a JSON file to store blog posts, serving as a simple data store for learning purposes.

The application implements an in-memory caching system to optimize performance by loading posts into memory on startup and maintaining cache consistency through dedicated helper functions.

## Tools and Technologies Used

- Node.js
- Express.js
- EJS (Embedded JavaScript templating)
- method-override (for supporting PUT/DELETE in forms)
- JSON file for data storage (no database)

## Running Locally

1. **Clone the repository:**
   ```bash
   git clone git@github.com:kianacox/node-blog-application.git
   cd node-blog-application
   ```
2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Start the development server:**
   ```bash
   npm run dev
   ```
   The server will run at [http://localhost:3000](http://localhost:3000).
