import React, { ReactNode } from 'react';
import { ContentLayoutSizes } from '@/types/styles.d';
import ContentLayout from '../layout/ContentLayout/ContentLayout';
import HomeTemplateContainer from './style';

function HomeTemplate({ children }: { children: ReactNode[] }) {
	return (
		<ContentLayout size={ContentLayoutSizes.lg} $margin="0 0 140px">
			<HomeTemplateContainer>
				<ContentLayout $margin="0 0 20px">{children[0]}</ContentLayout>
				<ContentLayout $margin="0 0 20px">{children[1]}</ContentLayout>
				<ContentLayout $margin="0 0 20px">{children[2]}</ContentLayout>
			</HomeTemplateContainer>
		</ContentLayout>
	);
}

export default HomeTemplate;