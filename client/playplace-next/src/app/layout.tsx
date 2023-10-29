import type { Metadata } from 'next';
import StyledComponentsRegistry from '@/lib/registry';
import Tabbar from '@/components/molecules/Tabbar/Tabbar';
import PlayBar from '@/components/organisms/player/PlayBar/PlayBar';
import PlayModal from '@/components/pages/PlayModal/PlayModal';
import Layout from '@/components/templates/layout/Layout/Layout';
import PlayBack from '@/components/atoms/player/PlayBack/PlayBack';
import Providers from './providers';

export const metadata: Metadata = {
	title: {
		template: 'Play, Place | %s',
		default: 'Play, Place |  함께 만드는 공유 플레이리스트',
	},
	description: 'Play, Place | 함께 만드는 공유 플레이리스트 홈',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="ko">
			<body>
				<StyledComponentsRegistry>
					<Providers>
						<Layout>{children}</Layout>
						<PlayBar />
						<Tabbar />
						<PlayModal />
						<PlayBack />
					</Providers>
				</StyledComponentsRegistry>
			</body>
		</html>
	);
}
