import axios from "axios";
import { getApiBaseUrl } from "./env";

export const api = axios.create({
  baseURL: getApiBaseUrl(),
  headers: { "Content-Type": "application/json" },
});
