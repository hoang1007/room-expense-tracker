import { useCallback, useEffect } from 'react';
import { fontFamily } from './constants/theme';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import RootNavigation from './navigation/Navigations';
import UserProvider from './services/UserProvider';


export default function App() {
	return (
		<SafeAreaProvider>
			<UserProvider>
				<RootNavigation />
			</UserProvider>
		</SafeAreaProvider>
	);
}