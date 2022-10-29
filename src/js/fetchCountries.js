const BASE_URL = 'https://restcountries.com/v3.1/name';
const filters = 'fields=name,capital,population,flags,languages';

export function fetchCountries(name) {
  const url = `${BASE_URL}/${name}?${filters}`;

  return fetch(url)
    .then(response => {
      if (!response.ok) {
        throw new Error(response.status);
      }

      return response.json();
    })
    .catch(error => console.log(error));
}
