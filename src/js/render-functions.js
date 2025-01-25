import iziToast from "izitoast";

export const createGalleryCardTemplate = imgInfo => {
    return `
        <li class="gallery-card">
            <a href="${imgInfo.largeImageURL}">
                <img src="${imgInfo.webformatURL}" alt="${imgInfo.tags}"/>
            </a>
            <div class="info">
                <p>Likes: ${imgInfo.likes}</p>
                <p>Views: ${imgInfo.views}</p>
                <p>Comments: ${imgInfo.comments}</p>
                <p>Downloads: ${imgInfo.downloads}</p>
            </div>
        </li>`;
};

export const showAlert = message => {
    iziToast.show({
        title: '❌',
        message: message,
        position: 'topRight',
        timeout: 3000,
    });
};