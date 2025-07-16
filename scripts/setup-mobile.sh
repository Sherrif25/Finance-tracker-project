#!/bin/bash

echo "Setting up mobile app development environment..."

# Install Capacitor CLI globally
npm install -g @capacitor/cli

# Install dependencies
npm install

# Initialize Capacitor
npx cap init

# Add mobile platforms
npx cap add android
npx cap add ios

# Build the web app
npm run build
npm run export

# Sync with mobile platforms
npx cap sync

echo "Mobile setup complete!"
echo ""
echo "Next steps:"
echo "1. For Android: npm run android"
echo "2. For iOS: npm run ios"
echo "3. Make sure you have Android Studio (for Android) or Xcode (for iOS) installed"
