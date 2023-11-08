import styled, { css } from 'styled-components';

interface ITextWrapperProps {
	$fontSize: number;
	$color: 'default' | 'gradientMain' | 'gray' | 'gradientOrange';
	$overflowHidden?: boolean;
}

const overflowHidden = css`
	width: 100%;
	white-space: nowrap;
	text-overflow: ellipsis;
	overflow: hidden;
`;

const TextStyle = {
	default: css`
		color: var(--white-100);
	`,
	gradientMain: css`
		background: var(--primary-grandiant-main);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
	`,
	gradientOrange: css`
		background: var(--primary-grandiant-sub-orange);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
	`,
	gray: css`
		color: var(--white-500);
	`,
};

const TextWrapper = styled.p<ITextWrapperProps>`
	width: fit-content;
	font-size: ${({ $fontSize }) => $fontSize}px;
	${({ $color }) => TextStyle[$color]};
	${({ $overflowHidden }) => $overflowHidden && overflowHidden}
`;

export default TextWrapper;