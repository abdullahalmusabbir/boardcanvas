# VisionBoard Frontend

A modern and responsive frontend application built with **Next.js**, **React**, and **TypeScript** for the TaskCanvas platform. This application provides an intuitive interface for authentication, task management, image annotation, user profiles, and dashboard functionalities by consuming REST APIs from the Django backend.

---

#  Tech Stack

- Next.js
- React
- TypeScript
- Tailwind CSS
- Axios
- Google OAuth

---

#  Features

##  Authentication

- User Registration
- User Login
- Google Sign-In
- JWT Authentication
- Protected Routes
- Persistent Login Session

---

##  Dashboard

- Personalized Dashboard
- User Overview
- Quick Navigation
- Responsive Layout

---

##  Task Management

- View Tasks
- Task Details
- Interactive Task Interface

---

##  Image Annotation

- Image Upload
- Interactive Annotation Canvas
- Polygon Drawing
- Zoom Controls
- Image Navigation
- Annotation Management

---

##  User Profile

- View Profile
- Edit Profile
- Update Avatar
- User Information

---

##  Responsive Design

- Desktop Friendly
- Tablet Support
- Mobile Responsive
- Modern UI

---

#  Project Structure

```
app/
│
├── about/
├── dashboard/
│   ├── annotate/
│   ├── profile/
│   ├── tasks/
│   └── page.tsx
│
├── features/
├── layout.tsx
├── page.tsx
│
components/
│
├── annotate/
│   ├── AnnotationCanvas.tsx
│   ├── ImageUploader.tsx
│   ├── ImageSlider.tsx
│   ├── PolygonList.tsx
│   └── ZoomControls.tsx
│
context/
│
├── AuthContext.tsx
└── DateContext.tsx
│
lib/
│
└── api.ts
│
types/
│
└── index.ts
│
public/
│
└── assets
```

---

#  Getting Started

Clone the repository

```bash
git clone <repository-url>
```

Move into the project

```bash
cd taskcanvas-frontend
```

Install packages

```bash
npm install
```

Run the development server

```bash
npm run dev
```

Open your browser

```
http://localhost:3000
```

---

#  Backend Integration

The frontend communicates with the Django REST API for:

- User Authentication
- User Profile
- Task Management
- Image Annotation
- Data Synchronization

Configure the backend API URL inside:

```
lib/api.ts
```

---

#  Public Assets

Static assets such as icons, SVGs, and images are stored inside:

```
public/
```

---

#  Pages

- Home
- About
- Features
- Dashboard
- Profile
- Tasks
- Annotation Workspace

---

#  Key Highlights

- Clean and Modern UI
- Fast Performance with Next.js
- TypeScript Support
- Responsive Design
- API Driven Architecture
- Reusable Components
- Context API State Management
- Secure Authentication
- Scalable Folder Structure

---

#  Build for Production

```bash
npm run build
```

Start the production server

```bash
npm run start
```

---

#  Developed With

- Next.js
- React
- TypeScript
- Tailwind CSS

---

#  License