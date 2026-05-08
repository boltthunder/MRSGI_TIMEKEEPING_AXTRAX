import axios from "axios";
import PlsConnect from "./connection";

export async function GetViewData() {
    try {
        const response = await axios.get(`${PlsConnect()}/api/View/GetAttendance`);
        const data = await response.data;
        return data;
    } catch (error) {
        return error.message;
    }
}

export async function DisLastTap(){
    try {
        const response = await axios.get(`${PlsConnect()}/api/View/Get/Tap`);
        const data = await response.data;
        return data;
    } catch (error) {
        return error.message;
    }
}
export async function TableData(){
    try {
        const response = await axios.get(`${PlsConnect()}/api/View/Get/LastTap`);
        const data = await response.data;
        return data;
    } catch (error) {
        return error.message;
    }
}