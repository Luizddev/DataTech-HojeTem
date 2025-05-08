const BASE_URL = "https://datatech-cinema-em-casa.onrender.com/api"; // URL base do backend
const TMDB_IMAGE_BASE = "https://image.tmdb.org/t/p/w500";
const TMDB_THUMB_BASE = "https://image.tmdb.org/t/p/w200";
const DEFAULT_IMAGE = "path/to/default-image.jpg"; // Substitua por uma imagem local válida

// Buscar filmes aleatórios para os banners
async function loadRandomPosters() {
  try {
    const genreId = 878; // Gênero Sci-Fi como exemplo
    const res = await fetch(`${BASE_URL}/movies?genre=${genreId}`);
    console.log(`URL chamada: ${BASE_URL}/movies?genre=${genreId}`);
    if (!res.ok) throw new Error('Erro ao carregar filmes aleatórios');
    const movies = await res.json();

    const validMovies = movies.filter(m => m.poster_path);
    if (validMovies.length < 2) {
      console.error('Filmes com poster insuficientes.');
      return;
    }

    const [movie1, movie2] = getTwoRandomItems(validMovies);

    document.getElementById('img1').src = `${TMDB_IMAGE_BASE}${movie1.poster_path}`;
    document.getElementById('img2').src = `${TMDB_IMAGE_BASE}${movie2.poster_path}`;
  } catch (error) {
    console.error('Erro ao carregar posters:', error);
  }
}

// Utilitário para pegar 2 filmes aleatórios sem repetição
function getTwoRandomItems(array) {
  const shuffled = array.sort(() => 0.5 - Math.random());
  return [shuffled[0], shuffled[1]];
}

// Buscar gêneros
async function fetchGenres() {
  try {
    const res = await fetch(`${BASE_URL}/genres`);
    if (!res.ok) throw new Error('Erro ao carregar gêneros');
    const genres = await res.json();

    if (!Array.isArray(genres)) {
      console.error('Formato inválido para gêneros:', genres);
      return;
    }

    const select = document.getElementById('genre-select');
    select.innerHTML = '<option value="">Selecione um gênero</option>';

    genres.forEach(genre => {
      const option = document.createElement('option');
      option.value = genre.id;
      option.textContent = genre.name;
      select.appendChild(option);
    });
  } catch (error) {
    console.error('Erro ao carregar gêneros:', error);
  }
}

// Buscar e exibir filmes
async function fetchMovies() {
  try {
    const genreId = document.getElementById('genre-select').value;
    if (!genreId) return alert('Selecione um gênero');

    const res = await fetch(`${BASE_URL}/movies?genre=${genreId}`);
    if (!res.ok) throw new Error('Erro ao buscar filmes');
    const movies = await res.json();

    const container = document.getElementById('movies');
    container.innerHTML = '';

    if (!movies.length) {
      container.innerHTML = '<p>Nenhum filme encontrado.</p>';
      return;
    }

    movies.forEach(movie => {
      const div = document.createElement('div');
      div.className = 'movie';
      div.innerHTML = `
        <img src="${movie.poster_path ? `${TMDB_THUMB_BASE}${movie.poster_path}` : DEFAULT_IMAGE}" alt="${movie.title}">
        <div class="movie-details">
          <h3>${movie.title} (${movie.release_date?.slice(0, 4) || 'Sem ano'})</h3>
        </div>
      `;
      div.addEventListener('click', () => openModal(movie));
      container.appendChild(div);
    });
  } catch (error) {
    console.error('Erro ao buscar filmes:', error);
  }
}

// Modal
function openModal(movie) {
  document.getElementById('modal-title').textContent = movie.title;
  document.getElementById('modal-overview').textContent = movie.overview || 'Descrição não disponível.';
  document.getElementById('modal-release').textContent = movie.release_date || 'Data não disponível';
  document.getElementById('modal-poster').src = movie.poster_path
    ? `${TMDB_IMAGE_BASE}${movie.poster_path}`
    : DEFAULT_IMAGE;

  document.getElementById('movie-modal').style.display = 'block';
}

function closeModal() {
  document.getElementById('movie-modal').style.display = 'none';
}

// Fechar modal ao clicar fora
window.addEventListener('click', event => {
  const modal = document.getElementById('movie-modal');
  if (event.target === modal) {
    closeModal();
  }
});

// Inicialização
async function init() {
  await loadRandomPosters();
  await fetchGenres();
  document.getElementById('search-btn').addEventListener('click', fetchMovies);
}

document.addEventListener('DOMContentLoaded', init);