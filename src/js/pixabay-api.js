import axios from 'axios';

export async function fetchImages(query, currentPage) {
  const API_KEY = '42356211-e192fc2ea90e5ac732e43fabf';
  const BASE_URL = 'https://pixabay.com';
  const END_POINT = '/api/';
  const url = `${BASE_URL}${END_POINT}`;

  const params = {
    key: API_KEY,
    q: query,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: 'true',
    per_page: 15,
    page: currentPage,
  };

  const response = await axios.get(url, { params });

  return response.data;
}