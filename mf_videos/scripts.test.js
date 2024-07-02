const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

const html = fs.readFileSync(path.resolve(__dirname, 'index.html'), 'utf8');

let dom;
let document;

beforeEach(() => {
    dom = new JSDOM(html, { runScripts: 'dangerously' });
    document = dom.window.document;
    global.document = document;
    global.window = dom.window;
    global.localStorage = {
        getItem: jest.fn(),
        setItem: jest.fn(),
    };
});

test('truncateTitle should truncate title if it exceeds maxWords', () => {
    const { truncateTitle } = require('./scripts');
    const title = 'This is a very long title that should be truncated';
    const truncatedTitle = truncateTitle(title, 5);
    expect(truncatedTitle).toBe('This is a very long title...');
});

test('toggleFavorite should add video to favorites if not already favorite', () => {
    const { toggleFavorite } = require('./scripts');
    const videoId = '123';
    const videoTitle = 'Sample Video';
    const thumbnailUrl = 'sample.jpg';

    localStorage.getItem.mockReturnValue(JSON.stringify([]));

    const img = document.createElement('img');
    toggleFavorite(videoId, img, videoTitle, thumbnailUrl);

    expect(localStorage.setItem).toHaveBeenCalledWith('favorites', JSON.stringify([{ id: videoId, title: videoTitle, thumbnailUrl }]));
});

test('toggleFavorite should remove video from favorites if already favorite', () => {
    const { toggleFavorite } = require('./scripts');
    const videoId = '123';
    const videoTitle = 'Sample Video';
    const thumbnailUrl = 'sample.jpg';

    localStorage.getItem.mockReturnValue(JSON.stringify([{ id: videoId, title: videoTitle, thumbnailUrl }]));

    const img = document.createElement('img');
    img.classList.add('favorite');
    toggleFavorite(videoId, img, videoTitle, thumbnailUrl);

    expect(localStorage.setItem).toHaveBeenCalledWith('favorites', JSON.stringify([]));
});

test('updateFavoritesCount should correctly update the favorites count', () => {
    const { updateFavoritesCount } = require('./scripts');
    const favoritesCountElement = document.getElementById('favorites-count');
    localStorage.getItem.mockReturnValue(JSON.stringify([{ id: '123' }, { id: '456' }]));

    updateFavoritesCount();

    expect(favoritesCountElement.textContent).toBe('2');
});