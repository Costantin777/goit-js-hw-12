import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

import { fetchImages } from './js/pixabay-api';
import { imagesTemplate } from './js/render-functions';

const form = document.querySelector('.form');
const gallery = document.querySelector('.gallery');
const searchInput = document.querySelector('input');
const loadMoreBtn = document.querySelector('.load-more');

let query = '';
let page = 1;
let per_page = 15;
let maxPage;

const lightbox = new SimpleLightbox('.gallery a', {
  captions: true,
  captionType: 'attr',
  captionsData: 'alt',
  captionPosition: 'bottom',
  captionSelector: 'img',
  captionDelay: 250,
});

function showLoader() {
  const loader = document.createElement('span');
  loader.classList.add('loader');
  loadMoreBtn.parentNode.insertBefore(loader, loadMoreBtn.nextSibling);
}

function hideLoader() {
  const loader = document.querySelector('.loader');
  if (loader) {
    loader.remove();
  }
}

function showLoadMoreButton() {
  loadMoreBtn.style.display = 'block';
}

function hideLoadMoreButton() {
  loadMoreBtn.style.display = 'none';
}

form.addEventListener('submit', async e => {
  e.preventDefault();

  query = searchInput.value.trim();

  if (!query) {
    iziToast.error({
      message: 'Your request is missing. Please fill out the form',
      position: 'topCenter',
    });
    gallery.innerHTML = '';
    return;
  }

  page = 1;

  gallery.innerHTML = '';

  showLoader();

  try {
    const data = await fetchImages(query, page);

    maxPage = Math.ceil(data.totalHits / per_page);

    if (data.totalHits === 0) {
      iziToast.error({
        message:
          'Sorry, there are no images matching your search query. Please try again!',
        position: 'topCenter',
      });
    } else {
      displayImages(data);

      checkBtnLoadMoreStatus();

      if (page >= maxPage) {
        iziToast.info({
          message: `We're sorry, but you've reached the end of search results.`,
          position: 'topCenter',
        });
      }
    }
  } catch (error) {
    iziToast.error({
      message: `An error occurred: ${error.message}`,
      position: 'topCenter',
    });
  } finally {
    hideLoader();
  }

  searchInput.value = '';
});

loadMoreBtn.addEventListener('click', async () => {
  showLoader();

  page += 1;

  const data = await fetchImages(query, page);

  displayImages(data);

  hideLoader();

  checkBtnLoadMoreStatus();

  if (page >= maxPage) {
    iziToast.info({
      message: `We're sorry, but you've reached the end of search results.`,
      position: 'topCenter',
    });
  }

  const galleryItemHeight =
    gallery.firstElementChild.getBoundingClientRect().height;

  scrollBy({
    top: galleryItemHeight * 2,
    behavior: 'smooth',
  });
});

function displayImages(data) {
  const markup = imagesTemplate(data);

  gallery.insertAdjacentHTML('beforeend', markup);

  lightbox.refresh();
}

function checkBtnLoadMoreStatus() {
  if (page >= maxPage) {
    hideLoadMoreButton();
  } else {
    showLoadMoreButton();
  }
}