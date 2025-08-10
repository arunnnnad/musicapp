document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const musicContainer = document.querySelector('.music-player');
    const playBtn = document.querySelector('#play');
    const prevBtn = document.querySelector('#prev');
    const nextBtn = document.querySelector('#next');
    const audio = new Audio();
    const progress = document.querySelector('.progress');
    const progressContainer = document.querySelector('.progress-bar');
    const title = document.querySelector('#title');
    const artist = document.querySelector('#artist');
    const cover = document.querySelector('#cover');
    const currentTimeEl = document.querySelector('.current-time');
    const durationEl = document.querySelector('.duration');
    const volumeSlider = document.querySelector('#volume');
    const volumeIcon = document.querySelector('#volume-icon');
    const playlistContainer = document.querySelector('#playlist');
    
    // State variables
    let isPlaying = false;
    let currentSongIndex = 0;
    let volume = 0.7; // Default volume

    // Sample song list - in a real app, this could come from an API or user uploads
    const songs = [
        {
            title: 'Electric Chill',
            artist: 'Jacinto Design',
            coverUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8OHx8bXVzaWN8ZW58MHx8MHx8&w=1000&q=80',
            audioUrl: 'https://assets.codepen.io/210284/Anitek_-_Komorebi.mp3'
        },
        {
            title: 'Seven Nation Army',
            artist: 'The White Stripes',
            coverUrl: 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8bXVzaWMlMjBiYW5kfGVufDB8fDB8fA%3D%3D&w=1000&q=80',
            audioUrl: 'https://assets.codepen.io/210284/Canção_do_Mar.mp3'
        },
        {
            title: 'Rhythm of the Night',
            artist: 'Corona',
            coverUrl: 'https://images.unsplash.com/photo-1468164016595-6108e4c60c8b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTh8fG11c2ljfGVufDB8fDB8fA%3D%3D&w=1000&q=80',
            audioUrl: 'https://assets.codepen.io/210284/Broke_For_Free_-_01_-_As_Colorful_As_Ever.mp3'
        }
    ];

    // Initialize player
    function init() {
        // Set initial volume
        audio.volume = volume;
        updateVolumeIcon();
        
        // Load first song
        loadSong(songs[currentSongIndex]);
        
        // Build playlist
        buildPlaylist();
    }

    // Build playlist UI
    function buildPlaylist() {
        playlistContainer.innerHTML = '';
        
        songs.forEach((song, index) => {
            const li = document.createElement('li');
            li.classList.add('playlist-item');
            if (index === currentSongIndex) {
                li.classList.add('active');
            }
            
            li.innerHTML = `
                <div class="playlist-item-info">
                    <h4 class="playlist-item-title">${song.title}</h4>
                    <p class="playlist-item-artist">${song.artist}</p>
                </div>
            `;
            
            li.addEventListener('click', () => {
                currentSongIndex = index;
                loadSong(songs[currentSongIndex]);
                playSong();
            });
            
            playlistContainer.appendChild(li);
        });
    }

    // Load song details
    function loadSong(song) {
        title.textContent = song.title;
        artist.textContent = song.artist;
        cover.src = song.coverUrl;
        audio.src = song.audioUrl;
        
        // Update active song in playlist
        document.querySelectorAll('.playlist-item').forEach((item, index) => {
            if (index === currentSongIndex) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
    }

    // Play song
    function playSong() {
        musicContainer.classList.add('play');
        cover.classList.add('play');
        playBtn.querySelector('i').classList.remove('fa-play');
        playBtn.querySelector('i').classList.add('fa-pause');
        
        audio.play()
            .then(() => {
                isPlaying = true;
            })
            .catch(error => {
                console.error('Error playing audio:', error);
            });
    }

    // Pause song
    function pauseSong() {
        musicContainer.classList.remove('play');
        cover.classList.remove('play');
        playBtn.querySelector('i').classList.add('fa-play');
        playBtn.querySelector('i').classList.remove('fa-pause');
        
        audio.pause();
        isPlaying = false;
    }

    // Previous song
    function prevSong() {
        currentSongIndex--;
        
        if (currentSongIndex < 0) {
            currentSongIndex = songs.length - 1;
        }
        
        loadSong(songs[currentSongIndex]);
        playSong();
        buildPlaylist();
    }

    // Next song
    function nextSong() {
        currentSongIndex++;
        
        if (currentSongIndex > songs.length - 1) {
            currentSongIndex = 0;
        }
        
        loadSong(songs[currentSongIndex]);
        playSong();
        buildPlaylist();
    }

    // Format time in minutes and seconds
    function formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = Math.floor(seconds % 60);
        return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
    }

    // Update progress bar
    function updateProgress(e) {
        const { duration, currentTime } = e.srcElement;
        
        // Update progress bar width
        const progressPercent = (currentTime / duration) * 100;
        progress.style.width = `${progressPercent}%`;
        
        // Update time displays
        currentTimeEl.textContent = formatTime(currentTime);
        
        // Only update duration if it's a valid number (sometimes it's NaN initially)
        if (!isNaN(duration)) {
            durationEl.textContent = formatTime(duration);
        }
    }

    // Set progress bar on click
    function setProgress(e) {
        const width = this.clientWidth;
        const clickX = e.offsetX;
        const duration = audio.duration;
        
        audio.currentTime = (clickX / width) * duration;
    }

    // Update volume
    function updateVolume() {
        volume = volumeSlider.value;
        audio.volume = volume;
        updateVolumeIcon();
    }

    // Update volume icon based on current volume
    function updateVolumeIcon() {
        volumeIcon.className = '';
        
        if (volume > 0.7) {
            volumeIcon.className = 'fa-solid fa-volume-high';
        } else if (volume > 0.1) {
            volumeIcon.className = 'fa-solid fa-volume-low';
        } else if (volume > 0) {
            volumeIcon.className = 'fa-solid fa-volume-off';
        } else {
            volumeIcon.className = 'fa-solid fa-volume-xmark';
        }
    }

    // Toggle mute when clicking on volume icon
    function toggleMute() {
        if (audio.volume > 0) {
            // Store current volume before muting
            volumeSlider.dataset.prevVolume = audio.volume;
            audio.volume = 0;
            volumeSlider.value = 0;
        } else {
            // Restore previous volume or set to default
            const prevVolume = volumeSlider.dataset.prevVolume || 0.7;
            audio.volume = prevVolume;
            volumeSlider.value = prevVolume;
        }
        
        updateVolumeIcon();
    }

    // Event listeners
    playBtn.addEventListener('click', () => {
        isPlaying ? pauseSong() : playSong();
    });

    // Change song events
    prevBtn.addEventListener('click', prevSong);
    nextBtn.addEventListener('click', nextSong);

    // Time and progress update
    audio.addEventListener('timeupdate', updateProgress);
    progressContainer.addEventListener('click', setProgress);

    // Song ends
    audio.addEventListener('ended', nextSong);

    // Volume controls
    volumeSlider.addEventListener('input', updateVolume);
    volumeIcon.addEventListener('click', toggleMute);

    // Keyboard controls
    document.addEventListener('keydown', (e) => {
        switch (e.key) {
            case ' ':  // Space - Play/Pause
                e.preventDefault();
                isPlaying ? pauseSong() : playSong();
                break;
            case 'ArrowRight':  // Right arrow - Next song
                nextSong();
                break;
            case 'ArrowLeft':  // Left arrow - Previous song
                prevSong();
                break;
            case 'ArrowUp':  // Up arrow - Volume up
                e.preventDefault();
                volume = Math.min(1, volume + 0.05);
                volumeSlider.value = volume;
                updateVolume();
                break;
            case 'ArrowDown':  // Down arrow - Volume down
                e.preventDefault();
                volume = Math.max(0, volume - 0.05);
                volumeSlider.value = volume;
                updateVolume();
                break;
        }
    });

    // Initialize
    init();
});