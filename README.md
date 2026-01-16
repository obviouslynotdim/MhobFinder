````markdown
# 🍲 MhobFinder

**Capstone Project 1 | Institute of Digital Technology**  
*A Smart Ingredient-Based Recipe Discovery Platform*

**MhobFinder** is a web-based system designed to help users discover recipes based on the ingredients they already have at home. By solving the common problem of *“what to cook”*, this platform simplifies meal planning, encourages healthier cooking habits, and helps reduce food waste.

---

## 📖 Table of Contents
- [About the Project](#-about-the-project)
- [Key Features](#-key-features)
- [Tech Stack](#-tech-stack)
- [System Architecture](#-system-architecture)
- [Getting Started](#-getting-started)
- [Team](#-team)
- [Acknowledgements](#-acknowledgements)

---

## 🧐 About the Project

Home cooking often faces challenges such as difficulty deciding what to cook and wasting food due to unused ingredients. **MhobFinder** addresses this problem by allowing users to input available ingredients and instantly receive suitable recipe suggestions complete with cooking instructions.

The project was developed over a **12-week period** using the **Waterfall methodology**, progressing from requirement analysis to system design, implementation, testing, and a fully functional prototype.

---

## ✨ Key Features

### User Functionalities
- **Ingredient-Based Search:** Users can input ingredients (e.g., egg, tomato) to generate meal ideas.
- **Recipe Suggestions:** Displays relevant dishes based on ingredient compatibility.
- **Detailed Instructions:** Step-by-step cooking guides with optional images.
- **Smart Filtering:** Filter recipes by cuisine type, dietary preferences, and cooking time.
- **Favorites System:** Logged-in users can save favorite recipes for later use.
- **Alternative Ingredients:** Suggests substitutes when certain ingredients are unavailable.

### Admin Functionalities
- **Recipe Management:** Add, edit, and delete recipes.
- **Ingredient & Category Management:** Maintain accurate ingredient and category data.
- **User Monitoring:** View user activity and system usage statistics.

---

## 🛠 Tech Stack

**MhobFinder** is built using modern web technologies to ensure performance, scalability, and a responsive user experience.

| Component | Technology | Description |
|---------|-----------|-------------|
| **Frontend** | React.js / JavaScript | Dynamic user interface and client-side logic |
| **Backend** | Node.js / Express | Server-side logic and RESTful APIs |
| **Database** | MySQL | Stores recipes, ingredients, and user data |
| **Authentication** | Firebase | User authentication and backend services |
| **Design** | Figma | UI/UX wireframing and prototyping |

---

## 💻 Getting Started

To run this project locally, you need to start the **Backend** and **Frontend** in **two separate terminal windows**.

### Prerequisites
- Node.js (LTS recommended)
- MySQL (installed and running)
- Git

---

### 🚀 Installation & Run Guide

#### 1. Clone the Repository
```bash
git clone https://github.com/your-username/MhobFinder.git
cd MhobFinder
````

---

#### 2. Terminal 1: Setup Backend

Open your **first terminal window** and run:

```bash
cd backend
npm install
npm run dev
```

---

#### 3. Terminal 2: Setup Frontend

Open a **second terminal window** and run:

```bash
cd frontend
npm install
npm run dev
```

Once both terminals are running, open your browser and visit:

* `http://localhost:3000`
  or
* `http://localhost:5173`

(depending on your frontend configuration)

---

## 🏗 System Architecture

The system follows a **logical and physical architecture** model:

* Users interact with the application via a web browser
* The **React frontend** communicates with the **Node.js / Express backend**
* The backend processes requests, handles authentication via **Firebase**, and retrieves data from the **MySQL database**

---

## 👥 Team

This Capstone Project was developed and submitted by:

* Mr. Sao Sethavathanak
* Mrs. Kimhong Chhour
* Mr. Pov Davin
* Mr. Mok Chytasenasak
* Mr. Khorn Vannda
* Mr. Luy Virak

---

## 🙏 Acknowledgements

We would like to express our sincere gratitude to our advisor, **Mr. Thear Sophal**, for his continuous guidance and encouragement.
Special thanks to the **Department of Computer Science** at the **Cambodia Academy of Digital Technology (CADT)** for their support throughout this project.

```

---

```
