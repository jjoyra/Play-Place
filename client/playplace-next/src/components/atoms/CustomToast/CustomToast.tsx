'use client';

import toast from 'react-hot-toast';
import { ToastStyles } from '@/types/styles';
import ToastWrapper from './style';

const CustomToast = (type: ToastStyles, text: string) => {
	if (type === 'success') {
		return toast.success(<ToastWrapper>{text}</ToastWrapper>, {
			style: {
				padding: '4px 6px',
				color: 'var(--white)',
				background: 'var(--primary-grandiant-sub-puple)',
				fontSize: '10px',
				marginBottom: '120px',
			},
			iconTheme: {
				primary: 'linear-gradient(90deg, #A229EC 2.5%, #9D29ED 100%)',
				secondary: 'var(--white)',
			},
		});
	}

	if (type === 'noTabbarSuccess') {
		return toast.success(<ToastWrapper>{text}</ToastWrapper>, {
			style: {
				padding: '4px 6px',
				color: 'var(--white)',
				background: 'var(--primary-grandiant-sub-puple)',
				fontSize: '10px',
			},
			iconTheme: {
				primary: 'linear-gradient(90deg, #A229EC 2.5%, #9D29ED 100%)',
				secondary: 'var(--white)',
			},
		});
	}

	if (type === 'noTabbarError') {
		return toast.error(<ToastWrapper>{text}</ToastWrapper>, {
			style: {
				padding: '4px 6px',
				color: 'var(--white)',
				background: 'var(--primary-grandiant-sub-puple)',
				fontSize: '10px',
			},
			iconTheme: {
				primary: 'linear-gradient(90deg, #A229EC 2.5%, #9D29ED 100%)',
				secondary: 'var(--white)',
			},
		});
	}

	return toast.error(<ToastWrapper>{text}</ToastWrapper>, {
		style: {
			padding: '4px 6px',
			color: 'var(--white)',
			background: 'var(--primary-grandiant-sub-puple)',
			fontSize: '10px',
			marginBottom: '120px',
		},
		iconTheme: {
			primary: 'linear-gradient(90deg, #A229EC 2.5%, #9D29ED 100%)',
			secondary: 'var(--white)',
		},
	});
};

export default CustomToast;
