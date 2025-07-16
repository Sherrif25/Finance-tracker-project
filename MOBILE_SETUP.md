# Mobile App Setup Guide

## Prerequisites

### For Android Development:
- **Android Studio** (latest version)
- **Java Development Kit (JDK) 11 or higher**
- **Android SDK** (API level 22 or higher)

### For iOS Development (macOS only):
- **Xcode** (latest version)
- **iOS Simulator** or physical iOS device
- **Apple Developer Account** (for device testing and App Store)

## Setup Steps

### 1. Install Dependencies
\`\`\`bash
npm install
\`\`\`

### 2. Build Web App
\`\`\`bash
npm run build
npm run export
\`\`\`

### 3. Initialize Capacitor
\`\`\`bash
npx cap init
\`\`\`

### 4. Add Mobile Platforms
\`\`\`bash
# Add Android
npx cap add android

# Add iOS (macOS only)
npx cap add ios
\`\`\`

### 5. Sync Code with Mobile Platforms
\`\`\`bash
npx cap sync
\`\`\`

### 6. Open in Native IDEs

#### For Android:
\`\`\`bash
npm run android
# or
npx cap open android
\`\`\`

#### For iOS:
\`\`\`bash
npm run ios
# or
npx cap open ios
\`\`\`

## Development Workflow

### 1. Make Changes to Web Code
Edit your React/Next.js components as usual.

### 2. Build and Sync
\`\`\`bash
npm run build:mobile
\`\`\`

### 3. Test on Device/Simulator
- **Android**: Use Android Studio's emulator or connected device
- **iOS**: Use Xcode's simulator or connected device

## Mobile-Specific Features

### SMS Access (Android)
Add to `android/app/src/main/AndroidManifest.xml`:
\`\`\`xml
<uses-permission android:name="android.permission.READ_SMS" />
<uses-permission android:name="android.permission.RECEIVE_SMS" />
\`\`\`

### Camera Access
\`\`\`xml
<uses-permission android:name="android.permission.CAMERA" />
\`\`\`

### Network State
\`\`\`xml
<uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
\`\`\`

## Building for Production

### Android APK:
1. Open Android Studio
2. Build → Generate Signed Bundle/APK
3. Follow the signing process

### iOS App Store:
1. Open Xcode
2. Product → Archive
3. Upload to App Store Connect

## Testing

### Device Testing:
- **Android**: Enable Developer Options and USB Debugging
- **iOS**: Add device to Apple Developer Account

### Performance:
- Test on actual devices (not just simulators)
- Monitor memory usage and battery consumption
- Test offline functionality

## Troubleshooting

### Common Issues:

1. **Build Failures**: Ensure all dependencies are installed
2. **Permission Errors**: Check AndroidManifest.xml and Info.plist
3. **Network Issues**: Test both online and offline scenarios
4. **Platform-specific Bugs**: Use platform detection in code

### Debugging:
- **Android**: Use Chrome DevTools with `chrome://inspect`
- **iOS**: Use Safari Web Inspector
- **Console Logs**: Check native IDE consoles for errors
