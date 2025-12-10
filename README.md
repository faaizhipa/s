# TrickOrTreat

A phone-web interaction system that enables real-time communication between a display screen and mobile devices using Firebase Realtime Database. Designed to work with GitHub Pages and other static hosting platforms.

## Features

- **Direct URL Access**: Display screen shows a URL for users to access on their phones
- **Mobile Form Interface**: Users open the URL to access a mobile-optimized form
- **Real-time Updates**: Firebase Realtime Database ensures instant synchronization
- **UI Sequence**: Display screen shows animated sequence when form is submitted
- **Auto-reset**: System automatically resets to normal display after interaction completes
- **Static Hosting Compatible**: No server required - works on GitHub Pages

## How It Works

1. **Display Screen** shows the URL: `https://faaizhipa.github.io/TrickOrTreat/public/mobile.html`
2. **User opens** the URL on their phone
3. **Mobile form** opens with input fields (auto-connects to the active session)
4. **User submits** the form (saved to Firebase)
5. **Display screen** detects the update and triggers a sequence of UI changes:
   - Step 1: Processing submission (2 seconds)
   - Step 2: Displaying personalized information (3 seconds)
   - Step 3: Completion message (3 seconds)
6. **System resets** to normal display

## Installation

No installation required! This is a static web application that can be hosted on GitHub Pages or any static hosting service.

## Usage

### Local Development

Simply open `public/index.html` in a web browser or use a local server:

```bash
# Using Python
python -m http.server 8000

# Using Node.js http-server (install with: npm install -g http-server)
http-server public -p 8000
```

Then navigate to `http://localhost:8000/`

### GitHub Pages Deployment

1. Push the `public` folder contents to your GitHub Pages repository
2. Enable GitHub Pages in repository settings
3. Access your site at `https://yourusername.github.io/yourrepo/`

## Architecture

- **Frontend Only**: Pure client-side JavaScript, HTML5, and CSS3
- **Real-time Database**: Firebase Realtime Database for session management
- **Session Management**: Firebase with automatic cleanup
- **No Backend Required**: Fully static, works on GitHub Pages

## Firebase Configuration

The app uses the following Firebase project:
- Database URL: `https://trickortreat-8c078-default-rtdb.firebaseio.com`

## Technologies Used

- Firebase Realtime Database
- Vanilla JavaScript (ES6+)
- HTML5 & CSS3

## File Structure

```
public/
├── index.html          # Display screen page
├── mobile.html         # Mobile form page
├── css/
│   ├── display.css     # Display screen styles
│   └── mobile.css      # Mobile form styles
└── js/
    ├── firebase-config.js  # Firebase initialization
    ├── display.js          # Display screen logic
    └── mobile.js           # Mobile form logic
```

## License

MIT
