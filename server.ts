import app from './src/app';
import { config } from './config/config';
import { connectdb } from './config/dbconnect';

const startServer = async () => {
  try {
    await connectdb(); // Establish MongoDB connection first

    const port = config.port|| 3000;

    app.listen(port, () => {
      console.log(`🚀 Server is listening on port ${port}`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
