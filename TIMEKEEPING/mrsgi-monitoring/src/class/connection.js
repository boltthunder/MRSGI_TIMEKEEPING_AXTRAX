import { isElectron } from "../services/electronService";

const Plsconnection = async () => {
  let baseUrl;
  try {
    if (isElectron() === false) {
      const ipAddress = localStorage.getItem("ipAddress");
      const port = localStorage.getItem("port");
      baseUrl = `http://${ipAddress}:${port}`;
      return baseUrl;
    } else if (isElectron() === true) {
      const data = await window.api.getConnections();

      return (baseUrl = `http://${data[0].IP_ADDRESS}:${data[0].PORT}`);
    }
  } catch (err) {
    console.error("Error occurred while fetching connection details:", err);
    return null;}
};

export default Plsconnection;
