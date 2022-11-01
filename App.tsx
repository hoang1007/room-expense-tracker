import { SafeAreaProvider } from 'react-native-safe-area-context';
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