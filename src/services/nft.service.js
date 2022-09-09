import http from "../http-common";

class NftDataService {
  
  getAll() {
    return http.get("/nft");
  }

  get(id) {
    return http.get(`/nft/${id}`);
  }

  fetch(offset, sortBy) {
    return http.get(`/nft/fetch/${offset}/${sortBy}`)
  }

  search(search, sortBy) {
    return http.get(`/nft/search/${search}/${sortBy}`)
  }
}

export default new NftDataService();