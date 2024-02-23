import { fetchImages } from './js/pixabay-api';
import { templateImages } from './js/render-functions';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
// ================ звернення до елементів =================
const refs = {
  formEl: document.querySelector('.form'),
  loadEl: document.querySelector('.loader'),
  GalleryEl: document.querySelector('.gallery'),
  loadMore: document.querySelector('.js-btn-load'), // знайшли кнопку loadMore
};
// ================= додаткові змінні ==============================
let query;
let page;
let maxPage;
// =================  прослуховувачі подій  ================================
refs.formEl.addEventListener('submit', onFormSubmit);
refs.loadMore.addEventListener('click', onLoadMore);
// ============= лоудер ====================
const showLoader = () => {
  refs.loadEl.classList.remove('hidden'); // показує лоудер після Submit
};

const hiddenLoader = () => {
  refs.loadEl.classList.add('hidden'); //ховає лоудер після Submit
};
// =======================================================
async function onFormSubmit(ev) {
  ev.preventDefault();
  showLoader();
  query = ev.target.elements.query.value.trim(); // отримання значення input без пробілів
  // якщо нічого не введено в пошук
  if (!query) {
    showError();
    hiddenLoader();
    return;
  }
  page = 1;
  try {
    const data = await fetchImages(query, page); // відправлення кур'єра на пошук
    maxPage = Math.ceil(data.totalHits / 15);
    //================ якщо не знайдено нічого на сервері =================
    if (data.hits.length === 0) {
      ev.target.reset(); // очищення input

      showErrorMessage();
      hiddenLoader();
      return;
    } else {
      refs.GalleryEl.innerHTML = ''; // скидання розмітки після submit, але до рендеру
      renderHits(data.hits);
    }
  } catch (error) {
    showError(error);
    maxPage = 0;
    refs.GalleryEl.innerHTML = ''; // скидання розмітки після
  }
  hiddenLoader();
  checkVisibleStatus();
  ev.target.reset(); // очищення input
}
// =============== друга кнопка LoadMore =================
async function onLoadMore() {
  page += 1;
  showLoader();
  const data = await fetchImages(query, page);
  renderHits(data.hits);
  hiddenLoader();
  checkVisibleStatus(); // можна поставити перед page += 1;
  const height =
    refs.GalleryEl.firstElementChild.getBoundingClientRect().height;
  scrollBy({
    behavior: 'smooth',
    top: height * 2,
  });
}
const lightbox = new SimpleLightbox('.gallery a', {
  captions: true,
  captionSelector: 'img',
  captionType: 'attr',
  captionsData: 'alt',
  captionPosition: 'bottom',
  animation: 250,
  widthRatio: 0.8,
  scaleImageToRatio: true,
});
function renderHits(hits) {
  const markup = templateImages(hits);
  refs.GalleryEl.insertAdjacentHTML('beforeend', markup); // додає нову розмітку
  lightbox.refresh(); // Оновити модальне вікно зображення
}
function checkVisibleStatus() {
  if (page >= maxPage) {
    hiddenLoadBtn();
    showErrorEnd();
  } else {
    showLoadBtn();
  }
}
// ==================== errors ===================
function showError() {
  iziToast.error({
    message: 'Please enter a search query.',
    position: 'topRight',
  });
}
function showErrorMessage() {
  iziToast.error({
    backgroundColor: '#ff0000',
    position: 'topRight',
    maxWidth: 500,
    message:
      'Sorry, there are no images matching your search query. Please try again!',
  });
}
function showErrorEnd() {
  iziToast.error({
    backgroundColor: '#dc143c',
    message: "We're sorry, but you've reached the end of search results",
    position: 'bottomCenter',
  });
}
// =============== кнопка loadMore ===================
function showLoadBtn() {
  refs.loadMore.classList.remove('hidden');
} //показує кнопку loadMore
function hiddenLoadBtn() {
  refs.loadMore.classList.add('hidden');
} //ховає кнопку loadMore