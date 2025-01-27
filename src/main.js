import SimpleLightbox from "simplelightbox";
import { fetchImages } from './js/pixabay-api.js';
import { createGalleryImgTemplate, showAlert } from './js/render-functions.js';

const formSearch = document.querySelector('.form');
const galleryEl = document.querySelector('.search-list');
const btnLoadMore = document.querySelector('.js-btn-load');
const loader = document.querySelector('.loader');

let page = 1;
let searchedQuery = '';
let totalPages = 0;

const onFormSubmit =  async event => {
        event.preventDefault();      
        searchedQuery = event.currentTarget.elements.search.value.trim();

    if (searchedQuery === '') {
        showAlert('Enter text to search!');
        return;
    }
        page = 1;
        loader.classList.add('active');
        galleryEl.innerHTML = '';
        btnLoadMore.classList.add('is-hidden');
    
    try {
        const { data } = await fetchImages(searchedQuery, page);

       if (data.hits.length === 0) {
            showAlert('Sorry, there are no images matching your search query. Please try again!');
            
            formSearch.reset();
            return;
        }

        totalPages = data.totalHits;

        const imagesCardsTemplate = data.hits.map(el => createGalleryImgTemplate(el)).join('');
        galleryEl.innerHTML = imagesCardsTemplate;
 
        const lightbox = new SimpleLightbox('.gallery-card a', {
            captionDelay: 250,
            captionsData: 'alt',
        });

        lightbox.refresh();
       
        if (totalPages > 1) {
            btnLoadMore.classList.remove('is-hidden')
        };
        
   } catch (err) {
       console.log(err);
       
    } finally {
        loader.classList.remove('active');
   }
};

formSearch.addEventListener('submit', onFormSubmit);

const onLoadMoreBtnClick = async () => {
    if (page < totalPages) {
        page++;
        loader.classList.add('active');
     };
        
 try {
        const { data } = await fetchImages(searchedQuery, page, 15);
        const galleryTemplate = data.hits.map(el => createGalleryImgTemplate(el)).join('');
        galleryEl.insertAdjacentHTML('beforeend', galleryTemplate);

      const lightbox = new SimpleLightbox('.gallery-card a', {
            captionDelay: 250,
            captionsData: 'alt',
        });

     lightbox.refresh();
     
        if (page >= totalPages) { 
            btnLoadMore.classList.add('is-hidden');
            showAlert( "We're sorry, but you've reached the end of search results.");
            btnLoadMore.removeEventListener('click', onLoadMoreBtnClick);
           
        };

} catch (err) {
    console.log(err);
 } finally {
     loader.classList.remove('active');
}
};
btnLoadMore.addEventListener('click', onLoadMoreBtnClick);