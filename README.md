# X Pro Library

A premium, fast, and responsive resource library built with Vanilla JS, TailwindCSS, Firebase, and ImageKit. Features a public catalog with advanced filtering and a secure admin dashboard.

## 🚀 Features

- **Public Interface**: Browse resources, filter by Type (Alpha/Tool), Score, and Category. Light/Dark mode.
- **Admin Dashboard**: Secure CRUD for posts, ImageKit integration for uploads, and global site settings editor.
- **Tech Stack**:
  - Frontend: Single HTML file (Vanilla JS + Tailwind CDN).
  - Backend: Firebase (Auth & Firestore).
  - Images: ImageKit (Client-side upload with Vercel Serverless Auth).

## 🛠 Setup & Deployment

### 1. Firebase Setup
1. Go to [Firebase Console](https://console.firebase.google.com/) and create a new project.
2. **Authentication**: Enable "Email/Password" sign-in provider.
3. **Firestore Database**: Create database (start in Test mode, we will add rules later).
4. **App Config**: Register a web app and copy the `firebaseConfig` object.
5. Paste the config into `index.html` where indicated.

### 2. Firestore Security Rules
Go to Firestore -> Rules and paste this to secure the app:

```text
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Helper: Check if user is the admin defined in settings
    function isAdmin() {
      return request.auth != null && 
             request.auth.token.email == get(/databases/$(database)/documents/settings/app).data.allowedAdminEmail;
    }

    // Settings: Only Admin can write, everyone can read (to see site title etc)
    match /settings/app {
      allow read: if true;
      allow write: if isAdmin(); // Only existing admin can change settings
      // NOTE: For first setup, manually create this doc in Firebase Console 
      // or temporarily allow write: if request.auth != null;
    }

    // Posts: Public read (if published), Admin write
    match /posts/{postId} {
      allow read: if resource.data.published == true || isAdmin();
      allow write: if isAdmin();
    }
  }
}