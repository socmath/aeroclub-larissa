# Aeroclub Larissa Website

A modern, responsive website for Aeroclub Larissa - a professional flight training school and aircraft services provider located in Larissa, Greece.

## 🛩️ About

This website showcases the comprehensive aviation services offered by Aeroclub Larissa, including:

- **Flight Training Programs** - PPL, CPL, and Instrument Rating courses
- **Aircraft Rental** - Modern, well-maintained fleet available for rent
- **Maintenance Services** - Certified aircraft maintenance and inspections
- **Scenic Flights** - Guided tours showcasing the beauty of Greece from above

## 🚀 Features

- **Responsive Design** - Fully responsive layout that works on all devices
- **Modern UI/UX** - Clean, professional design with smooth animations
- **Interactive Navigation** - Smooth scrolling with active section highlighting
- **Contact Form** - Functional contact form for inquiries and bookings
- **Fleet Showcase** - Detailed aircraft specifications and pricing
- **Training Programs** - Comprehensive course information with pricing
- **Mobile-Friendly** - Optimized mobile navigation with hamburger menu

## 🛠️ Technologies Used

- **HTML5** - Semantic markup with modern best practices
- **CSS3** - Custom styling with Flexbox/Grid layouts
- **JavaScript (ES6+)** - Interactive functionality and animations
- **Google Fonts** - Inter font family for modern typography
- **Font Awesome** - Icon library for consistent iconography

## 📁 Project Structure

```
aeroclub-larissa/
├── index.html          # Main HTML file
├── styles.css          # CSS stylesheet
├── script.js           # JavaScript functionality
├── assets/             # Images and media files
│   ├── aeroclub-logo.jpg
│   └── hero-video.mp4
└── README.md           # This file
```

## 🚀 Getting Started

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/aeroclub-larissa.git
   cd aeroclub-larissa
   ```

2. **Open in browser**
   - Simply open `index.html` in your preferred web browser
   - Or serve locally using a simple HTTP server:
   ```bash
   # Using Python
   python -m http.server 8000
   
   # Using Node.js
   npx serve .
   
   # Using PHP
   php -S localhost:8000
   ```

3. **View the website**
   - Navigate to `http://localhost:8000` if using a local server
   - Or open the `index.html` file directly in your browser

## 🌐 Deploy to GitHub Pages

GitHub Pages allows you to host your website directly from your GitHub repository for free.

### Method 1: Using GitHub Settings (Recommended)

1. **Push your code to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Enable GitHub Pages**
   - Go to your repository on GitHub: `https://github.com/socmath/aeroclub-larissa`
   - Click on **Settings** tab
   - Scroll down to **Pages** section in the left sidebar
   - Under **Source**, select **Deploy from a branch**
   - Choose **main** branch and **/ (root)** folder
   - Click **Save**

3. **Access your website**
   - Your site will be available at: `https://socmath.github.io/aeroclub-larissa`
   - It may take a few minutes for the site to become available

### Method 2: Using GitHub Actions (Advanced)

Create `.github/workflows/pages.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: false

jobs:
  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      - name: Setup Pages
        uses: actions/configure-pages@v4
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: '.'
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

### Custom Domain (Optional)

To use your own domain (e.g., `www.aeroclublarissa.gr`):

1. Create a `CNAME` file in your repository root:
   ```
   www.aeroclublarissa.gr
   ```

2. Configure DNS with your domain provider:
   - Add a CNAME record pointing to `socmath.github.io`
   - Or add A records pointing to GitHub's IP addresses

3. In GitHub Pages settings, enter your custom domain

### 🔄 Automatic Updates

Once set up, your website will automatically update whenever you push changes to the main branch!

## 📱 Features Overview

### Navigation
- Fixed header with smooth scroll navigation
- Active section highlighting
- Mobile hamburger menu for smaller screens

### Sections
- **Hero** - Compelling introduction with video background and statistics
- **Services** - Overview of all aviation services offered
- **Training** - Detailed training programs with pricing
- **Fleet** - Aircraft showcase with specifications
- **About** - Company history and certifications
- **Contact** - Contact form and location information

### Interactive Elements
- Animated statistics counters
- Smooth scroll-to-section navigation
- Responsive contact form
- Image galleries and carousels

## 🎨 Customization

### Colors and Branding
The website uses a professional aviation color scheme. Main colors can be customized in the CSS file:

```css
:root {
    --primary-color: #1e40af;
    --secondary-color: #3b82f6;
    --accent-color: #fbbf24;
    --text-dark: #1f2937;
    --text-light: #6b7280;
}
```

### Content Updates
- Update company information in `index.html`
- Replace images in the `assets/` folder
- Modify training programs and pricing in the respective sections
- Update contact information and social media links

## 📞 Contact Information

- **Location**: Larissa Airport, 41500 Larissa, Greece
- **Phone**: +30 2410 123456
- **Email**: info@aeroclublarissa.gr
- **Operating Hours**: Daily 08:00 - 18:00 (Weather permitting)

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Font Awesome for the icon library
- Google Fonts for the typography
- All the aviation professionals who inspired this design

---

**Note**: This website is designed for Aeroclub Larissa, a flight training school in Greece. All content, images, and information should be updated to reflect actual business details before deployment.