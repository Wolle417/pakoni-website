const IMAGE_FOLDER = './images/';

const IMAGE_NAMES = [
    'freepik__vintage-black-and-white-illustration-1900s-magic-s__51082.jpg',
    'freepik__vintage-black-and-white-illustration-1900s-magic-s__51083.jpg',
    'freepik__vintage-black-and-white-illustration-1900s-magic-s__51084.jpg',
    'freepik__vintage-black-and-white-illustration-1900s-magic-s__51085.jpg',
    'freepik__vintage-black-and-white-illustration-1900s-magic-s__51086.jpg',
    'freepik__vintage-black-and-white-illustration-1900s-magic-s__51087.jpg',
    'freepik__vintage-black-and-white-illustration-1900s-magic-s__51088.jpg',
    'freepik__vintage-black-and-white-illustration-1900s-magic-s__51089.jpg',
    'freepik__vintage-black-and-white-illustration-1900s-magic-s__51090.jpg',
    'freepik__vintage-black-and-white-illustration-1900s-magic-s__51091.jpg',
    'freepik__vintage-black-and-white-illustration-1900s-magic-s__51092.jpg',
    'freepik__vintage-black-and-white-illustration-1900s-magic-s__51093.jpg',
    'freepik__vintage-black-and-white-illustration-1900s-magic-s__51094.jpg',
    'freepik__vintage-black-and-white-illustration-1900s-magic-s__51095.jpg',
    'freepik__vintage-black-and-white-illustration-1900s-magic-s__51096.jpg',
    'freepik__vintage-black-and-white-illustration-1900s-magic-s__51097.jpg'
];

const MUSIC_FOLDER = './music/';
const MUSIC_FILES = [
    'track1.mp3',
    'track2.mp3',
    'track3.mp3'
];

let currentTrackIndex = 0;
let musicPlaying = false;
let currentImagePool = [];
let collageItems = [];

function shuffle(array) {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

function getRandomImage() {
    if (currentImagePool.length === 0) {
        currentImagePool = shuffle([...IMAGE_NAMES]);
    }
    return currentImagePool.pop();
}

// === VIDEO ANIMATION ===
function initVideoAnimation() {
    const videos = document.querySelectorAll('.hero-profile, .nav-profile-img');
    
    videos.forEach(video => {
        // Langsame Geschwindigkeit - 10s Video wird zu 33s
        video.playbackRate = 0.3; // 30% Geschwindigkeit
        
        video.pause();
        video.currentTime = 0;
        
        // Video spielt alle 20 Sekunden komplett durch (33s bei 0.3x Speed)
        setInterval(() => {
            video.currentTime = 0;
            video.play();
            setTimeout(() => {
                video.pause();
                video.currentTime = 0;
            }, 33000); // 10s * (1/0.3) = ~33 Sekunden
        }, 45000); // Alle 45 Sekunden
    });
}

// === COLLAGE ===
function createCollage() {
    const grid = document.getElementById('collage-grid');
    
    // Mobile: 9 Bilder (3x3), Desktop: 6 Bilder (3x2)
    const isMobile = window.innerWidth <= 768;
    const imageCount = isMobile ? 9 : 6;
    
    for (let i = 0; i < imageCount; i++) {
        const item = document.createElement('div');
        item.className = 'collage-item';
        
        const img1 = document.createElement('img');
        img1.src = IMAGE_FOLDER + getRandomImage();
        img1.className = 'collage-img base';
        
        const img2 = document.createElement('img');
        img2.src = IMAGE_FOLDER + getRandomImage();
        img2.className = 'collage-img overlay';
        img2.style.opacity = '0';
        
        item.appendChild(img1);
        item.appendChild(img2);
        grid.appendChild(item);
        
        collageItems.push({ base: img1, overlay: img2, showingOverlay: false });
    }
    
    setTimeout(() => startImageRotation(), 4000);
}

function changeImage(index) {
    const item = collageItems[index];
    const newImageSrc = IMAGE_FOLDER + getRandomImage();
    
    // Remove alle vorherigen Animations-Klassen
    item.base.classList.remove('fadeIn', 'fadeOut');
    item.overlay.classList.remove('fadeIn', 'fadeOut');
    
    if (!item.showingOverlay) {
        // Fade TO overlay
        item.overlay.src = newImageSrc;
        item.overlay.style.opacity = '1';
        item.overlay.classList.add('fadeIn');
        item.base.classList.add('fadeOut');
        item.showingOverlay = true;
    } else {
        // Fade TO base
        item.base.src = newImageSrc;
        item.base.style.opacity = '1';
        item.base.classList.add('fadeIn');
        item.overlay.classList.add('fadeOut');
        item.showingOverlay = false;
    }
}

function startImageRotation() {
    setInterval(() => {
        const randomIndex = Math.floor(Math.random() * collageItems.length);
        changeImage(randomIndex);
    }, 8000);
}

// === MUSIC PLAYER ===
function initMusicPlayer() {
    const audio = document.getElementById('background-music');
    const toggleBtn = document.getElementById('music-toggle');
    
    // Alle Tracks in Array
    let playlist = [...MUSIC_FILES];
    let currentIndex = 0;
    
    // Shuffle Funktion direkt hier
    function shufflePlaylist() {
        for (let i = playlist.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [playlist[i], playlist[j]] = [playlist[j], playlist[i]];
        }
        currentIndex = 0;
        console.log('Shuffled playlist:', playlist);
    }
    
    // Initial shuffle
    shufflePlaylist();
    
    // Ersten Track laden
    audio.src = MUSIC_FOLDER + playlist[currentIndex];
    audio.volume = 0.3;
    console.log('Loading first track:', playlist[currentIndex]);
    
    // Toggle Button
    toggleBtn.addEventListener('click', () => {
        if (musicPlaying) {
            audio.pause();
            toggleBtn.textContent = '🔇 Music';
            toggleBtn.classList.add('off');
            musicPlaying = false;
        } else {
            audio.play().catch(e => console.log('Play error:', e));
            toggleBtn.textContent = '🔊 Music';
            toggleBtn.classList.remove('off');
            musicPlaying = true;
        }
    });
    
    // Wenn Track zu Ende ist
    audio.addEventListener('ended', () => {
        console.log('Track ended:', playlist[currentIndex]);
        currentIndex++;
        
        // Wenn alle durch, neu shufflen
        if (currentIndex >= playlist.length) {
            console.log('All tracks played, reshuffling...');
            shufflePlaylist();
        }
        
        // Nächsten Track laden
        audio.src = MUSIC_FOLDER + playlist[currentIndex];
        console.log('Next track:', playlist[currentIndex]);
        
        // Weiterspielen wenn Musik an war
        if (musicPlaying) {
            audio.play().catch(e => console.log('Play error:', e));
        }
    });
    
    // Autoplay versuchen
    audio.play().then(() => {
        musicPlaying = true;
        toggleBtn.textContent = '🔊 Music';
        toggleBtn.classList.remove('off');
        console.log('Autoplay successful');
    }).catch(() => {
        musicPlaying = false;
        toggleBtn.textContent = '▶ Play Music';
        toggleBtn.classList.remove('off');
        console.log('Autoplay blocked');
    });
}

// === INIT ===
document.addEventListener('DOMContentLoaded', () => {
    initVideoAnimation();
    createCollage();
    initMusicPlayer();
    initHamburgerMenu();
});

// === HAMBURGER MENU ===
function initHamburgerMenu() {
    const hamburger = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobile-menu');
    
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        mobileMenu.classList.toggle('active');
    });
    
    // Close menu when clicking a link
    const links = mobileMenu.querySelectorAll('a');
    links.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            mobileMenu.classList.remove('active');
        });
    });
}