import axios from "axios";

const services = axios.create({
  baseURL: "http://127.0.0.1:3001",
});
export default services;
