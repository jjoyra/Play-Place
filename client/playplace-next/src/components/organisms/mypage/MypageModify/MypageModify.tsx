import React, { useContext, useEffect, useState } from 'react';
import EmojiList from '@/components/molecules/EmojiList/EmojiList';
import ContentLayout from '@/components/templates/layout/ContentLayout/ContentLayout';
import Text from '@/components/atoms/Text/Text';
import Button from '@/components/atoms/Button/Button';
import { ButtonStyles, ToastStyles } from '@/types/styles.d';
import { patchUserApi } from '@/utils/api/auth';
import CustomToast from '@/components/atoms/CustomToast/CustomToast';
import { useRouter } from 'next/navigation';
import UserInfoContext from '@/utils/common/UserInfoContext';
import NicknameContainer from '../../JoinInfo/style';

function MypageModify() {
	const { user, setUser } = useContext(UserInfoContext);
	const router = useRouter();
	const [profileImg, setProfileImg] = useState<number>(0);
	const [nickname, setNickname] = useState<string>('');

	const handleSelectEmoji = (idx: number) => {
		setProfileImg(idx);
	};

	const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setNickname(event.target.value);
	};

	const ModifyUserInfo = async () => {
		if (nickname.length === 0 || nickname.length > 10) {
			CustomToast(ToastStyles.error, '한글 또는 영문 10자 이내로 입력해주세요.');
			return;
		}

		if (user.nickname !== nickname || user.profileImg !== profileImg) {
			try {
				const response = await patchUserApi({
					body: {
						numImg: profileImg,
						nickname,
					},
				});

				if (response.status === 200) {
					const newUser = {
						...user,
						profileImg,
						nickname,
					};
					setUser(newUser);
					CustomToast(ToastStyles.success, `${nickname} 으로 수정됬습니다`);
					router.push('/');
				}
			} catch (error) {
				console.error(error);
			}
		} else {
			CustomToast(ToastStyles.error, '수정 변동 사항이 없습니다!');
		}
	};

	useEffect(() => {
		setProfileImg(user.profileImg);
		setNickname(user.nickname);
	}, [user]);

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
			<Button
				buttonType={ButtonStyles.outlinePrimaryBottom}
				content="수정하기"
				socialImg={false}
				onClick={ModifyUserInfo}
			/>
		</>
	);
}

export default MypageModify;
