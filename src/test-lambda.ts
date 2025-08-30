import { handler } from './index.js';

(async () => {
  try {
    const result = await handler({});
    console.log('Lambda handler result:', result);
  } catch (err) {
    console.error('Lambda handler error:', err);
  }
})();
