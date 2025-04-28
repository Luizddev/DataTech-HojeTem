const API_KEY = '074dcd2c51aec706e23fe45e43bdb16e'; 
const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

// Função para pegar filmes aleatórios
async function loadRandomPosters() {
  try {
    const randomPage = Math.floor(Math.random() * 500) + 1;
    const response = await fetch(`${BASE_URL}/movie/popular?api_key=${API_KEY}&language=pt-BR&page=${randomPage}`);
    const data = await response.json();
    const movies = data.results.filter(movie => movie.poster_path); // só filmes com imagem

    // Pega dois filmes aleatórios
    const randomMovies = [
      movies[Math.floor(Math.random() * movies.length)],
      movies[Math.floor(Math.random() * movies.length)]
    ];

    // Atualiza as imagens
    document.getElementById('img1').src = `${IMAGE_BASE_URL}${randomMovies[0].poster_path}`;
    document.getElementById('img2').src = `${IMAGE_BASE_URL}${randomMovies[1].poster_path}`;
    
  } catch (error) {
    console.error('Erro ao carregar filmes:', error);
  }
}

// Executa ao carregar a página
document.addEventListener('DOMContentLoaded', loadRandomPosters);
