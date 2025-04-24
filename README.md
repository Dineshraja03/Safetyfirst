# Online Safety Platform

## Overview
The Online Safety Platform is a web application designed to provide a safe space for children and women. It offers features such as emergency assistance, counseling, legal rights awareness, and gamified activities to promote safety and well-being.

## Features
- **User Authentication**: Secure login and registration using Firebase Authentication.
- **Landing Page**: A welcoming page with options for emergency assistance and user login.
- **Home Page**: A central hub for users after logging in, featuring a navigation bar, hero section, and quick navigation options.
- **Quick Navigation**: Easy access to resources like counseling, gamified activities, legal rights awareness, and community therapy sessions.
- **Responsive Design**: The application is designed to be user-friendly and accessible on various devices.

## Project Structure
```
online-safety-platform
├── public
│   ├── index.html
│   └── favicon.ico
├── src
│   ├── components
│   │   ├── Auth
│   │   │   ├── Login.js
│   │   │   └── Register.js
│   │   ├── Home
│   │   │   ├── HeroSection.js
│   │   │   ├── Navbar.js
│   │   │   └── QuickNavigation.js
│   │   └── Footer.js
│   ├── pages
│   │   ├── LandingPage.js
│   │   ├── LoginPage.js
│   │   └── HomePage.js
│   ├── routes
│   │   └── ProtectedRoute.js
│   ├── firebase
│   │   └── config.js
│   ├── App.js
│   ├── index.js
│   └── styles
│       └── global.css
├── package.json
├── .gitignore
└── README.md
```

## Getting Started

### Prerequisites
- Node.js and npm installed on your machine.
- A Firebase project set up for authentication.

### Installation
1. Clone the repository:
   ```
   git clone <repository-url>
   ```
2. Navigate to the project directory:
   ```
   cd online-safety-platform
   ```
3. Install the dependencies:
   ```
   npm install
   ```

### Configuration
1. Set up Firebase Authentication in `src/firebase/config.js` with your Firebase project credentials.

### Running the Application
To start the development server, run:
```
npm start
```
The application will be available at `http://localhost:3000`.

## Usage
- Visit the landing page to access the "Emergency" and "Login" buttons.
- Use the login page to authenticate or register a new account.
- After logging in, navigate through the home page and explore the available resources.

## Contributing
Contributions are welcome! Please open an issue or submit a pull request for any enhancements or bug fixes.

## License
This project is licensed under the MIT License.