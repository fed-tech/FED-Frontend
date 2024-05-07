<<<<<<< HEAD
## FED FRONTEND
=======
## FED Frontend Beta
>>>>>>> upstream/beta

### Overview

FED FRONTEND is the official website of the Federation of Entrepreneurship Development (FED), designed to showcase upcoming events, introduce team members and leads, and provide resources for developing entrepreneurial skills. This platform aims to empower individuals interested in entrepreneurship and innovation.

### Features (Currently in Development)

#### User-Focused Features:

- **User Authentication**: Users can create accounts and log in to access personalized content.
- **Events Management**: Browse and register for upcoming events, view details of past events.
- **User Profile**: Users can manage their profiles, view registered events, and update their information.
- **Responsive Design**: User-friendly interface optimized for desktop and mobile devices.

#### Administrator-Focused Features:

- **Admin Dashboard**: Administrators can view details of registered users and their event applications.
- **Team Management**: Add, update, or remove team members and their roles.
- **Event Management**: Create, edit, or remove events with detailed descriptions and schedules.
- **Analytics**: Access analytics and insights on user engagement and event participation.

### Tech Stack

- **Frontend**: ReactJS using Vite
- **Backend**: Node.js with Express
- **Database**: MongoDB
- **Authentication**: Firebase Authentication
- **Styling**: Modular SCSS for customizable and maintainable styles.

### How to Run Locally

To run FED FRONTEND locally on your machine, follow these steps:

1. **Clone Repository**:
   ```bash
<<<<<<< HEAD
   git clone https://github.com/PrityanshuSingh/Fed-Frontend.git
=======
   git clone -b beta https://github.com/PrityanshuSingh/Fed-Frontend.git
>>>>>>> upstream/beta
   ```

2. **Navigate to Project Directory**:
   ```bash
   cd Fed-Frontend
   ```

3. **Install pnpm Package Manager**:
   - If Node.js is installed on your system, run:
   ```bash 
   npm install -g pnpm
   ```
   - else, run:
   ```bash
   npm install -g @pnpm/exe
   ```

3. **Install Dependencies**:
<<<<<<< HEAD
   After successful installation of pnpm on your system, install the required node modules and dependencies for the project.
=======
   After successful installation of pnpm on your system, install the required node modules and dependencies for the project.
>>>>>>> upstream/beta
   ```bash
   pnpm i
   ```
   
4. **Set Up Firebase Credentials (Not required at this phase of development):**
   - Obtain Firebase configuration keys from the Firebase Console.
   - Create a `.env` file in the root directory and add Firebase configuration details:
     ```
     REACT_APP_FIREBASE_API_KEY=your-api-key
     REACT_APP_FIREBASE_AUTH_DOMAIN=your-auth-domain
     REACT_APP_FIREBASE_PROJECT_ID=your-project-id
     ```

5. **Start Development Server**:
   ```bash
   pnpm run dev
   ```

6. **Access Local Deployment**:
<<<<<<< HEAD
   Open your browser and navigate to `http://localhost:5174` to view the Fed-Frontend website locally.
=======
   Open your browser and navigate to `http://localhost:5174` to view the Fed-frontend website locally.
>>>>>>> upstream/beta


### Fork and Contribution

If you would like to contribute to Fed-Frontend, you can fork the repository on GitHub and create a pull request with your proposed changes. Here's how:

1. **Fork Repository**:
   Click the "Fork" button on the top-right corner of the GitHub repository page.

2. **Clone Your Fork and Set Up the Cloned Repo as Explained**:
   ```bash
   git clone https://github.com/your-username/Fed-Frontend.git
   ```

3. **Syncing Fork with Original Repository:**
   - Add an upstream remote to pull changes from the original repository.
   ```bash
   git add upstream https://github.com/PrityanshuSingh/Fed-Frontend.git
   ```

   - After syncing, Fetch upstream changes.
   ```bash
   git fetch upstream
   ```

4. **Create New Branch**:
   ```bash
   git checkout -b feature/my-new-feature
   ```
   - Merge the changes locally.
   ```bash
   git merge upstream/main
   ```

4. **Make Changes**:
   Implement your changes and commit them.

5. **Push Changes**:
   ```bash
   git push origin feature/my-new-feature
   ```

6. **Create Pull Request**:
   Go to your forked repository on GitHub and click on "New Pull Request" to submit your changes for review.

### Acknowledgements

Acknowledgements and credits go here.

### Screenshots

Include screenshots of the Fed-Frontend website in action:

1. Landing Page
2. Events Page
3. User Profile Section
4. Admin Dashboard

---

Feel free to reach out for any inquiries or assistance regarding Fed-Frontend. Happy coding and entrepreneurship!
