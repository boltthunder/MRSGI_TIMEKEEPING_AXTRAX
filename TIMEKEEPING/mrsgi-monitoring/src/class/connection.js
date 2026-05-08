import { isElectron } from "../services/electronService";

export default function Plsconnection() {
  let baseUrl;
  if (isElectron() === false) {
    const ipAddress = localStorage.getItem("ipAddress");
    const port = localStorage.getItem("port");
    baseUrl = `http://${ipAddress}:${port}`;
  } else {
    console.log("plsconnection called else");
  }
  //   console.log("plsconnection called");
  //const baseUrl = "http://10.216.3.77:8181";
  return baseUrl;
}
