import axios from 'axios';

const BASE_URL = 'https://pixabay.com/';
const END_POINT = 'api/';

export async function fetchImages(query, currentPage) {
  const url = `${BASE_URL}${END_POINT}`;

  const params = {
    key: '42263617-81d7156b9f7b88cd7b1016c2a',
    q: query,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: 'true',
    per_page: 15,
    page: currentPage,
  };

  const res = await axios.get(url, { params });
  return res.data;
}