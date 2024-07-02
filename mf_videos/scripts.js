document.getElementById('search-button').addEventListener('click', function() {
    const query = document.getElementById('search-input').value;
    if (query) {
        searchVideos(query);
    }
});

async function searchVideos(query) {
    try {
        const response = await fetch(`https://localhost:7161/api/Videos/search?query=${query}`, {
            mode: 'cors'
        });
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        const videos = await response.json();
        const videosList = document.getElementById('videos-list');
        videosList.innerHTML = '';
        videos.forEach(video => {
            const li = document.createElement('li');
            li.innerHTML = `
                <p class="title-list">${limitTitle(video.title, 5)}</p>
                <img src="${video.thumbnailUrl}" alt="${video.title}">
                <div class="favorite-section">
                    <img src="star-outline.svg" class="favorite-btn" alt="Favorite" onclick="toggleFavorite('${video.videoId}', this, '${video.title}', '${video.thumbnailUrl}')">
                    <span id="favorite-count-${video.videoId}" class="favorite-count">0</span>
                </div>
            `;
            videosList.appendChild(li);
        });
        updateFavoritesCount();
    } catch (error) {
        console.error('Fetch error: ', error);
    }
}

function limitTitle(title, maxWords) {
    const words = title.split(' ');
    if (words.length > maxWords) {
        return words.slice(0, maxWords).join(' ') + '...';
    }
    return title;
}

function toggleFavorite(videoId, img, videoTitle, thumbnailUrl) {
    const isFavorite = img.classList.contains('favorite');
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];

    if (isFavorite) {
        img.classList.remove('favorite');
        favorites = favorites.filter(video => video.id !== videoId);
    } else {
        img.classList.add('favorite');
        const favoriteVideo = { id: videoId, title: videoTitle, thumbnailUrl: thumbnailUrl };
        favorites.push(favoriteVideo);
    }

    localStorage.setItem('favorites', JSON.stringify(favorites));
    updateFavoritesCount();
}

function updateFavoritesCount() {
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    const favoritesCountElement = document.getElementById('favorites-count');
    if (favoritesCountElement) {
        favoritesCountElement.textContent = favorites.length;
    }

    document.querySelectorAll('.favorite-count').forEach(el => {
        const videoId = el.id.replace('favorite-count-', '');
        el.textContent = favorites.some(video => video.id === videoId) ? '1' : '0';
    });
}

document.addEventListener('DOMContentLoaded', function() {
    updateFavoritesCount();
});