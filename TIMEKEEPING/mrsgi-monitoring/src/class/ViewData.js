import axios from "axios";
import Plsconnection from "./connection";
const url = await Plsconnection();
export async function GetViewData() {
  try {
    const response = await axios.get(`${url}/api/View/GetAttendance`);
    const data = await response.data;
    return data;
  } catch (error) {
    return error.message;
  }
}

export async function DisLastTap() {
  try {
    const response = await axios.get(`${url}/api/View/Get/Tap`);
    const data = await response.data;
    return data;
  } catch (error) {
    return error.message;
  }
}
export async function TableData() {
  try {
    const response = await axios.get(`${url}/api/View/Get/LastTap`);
    const data = await response.data;
    return data;
  } catch (error) {
    return error.message;
  }
}
