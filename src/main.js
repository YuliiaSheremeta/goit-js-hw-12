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

const lightbox = new SimpleLightbox('.gallery-card a', {
            captionDelay: 250,
            captionsData: 'alt',
});
        
const onFormSubmit =  async event => {
        event.preventDefault();      
        searchedQuery = event.currentTarget.elements.search.value.trim();
   
    if (searchedQuery === '') {
        showAlert('Enter text to search!');

        return;
    }
    page = 1;
    loader.classList.add('active');
    btnLoadMore.classList.add('is-hidden');
    
    try {
        const { data } = await fetchImages(searchedQuery, page);

        
       if (data.hits.length === 0) {
           
           showAlert('Sorry, there are no images matching your search query. Please try again!');
           galleryEl.innerHTML = '';
           formSearch.reset();
           
            return;
        }
        
        totalPages = Math.ceil(data.totalHits / 15);

        const imagesCardsTemplate = data.hits.map(el => createGalleryImgTemplate(el)).join('');
        galleryEl.innerHTML = imagesCardsTemplate;

        if (data.totalHits > 15) {
             btnLoadMore.classList.remove('is-hidden');
        };
     
        lightbox.refresh();

   } catch (err) {
       console.log(err);
       showAlert('Something went wrong. Please try again later.');
    } finally {
        loader.classList.remove('active');
   }
};

formSearch.addEventListener('submit', onFormSubmit);

const onLoadMoreBtnClick = async event => {    
    try {
        page++;
        
        const { data } = await fetchImages(searchedQuery, page);

        if (data.hits.length === 0 || page >= totalPages) { 
            btnLoadMore.classList.add('is-hidden');
            showAlert("We're sorry, but you've reached the end of search results.");
           
            return;
        }
        
        const galleryTemplate = data.hits.map(el => createGalleryImgTemplate(el)).join('');
        galleryEl.insertAdjacentHTML('beforeend', galleryTemplate);
     
        lightbox.refresh();
        
        const imgCard = galleryEl.querySelector('.gallery-card');
        
     if (imgCard) { 
         const imgCardHeigth = imgCard.getBoundingClientRect().height;
            
            window.scrollBy({
            top: imgCardHeigth * 2,
            behavior: 'smooth' 
         });
     };


} catch (err) {
        console.log(err);
        showAlert('Something went wrong. Please try again later.');

 } finally {
     loader.classList.remove('active');
}
};
btnLoadMore.addEventListener('click', onLoadMoreBtnClick);