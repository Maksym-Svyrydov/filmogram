import NewAskServer from '../fetch-films';
import { getTrailer } from '../trailer';

const movieAPI = new NewAskServer();
const filmsList = document.querySelector('.films__list');
const modal = document.querySelector('.renderModal');
const STORAGE_PAGE = 'storagePage';
const STORAGE_KEY = 'genresId';

const backdrop = document.querySelector('.backdrop');
const notFound = `https://i.scdn.co/image/ab67616d0000b273d9495d198c584e0e64f3ad9d`;

const IMGURL = `https://image.tmdb.org/t/p/w500/`;
let filmArr = [];


if (filmsList) {
  filmsList.addEventListener('click', modalOpen);
}
function modalOpen(e) {
  // if (e.target.className !== "films__card") {
  //   return;
  
    CloseModalClickEsc();
    
    let parent = e.srcElement;
    while (parent.id != "film_card") {
      parent = parent.parentElement;
    }
    getTrailer(parent.dataset.id, movieAPI);
    backdrop.classList.remove('isHidden');
    const getFilmsJson = localStorage.getItem(STORAGE_PAGE);

    const parseFilmsJson = JSON.parse(getFilmsJson);
    for (let i = 0; i < parseFilmsJson.length; i += 1) {
      parseFilmsJson[i];
      if (
        parseFilmsJson[i].title === e.target.alt ||
        parseFilmsJson[i].title === e.target.textContent ||
        parseFilmsJson[i].title === e.target.parentElement.children[0].textContent
      ) {
        filmArr.push(parseFilmsJson[i]);
        const getGenresJson = localStorage.getItem(STORAGE_KEY);
        const parseGenresJson = JSON.parse(getGenresJson);
        const markupModal = filmArr

          .map(
            ({
              id,
              poster_path,
              vote_average,
              vote_count,
              title,
              popularity,
              genre_ids,
              overview,
            }) => {
              let genreArr = [];
              for (const genre of parseGenresJson) {
                if (genre_ids.includes(genre.id)) {
                  genreArr.push(genre.name);
                }
              }
            
              return (
                sessionStorage.setItem('current-film-id', id),
                `<div class="film-modal" >
  <button
    class="film-modal__btn-icon"
    data-modal-close-p
    type="button"
    id="btnClose"
  >
  </button>
  <div class="film-modal__thumb">
    <img class="film-modal__img" src="${IMGURL}${poster_path}" alt="${title}" onerror="this.onerror=null; this.src='${notFound}';"/>
  </div>
  <div class="film-modal__info-container">
    <h2 class="film-modal__title">${title}</h2>
    <table class="film-modal__table">
      <tbody class="film-modal__cell1">
        <tr>
          <td class="film-modal__cell film-modal__modal-text">Vote / Votes</td>
          <td class="film-modal__cell film-modal__modal-text">
            <span class="film-modal__span film-modal__span-vote">${vote_average.toFixed(
                  1
                )}</span> /
            <span class="film-modal__span film-modal__span--votes">${vote_count}</span>
          </td>
        </tr>

        <tr>
          <td class="film-modal__cell film-modal__modal-text">Popularity</td>
          <td class="film-modal__cell film-modal__modal-text--popularity">
            ${popularity}
          </td>
        </tr>

        <tr>
          <td class="film-modal__cell film-modal__modal-text">
            Oraginal Title
          </td>
          <td class="film-modal__cell film-modal__modal-text--oraginal">
            ${title}
          </td>
        </tr>

        <tr>
          <td class="film-modal__cell film-modal__modal-text">Genre</td>
          <td class="film-modal__cell film-modal__modal-text--genre">
            ${genreArr.join(', ')}
          </td>
        </tr>
      </tbody>
    </table>

    <button type='button' class='btn modal__btn button--trailer'>
        <img
          class='img-trailer'
          src=''
          id='btntrailer'
        />START TRAILER</button>


    <h3 class="film-modal__subtitle">ABOUT</h3>
    <p class="fil-modal__text">${overview}</p>

    <ul class="film-modal__btn-list">
      <li class="film-modal__btn-item">
        <button class="btn modal__btn" type="button" data-action="watch">
          ADD TO WATCHED
        </button>
      </li>
      <li class="film-modal__btn-item">
        <button class=" btn modal__btn" type="" data-action="queue">
          ADD TO QUEUE
        </button>
      </li>
    </ul>
  </div>
  </div>`
              );
            }
          )
          .join('');
        modal.innerHTML = markupModal;
        const closeBtn = document.querySelector('#btnClose');
        console.log('closeBtn: ', closeBtn);

        closeBtn.addEventListener('click', onCloseBtnClick);
      }
    }
  


  backdrop.addEventListener('click', closeModal);
  function closeModal(e) {
    if (e.target.classList[0] !== 'backdrop') {
      return;
    }
    backdrop.classList.add('isHidden');
    filmArr = [];
  }

  function CloseModalClickEsc() {
    document.addEventListener('keydown', event => {
      if (event.key !== 'Escape') {
        return;
      }
      backdrop.classList.add('isHidden');
      filmArr = [];
    });
  }

  function onCloseBtnClick(e) {
    backdrop.classList.add('isHidden');
    filmArr = [];
  }
}

