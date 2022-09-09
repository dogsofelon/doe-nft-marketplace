import http from "../http-opensea-common";

class OpenseaService {
  
  get(id){
      return http.get(`/${id}`);
  }
}

export default new OpenseaService();