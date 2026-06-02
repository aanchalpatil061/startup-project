# Askd Mobile — AI Answer Evaluation

Production-ready React Native + Expo mobile application for [askd.in](https://askd.in).

> "Evaluation shouldn't end with a number. It should begin a conversation."

---

## Website Analysis Summary

| Attribute | Details |
|-----------|---------|
| Product | AI-powered handwritten exam evaluation |
| Technology | Microsoft TrOCR + Gemini AI + SHA-256 Blockchain |
| Cost | ₹1.5/script (vs ₹30 manual) |
| Turnaround | < 24 hours |
| Market | 292M students across India |
| Portals | Student · Teacher · Admin |

---

## App Architecture

### Tech Stack
| Layer | Technology |
|-------|-----------|
| Framework | React Native 0.74 + Expo SDK 51 |
| Language | TypeScript (strict mode) |
| Navigation | Expo Router v3 (file-based) |
| State | Zustand |
| Server State | TanStack Query v5 |
| HTTP | Axios (with JWT refresh interceptor) |
| Storage | Expo SecureStore (encrypted) |
| Animations | React Native Reanimated v3 |
| Icons | @expo/vector-icons (Ionicons) |
| Images | expo-image |

### Folder Structure

```
askd-mobile/
├── app/                          # Expo Router screens
│   ├── _layout.tsx               # Root layout (QueryClient, SafeArea, StatusBar)
│   ├── index.tsx                 # Role selection screen
│   ├── onboarding.tsx            # 3-slide onboarding
│   ├── (auth)/                   # Auth group
│   │   ├── login/
│   │   │   ├── student.tsx       # Email OR roll number login
│   │   │   ├── teacher.tsx       # Email OR employee ID login
│   │   │   └── admin.tsx         # Email login
│   │   ├── signup/
│   │   │   ├── student.tsx       # Full student registration
│   │   │   └── teacher.tsx       # Full teacher registration
│   │   └── forgot-password.tsx
│   ├── (student)/                # Student tab navigator
│   │   ├── index.tsx             # Dashboard
│   │   ├── scripts/
│   │   │   ├── index.tsx         # All evaluated scripts
│   │   │   └── [id].tsx          # Script detail + question breakdown
│   │   ├── disputes/
│   │   │   ├── index.tsx         # All disputes
│   │   │   ├── [id].tsx          # Dispute detail
│   │   │   └── new.tsx           # File new dispute
│   │   ├── notifications.tsx
│   │   ├── profile.tsx
│   │   └── settings.tsx
│   ├── (teacher)/                # Teacher tab navigator
│   │   ├── index.tsx             # Dashboard
│   │   ├── batches/
│   │   │   ├── index.tsx         # All batches
│   │   │   └── [id].tsx          # Batch detail + analytics
│   │   ├── analytics.tsx         # Overall analytics
│   │   ├── disputes/
│   │   │   ├── index.tsx         # Student disputes
│   │   │   └── [id].tsx          # Dispute review + resolution
│   │   ├── notifications.tsx
│   │   ├── profile.tsx
│   │   └── settings.tsx
│   └── (admin)/                  # Admin tab navigator
│       ├── index.tsx             # Dashboard
│       ├── semesters.tsx         # Semester management
│       ├── courses.tsx           # Course catalog
│       ├── students/
│       │   ├── index.tsx         # Student directory + search
│       │   └── [id].tsx          # Student detail
│       ├── grades.tsx            # Grades & results
│       ├── communications.tsx    # Announcements
│       ├── profile.tsx
│       └── settings.tsx
├── src/
│   ├── api/
│   │   ├── client.ts             # Axios + JWT refresh interceptor
│   │   ├── auth.ts               # Auth endpoints
│   │   ├── student.ts            # Student endpoints
│   │   ├── teacher.ts            # Teacher endpoints
│   │   └── admin.ts              # Admin endpoints
│   ├── components/
│   │   ├── ui/                   # Design system primitives
│   │   │   ├── Button.tsx        # Animated, 5 variants, 3 sizes
│   │   │   ├── Input.tsx         # With icons, password toggle, validation
│   │   │   ├── Card.tsx          # Surface card with elevation support
│   │   │   ├── Badge.tsx         # Status/label badges
│   │   │   ├── Avatar.tsx        # Image + initials fallback
│   │   │   ├── Skeleton.tsx      # Loading skeleton with shimmer
│   │   │   └── EmptyState.tsx    # Empty list states
│   │   └── shared/
│   │       ├── Header.tsx        # Reusable screen header
│   │       ├── OfflineBanner.tsx # Network offline indicator
│   │       ├── LoadingOverlay.tsx
│   │       └── ErrorBoundary.tsx
│   ├── hooks/
│   │   ├── useAuth.ts            # Auth state hook
│   │   └── useNetwork.ts         # Network status hook
│   ├── store/
│   │   └── authStore.ts          # Zustand auth store
│   ├── types/
│   │   ├── auth.ts               # User types + auth payloads
│   │   ├── student.ts            # Script, dispute, notification types
│   │   ├── teacher.ts            # Batch, analytics types
│   │   ├── admin.ts              # Semester, course, grade types
│   │   └── api.ts                # Generic API response types
│   ├── utils/
│   │   ├── storage.ts            # SecureStore wrapper
│   │   ├── format.ts             # Date, score, color utilities
│   │   └── validation.ts         # Form validation helpers
│   └── constants/
│       ├── colors.ts             # Design system colors
│       ├── typography.ts         # Font sizes + families
│       └── config.ts             # App config + env vars
├── assets/images/                # App icons, splash screen
├── .env                          # Local env (git-ignored)
├── .env.example                  # Env template
├── app.json                      # Expo config
├── babel.config.js
├── tsconfig.json
└── package.json
```

---

## Screen Inventory (38 screens)

### Auth (6)
- Splash / Role Selection
- Onboarding (3 slides)
- Student Login + Signup
- Teacher Login + Signup
- Admin Login
- Forgot Password

### Student Portal (10)
- Dashboard (stats, recent scripts)
- Scripts List
- Script Detail (per-question breakdown, AI feedback, confidence, blockchain hash)
- File Dispute
- Dispute Detail
- Disputes List
- Notifications
- Profile
- Settings (password change, notification prefs)

### Teacher Portal (9)
- Dashboard (batch overview, pending evals)
- Batches List
- Batch Detail (scripts tab + analytics tab)
- Overall Analytics
- Disputes List
- Dispute Review (accept/reject with comment)
- Notifications
- Profile
- Settings

### Admin Portal (9)
- Dashboard (institution-wide stats)
- Semesters (CRUD)
- Courses
- Students Directory + Search
- Student Detail
- Grades & Results
- Communications / Announcements
- Profile
- Settings

---

## User Flows

```
App Launch
  └── First time → Onboarding → Role Selection
  └── Returning  → Auto-detect role → Deep link to portal

Student Flow
  Role Selection → Login/Signup → Dashboard
    → Scripts → Script Detail → File Dispute
    → Disputes → Status Tracking
    → Notifications → Profile → Settings

Teacher Flow
  Role Selection → Login/Signup → Dashboard
    → Batches → Batch Detail → Scripts / Analytics
    → Disputes → Review → Accept/Reject
    → Profile → Settings

Admin Flow
  Role Selection → Login → Dashboard
    → Semesters (create/manage)
    → Students (search, view profiles)
    → Grades (view results)
    → Communications (broadcast)
    → Profile → Settings
```

---

## Design System

### Colors
```typescript
primary:         #09090B  (near black)
background:      #FAFAFA  (off white)
surface:         #FFFFFF
border:          #E4E4E7
textSecondary:   #71717A
textMuted:       #A1A1AA
success:         #16A34A
warning:         #D97706
error:           #DC2626
info:            #2563EB
```

### Typography
- **Platform-native fonts** — System on iOS, Roboto on Android
- **Scale:** xs(11) · sm(13) · base(15) · md(16) · lg(18) · xl(20) · 2xl(24) · 3xl(28)

---

## Security Architecture
- **JWT access + refresh tokens** stored in Expo SecureStore (hardware-encrypted)
- **Auto token refresh** via Axios interceptor (transparent to UI)
- **Role-based routing** — each portal group is isolated
- **No tokens in AsyncStorage** — all secrets in SecureStore only
- **API base URL** injected via environment variable, not hardcoded

---

## Development Setup

### Prerequisites
```bash
node >= 18
npm >= 9
expo-cli >= 6
```

### Install & Run

```bash
# Clone or navigate to the project
cd askd-mobile

# Install dependencies
npm install

# Copy env
cp .env.example .env
# Edit .env with your API URL

# Start Expo Go (development)
npx expo start

# Run on Android emulator
npx expo run:android

# Run on iOS simulator (macOS only)
npx expo run:ios
```

### Environment Variables

```bash
EXPO_PUBLIC_API_URL=https://api.askd.in     # Your backend URL
EXPO_PUBLIC_APP_ENV=development              # or 'production'
```

---

## Build for Production

### Install EAS CLI
```bash
npm install -g eas-cli
eas login
```

### Configure EAS (first time)
```bash
eas build:configure
```
This creates `eas.json`. Use this recommended config:
```json
{
  "cli": { "version": ">= 12.0.0" },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "distribution": "internal",
      "android": { "buildType": "apk" }
    },
    "production": {
      "android": { "buildType": "app-bundle" },
      "ios": { "credentialsSource": "remote" }
    }
  }
}
```

---

## APK Generation (Android)

### Option 1: EAS Build (Recommended)
```bash
# Build a preview APK (internal testing)
eas build --platform android --profile preview

# Build production AAB (Play Store)
eas build --platform android --profile production
```

The APK/AAB download URL is provided after the build completes (~10–15 min).

### Option 2: Local Build
```bash
# Requires Android Studio + JDK 17
npx expo run:android --variant release
# APK output: android/app/build/outputs/apk/release/app-release.apk
```

### Option 3: Expo Go (Testing Only)
```bash
npx expo start
# Scan QR code with Expo Go app
```

---

## iOS IPA Generation

```bash
# Build IPA (requires Apple Developer account)
eas build --platform ios --profile production
```

---

## Google Play Store Deployment

### Step 1: Create Play Console Account
1. Go to [play.google.com/console](https://play.google.com/console)
2. Pay one-time $25 registration fee
3. Complete developer profile

### Step 2: Prepare Store Listing
- **App name:** Askd — AI Answer Evaluation
- **Short description:** AI evaluates handwritten exams in hours. Students see marks & feedback instantly.
- **Full description:** (see website copy)
- **Screenshots:** Capture from emulator (1080×1920 minimum)
- **Feature graphic:** 1024×500 px
- **Icon:** 512×512 px (use `assets/images/icon.png`)
- **Content rating:** Complete questionnaire (Education app)

### Step 3: Create App in Play Console
1. Click **Create app**
2. Select **App** → **Free** → **Android**
3. Accept policies

### Step 4: Upload AAB
1. Go to **Release** → **Production** → **Create new release**
2. Upload the `.aab` file from EAS Build
3. Enter release notes
4. **Save** → **Review release** → **Start rollout to Production**

### Step 5: Set Up Signing (via EAS)
```bash
# EAS manages Android keystore automatically
eas credentials --platform android
```
Keep the keystore backed up — you can never change it for an app.

---

## Backend API Contract

The app expects a REST API at `EXPO_PUBLIC_API_URL` with these endpoint groups:

| Group | Base Path | Description |
|-------|-----------|-------------|
| Auth | `/auth/*` | Login, signup, refresh, logout |
| Student | `/student/*` | Dashboard, scripts, disputes, notifications |
| Teacher | `/teacher/*` | Dashboard, batches, analytics, disputes |
| Admin | `/admin/*` | Dashboard, semesters, students, grades, comms |

### Auth Endpoints
```
POST /auth/student/login      { identifier, identifierType, password }
POST /auth/teacher/login      { identifier, identifierType, password }
POST /auth/admin/login        { email, password }
POST /auth/student/signup     { name, email, rollNumber, branch, year, section, password }
POST /auth/teacher/signup     { name, email, employeeId, department, password }
POST /auth/forgot-password    { email, role }
POST /auth/refresh            { refreshToken }
POST /auth/logout
```

### Standard Response Format
```json
{
  "success": true,
  "data": { ... },
  "message": "Optional message"
}
```

### Auth Response
```json
{
  "success": true,
  "data": {
    "user": { "id": "...", "role": "student", "name": "...", ... },
    "tokens": {
      "accessToken": "eyJ...",
      "refreshToken": "eyJ..."
    }
  }
}
```

---

## Assumptions

1. **Backend exists** at `api.askd.in` — the app is a frontend-only client. All data fetching requires a live API.
2. **JWT authentication** — access + refresh token pattern assumed based on industry standards.
3. **Image placeholders** — `assets/images/icon.png`, `splash.png`, `adaptive-icon.png` must be added before building. Use any 1024×1024 image to start.
4. **Picker dependency** — Student/Teacher signup uses `@react-native-picker/picker`. Add to package.json: `"@react-native-picker/picker": "2.7.5"`
5. **No real-time WebSockets** — all data is polled via TanStack Query with 5-minute stale time.
6. **Role isolation** — each role has completely separate navigation; there's no role-switching in the app.
7. **Blockchain verification** — shown as a UI badge when `blockchainHash` is present in the script response.
8. **Admin accounts** are pre-provisioned — no admin signup flow (matches website behavior).

---

## Adding Missing Package

Add to `package.json` dependencies:
```json
"@react-native-picker/picker": "2.7.5"
```

Then run:
```bash
npm install
```

---

## Placeholder Assets

Before running, add placeholder images:
```bash
# Use any 1024×1024 PNG for testing
# Place at:
assets/images/icon.png            (1024×1024)
assets/images/splash.png          (1242×2436)
assets/images/adaptive-icon.png   (1024×1024)
assets/images/favicon.png         (48×48)
assets/images/notification-icon.png (96×96, white on transparent)
```

---

## Contributing & Development Notes

- **API calls** are all in `src/api/` — swap real endpoints as the backend evolves
- **Colors** are in `src/constants/colors.ts` — single source of truth
- **New screens** go into the appropriate `(student)`, `(teacher)`, or `(admin)` group
- **TanStack Query keys** follow the pattern `[role, resource, id?]`
- **TypeScript strict mode** is enabled — no `any` in production code

---

## Team

Built for **Askd** — founded by IIITDM Kurnool:
- Peddu Sreekanth Reddy (Founder)
- M V S Karthikeya (Co-Founder)
- Aanchal Patil (Co-Founder)
- Darshini D (Co-Founder)

---

*Askd Mobile v1.0.0 · Made with React Native + Expo*
