import React, { useEffect } from 'react';
import PlayGroup from '@root/public/assets/icons/PlayGroup.svg';
import Down from '@root/public/assets/icons/Down.svg';
import TrashBox from '@root/public/assets/icons/TrashBox.svg';
import Text from '@/components/atoms/Text/Text';
import IconButton from '@/components/atoms/IconButton/IconButton';
import GroupSongList from '@/components/organisms/GroupSongList/GroupSongList';
import { BasicSong, LandmarkSong } from '@/types/songs';
import useToggle from '@/hooks/useToggle';
import { deleteGroupFromPlayListApi } from '@/utils/api/playlists';
import useFetchPlaylist from '@/hooks/player/useFetchPlaylist';
import CustomToast from '@/components/atoms/CustomToast/CustomToast';
import { ToastStyles } from '@/types/styles.d';
import SongGroupContainer from './style';

interface ISongGroupProps {
	groupName: string;
	landmarkId?: number;
	songs: BasicSong[] | LandmarkSong[];
	isBasicGroup?: boolean;
	editMode?: boolean;
}

function SongGroup(props: ISongGroupProps) {
	const { groupName, landmarkId = -1, songs, isBasicGroup = false, editMode = false } = props;
	const { fetchData } = useFetchPlaylist();
	const [toggle, setToggle] = useToggle(false);

	const removeSongGroup = async () => {
		if (!window.confirm(`'${groupName}' 그룹 재생목록을 삭제하시겠습니까?`)) return;

		try {
			const response = await deleteGroupFromPlayListApi(landmarkId);
			console.log(response);

			if (response.status === 200) {
				fetchData();
				CustomToast(ToastStyles.success, `'${groupName}' 그룹을 삭제했습니다.`);
			}
		} catch (error) {
			console.error(error);
		}
	};

	useEffect(() => {
		const foldAll = () => {
			if (!toggle) setToggle();
		};
		window.addEventListener('foldAll', foldAll);

		return () => window.removeEventListener('foldAll', foldAll);
	}, []);

	return (
		<SongGroupContainer $isFold={toggle}>
			<div id="group-header">
				<div id="group-info">
					<Text text={groupName} fontSize={16} />
					<Text text={`${songs.length} / ${isBasicGroup ? 999 : 99}`} color="gray" />
				</div>
				<div id="group-control">
					<IconButton Icon={<PlayGroup />} color="black300" onClick={() => alert('play group')} size="s" />
					<IconButton id="fold-btn" Icon={<Down />} color="black300" onClick={setToggle} size="s" />
					{editMode ? <IconButton Icon={<TrashBox />} color="danger" onClick={removeSongGroup} size="s" /> : <></>}
				</div>
			</div>
			<div id="group-songs">
				<GroupSongList songs={songs || []} isBasicGroup />
			</div>
		</SongGroupContainer>
	);
}

export default SongGroup;