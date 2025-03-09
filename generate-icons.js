const fs = require('fs');
const path = require('path');
const { createCanvas, loadImage } = require('canvas');

// Ensure the icons directory exists
const iconsDir = path.join(__dirname, 'public', 'icons');
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

// Icon sizes from manifest.json
const sizes = [72, 96, 128, 144, 152, 192, 384, 512];
const themeColor = '#F97316'; // Orange theme color from manifest.json

async function generateIcons() {
  try {
    // Load the SVG
    const svgPath = path.join(__dirname, 'public', 'globe.svg');
    const image = await loadImage(svgPath);
    
    // Generate icons for each size
    for (const size of sizes) {
      console.log(`Generating ${size}x${size} icon...`);
      
      // Create canvas with the required dimensions
      const canvas = createCanvas(size, size);
      const ctx = canvas.getContext('2d');
      
      // Fill background with theme color
      ctx.fillStyle = themeColor;
      ctx.fillRect(0, 0, size, size);
      
      // Calculate size for the SVG (80% of the canvas)
      const iconSize = size * 0.8;
      const padding = (size - iconSize) / 2;
      
      // Draw the SVG
      ctx.drawImage(image, padding, padding, iconSize, iconSize);
      
      // Save the icon
      const outputPath = path.join(iconsDir, `icon-${size}x${size}.png`);
      const buffer = canvas.toBuffer('image/png');
      fs.writeFileSync(outputPath, buffer);
    }
    
    console.log('All icons generated successfully!');
  } catch (error) {
    console.error('Error generating icons:', error);
  }
}

generateIcons();
