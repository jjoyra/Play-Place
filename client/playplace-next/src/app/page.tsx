'use client';

import Header from '@/components/molecules/Header/Header';
import LayoutWithHeader from '@/components/templates/layout/LayoutWithHeader/LayoutWithHeader';
import { HeaderStyles } from '@/types/styles.d';
import MenuIcon from '@root/public/assets/icons/Menu.svg';
import Home from '@/components/pages/Home/Home';
import { useEffect, useState } from 'react';
import MypageView from '@/components/organisms/MypageView/MypageView';

export default function HomePage() {
	const [isMyMenuOpen, setIsMyMenuOpen] = useState<boolean>(false);

	const handleMyPageOn = () => {
		console.log('열려');
		setIsMyMenuOpen(true);
	};

	useEffect(() => {
		if (window.AndMap) {
			window.AndMap.successLocate();
		}
	}, []);

	const header = (
		<>
			<Header $headerType={HeaderStyles.home} location="장덕동">
				<button type="button" onClick={handleMyPageOn}>
					<MenuIcon />
				</button>
			</Header>
		</>
	);

	return (
		<>
			<LayoutWithHeader header={header}>
				<Home />
			</LayoutWithHeader>
			<MypageView $isMyMenuOpen={isMyMenuOpen} setIsMyMenuOpen={setIsMyMenuOpen} />
		</>
	);
}
