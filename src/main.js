import SimpleLightbox from "simplelightbox";
import { fetchImages } from './js/pixabay-api.js';
import { createGalleryCardTemplate, showAlert } from './js/render-functions.js';

const formSearch = document.querySelector('.form');
const galleryEl = document.querySelector('.search-list');
const loader = document.querySelector('.loader');

const onFormSubmit = event => {
    event.preventDefault();
    const searchedQuery = event.currentTarget.elements.search.value.trim();

    if (searchedQuery === '') {
        showAlert('Enter text to search!');
        return;
    }

    loader.classList.add('active');

    fetchImages(searchedQuery).then(data => {
        if (data.hits.length === 0) {
            showAlert('Sorry, there are no images matching your search query. Please try again!');
            galleryEl.innerHTML = '';
            formSearch.reset();
            return;
        }

        const galleryTemplate = data.hits.map(el => createGalleryCardTemplate(el)).join('');
        galleryEl.innerHTML = galleryTemplate;

        const lightbox = new SimpleLightbox('.gallery-card a', {
            captionDelay: 250,
            captionsData: 'alt',
        });

        lightbox.refresh();
    }).catch(err => {
        console.error(err);
    }).finally(() => {
        setTimeout(() => {
            loader.classList.remove('active');
        }, 1000);
    });
        
};

formSearch.addEventListener('submit', onFormSubmit);