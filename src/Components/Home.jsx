import React, { useState, useEffect } from 'react';
import './Css/Home.css';
import { waveform } from 'ldrs';
import { useNavigate } from 'react-router-dom';

waveform.register();

const Home = () => {
    let go = useNavigate();

    const [search, setSearch] = useState(localStorage.getItem('userSearch') || "");
    const [tracks, setTracks] = useState([]);
    const [currentTrack, setCurrentTrack] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentPlayingIndex, setCurrentPlayingIndex] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [history, setHistory] = useState([]);

    useEffect(() => {
        const playedHistory = JSON.parse(localStorage.getItem('playedHistory')) || [];
        setHistory(playedHistory);

        if (search) {
            fetchTracks();
        }
    }, [search]);

    const handleInputChange = (e) => {
        const newSearch = e.target.value;
        setSearch(newSearch);
        localStorage.setItem('userSearch', newSearch);
    };

    const fetchTracks = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(
                `https://v1.nocodeapi.com/nikhilsharma1302/spotify/lGOpCYpXpTIQiYHN/search?q=${search}&type=track`
            );
            const data = await response.json();
            console.log(data);

            if (data?.tracks?.items) {
                setTracks(data.tracks.items);
            } else {
                setTracks([]);
            }
        } catch (error) {
            console.error("Error fetching tracks:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const btndabana = (e) => {
        if (e.key === 'Enter') {
            fetchTracks();
        }
    };

    const MusicDetails = (track) => {
        if (currentTrack) {
            currentTrack.pause();
            setIsPlaying(false);
            setCurrentPlayingIndex(null);
        }
        go("/Musicdetails", { state: { songs: [track] } });
    };

    const playTrack = (previewUrl, index, track) => {
        if (currentTrack) {
            currentTrack.pause();
            setIsPlaying(false);
        }

        const audio = new Audio(previewUrl);
        audio.play();
        setCurrentTrack(audio);
        setIsPlaying(true);
        setCurrentPlayingIndex(index);

        audio.onended = () => {
            setIsPlaying(false);
            setCurrentPlayingIndex(null);
        };

        const playedHistory = JSON.parse(localStorage.getItem('playedHistory')) || [];

        if (!playedHistory.some(item => item.id === track.id)) {
            playedHistory.push(track);
        }
 
        if (playedHistory.length > 10) {
            playedHistory.shift();   
        }

        localStorage.setItem('playedHistory', JSON.stringify(playedHistory));
        setHistory(playedHistory);   
    };

    const pauseTrack = () => {
        if (currentTrack) {
            currentTrack.pause();
            setIsPlaying(false);
            setCurrentPlayingIndex(null);
        }
    };

    return (
        <div className="music-container">
            <div className="search-bar">
                <input
                    type="text"
                    placeholder="Search for a song..."
                    value={search}
                    onKeyPress={btndabana}
                    onChange={handleInputChange}
                    className="search-input"
                />
                <button onClick={fetchTracks} className="search-button">
                    Search
                </button>
            </div>

            {isLoading ? (
                <l-waveform
                    size="50"
                    stroke="3.5"
                    speed="1.2"
                    color="white"
                    className="py-5"
                ></l-waveform>
            ) : (
                <div className="music-card1">
                    {tracks.length > 0 ? (
                        tracks.map((track, index) => (
                            <div key={track.id} className="song-item">
                                <img
                                    src={track.album.images[1]?.url || "default-image.jpg"}
                                    alt="Album Art"
                                    className="album-art1"
                                    onClick={() => MusicDetails(track)}
                                />
                                <div className="song-details1">
                                    <h2 className="song-title1">{track.name}</h2>
                                    <p className="song-artist1">{track.artists[0].name}</p>
                                    <p className="song-album1">{track.album.name}</p>
                                </div>
                                {track.preview_url && index === currentPlayingIndex ? (
                                    <button
                                        className="play-button"
                                        onClick={() => {
                                            if (isPlaying) {
                                                pauseTrack();
                                            } else {
                                                playTrack(track.preview_url, index, track);
                                            }
                                        }}
                                    >
                                        {isPlaying ? (
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="white" viewBox="0 0 24 24">
                                                <path d="M6 6h12v12H6z" />
                                            </svg>
                                        ) : (
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="white" viewBox="0 0 24 24">
                                                <path d="M8 5v14l11-7z" />
                                            </svg>
                                        )}
                                    </button>
                                ) : (
                                    track.preview_url && (
                                        <button
                                            className="play-button"
                                            onClick={() => playTrack(track.preview_url, index, track)}
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="white" viewBox="0 0 24 24">
                                                <path d="M8 5v14l11-7z" />
                                            </svg>
                                        </button>
                                    )
                                )}
                            </div>
                        ))
                    ) : (
                        <p className='py-5 ms-auto'>No results found for your search</p>
                    )}
                </div>
            )}

            {!search && history.length > 0 && (
                <div className="history-section py-5">
                    <h2>Recently Played<span className='heading'> Songs</span></h2>
                    <div className="music-card1">
                        {history.map((track, index) => (
                            <div key={track.id} className="song-item">
                                <img
                                    src={track.album.images[1]?.url || "default-image.jpg"}
                                    alt="Album Art"
                                    className="album-art1"
                                    onClick={() => MusicDetails(track)}
                                />
                                <div className="song-details1">
                                    <h2 className="song-title1">{track.name}</h2>
                                    <p className="song-artist1">{track.artists[0].name}</p>
                                    <p className="song-album1">{track.album.name}</p>
                                </div>
                                {track.preview_url && index === currentPlayingIndex ? (
                                    <button
                                        className="play-button"
                                        onClick={() => {
                                            if (isPlaying) {
                                                pauseTrack();
                                            } else {
                                                playTrack(track.preview_url, index, track);
                                            }
                                        }}
                                    >
                                        {isPlaying ? (
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="white" viewBox="0 0 24 24">
                                                <path d="M6 6h12v12H6z" />
                                            </svg>
                                        ) : (
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="white" viewBox="0 0 24 24">
                                                <path d="M8 5v14l11-7z" />
                                            </svg>
                                        )}
                                    </button>
                                ) : (
                                    track.preview_url && (
                                        <button
                                            className="play-button"
                                            onClick={() => playTrack(track.preview_url, index, track)}
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="white" viewBox="0 0 24 24">
                                                <path d="M8 5v14l11-7z" />
                                            </svg>
                                        </button>
                                    )
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Home;
