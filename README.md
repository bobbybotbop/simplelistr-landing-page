# Simplelistr Landing Page

A modern, animated landing page built with **Next.js**, **React**, **Tailwind CSS**, and **Three.js** for the Simplelistr project.

## Features

- ✨ **Animated Components** - 3D animated sphere, tetrahedron, and wave animations using Three.js
- 🎨 **Modern Design** - Built with Tailwind CSS and Radix UI components
- 🌙 **Dark Mode Support** - Toggle between light and dark themes
- 📱 **Fully Responsive** - Optimized for desktop, tablet, and mobile devices
- ⚡ **High Performance** - Next.js optimization and fast load times
- 🎯 **Modular Sections** - Easy-to-extend component architecture

## Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) 16.2
- **UI Library**: [React](https://react.dev/) 19
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) 4
- **3D Graphics**: [Three.js](https://threejs.org/)
- **Components**: [Radix UI](https://www.radix-ui.com/)
- **Forms**: [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/)
- **Animations**: [Tailwind CSS Animate](https://www.tailwindcss-animate.com/)

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm, yarn, pnpm, or bun

### Installation

1. Clone the repository:
```bash
git clone https://github.com/bobbybotbop/simplelistr-landing-page.git
cd simplelistr-landing-page
```

2. Install dependencies:
```bash
npm install
# or
pnpm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to see the result.

## Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build for production
- `npm start` - Start the production server
- `npm run lint` - Run ESLint to check code quality

## Project Structure

```
├── app/
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Home page
│   └── globals.css         # Global styles
├── components/
│   ├── landing/            # Landing page sections
│   │   ├── hero-section.tsx
│   │   ├── pricing-section.tsx
│   │   ├── footer-section.tsx
│   │   ├── navigation.tsx
│   │   └── ...
│   ├── ui/                 # Reusable UI components
│   └── theme-provider.tsx
├── public/                 # Static assets
├── styles/                 # Additional stylesheets
└── tsconfig.json          # TypeScript configuration
```

## Features Roadmap

The landing page includes several pre-built sections ready to be enabled:
- ✅ Hero Section
- ✅ Pricing Section
- ✅ Footer Section
- ⏳ Features Section
- ⏳ How It Works Section
- ⏳ Infrastructure Section
- ⏳ Metrics Section
- ⏳ Integrations Section
- ⏳ Security Section
- ⏳ Testimonials Section
- ⏳ CTA Section

Uncomment sections in `app/page.tsx` to enable them.

## Customization

### Colors & Theme
Customize the theme by editing the Tailwind configuration in `tailwind.config.ts` and the CSS variables in `app/globals.css`.

### Content
Edit component files in `components/landing/` to update text, images, and content.

### Animations
Three.js animations are in:
- `components/landing/animated-sphere.tsx`
- `components/landing/animated-tetrahedron.tsx`
- `components/landing/animated-wave.tsx`

## Deployment

### Deploy to Vercel (Recommended)
The easiest way to deploy is using [Vercel](https://vercel.com/):

1. Push your code to GitHub
2. Import your repository on [Vercel](https://vercel.com/new)
3. Vercel will automatically detect Next.js and deploy with optimal settings

### Other Deployment Options
- [Netlify](https://netlify.com/)
- [AWS Amplify](https://aws.amazon.com/amplify/)
- Docker container
- Traditional Node.js hosting

## Performance Optimization

- Image optimization with Next.js Image component
- Code splitting and lazy loading
- CSS-in-JS with Tailwind CSS
- Vercel Analytics integration

## License

This project is open source and available under the MIT License.

## Support

For questions or issues, please open an issue on [GitHub Issues](https://github.com/bobbybotbop/simplelistr-landing-page/issues).
