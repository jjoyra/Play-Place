import PlayListHeader from '@/components/molecules/player/PlayListHeader/PlayListHeader';
import { LandmarkGroup } from '@/types/play';
import Text from '@/components/atoms/Text/Text';
import useFetchPlaylist from '@/hooks/player/useFetchPlaylist';
import { useEffect } from 'react';
import ArrowButton from '@/components/atoms/ArrowButton/ArrowButton';
import { useRecoilState } from 'recoil';
import { playModalState } from '@/recoil/play';
import { useRouter } from 'next/navigation';
import useToggle from '@/hooks/useToggle';
import useLocalStorage from '@/hooks/useLocalStorage';
import PlayListContainer from './style';
import SongGroup from '../SongGroup/SongGroup';
import SongGroupAreaHeader from '../SongGroupAreaHeader/SongGroupAreaHeader';

function PlayList() {
	const { basicSongs, landmarkGroups, fetchData } = useFetchPlaylist();
	const [, setPlayModal] = useRecoilState(playModalState);
	const [editMode, toggleEditMode] = useToggle(false);
	const router = useRouter();
	const localStorage = useLocalStorage();

	const handleClick = (path: string) => {
		router.push(`/${path}`);
		setPlayModal('none');
	};

	useEffect(() => {
		if (localStorage?.getItem('accessToken')) {
			fetchData();
		}
	}, [localStorage]);

	return (
		<PlayListContainer>
			<div id="playlist-header">
				<PlayListHeader />
			</div>
			<div id="basic-song-group">
				<SongGroupAreaHeader groupAreaName="기본 그룹" isBasicGroup />
				{basicSongs.length ? (
					<SongGroup groupName="기본" songs={basicSongs} isBasicGroup />
				) : (
					<>
						<Text text="재생목록이 비어있어요. 추가할 곡을 검색하세요!" color="gray" fontSize={14} />
						<ArrowButton text="음악 검색 바로가기 > " onClick={() => handleClick('/search')} />
					</>
				)}
			</div>
			<div id="landmark-song-groups">
				<SongGroupAreaHeader groupAreaName="랜드마크 그룹" setEditMode={toggleEditMode} editMode={editMode} />
				{/* TODO : 랜드마크 만큼 map 돌리기 */}
				{landmarkGroups.length ? (
					landmarkGroups.map((l: LandmarkGroup) => (
						<SongGroup
							key={l.landmarkId}
							userLandmarkGroupId={l.userLandmarkGroupId}
							groupName={l.title}
							songs={l.landmarkSongs}
							editMode={editMode}
							toggleEditMode={toggleEditMode}
						/>
					))
				) : (
					// TODO : 더 이쁘게 바꾸기
					<>
						<Text text="플레이맵에서 랜드마크 그룹을 추가하세요!" color="gray" fontSize={14} />
						<ArrowButton text="플레이맵 바로가기 > " onClick={() => handleClick('/map')} />
					</>
				)}
			</div>
		</PlayListContainer>
	);
}

export default PlayList;
