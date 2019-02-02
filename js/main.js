window.addEventListener('DOMContentLoaded', function() {
    const searchField = document.querySelector('.title');
    const formSubmit = document.querySelector('#submit');
    const filmsSection = document.querySelector('.wrapper');
    const xhr = new XMLHttpRequest();
    let output = '';

    formSubmit.addEventListener('click', getVideos);

    searchField.addEventListener('keyup', clearVideos);

    function clearVideos() {
        if(searchField.value === '') {
            output = '';
            filmsSection.innerHTML = '';
        }
    }

    function getVideos(e) {
        e.preventDefault();
        filmsSection.innerHTML = '';

        xhr.open('GET', `http://www.omdbapi.com/?apikey=d70cba40&s=${searchField.value}`, false);
        
        xhr.onload = function() {
            if(this.status === 200) {
                // Success

                // Get all the data returned from the response
                let filmData = JSON.parse(this.responseText).Search;

                if(filmData !== undefined) {
                    filmData.forEach((film) => {
                        // Only list a film if it has an available poster. Don't want the site looking shit now do we
                        if(film.Poster !== 'N/A') {
                            output += `<div class="film" data-filmId="${film.imdbID}">
                                <img src="${film.Poster}" class="film-poster">
                                <h3 class="film-title">${film.Title}</h3>
                            </div>`;
                        }
                    });

                    filmsSection.innerHTML += output;

                    const films = document.querySelectorAll('.film');

                    films.forEach(film => {
                        film.addEventListener('mouseenter', getVideoInfo)
                        film.addEventListener('mouseleave', clearPopup);
                    });

                } else {
                    filmsSection.innerHTML = '<h3>No films found with that search. Please try again.</h3>'
                }
                
            }
        }
        xhr.send()
    }

    function clearPopup() {
        let popup = document.querySelector('.popup');
        let films = document.querySelectorAll('.film');
        films.forEach(film => {
            // Loop over each childNode of the films, and check if the popup div is in there. If it is, remove it.
            for(i in film.childNodes) {
                if(film.childNodes[i] === popup) {
                    film.removeChild(popup);
                }
            }
        });
    }

    function getVideoInfo(e) {
        let filmID = e.target.attributes[1].nodeValue;

        let popup = document.createElement('div');

        popup.classList += ' popup';

        xhr.open('GET', `http://www.omdbapi.com/?apikey=d70cba40&i=${filmID}&plot=full`, false)
        
        xhr.onload = function() {
            if(this.status === 200) {

                let filmInfo = JSON.parse(this.responseText);
                // console.log(filmInfo)

                let filmDetail = `<div class="">
                    <h4>${filmInfo.Plot}</h4>
                    <div class="film-info">
                        <p>Released: ${filmInfo.Released}</p>
                        <p>Length: ${filmInfo.Runtime}</p>
                        <p>Genre: ${filmInfo.Genre}</p>
                        <p>Actors: ${filmInfo.Actors}</p>
                    </div>
                
                </div>`
                // Set the html of the popup to the above div
                popup.innerHTML = filmDetail;
                // Append the popup to the currently hovered item
                e.target.appendChild(popup);
            }
        }

        xhr.send()
    }


});