# 🚀 AppHub - Modern App Marketplace

A beautiful, modern web application for discovering, browsing, and downloading applications. Built with Next.js 16, TypeScript, and Tailwind CSS.

![Next.js](https://img.shields.io/badge/Next.js-16.1.6-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.7.3-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.2.0-38bdf8)
![Firebase](https://img.shields.io/badge/Firebase-Integrated-orange)

## ✨ Features

### 🎨 Modern UI/UX
- **Gradient Design**: Beautiful purple/blue gradient theme
- **Dark/Light Mode**: Seamless theme switching
- **Responsive**: Perfect on all devices
- **Smooth Animations**: Buttery smooth transitions

### 📱 App Management
- **Browse Apps**: Grid layout with search and filters
- **App Details**: Detailed app pages with screenshots
- **Ratings & Reviews**: User ratings and reviews system
- **Download Tracking**: Track app downloads

### 🔐 Admin Panel
- **Secure Access**: Hidden admin panel with authentication
- **App CRUD**: Create, Read, Update, Delete apps
- **Image Upload**: Cloudinary integration for icons and screenshots
- **Firebase Sync**: Automatic data sync to Firebase

### 🖼️ Media Management
- **App Icons**: Upload and display app logos
- **Screenshots**: Mobile-style screenshot gallery
- **Cloudinary CDN**: Fast image delivery
- **Fallback Support**: Works with or without Cloudinary

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **Database**: Firebase Firestore
- **Image CDN**: Cloudinary
- **UI Components**: Radix UI
- **Icons**: Lucide React

## 📦 Installation

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Steps

1. **Clone the repository**
```bash
git clone https://github.com/DevStudio2k25/Aniplixofficial.git
cd Aniplixofficial
```

2. **Install dependencies**
```bash
npm install
```

3. **Create environment file**
```bash
cp .env.example .env.local
```

4. **Configure environment variables**
Edit `.env.local`:
```env
# Cloudinary (Optional - for image uploads)
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloud-name
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=apps4all

# Admin Password
ADMIN_PASSWORD=your-secure-password
```

5. **Run development server**
```bash
npm run dev
```

6. **Open in browser**
```
http://localhost:3000
```

## 🔧 Configuration

### Cloudinary Setup (Optional)
1. Create account at [cloudinary.com](https://cloudinary.com)
2. Get your Cloud Name from dashboard
3. Create unsigned upload preset named `apps4all`
4. Add credentials to `.env.local`

### Firebase Setup (Optional)
1. Create project at [firebase.google.com](https://firebase.google.com)
2. Enable Firestore Database
3. Update `lib/firebase.ts` with your config

## 📁 Project Structure

```
├── app/                          # Next.js app directory
│   ├── api/                      # API routes
│   ├── apps/                     # Apps listing & detail pages
│   ├── secret-admin-panel-2026/  # Hidden admin panel
│   └── page.tsx                  # Homepage
├── components/                   # React components
│   ├── ui/                       # UI components (Radix)
│   ├── app-card.tsx             # App card component
│   ├── header.tsx               # Navigation header
│   └── screenshot-gallery.tsx   # Screenshot viewer
├── lib/                         # Utilities
│   ├── db.ts                    # Database operations (Firebase)
│   ├── firebase.ts              # Firebase config
│   └── firestore.ts             # Firestore operations
├── public/                      # Static assets
└── scripts/                     # Database scripts
```

## 🎯 Usage

### For Users
1. **Browse Apps**: Visit homepage or `/apps`
2. **Search**: Use search bar to find apps
3. **Filter**: Filter by category
4. **View Details**: Click on any app card
5. **Download**: Click download button on app page
6. **Rate**: Leave ratings and reviews

### For Admins
1. **Access Admin Panel**: Navigate to secret URL
2. **Login**: Enter admin password
3. **Manage Apps**: Add, edit, or delete apps
4. **Upload Media**: Add app icons and screenshots
5. **Feature Apps**: Mark apps as featured

## 🔐 Security

- ✅ Admin panel hidden from navigation
- ✅ Server-side password validation
- ✅ Environment variables for secrets
- ✅ Session-based authentication
- ✅ No sensitive data in client code

## 🚀 Deployment

### Vercel (Recommended)
```bash
npm install -g vercel
vercel
```

### Other Platforms
- Build: `npm run build`
- Start: `npm start`

**Important**: Set environment variables in your hosting platform!

## 📝 Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm start        # Start production server
npm run lint     # Run ESLint
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 👨‍💻 Author

**DevStudio2k25**
- GitHub: [@DevStudio2k25](https://github.com/DevStudio2k25)

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- Radix UI for accessible components
- Cloudinary for image CDN
- Firebase for backend services

---

**Made with ❤️ using Next.js**
