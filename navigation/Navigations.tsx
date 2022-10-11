import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import React from 'react';
import { COLORS } from '../constants';
import UserProvider, { UserContext } from '../services/UserProvider';
import BottomBar from './BottomBar';
import LoginScreen from "./Login";


export function AuthStack({ onReady }: { onReady?: (() => void) | undefined }) {
    return (
        <NavigationContainer onReady={onReady}>
            <LoginScreen />
        </NavigationContainer>
    );
}

export function UserStack({ onReady }: { onReady?: (() => void) | undefined }) {
    const theme = {
        ...DefaultTheme,
        colors: {
            ...DefaultTheme.colors,
            background: COLORS.black,
            primary: COLORS.black,
            border: "transparent",
        },
    };

    return (
        <NavigationContainer theme={theme} onReady={onReady}>
            <BottomBar />
        </NavigationContainer>
    );
}

export default function RootNavigation({ onReady }: { onReady?: (() => void) | undefined }) {
    const { authInfo } = React.useContext(UserContext);

    return (
        authInfo ? <UserStack onReady={onReady} /> : <AuthStack onReady={onReady} />
    );
}