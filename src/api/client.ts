import axios from "axios";

export const urNetClient = axios.create({
  headers: {
    "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
    Accept: "application/json, text/javascript, */*; q=0.01",
    Origin: "https://www.ur-net.go.jp",
    Referer: "https://www.ur-net.go.jp/",
    "User-Agent":
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
  },
});
