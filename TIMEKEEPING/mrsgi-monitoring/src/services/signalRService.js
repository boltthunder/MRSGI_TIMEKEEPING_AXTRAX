import { HubConnectionBuilder } from "@microsoft/signalr";
import PlsConnect from "../connection";

let connection = null;

export const startSignalR = async (onReceiveTap) => {
  connection = new HubConnectionBuilder()
    .withUrl(`${PlsConnect()}/taphub`)
    .withAutomaticReconnect()
    .build();

  try {
    await connection.start();
    console.log("✅ SignalR Connected");

    connection.on("ReceiveTap", onReceiveTap);
  } catch (err) {
    console.error("❌ SignalR Error:", err);
  }
};

export const stopSignalR = async () => {
  if (connection) {
    await connection.stop();
  }
};