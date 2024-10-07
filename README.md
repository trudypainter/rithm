wow this was ai generated...

```
  _   _      _ _
 | | | | ___| | | ___
 | |_| |/ _ \ | |/ _ \
 |  _  |  __/ | | (_) |
 |_| |_|\___|_|_|\___/

 ♥•*¨`*•♫.•´*.¸.•´♥
 ℙ𝕣𝕚𝕟𝕔𝕖𝕤𝕤
   ♡❀◕‿◕❀♡

    _____ _
   |_   _(_)_ __   __ _
     | | | | '_ \ / _` |
     | | | | | | | (_| |
     |_| |_|_| |_|\__,_|

 ♔♕♚♛✿❀❁❃❋❀✿❀❁❃❋❀✿
```

## Get Started

Install dev dependencies

`npm install`

## Get Firebase Configuration

1. Create a Firebase project:

   - Go to the [Firebase Console](https://console.firebase.google.com/)
   - Click on "Add project" and follow the setup wizard

2. Get your Firebase configuration:

   - In your Firebase project console, click on the gear icon next to "Project Overview" and select "Project settings"
   - Scroll down to the "Your apps" section and select the web app
   - Under the "SDK setup and configuration" section, you'll find your Firebase configuration object

3. Set up environment variables:

   - In the root of your project, create a file named `.env` if it doesn't already exist
   - Add your Firebase configuration to the `.env` file as follows:

   ```
   FIREBASE_API_KEY=your_api_key
   FIREBASE_AUTH_DOMAIN=your_auth_domain
   FIREBASE_PROJECT_ID=your_project_id
   FIREBASE_STORAGE_BUCKET=your_storage_bucket
   FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
   FIREBASE_APP_ID=your_app_id
   FIREBASE_MEASUREMENT_ID=your_measurement_id
   ```

   Replace `your_api_key`, `your_auth_domain`, etc., with the actual values from your Firebase configuration.

4. Ensure `.env` is in your `.gitignore` file to keep your Firebase credentials secure.

5. Use the environment variables in your `firebaseConfig.js` file as shown in the provided code snippet.

Now your Firebase configuration is set up securely using environment variables.

## Then for running the app

Run The app

`npm start`

Runs your app in development mode.

Open it in the [Expo app](https://expo.io) on your phone to view it. It will reload if you save edits to your files, and you will see build errors and logs in the terminal.

`npm run ios`

Like `npm start` / `yarn start`, but also attempts to open your app in the iOS Simulator if you're on a Mac and have it installed.

## Firebase Access

To access the Firebase services for this project, follow these steps:

1. Go to the [Firebase Console](https://console.firebase.google.com/)
2. Select the project "rithm-dating-3"

### Authentication

To access user authentication data and settings:

- In the left sidebar, click on "Authentication"
- Select the "Users" tab to view and manage user accounts

### Firestore Database

To manage and view the Firestore database:

- In the left sidebar, click on "Firestore Database"
- You can now browse and manage your database collections and documents

Note: You need appropriate permissions to access these Firebase services. If you encounter any issues, please contact the project administrator.

## Video Tutorial

For a detailed walkthrough of this project, you can watch the following video tutorial:

[React Native Dating App Tutorial](https://www.youtube.com/watch?v=wncM96HYcxw)

## Additional Resources

For more information on the technologies used in this project, refer to their official documentation:

- [React Native Documentation](https://reactnative.dev/docs/getting-started)
- [Expo Documentation](https://docs.expo.dev/)
- [Firebase Documentation](https://firebase.google.com/docs)

## Animations

This project uses [Lottie](https://airbnb.io/lottie/) for high-quality, performant animations.

- Add JSON animation files to `assets/animations/`
- Use `LottieView` component in your React Native code

For more details, see [Lottie React Native](https://github.com/lottie-react-native/lottie-react-native).

## Environment Setup

To run this project, you need to set up your Firebase configuration. Follow these steps:

1. Copy the `.env.example` file and rename it to `.env`
2. Replace the placeholder values in the `.env` file with your actual Firebase configuration

```

```
