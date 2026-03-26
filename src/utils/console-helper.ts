// Console helper for troubleshooting backend connection issues

const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

console.log('%c🚀 ECEasy Frontend', 'font-size: 20px; font-weight: bold; color: #3b82f6;');
console.log('%cBackend Integration Status', 'font-size: 14px; font-weight: bold; color: #1e3a8a;');
console.log('');

console.log('📍 Expected Backend URL:', API_URL);
console.log('');

console.log('%c✅ Quick Setup Checklist:', 'font-weight: bold; color: #059669;');
console.log('1. Backend server running at', API_URL);
console.log('2. CORS enabled on backend for this origin');
console.log('3. Backend endpoints implemented:');
console.log('   - POST /chat');
console.log('   - GET /sessions');
console.log('   - POST /sessions');
console.log('   - GET /history/{sessionId}');
console.log('');

console.log('%c🔧 Troubleshooting:', 'font-weight: bold; color: #d97706;');
console.log('If you see "Failed to fetch" errors:');
console.log('');
console.log('Step 1: Check if backend is running');
console.log('Run this in terminal: curl', API_URL + '/health');
console.log('');
console.log('Step 2: Verify environment variable');
console.log('Check your .env file has: VITE_API_BASE_URL=' + API_URL);
console.log('Remember to restart dev server after changing .env!');
console.log('');
console.log('Step 3: Test backend connection from browser');
console.log('Run this in console:');
console.log(`fetch('${API_URL}/sessions').then(r => r.json()).then(console.log).catch(console.error)`);
console.log('');

console.log('%c📚 Documentation:', 'font-weight: bold; color: #7c3aed;');
console.log('• QUICKSTART.md - 5 minute setup guide');
console.log('• INTEGRATION_GUIDE.md - Detailed backend integration');
console.log('• DEPLOYMENT.md - Production deployment');
console.log('');

console.log('%c💡 Demo Mode:', 'font-weight: bold; color: #d97706;');
console.log('The app works without a backend in demo mode.');
console.log('You can test the UI, but responses will be mock data.');
console.log('Connect the backend to enable full RAG functionality!');
console.log('');

// Test backend connection
async function testBackendConnection() {
  try {
    const response = await fetch(`${API_URL}/health`, { method: 'GET' });
    if (response.ok) {
      console.log('%c✅ Backend is reachable!', 'color: #059669; font-weight: bold;');
    } else {
      console.log('%c⚠️ Backend responded but returned status:', response.status, 'color: #d97706; font-weight: bold;');
    }
  } catch (error) {
    console.log('%c❌ Backend is not reachable', 'color: #dc2626; font-weight: bold;');
    console.log('Make sure backend is running at:', API_URL);
  }
}

// Run connection test
setTimeout(() => {
  console.log('%c🔍 Testing backend connection...', 'font-style: italic; color: #6b7280;');
  testBackendConnection();
}, 1000);

// Export for debugging
(window as any).eceasyDebug = {
  apiUrl: API_URL,
  testConnection: testBackendConnection,
};

console.log('');
console.log('Type eceasyDebug.testConnection() to test backend connection anytime');
console.log('');
