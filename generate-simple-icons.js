const fs = require('fs');
const path = require('path');
const { createCanvas } = require('canvas');

// Ensure the icons directory exists
const iconsDir = path.join(__dirname, 'public', 'icons');
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

// Icon sizes from manifest.json
const sizes = [72, 96, 128, 144, 152, 192, 384, 512];
const themeColor = '#F97316'; // Orange theme color from manifest.json
const textColor = '#FFFFFF'; // White text

function generateIcons() {
  try {
    // Generate icons for each size
    for (const size of sizes) {
      console.log(`Generating ${size}x${size} icon...`);
      
      // Create canvas with the required dimensions
      const canvas = createCanvas(size, size);
      const ctx = canvas.getContext('2d');
      
      // Fill background with theme color
      ctx.fillStyle = themeColor;
      ctx.fillRect(0, 0, size, size);
      
      // Add text "A" for AuroNet
      ctx.fillStyle = textColor;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      
      // Scale font size based on icon size
      const fontSize = Math.floor(size * 0.6);
      ctx.font = `bold ${fontSize}px Arial`;
      
      // Draw the text in the center
      ctx.fillText('A', size / 2, size / 2);
      
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
