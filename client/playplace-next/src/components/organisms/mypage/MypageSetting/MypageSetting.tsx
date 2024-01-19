import MypageToggle from '@/components/molecules/MypageToggle/MypageToggle';
import ContentLayout from '@/components/templates/layout/ContentLayout/ContentLayout';
import { ContentLayoutSizes, ToastStyles } from '@/types/styles.d';
import React, { useContext, useEffect, useState } from 'react';
import Text from '@/components/atoms/Text/Text';
import { DeleteUserApi, logoutUserApi, patchShakeApi } from '@/utils/api/auth';
import { useRouter } from 'next/navigation';
import CustomToast from '@/components/atoms/CustomToast/CustomToast';
import UserInfoContext from '@/utils/common/UserInfoContext';
import MypageSettingContainer, { Line, MypagetSettingText } from './style';

function MypageSetting() {
	const router = useRouter();
	const { user, setUser } = useContext(UserInfoContext);
	// const [push, setPush] = useState<boolean>(false);
	const [shake, setShake] = useState<boolean>(false);

	// const handlePush = async () => {
	// 	try {
	// 		const response = await patchPushApi();
	// 		if (response.status === 200) {
	// 			setPush(!push);
	// 			const newUser = {
	// 				...user,
	// 				push: !push,
	// 			};
	// 			setUser(newUser);
	// 			CustomToast(ToastStyles.noTabbarSuccess, `푸시알림 ${!push ? '동의' : '비동의'}하셨습니다`);
	// 		}
	// 	} catch (error) {
	// 		console.error(error);
	// 	}
	// };

	const handleShake = async () => {
		try {
			const response = await patchShakeApi();
			if (response.status === 200) {
				setShake(!shake);
				const newUser = {
					...user,
					shake: !shake,
				};
				setUser(newUser);
				CustomToast(ToastStyles.noTabbarSuccess, `흔들기 ${!shake ? '동의' : '비동의'}하셨습니다`);
			}
		} catch (error) {
			console.error(error);
		}
	};

	const deleteUser = async () => {
		try {
			const response = await DeleteUserApi();
			if (response.status === 200) {
				CustomToast(ToastStyles.success, 'PlayPlace를 이용해주셔서 감사합니다');
				localStorage.removeItem('accessToken');
				router.push('/login');
			}
		} catch (error) {
			console.error(error);
		}
	};

	const logoutUser = async () => {
		try {
			const response = await logoutUserApi();
			if (response.status === 200) {
				localStorage.removeItem('accessToken');
				CustomToast(ToastStyles.success, `${user.nickname}님 감사합니다.`);
				router.push('/login');
			}
		} catch (error) {
			console.error(error);
		}
	};

	useEffect(() => {
		// setPush(user.push);
		setShake(user.shake);
	}, [user.shake]);

	return (
		<ContentLayout size={ContentLayoutSizes.md}>
			<MypageSettingContainer>
				{/* <MypageToggle functionOnOff={push} handleFunction={handlePush} title="푸시 알림 동의" /> */}
				<MypageToggle functionOnOff={shake} handleFunction={handleShake} title="흔들어서 플로디 열기" />
				<Line />
				<MypagetSettingText>
					<Text text="로그아웃" fontSize={14} color="default" onClick={logoutUser} />
				</MypagetSettingText>
				<MypagetSettingText>
					<Text text="회원탈퇴" fontSize={14} color="default" onClick={deleteUser} />
				</MypagetSettingText>
			</MypageSettingContainer>
		</ContentLayout>
	);
}

export default MypageSetting;
