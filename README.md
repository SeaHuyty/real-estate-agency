# 🏡 Real Estate Agency

A full-stack web application designed for individuals seeking to buy properties such as villas, apartments, penthouses, and houses. Built with modern web technologies, this project enables users to browse listings and manage real estate data through a user-friendly interface.

## 📌 Project Overview

**Real Estate Agency** is a university project aimed at simulating a digital platform for real estate transactions. It showcases properties and provides features tailored to people looking to purchase different types of homes.

## ⚙️ Tech Stack

* **Frontend:** React.js, Tailwind CSS
* **Backend:** Node.js, Express.js
* **Database:** PostgreSQL (hosted on [Neon](https://neon.tech/))

## 💡 Features

* Browse property listings (villas, houses, apartments, penthouses)
* Responsive and modern UI using Tailwind
* Full-stack integration between frontend and backend
* Scalable database structure using PostgreSQL

## 🛠️ Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/SeaHuyty/real-estate-agency.git
cd real-estate-agency
```

### 2. Install Dependencies

#### Frontend

```bash
cd frontend
npm install
```

#### Backend

```bash
cd ../backend
npm install
```

### 3. Environment Configuration

Create a `.env` file in the backend directory with your PostgreSQL connection string and any other secrets required.

Example:

```env
DATABASE_URL=your_postgres_connection_string
PORT=5000
```

### 4. Run the App

In separate terminals:

#### Backend

```bash
cd backend
npm start
```

#### Frontend

```bash
cd frontend
npm run dev
```

## 📄 License

This project is licensed under the [MIT License](LICENSE).
