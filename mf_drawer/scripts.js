document.addEventListener('DOMContentLoaded', function() {
    displayFavorites();
    updateFavoritesCount();
});

function displayFavorites() {
    const favoriteVideos = JSON.parse(localStorage.getItem('favorites')) || [];
    const favoritesList = document.getElementById('favorites-list');
    favoritesList.innerHTML = '';

    favoriteVideos.forEach(video => {
        const li = document.createElement('li');
        li.innerHTML = `
            <p class="title-list">${video.title}</p>
            <img src="${video.thumbnailUrl}" alt="${video.title}">
        `;
        favoritesList.appendChild(li);
    });
}

function updateFavoritesCount() {
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    const favoritesCountElement = document.getElementById('favorites-count');
    if (favoritesCountElement) {
        favoritesCountElement.textContent = favorites.length;
    }
}

document.getElementById('favorites-link').addEventListener('click', function(event) {
    event.preventDefault();
    displayFavorites();
});