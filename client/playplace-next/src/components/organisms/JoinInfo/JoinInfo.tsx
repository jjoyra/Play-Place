'use client';

import { JoinInfoType } from '@/types/auth';
import { joinApi } from '@/utils/api/auth';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Button from '@/components/atoms/Button/Button';
import { ButtonStyles, ToastStyles } from '@/types/styles.d';

import { AxiosHeaders } from 'axios';
import ContentLayout from '@/components/templates/layout/ContentLayout/ContentLayout';
import EmojiList from '@/components/molecules/EmojiList/EmojiList';
import Text from '@/components/atoms/Text/Text';
import CustomToast from '@/components/atoms/CustomToast/CustomToast';
import NicknameContainer from './style';

interface JoinInfoProps {
	email: string;
	googleToken: string;
}

function JoinInfo(props: JoinInfoProps) {
	const { email, googleToken } = props;
	const router = useRouter();
	const [nickname, setNickname] = useState<string | null>(null);
	const [profileImg, setProfileImg] = useState<number | null>(null);

	const join = async () => {
		try {
			if (email && googleToken && nickname && nickname.length !== 0 && nickname.length <= 10 && profileImg !== null) {
				const body: JoinInfoType = {
					email,
					googleToken,
					nickname,
					profileImg,
				};
				const response = await joinApi({ body });
				if (response && response.status === 200) {
					const { headers } = response;
					if (headers instanceof AxiosHeaders) {
						const token = headers.get('authorization');
						CustomToast(ToastStyles.success, `${nickname} 님 환영합니다.`);
						localStorage.setItem('accessToken', `${token}`);
						router.push('/');
					}
				}
			} else {
				CustomToast(ToastStyles.error, '값을 입력해주세요!');
			}
		} catch (error) {
			console.error(error);
		}
	};

	const handleSelectEmoji = (idx: number) => {
		setProfileImg(idx);
	};

	const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setNickname(event.target.value);
	};

	const handleKeyboardInputChange = (event: React.KeyboardEvent<HTMLInputElement>) => {
		const inputValue: string = event.currentTarget.value;
		setNickname(inputValue);
	};

	useEffect(() => {
		const debounceTimeout = setTimeout(() => {
			setNickname(nickname);
		}, 300);

		return () => {
			clearTimeout(debounceTimeout);
		};
	}, [nickname, setNickname]);

	return (
		<>
			<EmojiList handleSelectEmoji={handleSelectEmoji} profileImg={profileImg} />
			<ContentLayout>
				<NicknameContainer>
					<Text text="닉네임" fontSize={16} />
					<input
						type="text"
						value={nickname || ''}
						placeholder="한글 또는 영문 10자 이내"
						maxLength={10}
						onChange={handleInputChange}
						onKeyDown={handleKeyboardInputChange}
					/>
				</NicknameContainer>
			</ContentLayout>
			<Button buttonType={ButtonStyles.outlinePrimaryBottom} content="가입하기" socialImg={false} onClick={join} />
		</>
	);
}

export default JoinInfo;
