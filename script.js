const API_KEY = '074dcd2c51aec706e23fe45e43bdb16e'; // Substitua com sua API key real
const BASE_URL = 'https://api.themoviedb.org/3';

async function getGenres() {
  const res = await fetch(`${BASE_URL}/genre/movie/list?api_key=${API_KEY}&language=pt-BR`);
  const data = await res.json();
  return data.genres;
}

async function searchMoviesByGenre(genreId) {
  const res = await fetch(`${BASE_URL}/discover/movie?api_key=${API_KEY}&language=pt-BR&with_genres=${genreId}&sort_by=popularity.desc`);
  const data = await res.json();

  // Embaralhar os resultados e pegar 7 diferentes
  const shuffled = data.results.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, 7);
}

function displayGenres(genres) {
  const select = document.getElementById('genre-select');
  select.innerHTML = '<option value="">Selecione um Gênero</option>';
  genres.forEach(g => {
    const option = document.createElement('option');
    option.value = g.id;
    option.textContent = g.name;
    select.appendChild(option);
  });
}

function displayMovies(movies) {
  const container = document.getElementById('movies');
  container.innerHTML = ''; // Limpa antes de exibir novos

  if (movies.length === 0) {
    container.innerHTML = '<p>Nenhum filme encontrado.</p>';
    return;
  }

  movies.forEach(movie => {
    const div = document.createElement('div');
    div.className = 'movie';
    div.innerHTML = `
          <img src="https://image.tmdb.org/t/p/w200/${movie.poster_path}" alt="${movie.title}">
          <div class="movie-details">
            <h3>${movie.title} (${movie.release_date?.slice(0, 4) || 'Sem ano'})</h3>
            <p>${movie.overview || 'Sem sinopse disponível.'}</p>
          </div>
        `;
    container.appendChild(div);
  });
}

async function init() {
  const genres = await getGenres();
  displayGenres(genres);

  document.getElementById('search-btn').addEventListener('click', async () => {
    const genreId = document.getElementById('genre-select').value;
    if (!genreId) {
      alert('Selecione um gênero!');
      return;
    }

    // Limpa antes mesmo da busca
    document.getElementById('movies').innerHTML = '<p>Buscando filmes...</p>';

    const movies = await searchMoviesByGenre(genreId);
    displayMovies(movies);
  });
}

init();