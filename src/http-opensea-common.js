import axios from "axios";

export default axios.create({
  baseURL: "https://api.opensea.io/api/v1/asset/0xd8cdb4b17a741dc7c6a57a650974cd2eba544ff7",
  headers: {
    "Content-type": "application/json"
  }
});