# PawNest - Pet Care Platform Frontend

<div align="center">
  <img src="public/vite.svg" alt="PawNest Logo" width="120" height="120">
  
  <h3>🐾 Your Pet's Home Away From Home</h3>
  
  <p>A modern web application connecting pet owners with trusted caregivers</p>

![React](https://img.shields.io/badge/React-18.x-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)
![Vite](https://img.shields.io/badge/Vite-5.x-yellow)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.x-blue)
![License](https://img.shields.io/badge/License-MIT-green)

</div>

## 📖 About PawNest

PawNest is a comprehensive pet care platform that connects pet owners with verified, trustworthy caregivers in their local area. Whether you need pet sitting, dog walking, boarding, or daycare services, PawNest makes it easy to find the perfect caregiver for your furry family members.

### 🌟 Key Features

- **🔍 Find Verified Caregivers**: Browse through background-checked, verified pet caregivers
- **📱 Real-time Updates**: Get photos, videos, and updates about your pet during their stay
- **💰 Transparent Pricing**: Clear, upfront pricing with secure payment processing
- **⭐ Reviews & Ratings**: Read genuine reviews from other pet owners
- **📅 Easy Booking**: Simple, intuitive booking system with calendar integration
- **💬 In-app Messaging**: Direct communication with caregivers
- **🛡️ Insurance Coverage**: All bookings covered by comprehensive insurance

## 🚀 Tech Stack

- **Frontend Framework**: React 18 with TypeScript
- **Build Tool**: Vite 5.x for fast development and building
- **Styling**: Tailwind CSS 3.x for utility-first styling
- **State Management**: React Context + Custom Hooks
- **HTTP Client**: Native Fetch API with custom wrapper
- **Icons**: Emoji-based icons (can be replaced with icon libraries)
- **Linting**: ESLint with TypeScript rules
- **Development**: Hot Module Replacement (HMR) with Vite

## 📁 Project Structure

```
src/
├── assets/                 # Static assets
│   └── styles/
│       └── globals.css     # Global styles and Tailwind configuration
├── components/             # Reusable UI components
│   ├── common/            # Common components (Header, Footer, etc.)
│   └── ui/                # Base UI components (Button, Input, etc.)
├── contexts/              # React Context providers
├── hooks/                 # Custom React hooks
├── pages/                 # Page components
├── services/              # API services and HTTP client
│   ├── apiClient.ts       # HTTP client configuration
│   ├── authService.ts     # Authentication services
│   └── petService.ts      # Pet management services
├── types/                 # TypeScript type definitions
│   └── index.ts           # Core application types
├── utils/                 # Utility functions and helpers
├── App.tsx               # Main application component
└── main.tsx              # Application entry point
```

## 🛠️ Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm, yarn, or pnpm package manager

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/tylum123/PawNest_FE.git
   cd PawNest_FE
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Set up environment variables**

   ```bash
   cp .env.example .env.local
   ```

   Update the `.env.local` file with your configuration:

   ```env
   VITE_API_BASE_URL=http://localhost:3000/api
   VITE_APP_NAME=PawNest
   ```

4. **Start the development server**

   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173` to see the application.

## 📜 Available Scripts

- **`npm run dev`** - Start development server with HMR
- **`npm run build`** - Build for production
- **`npm run preview`** - Preview production build locally
- **`npm run lint`** - Run ESLint for code quality checks
- **`npm run lint:fix`** - Fix linting issues automatically
- **`npm run type-check`** - Run TypeScript type checking

## 🎨 Styling Guide

PawNest uses Tailwind CSS with a custom design system:

### Color Palette

- **Primary**: Warm orange tones (`#f59e0b`) - Friendly and approachable
- **Secondary**: Calming blues (`#3b82f6`) - Trust and reliability
- **Success**: Green (`#22c55e`) - Positive actions
- **Warning**: Amber (`#f59e0b`) - Caution
- **Error**: Red (`#ef4444`) - Alerts and errors

### Component Classes

The project includes pre-built component classes:

- `.btn`, `.btn-primary`, `.btn-secondary` - Button variants
- `.card`, `.card-header`, `.card-body` - Card components
- `.badge`, `.badge-primary` - Status badges
- `.input`, `.input-error` - Form inputs

## 🔧 Development Guidelines

### Code Style

- Use TypeScript for all new files
- Follow React functional component patterns
- Use custom hooks for reusable logic
- Implement proper error handling
- Write descriptive commit messages

### Component Structure

```tsx
// Import statements
import { useState } from "react";
import type { ComponentProps } from "../types";

// Component interface
interface MyComponentProps {
  title: string;
  onAction?: () => void;
}

// Component implementation
export default function MyComponent({ title, onAction }: MyComponentProps) {
  const [state, setState] = useState("");

  return <div className="component-wrapper">{/* Component JSX */}</div>;
}
```

### API Integration

- Use the provided `apiClient` for all HTTP requests
- Implement proper error handling and loading states
- Use TypeScript interfaces for API responses
- Store sensitive data securely

## 🚀 Deployment

### Building for Production

1. **Build the application**

   ```bash
   npm run build
   ```

2. **Test the production build**
   ```bash
   npm run preview
   ```

### Deployment Options

- **Vercel**: Connect your GitHub repository for automatic deployments
- **Netlify**: Drag and drop the `dist` folder or connect via Git
- **Firebase Hosting**: Use Firebase CLI for deployment
- **Static Hosting**: Upload the `dist` folder to any static hosting service

## 🤝 Contributing

We welcome contributions to PawNest! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Process

- Ensure your code follows the established patterns
- Add appropriate TypeScript types
- Test your changes thoroughly
- Update documentation if needed

## 📄 API Documentation

The frontend communicates with the PawNest backend API. Key endpoints include:

- **Authentication**: `/auth/login`, `/auth/register`, `/auth/logout`
- **User Management**: `/users/profile`, `/users/settings`
- **Pet Management**: `/pets`, `/pets/:id`
- **Caregiver Services**: `/caregivers`, `/caregivers/search`
- **Bookings**: `/bookings`, `/bookings/:id`
- **Reviews**: `/reviews`, `/reviews/:id`

## 🛡️ Security

- All API communications use HTTPS
- JWT tokens for authentication
- Input validation and sanitization
- Secure file upload handling
- XSS and CSRF protection

## 📞 Support

- **Documentation**: Check this README and inline code comments
- **Issues**: Create an issue on GitHub for bug reports
- **Discussions**: Use GitHub Discussions for questions and ideas
- **Email**: contact@pawnest.com (for urgent matters)

## 📊 Performance

- **Lighthouse Score**: 95+ for Performance, Accessibility, Best Practices, SEO
- **Bundle Size**: Optimized with Vite's tree-shaking and code splitting
- **Loading**: Lazy loading for images and components
- **Caching**: Proper cache headers for static assets

## 🔮 Roadmap

- [ ] Mobile app development (React Native)
- [ ] Real-time chat and notifications
- [ ] Advanced search filters
- [ ] Caregiver availability calendar
- [ ] Multi-language support
- [ ] Payment integration
- [ ] GPS tracking for dog walks
- [ ] Video calling features

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- React team for the amazing framework
- Tailwind CSS for the utility-first approach
- Vite for the lightning-fast development experience
- TypeScript for type safety
- Open source community for inspiration and tools

---

<div align="center">
  <p>Made with ❤️ for pet lovers everywhere</p>
  <p>🐕 🐱 🐰 🐦</p>
</div>
