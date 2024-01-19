'use client';

import { HeaderStyles } from '@/types/styles.d';
import LogoIcon from '@root/public/assets/icons/Logo.svg';
import BackArrowIcon from '@root/public/assets/icons/BackArrow.svg';
import { HEADER_LIST } from '@/constants/common';
import { useRouter } from 'next/navigation';
import { useRecoilState } from 'recoil';
import chatbotModalState from '@/recoil/chatbot';
import { HeaderLeftItemContainer, Title } from './style';

interface HeaderLeftItemProps {
	$headerType: HeaderStyles;
	location?: string | null;
	pageName?: string | null;
	handler?: () => void;
}

function HeaderLeftItem(props: HeaderLeftItemProps) {
	const { $headerType, location, pageName, handler } = props;
	const router = useRouter();
	const [, chatbotModal] = useRecoilState(chatbotModalState);

	const handleMoveBack = () => {
		router.back();
	};

	if ($headerType === HeaderStyles.home && location) {
		return (
			<HeaderLeftItemContainer>
				<LogoIcon />
				<Title>{location}</Title>
			</HeaderLeftItemContainer>
		);
	}

	if ($headerType === HeaderStyles.map && pageName && handler) {
		return (
			<HeaderLeftItemContainer>
				<button type="button" onClick={handler}>
					<BackArrowIcon />
				</button>
				<Title>{pageName}</Title>
			</HeaderLeftItemContainer>
		);
	}

	if ($headerType === HeaderStyles.back && pageName) {
		return (
			<HeaderLeftItemContainer>
				<button type="button" onClick={handleMoveBack}>
					<BackArrowIcon />
				</button>
				<Title>{pageName}</Title>
			</HeaderLeftItemContainer>
		);
	}

	if ($headerType === HeaderStyles.playlist) {
		return (
			<HeaderLeftItemContainer>
				<button type="button" onClick={handleMoveBack}>
					<BackArrowIcon />
				</button>
				<Title>{HEADER_LIST[`${$headerType}`]}</Title>
			</HeaderLeftItemContainer>
		);
	}

	if ($headerType === HeaderStyles.chatbot) {
		return (
			<HeaderLeftItemContainer>
				<button type="button" onClick={() => chatbotModal(false)}>
					<BackArrowIcon />
				</button>
				<Title>{HEADER_LIST[`${$headerType}`]}</Title>
			</HeaderLeftItemContainer>
		);
	}

	return (
		<HeaderLeftItemContainer>
			<Title>{HEADER_LIST[`${$headerType}`]}</Title>
		</HeaderLeftItemContainer>
	);
}

export default HeaderLeftItem;
