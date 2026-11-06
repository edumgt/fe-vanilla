import { createApp } from './nodejs/src/app.js';

const app = createApp();
const PORT = 3000;
const HOST = '0.0.0.0';

app.listen(PORT, HOST, () => {
  console.log(`[Enterprise Server] Listening at http://${HOST}:${PORT}`);
});

export default app;
