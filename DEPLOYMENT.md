# Deployment Guide

This guide explains how to deploy the TrickOrTreat application to various hosting platforms.

## GitHub Pages

### Option 1: Using the `public` folder

1. Go to your GitHub repository settings
2. Navigate to "Pages" section
3. Set source to your branch (e.g., `main` or `gh-pages`)
4. Set folder to `/public`
5. Click "Save"
6. Your site will be available at `https://yourusername.github.io/TrickOrTreat/`

### Option 2: Custom deployment

1. Copy all files from the `public` folder to your repository root or a `docs` folder
2. Update the GitHub Pages settings to point to your chosen location
3. Commit and push the changes

## Firebase Hosting

1. Install Firebase CLI:
   ```bash
   npm install -g firebase-tools
   ```

2. Login to Firebase:
   ```bash
   firebase login
   ```

3. Initialize Firebase (if not already done):
   ```bash
   firebase init hosting
   # Select the trickortreat-8c078 project
   # Set public directory to 'public'
   # Configure as single-page app: No
   ```

4. Deploy:
   ```bash
   firebase deploy --only hosting
   ```

5. Your app will be live at: `https://trickortreat-8c078.web.app`

## Other Static Hosting Platforms

### Netlify

1. Connect your GitHub repository to Netlify
2. Set build command: (leave empty)
3. Set publish directory: `public`
4. Deploy!

### Vercel

1. Import your GitHub repository
2. Set framework preset to "Other"
3. Set output directory: `public`
4. Deploy!

### AWS S3 + CloudFront

1. Create an S3 bucket
2. Enable static website hosting
3. Upload contents of `public` folder
4. Configure CloudFront distribution (optional, for HTTPS)
5. Update bucket policy for public read access

## Local Testing

Before deploying, test locally:

```bash
# Using Python
cd public
python3 -m http.server 8000

# Using Node.js http-server
npx http-server public -p 8000

# Using PHP
cd public
php -S localhost:8000
```

Then open `http://localhost:8000/` in your browser.

## Firebase Database Rules

The Firebase Realtime Database rules provide security for the application:

```json
{
  "rules": {
    "sessions": {
      "$sessionId": {
        ".read": true,
        ".write": "!data.exists() || (now - data.child('createdAt').val() < 3600000)",
        ".validate": "newData.hasChildren(['id', 'createdAt', 'status'])",
        ".indexOn": ["status", "createdAt"]
      }
    }
  }
}
```

**Security Features:**
- **Read access**: Public (needed for display screens to read any session)
- **Write access**: Only allowed if session doesn't exist OR is less than 1 hour old
- **Validation**: Ensures required fields are present
- **Time-based protection**: Prevents modification of old sessions

You can update rules in the Firebase Console or use:
```bash
firebase deploy --only database
```

**Important Security Notes:**
- Firebase API keys in client code are safe (they identify the project, not authenticate)
- Security is enforced through Firebase Security Rules, not API key secrecy
- Session IDs are generated using crypto.randomUUID() for unpredictability
- Sessions automatically expire after 1 hour

## Post-Deployment Checklist

- [ ] Verify display screen shows the mobile URL
- [ ] Open mobile URL on a phone and verify it connects to the active session
- [ ] Submit form and verify real-time update
- [ ] Check that UI sequence plays correctly
- [ ] Verify auto-reset functionality
- [ ] Test on multiple browsers
- [ ] Test on mobile devices (iOS and Android)

## Troubleshooting

### Display not initializing
- Check browser console for errors
- Verify Firebase SDK is loading correctly
- Ensure Firebase project is accessible

### Mobile page not connecting
- Make sure the display screen is running (creates the session)
- Check browser console for errors
- Verify Firebase database rules allow reading sessions

### Form submission not working
- Check Firebase database rules
- Verify network connectivity
- Check browser console for errors

### Real-time updates not working
- Ensure Firebase database URL is correct
- Check that both display and mobile are using the same session ID
- Verify Firebase SDK is loaded on both pages

## Support

For issues specific to hosting platforms, consult their documentation:
- [GitHub Pages Docs](https://docs.github.com/en/pages)
- [Firebase Hosting Docs](https://firebase.google.com/docs/hosting)
- [Netlify Docs](https://docs.netlify.com/)
- [Vercel Docs](https://vercel.com/docs)
