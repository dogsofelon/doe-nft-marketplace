import http from "../http-common";

class TraitsDataService {

  getAll() {
    return http.get("/traits");
  }

  get(id) {
    return http.get(`/traits/${id}`);
  }

}

export default new TraitsDataService();