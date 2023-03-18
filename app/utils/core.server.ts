// Core Service APIs

import { fetch } from "@remix-run/node"
import axios from "axios"
import { ReadyState } from "react-use-websocket"

export const ax = axios.create({
  baseURL: ENV.CORE_URL,
  // timeout: 10000,
  headers: { "X-Request-From": "Website" },
  // transformRequest: axios.defaults.transformRequest,
  // transformResponse: axios.defaults.transformResponse,
})

// export const WS_BASE_URI = `${
//   process.env.NODE_ENV === "production" ? "wss" : "ws"
// }://${ENV.CORE_ADDR}/api/v1/control`

// export const WS_STATUS_BADGES = {
//   [ReadyState.CONNECTING]: {
//     text: "Connecting",
//     className: "bg-orange-500 shadow-orange-300",
//   },
//   [ReadyState.OPEN]: {
//     text: "Connected",
//     className: "bg-green-500 shadow-green-300",
//   },
//   [ReadyState.CLOSING]: {
//     text: "Disconnecting",
//     className: "bg-rose-500 shadow-rose-300",
//   },
//   [ReadyState.CLOSED]: {
//     text: "Disconnected",
//     className: "bg-slate-800 shadow-slate-300",
//   },
//   [ReadyState.UNINSTANTIATED]: {
//     text: "Uninstantiated",
//     className: "bg-red-500",
//   },
// }

// axios.defaults.baseURL = ENV.CORE_URL
// const ax = axios

export const h = (token: string) => ({
  headers: { Authorization: `Bearer ${token}` },
})
export const extractResponseData = (res: any) => res.data

export const v1 = "/api/v1"

export const healthCheck = () => ax.get("/health/")
export const checkAuth = (token: string) => ax.get(`${v1}/auth/`, h(token))
export const login = (data: object) => ax.post(`${v1}/auth/`, data)
export const signup = (data: object) => ax.post(`${v1}/auth/signup/`, data)

export const getUserBuildings = (token: string) =>
  ax.get(`${v1}/buildings/`, h(token)).then(extractResponseData)
export const createBuilding = (token: string, data: object) =>
  ax.post(`${v1}/buildings/`, data, h(token)).then(extractResponseData)
export const getBuildingDetails = (id: string, token: string) =>
  ax.get(`${v1}/buildings/${id}/`, h(token)).then(extractResponseData)

export const delay = (time: number) => ax.get(`${v1}/dev/delay?time=${time}`)
export const dly = (t: number) =>
  fetch(`${process.env.CORE_ADDR}/api/v1/dev/delay?time=${t}`)

export const adminGetInitialData = (token: string) =>
  ax.get(`${v1}/admin`, h(token)).then(extractResponseData)
export const adminGetUsers = (token: string) =>
  ax.get(`${v1}/admin/users`, h(token)).then(extractResponseData)
export const adminGetFirmwares = (token: string) =>
  ax.get(`${v1}/admin/firmware-updates`, h(token)).then(extractResponseData)
export const adminPostFirmware = (formData: FormData, token: string) =>
  ax
    .post(`${v1}/admin/firmware-updates`, formData, h(token))
    .then(extractResponseData)
// fetch(`${ENV.CORE_URL + v1}/admin/firmware-updates`, {
//   ...h(token),
//   method: "POST",
//   body: formData,
// }).then(res => res.json())
// .then(extractResponseData)

const api = {
  v1,
  healthCheck,
  checkAuth,
  login,
  signup,
  getUserBuildings,
  createBuilding,
  getBuildingDetails,
  delay,
  dly,
  adminGetInitialData,
  adminGetUsers,
  adminGetFirmwares,
  adminPostFirmware,
}

export default api
