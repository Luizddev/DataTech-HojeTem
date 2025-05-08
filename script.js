const BASE_URL = fetch("/api/..."); // Backend local

// Buscar gêneros
async function fetchGenres() {
  const res = await fetch("/api/genres");
  if (!res.ok) throw new Error('Erro ao buscar gêneros');
  const data = await res.json();

  const genres = Array.isArray(data) ? data : data.genres || [];
  const select = document.getElementById('genre-select');
  select.innerHTML = '<option value="">Selecione um gênero</option>';

  genres.forEach(g => {
    const option = document.createElement('option');
    option.value = g.id;
    option.textContent = g.name;
    select.appendChild(option);
  });
}

// Buscar filmes aleatórios para os banners
async function loadRandomPosters() {
  try {
    const res = await fetch("/api/random-movies"); // Endpoint correto para filmes aleatórios
    if (!res.ok) throw new Error('Erro ao carregar filmes aleatórios');
    const movies = await res.json();

    if (movies.length < 2) {
      console.error('Não há filmes suficientes com poster nesta página.');
      return;
    }

    // Seleciona dois filmes aleatórios
    const randomMovies = [
      movies[Math.floor(Math.random() * movies.length)],
      movies[Math.floor(Math.random() * movies.length)]
    ];

    // Atualiza as imagens dos banners
    document.getElementById('img1').src = randomMovies[0].poster_path
      ? `https://image.tmdb.org/t/p/w500${randomMovies[0].poster_path}`
      : 'path/to/default-image.jpg'; // Fallback para filmes sem poster

    document.getElementById('img2').src = randomMovies[1].poster_path
      ? `https://image.tmdb.org/t/p/w500${randomMovies[1].poster_path}`
      : 'path/to/default-image.jpg'; // Fallback para filmes sem poster

  } catch (error) {
    console.error('Erro ao carregar posters aleatórios:', error);
  }
}

// Mostrar filmes no container
async function fetchMovies() {
  const genreId = document.getElementById('genre-select').value;
  if (!genreId) return alert('Selecione um gênero');

  const res = await fetch(`/api/movies?genre_id=${genreId}`); // Endpoint correto para filmes por gênero
  if (!res.ok) throw new Error('Erro ao buscar filmes');
  const movies = await res.json();

  const container = document.getElementById('movies');
  container.innerHTML = '';

  if (movies.length === 0) {
    container.innerHTML = '<p>Nenhum filme encontrado.</p>';
    return;
  }

  // Exibe os filmes na página
  movies.forEach(movie => {
    const div = document.createElement('div');
    div.className = 'movie';
    div.innerHTML = `
      <img src="${movie.poster_path ? `https://image.tmdb.org/t/p/w200${movie.poster_path}` : 'path/to/default-image.jpg'}" alt="${movie.title}">
      <div class="movie-details">
        <h3>${movie.title} (${movie.release_date?.slice(0, 4) || 'Sem ano'})</h3>
      </div>
    `;

    // Evento de clique para abrir o modal
    div.addEventListener('click', () => openModal(movie));
    container.appendChild(div);
  });
}

// Inicializar tudo
async function init() {
  await loadRandomPosters(); // Carregar posters aleatórios ao carregar a página
  await fetchGenres(); // Carregar gêneros para o select

  // Evento de busca ao clicar no botão
  document.getElementById('search-btn').addEventListener('click', fetchMovies);
}

document.addEventListener('DOMContentLoaded', init);

// Função para abrir o modal com detalhes do filme
function openModal(movie) {
  document.getElementById('modal-title').textContent = movie.title;
  document.getElementById('modal-overview').textContent = movie.overview || 'Descrição não disponível.';
  document.getElementById('modal-release').textContent = movie.release_date || 'Data não disponível';
  document.getElementById('modal-poster').src = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : 'path/to/default-image.jpg'; // Fallback para filmes sem poster

  document.getElementById('movie-modal').style.display = 'block';
}

// Função para fechar o modal
function closeModal() {
  document.getElementById('movie-modal').style.display = 'none';
}

// Fecha o modal ao clicar fora
window.onclick = function (event) {
  const modal = document.getElementById('movie-modal');
  if (event.target === modal) {
    closeModal();
  }
};
