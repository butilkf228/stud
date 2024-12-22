import fetchCountries from './fetchCountries.js';
import debounce from 'lodash.debounce';
import { alert, error } from '@pnotify/core';
import '@pnotify/core/dist/PNotify.css';
import '@pnotify/core/dist/BrightTheme.css';

const searchBox = document.getElementById('search-box');
const countryList = document.getElementById('country-list');
const countryInfo = document.getElementById('country-info');

const DEBOUNCE_DELAY = 500;

function clearMarkup() {
  countryList.innerHTML = '';
  countryInfo.innerHTML = '';
}

function renderCountryList(countries) {
  const markup = countries
    .map(country => `<li>${country.name}</li>`)
    .join('');
  countryList.innerHTML = markup;
}

function renderCountryInfo(country) {
  const markup = `
    <h2>${country.name}</h2>
    <p><b>Capital:</b> ${country.capital}</p>
    <p><b>Population:</b> ${country.population}</p>
    <p><b>Languages:</b> ${country.languages.map(lang => lang.name).join(', ')}</p>
    <img src="${country.flag}" alt="${country.name}" width="300">
  `;
  countryInfo.innerHTML = markup;
}

function handleInput(event) {
  const searchQuery = event.target.value.trim();

  if (!searchQuery) {
    clearMarkup();
    return;
  }

  fetchCountries(searchQuery)
    .then(countries => {
      clearMarkup();

      if (countries.length > 10) {
        alert({
          text: 'Too many matches found.',
        });
      } else if (countries.length === 1) {
        renderCountryInfo(countries[0]);
      } else {
        renderCountryList(countries);
      }
    })
    .catch(() => {
      clearMarkup();
      error({
        text: 'No country found with this name.',
      });
    });
}

searchBox.addEventListener('input', debounce(handleInput, DEBOUNCE_DELAY));