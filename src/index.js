import './css/styles.css';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';
import { fetchCountries } from './js/fetchCountries';

const DEBOUNCE_DELAY = 300;
const clearMarkup = '';

const refs = {
  searchInput: document.querySelector('input#search-box'),
  countryList: document.querySelector('ul.country-list'),
  countryInfo: document.querySelector('div.country-info'),
};

refs.searchInput.addEventListener(
  'input',
  debounce(onSearchInput, DEBOUNCE_DELAY)
);

function onSearchInput(e) {
  const searchValue = e.target.value.trim();

  if (searchValue === '') {
    toggleMarkupAppearance(clearMarkup, clearMarkup);
    return;
  }

  fetchCountries(searchValue)
    .then(dataRender)
    .catch(error => {
      Notiflix.Notify.failure('Oops, there is no country with that name');
      toggleMarkupAppearance(clearMarkup, clearMarkup);
    });
}

function toggleMarkupAppearance(actionA, actionB) {
  refs.countryList.innerHTML = actionA;
  refs.countryInfo.innerHTML = actionB;
}

function dataRender(data) {
  if (data.length > 10) {
    Notiflix.Notify.info(
      'Too many matches found. Please enter a more specific name.'
    );
    toggleMarkupAppearance(clearMarkup, clearMarkup);
  } else if (data.length <= 10 && data.length >= 2) {
    const renderMarkup = data.map(createCountryListMarkup).join('');
    toggleMarkupAppearance(renderMarkup, clearMarkup);
  } else {
    const renderMarkup = createCountryInfoMarkup(data[0]);
    toggleMarkupAppearance(clearMarkup, renderMarkup);
  }
}

function createCountryListMarkup({ flags, name }) {
  return `
  <li class="country-list__item">
    <img src="${flags.svg}" alt="flag of ${name.official}" width="32px">
    <p>${name.official}</p>
  </li>`;
}

function createCountryInfoMarkup({
  name,
  capital,
  population,
  flags,
  languages,
}) {
  const allLanguages = [...Object.values(languages)].join(', ');
  return `
    <div class="basic-info">
      <img src="${flags.svg}" alt="flag of ${name.official}" width="48px">
      <p class="basic-info__text">${name.official}</p>
    </div>
    <ul class="country-info-list">
      <li><p>Capital: <span class="country-info-list__value">${capital}</span></p></li>
      <li><p>Population: <span class="country-info-list__value">${population}</span></p></li>
      <li><p>Languages: <span class="country-info-list__value">${allLanguages}</span></p></li>
    </ul>
   `;
}
