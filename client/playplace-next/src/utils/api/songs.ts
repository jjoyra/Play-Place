import {
	HomeApiBody,
	SaveNowPlaySongApiBody,
	SaveSongLikeToggleApiBody,
	SaveSongRecordApiBody,
	SaveSongToPlaylistApiBody,
	UpdatePlayTimeApiBody,
} from '@/types/api';
import http from './http';

/**
 * 가장 최근에 재생한 노래 정보
 */
export const getLatestSongApi = () => {
	const response = http.get('/songs');
	return response;
};

/**
 * 내 재생목록에 음악 추가
 */
export const saveSongToPlaylistApi = (body: SaveSongToPlaylistApiBody) => {
	const response = http.post('/songs', body);
	return response;
};

/**
 * 현재 재생중인 기록하기 (1분이상 들었을 때)
 */
export const saveSongRecordApi = (body: SaveSongRecordApiBody) => {
	const response = http.post('/songs/history', body);
	return response;
};

/**
 * 노래 재생 시 호출하기
 */
export const saveNowPlaySongApi = (body: SaveNowPlaySongApiBody) => {
	const response = http.post('/songs/play', body);
	return response;
};

/**
 * 노래 재생 시 호출하기
 */
export const updatePlayTimeApi = (body: UpdatePlayTimeApiBody) => {
	const response = http.put('/songs/play', body);
	return response;
};

/**
 * 좋아요 여부 조회하기
 */
export const getSongLike = (songId: number) => {
	const response = http.get(`/songs/like/${songId}`);
	return response;
};

/**
 * 좋아요 / 좋아요 취소
 */
export const saveSongLikeToggleApi = (body: SaveSongLikeToggleApiBody) => {
	const response = http.post('/songs/like', body);
	return response;
};

export const searchSongApi = (searchWord: string) => {
	const response = http.get(`/songs/search/${searchWord}`);
	return response;
};

export const postLocateSongsApi = (body: HomeApiBody) => {
	const response = http.post('/home/area', body);
	return response;
};

export const postWeatherSongApi = (body: HomeApiBody) => {
	const response = http.post('/home/weather', body);
	return response;
};

export const postTimezoneSongApi = () => {
	const response = http.post('/home/timezone');
	return response;
};

export const postVillageApi = (body: HomeApiBody) => {
	const response = http.post('/home/village', body);
	return response;
};
