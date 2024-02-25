export function imagesTemplate(data) {
  return data.hits

    .map(image => {
      return ` <li class="gallery-item">
        <a href="${image.largeImageURL}">
          <img class="gallery-image" src="${image.webformatURL}" alt="${image.tags}">
        </a>
        <p><b>Likes: </b>${image.likes}</p>
        <p><b>Views: </b>${image.views}</p>
        <p><b>Comments: </b>${image.comments}</p>
        <p><b>Downloads: </b>${image.downloads}</p>
      </li>`;
    })

    .join('');
}