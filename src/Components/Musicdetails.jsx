import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './Css/Music.css';

const MusicDetails = () => {
    const location = useLocation();
    const { songs } = location.state || {};

    const [playing, setPlaying] = useState(false);
    const [audio, setAudio] = useState(null);
    const [position, setPosition] = useState(0);
    const [duration, setDuration] = useState(0);
    let navigate = useNavigate()
    useEffect(() => {
        if (songs && songs.length > 0 && songs[0].preview_url) {
            const newAudio = new Audio(songs[0].preview_url);
            setAudio(newAudio);

            newAudio.addEventListener('loadedmetadata', () => {
                setDuration(newAudio.duration);
            });

            newAudio.addEventListener('timeupdate', () => {
                setPosition(newAudio.currentTime);
            });

            newAudio.addEventListener('ended', () => {
                setPlaying(false);
                setPosition(0);
            });

            return () => {
                newAudio.pause();
                newAudio.removeEventListener('loadedmetadata', () => { });
                newAudio.removeEventListener('timeupdate', () => { });
                newAudio.removeEventListener('ended', () => { });
                setAudio(null);
            };
        }
    }, [songs]);

    const togglePlay = () => {
        if (audio) {
            if (playing) {
                audio.pause();
            } else {
                audio.play();
            }
            setPlaying(!playing);
        }
    };

    const handleSliderChange = (e) => {
        const newTime = Number(e.target.value);
        if (audio) {
            audio.currentTime = newTime;
            setPosition(newTime);
        }
    };

    const formatTime = (time) => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
    };

    if (!songs || songs.length === 0) {
        return <div>No song details available</div>;
    }

    const track = songs[0];

    return (

        <div className="unique-music-details-container">
            <button className="back-to-home-button" onClick={() => navigate('/')}>
                Back to Home
            </button>

            <div className="unique-music-card">
                <div className="unique-album-art-container">
                    <img
                        src={track.album.images[0]?.url || "default-image.jpg"}
                        alt="Album Art"
                        className="unique-album-art"
                    />
                </div>
                <div className="unique-song-info">
                    <h1 className="unique-song-title">{track.name}</h1>
                    <p className="unique-artist-name">by {track.artists[0]?.name || "Unknown Artist"}</p>
                    <p className="unique-album-name">Album: {track.album.name || "Unknown Album"}</p>
                    <div className="unique-progress-container">
                        <input
                            type="range"
                            value={position}
                            min="0"
                            max={duration}
                            step="1"
                            onChange={handleSliderChange}
                            className="unique-progress-slider"
                        />
                        <div className="unique-time-info">
                            <span>{formatTime(position)}</span>
                            <span>{formatTime(duration)}</span>
                        </div>
                    </div>
                    <div className="unique-play-button-container">
                        <button className="unique-play-button" onClick={togglePlay}>
                            {playing ? (
                                <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="white" viewBox="0 0 24 24">
                                    <path d="M6 6h4v12H6zm8 0h4v12h-4z" />
                                </svg>
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="white" viewBox="0 0 24 24">
                                    <path d="M8 5v14l11-7z" />
                                </svg>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MusicDetails;