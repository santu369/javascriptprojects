const API_URL = "https://www.omdbapi.com";
const API_KEY = "92ab4bf0";
const mainEl = document.getElementById("main");
const articleEl = document.getElementById("article");

const modalEl = document.createElement("div");
modalEl.classList.add("modal");

let form = document.forms["search-form"];
const searchTerm = form[0].value;

searchFunction(searchTerm);
form[1].addEventListener("click", search);

async function getMovies(searchTerm) {
  const response = await fetch(
    API_URL + "/?s=" + searchTerm + "&page=1" + "&apikey=" + API_KEY
  );
  const responseData = await response.json();
  return await responseData;
}

async function getAdditionalInfo(imdbId) {
  const response = await fetch(
    API_URL + "/?i=" + imdbId + "&apikey=" + API_KEY
  );
  const responseData = await response.json();
  return await responseData;
}

async function searchFunction(searchTerm) {
  let movies = await getMovies(searchTerm);
  articleEl.style.display = "none";
  mainEl.style.display = "grid";
  if (movies.Response == "False") {
    mainEl.classList.remove("main");
    mainEl.classList.add("main-text");
    mainEl.innerHTML = movies.Error + " Please try again.";
    return movies.Error;
  } else {
    mainEl.innerHTML = "";
    mainEl.classList.remove("main-text");
    mainEl.classList.add("main");
    for (let movie of movies.Search) {
      const sectionEl = document.createElement("section");
      sectionEl.addEventListener("click", function () {
        showAdditonalInfo(movie.imdbID);
      });
      let sectionData = `
            <div class="img-container">
            <img src=${
              movie.Poster != "N/A" ? movie.Poster : "images/na.jpg"
            } alt='${movie.Title}' height="auto" width="100%">
            </div>
            <div class="info-container">
                <div class="main-info">
                    <p class="name">${movie.Title} - ${
        movie.Type.charAt(0).toUpperCase() + movie.Type.slice(1)
      }</p>
                    <p class="year">${movie.Year}</p>
                </div>
            </div>
            `;
      sectionEl.innerHTML = sectionData;
      mainEl.appendChild(sectionEl);
    }
  }
}

function search(e) {
  if (form[0].value != "") {
    e.preventDefault();
    searchFunction(form[0].value);
  }
}

async function showAdditonalInfo(imdbId) {
  let additionalInfo = await getAdditionalInfo(imdbId);
  modalEl.innerHTML = `
    <header class="modal-header">
        <h2>Name: ${additionalInfo.Title}</h2>
        <button onclick="closeModal()"><i class="fas fa-times"></i></button>
    </header>
    <div class="modal-container">
        <div class="modal-text">
            <p class="year"><strong>Year: </strong>${
              additionalInfo.Year
            }, <strong>Rated: </strong>PG</p>
            <p class="released"><strong>Released On: </strong>${
              additionalInfo.Released
            }</p>
            <p class="language"><strong>Language: </strong>${
              additionalInfo.Language
            }</p>
            <p class="country"><strong>Country: </strong>${
              additionalInfo.Country
            }</p>
            <p class="genre"><strong>Genre: </strong>${additionalInfo.Genre}</p>
            <p class="director"><strong>Director: </strong>${
              additionalInfo.Director
            }</p>
            <p class="writer"><strong>Writer: </strong>${
              additionalInfo.Writer
            }</p>
            <p class="actors"><strong>Actors: </strong>${
              additionalInfo.Actors
            }</p>
            <p class="production"><strong>Production: </strong>${
              additionalInfo.Production
            }</p>
            <p class="plot"><strong>Plot: </strong>${additionalInfo.Plot}</p>
            <p class="awards"><strong>Awards: </strong>${
              additionalInfo.Awards
            }</p>
            <p class="imdb-rating"><strong>IMDB Rating: </strong>${
              additionalInfo.imdbRating
            }</p>
            <p class="imdb-votes"><strong>IMDB Votes: </strong>${
              additionalInfo.imdbVotes
            }</p>
        </div>
        <div class="modal-image-container">
            <img src=${
              additionalInfo.Poster != "N/A"
                ? additionalInfo.Poster
                : "images/na.jpg"
            } alt=${additionalInfo.Title} height="auto" width="100%">
        </div>
    </div>
    `;
  articleEl.appendChild(modalEl);
  articleEl.style.display = "block";
  mainEl.style.display = "none";
}

function closeModal() {
  articleEl.style.display = "none";
  mainEl.style.display = "grid";
}
