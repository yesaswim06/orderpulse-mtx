const fs = require('fs');
const { execSync } = require('child_process');

console.log('[OrderPulse Vercel Build] Current working directory:', process.cwd());

if (fs.existsSync('frontend')) {
  console.log('[OrderPulse Vercel Build] Detected "frontend" subdirectory at repo root.');
  console.log('[OrderPulse Vercel Build] Building Vite frontend via npm run build...');
  execSync('npm run build --prefix frontend', { stdio: 'inherit' });

  if (!fs.existsSync('dist')) {
    fs.mkdirSync('dist', { recursive: true });
  }
  fs.cpSync('frontend/dist', 'dist', { recursive: true });
  console.log('[OrderPulse Vercel Build] Mirrored built artifacts to root "dist" directory.');
} else {
  console.log('[OrderPulse Vercel Build] Inside frontend directory. Running npm run build...');
  execSync('npm run build', { stdio: 'inherit' });
}

console.log('[OrderPulse Vercel Build] Build finished successfully.');
