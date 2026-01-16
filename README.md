Here is the full, professional `README.md` file for **MhobFinder**, incorporating all the details from your report and the specific terminal setup instructions you requested.

You can copy the code block below directly into your project's `README.md` file.

---

```markdown
# 🍲 MhobFinder

**Capstone Project 1 | Institute of Digital Technology** *A Smart Ingredient-Based Recipe Discovery Platform*

[cite_start]**MhobFinder** is a web-based system designed to help users discover recipes based on the ingredients they already have at home[cite: 14]. [cite_start]By solving the common problem of "what to cook," this platform aims to simplify meal planning, encourage healthier cooking habits, and reduce food waste[cite: 16, 20].

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
[cite_start]Home cooking often faces challenges such as difficulty deciding what to cook and wasting food due to unused ingredients[cite: 70, 71, 72]. [cite_start]**MhobFinder** addresses this by allowing users to input available ingredients and immediately receiving recipe suggestions complete with cooking instructions[cite: 17].

[cite_start]The project was developed over a 12-week period using the **Waterfall methodology**, moving from requirement analysis to a fully functional prototype[cite: 19, 86].

---

## ✨ Key Features

### User Functionalities
* [cite_start]**Ingredient-Based Search:** Users can input ingredients (e.g., "egg", "tomato") to generate meal ideas[cite: 51].
* [cite_start]**Recipe Suggestions:** Provides a list of relevant dishes based on ingredient compatibility[cite: 17].
* [cite_start]**Detailed Instructions:** Includes step-by-step cooking guides with optional images[cite: 57].
* [cite_start]**Smart Filtering:** Filter recipes by cuisine type, dietary preferences, and cooking time[cite: 60].
* [cite_start]**Favorites System:** Logged-in users can save recipes for future reference[cite: 41].
* [cite_start]**Alternative Ingredients:** Suggests substitutes when specific items are missing[cite: 59].

### Admin Functionalities
* [cite_start]**Recipe Management:** Add, edit, and delete recipe data[cite: 140].
* [cite_start]**Ingredient & Category Management:** Organize ingredients and categories for accurate searching[cite: 144, 147].
* [cite_start]**User Monitoring:** View user activities and system usage statistics[cite: 149].

---

## 🛠 Tech Stack

[cite_start]**MhobFinder** is built using modern web technologies to ensure a responsive and efficient user experience[cite: 18].

| Component | Technology | Description |
| :--- | :--- | :--- |
| **Frontend** | React.js / JavaScript | [cite_start]Used for dynamic UI components and interactivity[cite: 184, 189]. |
| **Backend** | Node.js / Express | [cite_start]Handles server-side logic and API requests[cite: 194]. |
| **Database** | MySQL | [cite_start]Relational database for storing recipes and user data[cite: 198]. |
| **Auth/Hosting** | Firebase | [cite_start]Provides user authentication and backend services[cite: 18]. |
| **Design** | Figma | [cite_start]Used for wireframing and UI/UX prototyping[cite: 211]. |

---

## 💻 Getting Started

To run this project locally, you will need to set up the **Backend** and **Frontend** servers in two separate terminal windows.

### Prerequisites
* Node.js installed
* MySQL installed and running

### Installation & Run Guide

#### 1. Clone the Repository
```bash
git clone [https://github.com/your-username/MhobFinder.git](https://github.com/your-username/MhobFinder.git)
cd MhobFinder

```

#### 2. Terminal 1: Setup Backend

Open your **first terminal** to start the backend server.

```bash
# Navigate to the backend directory
cd backend

# Install dependencies
npm install

# Start the Backend Server
npm run dev

```

#### 3. Terminal 2: Setup Frontend

Open a **second terminal** to start the client application.

```bash
# Navigate to the frontend directory
cd frontend

# Install dependencies
npm install

# Start the React Application
npm run dev

```

*Once both terminals are running, the application should be accessible via your browser (typically at `http://localhost:3000` or `http://localhost:5173`).*

---

## 🏗 System Architecture

The system follows a **Physical and Logical Architecture** where users access the application via web browsers. The frontend communicates with the Node.js/Firebase backend, which processes requests and retrieves data from the MySQL database.

---

## 👥 Team

This Capstone Project was submitted by:

* Mr. Sao Sethavathanak 


* Mrs. Kimhong Chhour 


* Mr. Pov Davin 


* Mr. Mok Chytasenasak 


* Mr. Khorn Vannda 


* Mr. Luy Virak 



---

## 🙏 Acknowledgements

We would like to express our sincere gratitude to our advisor, Mr. Thear Sophal, for his continuous guidance and encouragement. We also thank the **Department of Computer Science** at the **Cambodia Academy of Digital Technology (CADT)** for their support.

```

```
