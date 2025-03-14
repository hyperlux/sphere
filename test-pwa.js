const fs = require('fs');
const path = require('path');
const http = require('http');

// Test function to check if icon files exist
function checkIconFiles() {
  console.log('\n--- Testing Icon Files ---');
  const iconSizes = [72, 96, 128, 144, 152, 192, 384, 512];
  const iconsDir = path.join(__dirname, 'public', 'icons');
  
  let allIconsExist = true;
  
  for (const size of iconSizes) {
    const iconPath = path.join(iconsDir, `icon-${size}x${size}.png`);
    const exists = fs.existsSync(iconPath);
    
    console.log(`Icon ${size}x${size}: ${exists ? '✅ Exists' : '❌ Missing'}`);
    
    if (!exists) {
      allIconsExist = false;
    }
  }
  
  return allIconsExist;
}

// Test function to check if manifest.json exists and is valid
function checkManifest() {
  console.log('\n--- Testing Manifest ---');
  const manifestPath = path.join(__dirname, 'public', 'manifest.json');
  
  if (!fs.existsSync(manifestPath)) {
    console.log('❌ manifest.json is missing');
    return false;
  }
  
  try {
    const manifestContent = fs.readFileSync(manifestPath, 'utf8');
    const manifest = JSON.parse(manifestContent);
    
    console.log('✅ manifest.json exists and is valid JSON');
    
    // Check if icons are defined in manifest
    if (manifest.icons && Array.isArray(manifest.icons) && manifest.icons.length > 0) {
      console.log(`✅ manifest.json contains ${manifest.icons.length} icon definitions`);
    } else {
      console.log('❌ manifest.json does not contain icon definitions');
      return false;
    }
    
    return true;
  } catch (error) {
    console.log(`❌ Error parsing manifest.json: ${error.message}`);
    return false;
  }
}

// Test function to check if service worker exists
function checkServiceWorker() {
  console.log('\n--- Testing Service Worker ---');
  const swPath = path.join(__dirname, 'public', 'sw.js');

  if (process.env.NODE_ENV === 'development') {
    console.log('Skipping service worker check in development mode');
    return true;
  }
  
  if (!fs.existsSync(swPath)) {
    console.log('❌ Service worker (sw.js) is missing');
    return false;
  }
  
  console.log('✅ Service worker (sw.js) exists');
  
  // Check if workbox is imported in service worker
  const swContent = fs.readFileSync(swPath, 'utf8');
  if (swContent.includes('workbox')) {
    console.log('✅ Service worker imports workbox');
  } else {
    console.log('❌ Service worker does not import workbox');
    return false;
  }
  
  return true;
}

// Test function to check next.config.js for PWA configuration
function checkNextConfig() {
  console.log('\n--- Testing Next.js PWA Configuration ---');
  const configPath = path.join(__dirname, 'next.config.js');
  
  if (!fs.existsSync(configPath)) {
    console.log('❌ next.config.js is missing');
    return false;
  }
  
  const configContent = fs.readFileSync(configPath, 'utf8');
  
  if (configContent.includes('next-pwa')) {
    console.log('✅ next.config.js includes next-pwa configuration');
  } else {
    console.log('❌ next.config.js does not include next-pwa configuration');
    return false;
  }
  
  if (configContent.includes('buildExcludes')) {
    console.log('✅ next.config.js includes buildExcludes configuration');
  } else {
    console.log('❌ next.config.js does not include buildExcludes configuration');
    return false;
  }
  
  return true;
}

// Run all tests
async function runTests() {
  console.log('=== PWA Configuration Test ===');
  
  const iconFilesOk = checkIconFiles();
  const manifestOk = checkManifest();
  const serviceWorkerOk = checkServiceWorker();
  const nextConfigOk = checkNextConfig();
  
  console.log('\n--- Test Summary ---');
  console.log(`Icon Files: ${iconFilesOk ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`Manifest: ${manifestOk ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`Service Worker: ${serviceWorkerOk ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`Next.js Config: ${nextConfigOk ? '✅ PASS' : '❌ FAIL'}`);
  
  const allTestsPassed = iconFilesOk && manifestOk && serviceWorkerOk && nextConfigOk;
  console.log(`\nOverall Result: ${allTestsPassed ? '✅ ALL TESTS PASSED' : '❌ SOME TESTS FAILED'}`);
  
  if (allTestsPassed) {
    console.log('\n🎉 Your PWA configuration looks good! The app should work as a PWA.');
  } else {
    console.log('\n⚠️ Some issues were found with your PWA configuration.');
  }
}

// Run the tests
runTests();
