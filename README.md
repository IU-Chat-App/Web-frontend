# IU Chat Landing Page

A modern, responsive landing page for the IU Chat mobile application, built with React and TypeScript.

## Features

- 🎨 Modern, clean UI design similar to WhatsApp
- 📱 Fully responsive (desktop, tablet, mobile)
- ⚡ Fast and optimized performance
- 🎭 Smooth scrolling animations
- 🎯 SEO-friendly structure
- ♿ Accessible components

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser and navigate to `http://localhost:5173`

### Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

### Preview Production Build

```bash
npm run preview
```

## Project Structure

```
src/
├── components/
│   ├── Navbar.tsx          # Navigation bar component
│   ├── Hero.tsx            # Hero section with CTA
│   ├── Features.tsx         # Features grid section
│   ├── AppPreview.tsx      # App screenshots/preview
│   ├── Security.tsx         # Security and privacy section
│   ├── Download.tsx        # Download section with store buttons
│   └── Footer.tsx          # Footer with links
├── App.tsx                 # Main app component
├── App.css                 # Global app styles
├── index.css               # Base styles and CSS variables
└── main.tsx                # Entry point
```

## Technologies Used

- React 18
- TypeScript
- Vite
- CSS3 (with CSS Variables)

## Customization

The color scheme can be customized by modifying CSS variables in `src/index.css`:

```css
:root {
  --primary-green: #25D366;
  --dark-green: #128C7E;
  --darker-green: #075E54;
  /* ... */
}
```

## License

MIT

