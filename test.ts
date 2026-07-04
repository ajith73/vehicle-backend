import { Mechanic } from './src/models';

async function test() {
  try {
    const mechs = await Mechanic.findAll();
    console.log('Success, found:', mechs.length);
  } catch (err) {
    console.error('Error:', err);
  }
}

test();
