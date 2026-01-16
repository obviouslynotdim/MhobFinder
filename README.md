---

```markdown
# 🍲 MhobFinder

> **Capstone Project 1** - Institute of Digital Technology, CADT  
> *Smart Ingredient-Based Recipe Discovery Platform*

**MhobFinder** is a web-based application designed to help users find recipes based on the ingredients they already have at home. By simplifying the decision of "what to cook," this system aims to reduce food waste, minimize unnecessary grocery trips, and promote healthier meal planning.

---

## 📖 Table of Contents
- [About the Project](#-about-the-project)
- [Key Features](#-key-features)
- [Tech Stack](#-tech-stack)
- [System Architecture](#-system-architecture)
- [Getting Started](#-getting-started)
- [Usage](#-usage)
- [Contributors](#-contributors)
- [Acknowledgements](#-acknowledgements)

---

## 🧐 About the Project
Many people face difficulty deciding what to cook, often limited by the ingredients available in their fridge. This leads to food waste and poor meal planning. 

**MhobFinder** solves this by:
1. allowing users to input ingredients (e.g., "egg", "tomato").
2. generating instant recipe suggestions.
3. providing step-by-step cooking instructions.

The project was developed over 12 weeks using the **Waterfall methodology** and adheres to modern web development standards.

---

## ✨ Key Features

### User Portal
* **Ingredient-Based Search:** Input available ingredients to find matching recipes.
* **Recipe Suggestions:** View detailed recipes with images, ingredients, and step-by-step instructions.
* **Smart Filtering:** Filter results by **Cuisine**, **Dietary Preferences**, and **Cooking Time**.
* **Favorites:** Save recipes to a personal "Favorites" list for quick access.
* **Alternative Ingredients:** Get suggestions for substitutes if you are missing an item.

### Admin Panel
* **Recipe Management:** Create, update, and delete recipes.
* **Ingredient Management:** Manage the database of ingredients and categories.
* **User Monitoring:** View user activity and system usage.

---

## 🛠 Tech Stack

### Frontend
* **JavaScript (ES6+)** - Core logic.
* **React.js** - Component-based UI library.
* **HTML5 & CSS3** - Layout and styling.

### Backend
* **Node.js** - Runtime environment.
* **Express.js** - Web framework for handling API requests.

### Database & Services
* **MySQL** - Relational database for storing recipes and user data.
* **Firebase** - Used for User Authentication and Hosting.

### Tools
* **Figma** - UI/UX Design and Prototyping.
* **VS Code** - Development environment.
* **GitHub** - Version control.

---

## 💻 Getting Started

Follow these instructions to set up the project locally. You will need to run the **Backend** and **Frontend** in separate terminals.

### Prerequisites
* Node.js installed (v14 or higher)
* MySQL installed and running

### Installation & Run Guide

#### 1. Clone the Repository
```bash
git clone [https://github.com/username/MhobFinder.git](https://github.com/username/MhobFinder.git)
cd MhobFinder

```

#### 2. Setup Backend (Terminal 1)

Open your first terminal window to start the server.

```bash
# Navigate to backend folder
cd backend

# Install server dependencies
npm install

# Create a .env file (if required) and add your DB/Firebase credentials
# echo "DB_HOST=localhost" > .env

# Start the Backend Server
npm run dev

```

*The server should now be running (e.g., on port 5000).*

#### 3. Setup Frontend (Terminal 2)

Open a **new** terminal window to start the client application.

```bash
# Navigate to the project root, then frontend
cd MhobFinder
cd frontend

# Install client dependencies
npm install

# Start the React Application
npm run dev

```

*The application should now be accessible in your browser (usually at `http://localhost:3000` or `http://localhost:5173`).*

---

## 🏗 System Architecture

The system utilizes a **Client-Server Architecture**:

1. **Client:** Web browser (Chrome/Firefox) running the React Frontend.
2. **Server:** Node.js/Express API handling business logic.
3. **Database:** MySQL storing structured data (Recipes, Ingredients, Users).

---

## 👥 Contributors

This project was submitted by the following students from the **Faculty of Digital Engineering**:

* **Mr. Sao Sethavathanak**
* **Mrs. Kimhong Chhour**
* **Mr. Pov Davin**
* **Mr. Mok Chytasenasak**
* **Mr. Khorn Vannda**
* **Mr. Luy Virak**

---

## 🙏 Acknowledgements

We would like to express our sincere gratitude to our advisor, **Mr. Thear Sophal**, for his continuous guidance and valuable feedback throughout the development of **MhobFinder**.

We also thank the **Department of Computer Science** at the **Cambodia Academy of Digital Technology (CADT)** for equipping us with the necessary skills to complete this Capstone project.

```

### Sources Used:
* [cite_start]**Project Title & Type:** M’hobFinder is a web-based system designed to help users find recipes based on ingredients[cite: 14].
* [cite_start]**Objective:** Simplify cooking, reduce food waste, and help users prepare balanced meals[cite: 53].
* [cite_start]**Features:** Ingredient input, step-by-step instructions, alternative ingredients, filtering options, favorites[cite: 17, 154].
* [cite_start]**Tech Stack:** Node.js, Firebase, HTML/CSS/JavaScript, React (optional), MySQL[cite: 18, 198, 199].
* **Contributors & Advisor:** Sao Sethavathanak, Kimhong Chhour, Pov Davin, Mok Chytasenasak, Khorn Vannda, Luy Virak; [cite_start]Advisor: Mr. Thear Sophal[cite: 1].
* [cite_start]**University:** Cambodia Academy of Digital Technology (CADT)[cite: 4].

```
