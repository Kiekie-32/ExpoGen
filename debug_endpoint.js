
async function test() {
  const url1 = 'https://expo-gen-rose.vercel.app/auth/register';
  const url2 = 'https://expo-gen-rose.vercel.app/api/auth/register';
  
  console.log('Testing URL 1:', url1);
  try {
    const res1 = await fetch(url1, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({}) });
    console.log('URL 1 status:', res1.status);
  } catch (e) {
    console.log('URL 1 error:', e.message);
  }

  console.log('Testing URL 2:', url2);
  try {
    const res2 = await fetch(url2, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({}) });
    console.log('URL 2 status:', res2.status);
  } catch (e) {
    console.log('URL 2 error:', e.message);
  }
}

test();
