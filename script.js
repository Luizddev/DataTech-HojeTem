const API_KEY = '074dcd2c51aec706e23fe45e43bdb16e';
const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

// Buscar gêneros
async function getGenres() {
  const res = await fetch(`${BASE_URL}/genre/movie/list?api_key=${API_KEY}&language=pt-BR`);
  const data = await res.json();
  return data.genres;
}

// Buscar filmes por gênero
async function searchMoviesByGenre(genreId) {
  const res = await fetch(`${BASE_URL}/discover/movie?api_key=${API_KEY}&language=pt-BR&with_genres=${genreId}&sort_by=popularity.desc`);
  const data = await res.json();

  const shuffled = data.results.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, 20);
}

// Mostrar gêneros no select
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

// Mostrar filmes no container
function displayMovies(movies) {
  const container = document.getElementById('movies');
  container.innerHTML = '';

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
        
      </div>
    `;
    container.appendChild(div);
  });
}

// Mostrar imagens aleatórias nos banners (img1 e img2)
async function loadRandomPosters() {
  try {
    const randomPage = Math.floor(Math.random() * 500) + 1;
    const res = await fetch(`${BASE_URL}/movie/popular?api_key=${API_KEY}&language=pt-BR&page=${randomPage}`);
    const data = await res.json();
    const movies = data.results.filter(movie => movie.poster_path); // Só os que têm imagem

    if (movies.length < 2) {
      console.error('Não há filmes suficientes com poster nesta página.');
      return;
    }

    const randomMovies = [
      movies[Math.floor(Math.random() * movies.length)],
      movies[Math.floor(Math.random() * movies.length)]
    ];

    document.getElementById('img1').src = `${IMAGE_BASE_URL}${randomMovies[0].poster_path}`;
    document.getElementById('img2').src = `${IMAGE_BASE_URL}${randomMovies[1].poster_path}`;
  } catch (error) {
    console.error('Erro ao carregar posters aleatórios:', error);
  }
}

// Inicializar tudo
async function init() {
  await loadRandomPosters(); // Primeiro carrega os posters aleatórios

  const genres = await getGenres();
  displayGenres(genres);

  document.getElementById('search-btn').addEventListener('click', async () => {
    const genreId = document.getElementById('genre-select').value;
    if (!genreId) {
      alert('Selecione um gênero!');
      return;
    }

    document.getElementById('movies').innerHTML = '<p>Buscando filmes...</p>';

    const movies = await searchMoviesByGenre(genreId);
    displayMovies(movies);
  });
}

document.addEventListener('DOMContentLoaded', init);