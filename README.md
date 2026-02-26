# 🍲 MhobFinder

**Capstone Project 2 | Institute of Digital Technology**  
*A Smart Ingredient-Based Recipe Discovery Platform*

**MhobFinder** is a web application that helps users discover recipes based on the ingredients they already have at home. By solving the common question *“What should I cook today?”*, it simplifies meal planning, encourages healthier cooking habits, and helps reduce food waste.  

<p align="center">
  <img src="https://media.giphy.com/media/l0MYt5jPR6QX5pnqM/giphy.gif" width="300" alt="Cooking Animation"/>
</p>

---

## 📖 Table of Contents
- [About the Project](#-about-the-project)
- [Key Features](#-key-features)
- [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)
  - [Installation & Run Guide](#-installation--run-guide)
- [System Architecture](#-system-architecture)
- [Team](#-team)

---

## 🧐 About the Project

Home cooking can be challenging when deciding what to make and avoiding food waste. **MhobFinder** solves this by letting users input available ingredients and instantly generating recipe suggestions complete with detailed cooking instructions.

The project was developed over **12 weeks** following the **Waterfall methodology**, progressing from requirements analysis → system design → implementation → testing → fully functional prototype.

---

## ✨ Key Features

### User Functionalities
- **Ingredient-Based Search:** Input ingredients (e.g., egg, tomato) to find recipes.
- **Recipe Suggestions:** Get relevant dishes based on what you have.
- **Step-by-Step Instructions:** Detailed cooking guides with optional images.
- **Smart Filtering:** Filter by cuisine, dietary preferences, or cooking time.
- **Favorites System:** Save your favorite recipes (requires login).
- **Alternative Ingredients:** Suggests substitutes when an ingredient is missing.

### Admin Functionalities
- **Recipe Management:** Add, edit, or delete recipes.
- **Ingredient & Category Management:** Keep ingredients and categories up to date.
- **User Monitoring:** Track user activity and system usage statistics.

---

## 🛠 Tech Stack

**MhobFinder** uses modern web technologies for performance, scalability, and a responsive user experience.

| Component        | Technology              | Description |
|-----------------|------------------------|-------------|
| **Frontend**     | React.js / JavaScript   | Dynamic UI & client-side logic |
| **Backend**      | Node.js / Express       | Server-side logic & RESTful APIs |
| **Database**     | MySQL                  | Stores recipes, ingredients, users |
| **Authentication** | Firebase             | User authentication & services |
| **Design**       | Figma                  | UI/UX wireframing & prototyping |

<p align="center">
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React"/>
  <img src="https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js"/>
  <img src="https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express.js"/>
  <img src="https://img.shields.io/badge/MySQL-00000F?style=for-the-badge&logo=mysql&logoColor=white" alt="MySQL"/>
  <img src="https://img.shields.io/badge/Firebase-039BE5?style=for-the-badge&logo=firebase&logoColor=white" alt="Firebase"/>
</p>

---

## 💻 Getting Started

To run locally, start the **Backend** and **Frontend** in **two separate terminals**.

### Prerequisites
- Node.js (LTS recommended)  
- MySQL (installed & running)  
- Git  

### 🚀 Installation & Run Guide

#### 1️⃣ Clone the Repository
```bash
git clone https://github.com/your-username/MhobFinder.git
cd MhobFinder
````

#### 2️⃣ Setup Backend

Open your **first terminal**:

```bash
cd backend
npm install
npm run dev
```

#### 3️⃣ Setup Frontend

Open your **second terminal**:

```bash
cd frontend
npm install
npm run dev
```

Visit the app in your browser:

* `http://localhost:3000` or `http://localhost:5173` (depending on configuration)

---

## 🏗 System Architecture

* Users interact via a web browser
* **React frontend** communicates with **Node.js / Express backend**
* Backend handles requests, authentication via **Firebase**, and data retrieval from **MySQL**

<p align="center">
  <img src="https://media.giphy.com/media/3o7TKtnuHOHHUjR38Y/giphy.gif" width="400" alt="Architecture Illustration"/>
</p>

---

## 👥 Team

This project was developed by:

* Mr. Sao Sethavathanak
* Mrs. Kimhong Chhour
* Mr. Pov Davin
* Mr. Mok Chytasenasak
* Mr. Khorn Vannda
* Mr. Luy Virak

---

<p align="center">
  <img src="https://capsule-render.vercel.app/api?text=Happy+Cooking!&animation=fadeIn&type=waving&color=gradient&height=100" alt="Footer Animation"/>
</p>
