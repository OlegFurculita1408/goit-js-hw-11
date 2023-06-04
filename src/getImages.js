import axios from 'axios';


export default class GalleryService {
  constructor() {
    this.URL = 'https://pixabay.com/api/';
    this.API_KEY = '37017731-87154c65e3580dd14aba57926';
    this.perPage = 40;
    this.page = 1;
    this.searchQuery = ''
  }
  async getImages() {
    const params = {
      key: this.API_KEY,
      q: this.searchQuery,
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: true,
      per_page: this.perPage,
      page: this.page
    }
      try {
        const response = await axios.get(`${this.URL}`, { params });
        const { hits, totalHits } = response.data;
        return { hits, totalHits };
      } catch (error) {
        console.log(error);
      }
  }
  resetPage() {
    this.page = 1;
  }
  incrementPage() {
    this.page += 1;
  }
}
