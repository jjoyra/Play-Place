import React, { useState, useCallback, useEffect } from 'react';
import { GoogleMap, useJsApiLoader, Circle, MarkerF, MarkerClustererF } from '@react-google-maps/api';
import { LandMarkInfo, ILocation } from '@/types/maps';
import LocateButton from '@/components/atoms/LocateButton/LocateButton';
import getLandmarksApi, { getLandmarkDetailApi } from '@/utils/api/landmarks';
import clusterOptions, { CalDistance } from '@/constants/map';
import CustomBottomSheet from '@/components/molecules/CustomBottomSheet/CustomBottomSheet';
import { Song } from '@/types/songs';
import LandMarkDefault from '@root/public/assets/images/LandMarkDefault.png';
import MapBottomSheet from '@/components/organisms/MapBottomSheet/MapBottomSheet';
import { PlayMapContainer, SearchHeader, containerStyle, nightModeStyles } from './style';

// google api 키
const googleMapsApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS || '';

function PlayMaps() {
	// 구글 맵
	const [map, setMap] = useState<google.maps.Map | null>(null);
	// 현재 위치
	const [center, setCenter] = useState<ILocation>({ lat: 0, lng: 0 });

	// 지도 기준 현 위치
	const [mapCenter, setMapCenter] = useState<ILocation>({ lat: 0, lng: 0 });

	const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);

	// 바텀시트를 여는 state
	const [open, setOpen] = useState<boolean>(false);
	// 랜드마크 정보 저장 배열
	const [landMarks, setLandMarks] = useState<LandMarkInfo[]>([]);
	// 랜드마크 100m 정보에 따른 boolean값
	const [isDistance, setIsDistance] = useState<boolean>(false);
	// 랜드마크 상세정보

	// 랜드마크를 눌렀을 때
	const [choose, setChoose] = useState<boolean>(false);

	// 랜드마크정보
	const [detailLandmark, setDetailLandmark] = useState<LandMarkInfo>({
		landmarkId: 0,
		latitude: 0,
		longitude: 0,
		title: '',
		representativeImg: '',
	});

	// 랜드만크안에 들어있는 곡 정보
	const [landMarkList, setLandMarkList] = useState<Song[]>([]);

	// map 로딩
	const { isLoaded } = useJsApiLoader({
		id: 'google-map-script',
		googleMapsApiKey,
	});

	// 현재 위치로 이동
	const locateUser = useCallback(() => {
		if (center.lat && center.lng) {
			const newLocation = {
				lat: center.lat,
				lng: center.lng,
			};
			setMapCenter(newLocation);
			if (map) {
				map.panTo(newLocation);
				map.setZoom(18);
			}
		}
	}, [center.lat, center.lng, map]);

	const onUnmount = useCallback(function callback() {
		// 컴포넌트가 언마운트될때 호출 map 상태 변수를 null로 설정하여 초기화
		setMap(null);
	}, []);

	const onLoad = useCallback(async function callback(loadMap: google.maps.Map) {
		if (typeof window !== undefined && window.AndMap) {
			const data = window.AndMap.getLastKnownLocation();

			if (data) {
				const location = JSON.parse(data);
				setMapCenter(location);
				return;
			}
		}

		navigator.geolocation.getCurrentPosition((position) => {
			const newLocation = {
				lat: position.coords.latitude,
				lng: position.coords.longitude,
			};
			setMapCenter(newLocation);
		});
		setMap(loadMap);
	}, []);

	const onMapIdle = useCallback(() => {
		if (map) {
			const newCenter = map.getCenter();
			if (mapCenter && newCenter && (mapCenter.lat !== newCenter.lat() || mapCenter.lng !== newCenter.lng())) {
				if (newCenter) {
					setMapCenter({
						lat: newCenter.lat(),
						lng: newCenter.lng(),
					});
				}
			}
		}
	}, []);

	const callAndroidLocation = useCallback(() => {
		if (typeof window !== undefined && window.AndMap) {
			const data = window.AndMap.getLastKnownLocation();

			if (data) {
				const location = JSON.parse(data);
				setCenter(location);
			}
			return;
		}

		navigator.geolocation.getCurrentPosition((position) => {
			const newLocation = {
				lat: position.coords.latitude,
				lng: position.coords.longitude,
			};
			setCenter(newLocation);
		});
	}, []);

	const getLandmarks = useCallback(async () => {
		try {
			const response = await getLandmarksApi();

			if (response && response.status === 200) {
				setLandMarks(response.data.data);
			}
		} catch (error) {
			console.error(error);
		}
	}, []);

	const detailLandMarkTest = async (landmarkId: number) => {
		try {
			const response = await getLandmarkDetailApi(landmarkId);
			if (response && response.status === 200) {
				setLandMarkList(response.data.data);
			}
			setOpen(true);
		} catch (error) {
			console.error(error);
		}
	};

	const checkLandmarkInfo = (detail: LandMarkInfo) => {
		const distance = CalDistance(center.lat, detail.latitude, center.lng, detail.longitude);

		if (distance <= 0.1) {
			setIsDistance(true);
		} else {
			setIsDistance(false);
		}

		setDetailLandmark(detail);
		setChoose(true);
	};

	useEffect(() => {
		if (choose && detailLandmark.landmarkId) {
			detailLandMarkTest(detailLandmark.landmarkId);
			setChoose(false);
		}
	}, [choose, detailLandmark.landmarkId]);

	useEffect(() => {
		if (landMarks.length === 0) {
			getLandmarks();
		}

		const handleAddLandmarkSong = (event: Event) => {
			// event를 CustomEvent로 캐스팅하고 detail 속성에 접근합니다.
			const customEvent = event as CustomEvent<{ landmarkId: number }>;
			const { landmarkId } = customEvent.detail;
			detailLandMarkTest(landmarkId);
		};

		window.addEventListener('addLandmarkSong', handleAddLandmarkSong);

		// 컴포넌트 언마운트 시 이벤트 리스너 제거
		return () => {
			window.removeEventListener('addLandmarkSong', handleAddLandmarkSong);
		};
	}, [landMarks.length]);

	// eslint-disable-next-line consistent-return
	useEffect(() => {
		const debounce = <F extends (...args: unknown[]) => void>(func: F, wait: number) => {
			let timeout: NodeJS.Timeout | null = null;
			return function executedFunction(...args: Parameters<F>) {
				const later = () => {
					clearTimeout(timeout as NodeJS.Timeout);
					func(...args);
				};
				clearTimeout(timeout as NodeJS.Timeout);
				timeout = setTimeout(later, wait);
			};
		};

		const debouncedOnMapIdle = debounce(onMapIdle, 5000);

		if (map) {
			const idleListener = google.maps.event.addListener(map, 'idle', debouncedOnMapIdle);

			return () => {
				google.maps.event.removeListener(idleListener);
			};
		}
	}, []);

	useEffect(() => {
		if (!intervalId) {
			const id = setInterval(callAndroidLocation, 1000);
			setIntervalId(id);
		}

		return () => {
			if (intervalId) {
				clearInterval(intervalId);
			}
		};
	}, [intervalId, callAndroidLocation]);

	// 현재위치 표시
	const circleRangeOptions = {
		strokeColor: '#FF7575',
		strokeOpacity: 0,
		strokeWeight: 0,
		fillColor: '#C779D0',
		fillOpacity: 0.35,
		radius: 100,
		center,
	};

	const markerCircleOptions = {
		strokeColor: '#FFFFFF',
		strokeOpacity: 1,
		strokeWeight: 2,
		fillColor: '#C779D0',
		fillOpacity: 1,
		radius: 5,
		center,
	};

	return (
		<PlayMapContainer>
			{center && landMarks && isLoaded && (
				<div style={{ position: 'relative', ...containerStyle }}>
					<LocateButton onLocateClick={locateUser} />
					<GoogleMap
						id="map"
						mapContainerStyle={{ width: '100%', height: '100%' }}
						center={mapCenter}
						zoom={18}
						onLoad={onLoad}
						onUnmount={onUnmount}
						onIdle={onMapIdle}
						options={{
							styles: nightModeStyles,
							mapTypeControl: false,
							fullscreenControl: false,
							rotateControl: false,
							streetViewControl: false,
						}}
					>
						<MarkerClustererF options={clusterOptions}>
							{(clusterer) => (
								<>
									{landMarks.map((landMark) => (
										<MarkerF
											key={landMark.landmarkId}
											position={{ lat: landMark.latitude, lng: landMark.longitude }}
											clusterer={clusterer}
											onClick={() => {
												checkLandmarkInfo(landMark);
											}}
											icon={{
												url:
													landMark.representativeImg === 'test.png' || landMark.representativeImg === null
														? LandMarkDefault.src
														: landMark.representativeImg,
												scaledSize: new google.maps.Size(50, 50),
												origin: new google.maps.Point(0, 0),
												anchor: new google.maps.Point(25, 50),
											}}
										/>
									))}
								</>
							)}
						</MarkerClustererF>

						<Circle center={center} options={circleRangeOptions} />
						<Circle center={center} options={markerCircleOptions} />
					</GoogleMap>
					{open && (
						<CustomBottomSheet open={open} setOpen={setOpen}>
							<SearchHeader>
								<MapBottomSheet
									isDistance={isDistance}
									landMarkTitle={`${detailLandmark.title}`}
									landMarkList={landMarkList}
									landmarkId={detailLandmark.landmarkId}
								/>
							</SearchHeader>
						</CustomBottomSheet>
					)}
				</div>
			)}
		</PlayMapContainer>
	);
}

export default PlayMaps;
