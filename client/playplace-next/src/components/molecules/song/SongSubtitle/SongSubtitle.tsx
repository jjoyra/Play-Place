import React from 'react';
import SongSubtitleContainer from './style';
import Text from '../../../atoms/Text/Text';

interface SongSubtitleProps {
	colorSubtitle: string;
	normalSubtitle: string;
}
function SongSubtitle(props: SongSubtitleProps) {
	const { colorSubtitle, normalSubtitle } = props;
	return (
		<SongSubtitleContainer>
			<Text text={colorSubtitle} color="gradientOrange" fontSize={18} $overflowHidden={false} />
			<Text text={normalSubtitle} color="default" fontSize={18} $overflowHidden={false} />
		</SongSubtitleContainer>
	);
}

export default SongSubtitle;
