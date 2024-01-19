'use client';

import useFetchPlaylist from '@/hooks/player/useFetchPlaylist';
import usePlayer from '@/hooks/player/usePlayer';
import useLocalStorage from '@/hooks/useLocalStorage';
import { isNowPlayState, nowPlaySongState, playbackState } from '@/recoil/play';
import { SaveSongRecordApiBody, UpdatePlayTimeApiBody } from '@/types/api';
import { PlaybackType } from '@/types/play';
import { BasicSong, LandmarkSong, Song } from '@/types/songs';
import { getLatestSongApi, saveNowPlaySongApi, saveSongRecordApi, updatePlayTimeApi } from '@/utils/api/songs';
import { useEffect, useRef } from 'react';
import YouTube, { YouTubeProps } from 'react-youtube';
import { useRecoilState } from 'recoil';

function PlayBack() {
	const localStorage = useLocalStorage();
	const [isNowPlay, setIsNowPlay] = useRecoilState(isNowPlayState);
	const [, setPlayback] = useRecoilState(playbackState);
	const [nowPlaySong, setNowPlaySong] = useRecoilState(nowPlaySongState);
	const { fetchData } = useFetchPlaylist();
	const playbackRef = useRef<PlaybackType | null>(null); // YouTube 플레이어 참조
	const { playNextSong } = usePlayer();

	const opts = {
		width: '0',
		height: '0',
		playerVar: {},
	};

	const saveSongRecord = async () => {
		try {
			const data = window.AndMap.getLastKnownLocation();

			if (data) {
				const location = JSON.parse(data);

				if (!nowPlaySong || nowPlaySong.songId === -1) return;
				const body: SaveSongRecordApiBody = {
					songId: nowPlaySong?.songId,
					lat: location.lat,
					lon: location.lng,
				};

				await saveSongRecordApi(body);
			}
		} catch (error) {
			console.log(error);
		}
	};

	// 재생시간 갱신
	const updatePlayTime = async () => {
		if (nowPlaySong?.playTime === -1) {
			try {
				if (nowPlaySong) {
					const duration = await playbackRef.current?.internalPlayer.getDuration();
					const body: UpdatePlayTimeApiBody = {
						youtubeId: nowPlaySong?.youtubeId,
						playTime: duration.toFixed(),
					};
					const response = await updatePlayTimeApi(body);
					if (response.status === 200) {
						fetchData();
					}
				}
			} catch (error) {
				console.error(error);
			}
		}
	};

	// 가장 마지막에 재생한 곡 업데이트
	const fetchLatestSongData = async () => {
		try {
			const response = await getLatestSongApi();
			if (response.status === 200) {
				if (response.data.landmark) {
					const song: LandmarkSong = {
						...response.data,
						landmarkSongId: response.data.playListSongId,
					};
					setNowPlaySong(song);
				} else {
					const song: BasicSong = {
						...response.data,
						basicSongId: response.data.playListSongId,
					};
					setNowPlaySong(song);
				}
			} else if (response.status === 204) {
				const emptySong: Song = {
					title: '현재 재생중인 곡이 없습니다.',
					artist: '',
					albumImg: '',
					playTime: 0,
					songId: -1,
					youtubeId: '',
				};
				setNowPlaySong(emptySong);
			}
		} catch (error) {
			console.error(error);
		}
	};

	const onPlayerReady: YouTubeProps['onReady'] = (event) => {
		setPlayback(event.target);
		if (isNowPlay) event.target.playVideo();
	};

	const onPlay: YouTubeProps['onPlay'] = async (event) => {
		setTimeout(saveSongRecord, 10000);
		setPlayback(event.target);
		setIsNowPlay(true);

		let isLandmark = false;
		let playlistSongId = -1;

		if (nowPlaySong) {
			if ('landmarkSongId' in nowPlaySong) {
				isLandmark = true;
				playlistSongId = nowPlaySong.landmarkSongId as number;
			} else if ('basicSongId' in nowPlaySong) {
				isLandmark = false;
				playlistSongId = nowPlaySong.basicSongId as number;
			}
		}

		try {
			if (playlistSongId !== -1) {
				await saveNowPlaySongApi({ isLandmark, playlistSongId });
			}
		} catch (error) {
			console.error(error);
		}
		updatePlayTime();
	};

	const onPause: YouTubeProps['onPause'] = () => {
		setIsNowPlay(false);
	};

	const onEnd: YouTubeProps['onEnd'] = () => {
		playNextSong();
	};

	useEffect(() => {
		if (localStorage?.getItem('accessToken')) fetchLatestSongData();
	}, [localStorage]);

	return (
		<YouTube
			key={nowPlaySong?.youtubeId}
			videoId={nowPlaySong?.youtubeId}
			opts={opts}
			ref={playbackRef}
			onReady={onPlayerReady}
			onPlay={onPlay}
			onPause={onPause}
			onEnd={onEnd}
		/>
	);
}

export default PlayBack;
