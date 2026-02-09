const axios = require('axios');

const BASE_URL = 'http://localhost:3000';

async function sendVehicleData(count = 500) {
  console.log('Sending vehicle data...');

  const requests = [];

  for (let i = 0; i < count; i++) {
    requests.push(
      axios.post(`${BASE_URL}/v1/ingest`, {
        vehicleId: 'V1',
        soc: 70 + Math.random() * 10,
        kwhDeliveredDc: 10 + Math.random(),
        batteryTemp: 35 + Math.random() * 5,
        timestamp: new Date().toISOString()
      })
    );
  }

  await Promise.all(requests);
  console.log('Vehicle ingestion done');
}

async function sendMeterData(count = 500) {
  console.log('Sending meter data...');

  const requests = [];

  for (let i = 0; i < count; i++) {
    requests.push(
      axios.post(`${BASE_URL}/v1/ingest`, {
        meterId: 'V1',
        kwhConsumedAc: 12 + Math.random(),
        voltage: 220 + Math.random() * 10,
        timestamp: new Date().toISOString()
      })
    );
  }

  await Promise.all(requests);
  console.log('Meter ingestion done');
}

async function testAnalytics() {
  console.log('Testing analytics...');

  const response = await axios.get(
    `${BASE_URL}/v1/analytics/performance/V1`
  );

  console.log('Analytics Response:');
  console.log(response.data);
}

async function runTest() {
  try {
    console.time('Total Test Time');

    await sendVehicleData(500);
    await sendMeterData(500);
    await testAnalytics();

    console.timeEnd('Total Test Time');
  } catch (err) {
    console.error('Test failed:', err.message);
  }
}

runTest();
