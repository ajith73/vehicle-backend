async function test() {
  const response = await fetch('http://localhost:5000/api/public/route', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      startLat: 21.0, startLng: 79.0, endLat: 21.1, endLng: 79.1, routeOption: 'Fastest'
    })
  });
  const data = await response.json();
  console.log(response.status);
  console.log(data);
}
test();
