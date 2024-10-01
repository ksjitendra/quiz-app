import { IappConfig } from "./config.interface";

export default (): IappConfig => ({
    app: {
      port: parseInt(process.env.SERVER_PORT),
    },
    
  });
  