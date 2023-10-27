import React, { ButtonHTMLAttributes } from 'react';
import GoogleLogo from '@root/public/assets/images/googleLogo.png';
import { ButtonContainer, SocialImage } from './style';

interface IButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
	content: string;
	buttonType: 'primary' | 'outlinePrimary' | 'success' | 'cancel';
	onClick?: () => void;
	socialImg: boolean;
}

function Button(props: IButtonProps) {
	const { content, onClick = () => {}, buttonType, socialImg } = props;

	return (
		<ButtonContainer $buttonType={buttonType} onClick={onClick}>
			{socialImg ? <SocialImage src={GoogleLogo} alt="" /> : <></>}
			{content}
		</ButtonContainer>
	);
}

export default Button;
