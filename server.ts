import app from './src/app'
import { config } from './config/config';
const startServer=()=>{
  const port = config.port;
    app.listen(port,()=>{
        console.log('the server is listening at ',port)
    })
}
startServer()
