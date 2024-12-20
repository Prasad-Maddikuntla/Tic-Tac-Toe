// import { getLocalIP } from "./getIp";

    
const port = process.env.REACT_APP_PORT;
let localHost = process.env.REACT_APP_HOST
const domain = `http://${localHost}:${port}`;
console.log("domain:", domain);

export const config = {
    domain,
    localHost,
    port,
}