const form = document.getElementById("search-form")
const defaultMain = document.getElementById("index-placeholder")
const indexMain = document.getElementById("index-main")
const errorMessage = document.getElementById("error-message")
const watchlistMain = document.getElementById("watchlist-main")

const apiKey = "6c80cdeb"

let films = []

form.addEventListener("submit", (e) => {
    e.preventDefault()
    const enteredValue = document.getElementById("film-name").value 
    fetch(`https://www.omdbapi.com/?t=${enteredValue}&apikey=${apiKey}`)
        .then(res => res.json())
        .then(data => {
            if(!enteredValue || data.Error){
                if(indexMain.contains(defaultMain)){
                    defaultMain.innerHTML = `
                        <p>Unable to find what you are looking for. Please try another search.</p>
                    `   
                }else{
                    errorMessage.textContent = "No such film found ☹️";
                    errorMessage.style.display = "block";

                    // Hide the message after 2 seconds
                    setTimeout(() => {
                        errorMessage.style.display = "none";
                    }, 2000);
                }
            }else {
                handleFilm(data)
                document.getElementById("film-name").value = ""
            }
        })
})

indexMain.addEventListener("click", (e) => {
    if(e.target.closest(".add-film")){
        const filmID = e.target.closest(".add-film").getAttribute("data-film")
        addToWatchlist(filmID)
    }
})

async function addToWatchlist(filmID) {
    try {
        const res = await fetch(`https://www.omdbapi.com/?i=${filmID}&apikey=${apiKey}`)
        const data = await res.json()

        if (data.Response === "True") {
            // ✅ Store data in localStorage
            let watchlist = JSON.parse(localStorage.getItem("watchList")) || []
            if(!watchlist.some(movie => movie.imdbID === filmID)) {
                watchlist.push(data)
                localStorage.setItem("watchList", JSON.stringify(watchlist)); 
            }else {
                alert(`This movie is already in your Watchlist`)
            }
        } else {
            alert("Error:", data.Error);
        }
    } catch (error) {
        throw new Error("Fetch error:", error);
    }    
}

function createFilmsCard(films) {
    let filmsCard = ""
    films.forEach(film => {
        let {Title, imdbRating, Runtime, Genre, Plot, Poster, imdbID} = film
        filmsCard += `
            <div class="card" id="${imdbID}">
                <div class="poster">
                    <img src="${Poster}" alt="${Title}" class="poster-img"/>
                </div>
                <div class="film-details">
                    <h4>${Title} <span class="rating">⭐ ${imdbRating}</span></h4>
                    <div class="rgw">
                        <span class="runtime">${Runtime}</span>
                        <span class="genre">${Genre}</span>
                        <span class="add-film" data-film="${imdbID}"><i class="fa-solid fa-plus"></i> Watchlist</span>
                    </div>
                    <p class="plot">${Plot}</p>
                </div>
            </div>
            <hr/>
        `  
          
    })
    return filmsCard
}

function handleFilm(film) {
    const filmFound = films.find(item => item["Title"] === film["Title"])
    filmFound ? alert("You have this film listed below") : films.unshift(film)
    indexMain.innerHTML = createFilmsCard(films) 
}

document.getElementById("watchlist-locator").addEventListener("click", () => {
    window.location.href = "watchlist.html"   
})