import Notiflix from 'notiflix';
import GalleryService from "./getImages.js";
import LoadMoreBtn from "./LoadMoreBtn.js";
import createMarkup from './createMarkup.js';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

const refs = {
  searchForm: document.getElementById('search-form'),
  galleryWrapper: document.querySelector('.gallery'),
};

const galleryService = new GalleryService();
const loadMoreBtn = new LoadMoreBtn({
  selector: '.load-more',
  isHidden: true,
});

refs.searchForm.addEventListener('submit', onSearchFormSubmit);
loadMoreBtn.button.addEventListener('click', onLoadMoreBtnClick);


async function onSearchFormSubmit(event) {
  event.preventDefault();

  const formEl = event.currentTarget;
  const inputValue = formEl.elements.searchQuery.value.trim();

    if (!inputValue || !inputValue.match(/^[A-Za-z]+$/)) {
        Notiflix.Notify.failure("Sorry, there are no images matching your search query. Please try again.");
        loadMoreBtn.hide();
  }
    else {
        try {
            galleryService.searchQuery = inputValue;
            galleryService.resetPage();
            formEl.reset();
            clearGalleryList();

      const data = await galleryService.getImages();
      const markup = data.hits.map(image => createMarkup(image)).join('');

        if (data.hits.length === 0) {
            Notiflix.Notify.failure("Sorry, there are no images matching your search query. Please try again.");
            galleryService.resetPage();
            loadMoreBtn.hide()
            return;
      }
        else if (data.hits.length < galleryService.perPage) {
            updateGalleryList(markup);
            loadMoreBtn.hide();
      }
        else {
            Notiflix.Notify.success(`Hooray! We found ${data.totalHits} images.`)
            updateGalleryList(markup);
            loadMoreBtn.show();
        }
        } catch (err) {
        console.log(err);
        }
    }
    }

async function onLoadMoreBtnClick() {
  loadMoreBtn.disable();
    try {
        galleryService.incrementPage()

    const data = await galleryService.getImages();
    const totalPages = Math.ceil(data.totalHits / galleryService.perPage);
    console.log(galleryService.page)
    loadMoreBtn.enable();

    const markup = data.hits.map(image => createMarkup(image)).join('');
        updateGalleryList(markup);

        if (galleryService.page > 1) {
        {
            const { height: cardHeight } = document
            .querySelector(".gallery")
            .firstElementChild.getBoundingClientRect();
            window.scrollBy({
            top: cardHeight * 2,
            behavior: "smooth",
        });
      }
    }
        if (galleryService.page >= totalPages) {
        Notiflix.Notify.info("We're sorry, but you've reached the end of search results.");
        loadMoreBtn.hide();
        }
        else {
        loadMoreBtn.show();
        }
        initLightbox();

        } catch (err) {
            console.log(err);
            loadMoreBtn.enable();
        }
    }

function updateGalleryList(markup) {
  refs.galleryWrapper.insertAdjacentHTML("beforeend", markup);
}

function clearGalleryList() {
  refs.galleryWrapper.innerHTML = '';
}

function initLightbox() {
  new SimpleLightbox('.gallery a', {
    captionsData: 'alt',
    captionDelay: 250,
    caption: 'true',
  });
}


