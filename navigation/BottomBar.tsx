import Icon from 'react-native-vector-icons/Ionicons';
import React, { useRef, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { CurvedBottomBar } from "react-native-curved-bottom-bar";
import Animated from "react-native-reanimated";
import { COLORS, FONTS, shadow, SIZES } from "../constants";
import { colorWithOpacity } from "../utils";
import DashboardScreen from '../screens/dashboard/Dashboard';
import ExpenseScreen from '../screens/expense/Expense';
import { PAGES } from '../screens';


const BottomBar: React.FC = () => {
    const [showHeader, setShowHeader] = useState(false);
    const tabBarRef = useRef<any>();
    const dashboardRef = React.createRef<DashboardScreen>();

    const onNavigateHomeScreen = () => {
        tabBarRef.current.setVisible(true);
        setShowHeader(false);
    };

    const onNavigateExpenseScreen = () => {
        tabBarRef.current.setVisible(false);
        setShowHeader(true);
    };

    const renderScreenIcon = (routeName: string, selectedTab: string) => {
        let icon: string = "alert-outline";

        switch (routeName) {
            case PAGES.HOME:
                icon = "home-outline";
                break;
            case PAGES.EXPENSE:
                icon = "cart-outline";
                break;
        }

        return <Icon name={icon} size={SIZES.icon} color={routeName === selectedTab ? COLORS.lightBlue : COLORS.white} />
    }

    const renderTabBar = ({ routeName, selectedTab, navigate }: {
        routeName: string,
        selectedTab: string,
        navigate(selectedTab: string): void
    }) => {
        return (
            <TouchableOpacity
                onPress={() => {
                    navigate(routeName);

                    if (routeName === PAGES.EXPENSE) {
                        onNavigateExpenseScreen();
                    } else if (routeName === PAGES.HOME) {
                        onNavigateHomeScreen();
                    }
                }}
                style={{
                    flex: 1,
                    alignItems: 'center',
                    justifyContent: 'center',
                }}>
                {renderScreenIcon(routeName, selectedTab)}
            </TouchableOpacity>
        );
    };

    const renderHeader = (navigate: (selectedTab: string) => void, routeName: string) => {
        return (
            <View style={bottomBarStyles.headerContainer}>
                <TouchableOpacity
                    onPress={(event) => {
                        navigate(PAGES.HOME);
                        setShowHeader(false);
                        tabBarRef.current.setVisible(true);
                    }}
                    style={{ flex: 0.2 }}
                >
                    <Icon name="arrow-back-outline" size={SIZES.icon} color={COLORS.white} />
                </TouchableOpacity>
                <View style={{
                    flex: 0.6, // 1 - 0.2 x 2
                    flexDirection: "row",
                    justifyContent: "center"
                }}>
                    <Text style={{ ...FONTS.h2, color: COLORS.white }}>{routeName}</Text>
                </View>
            </View>
        );
    }

    return (
        <CurvedBottomBar.Navigator
            ref={tabBarRef}
            screenOptions={{
                headerShown: showHeader,
                header: ({ navigation, route }) => renderHeader(navigation.navigate, route.name)
            }}
            initialRouteName={PAGES.HOME}
            strokeWidth={3}
            height={bottomBarHeight}
            circleWidth={62}
            strokeColor={colorWithOpacity("#000", 0.05)}
            bgColor={COLORS.black}
            borderTopLeftRight={true}
            renderCircle={({ selectedTab, navigate }) => (
                <Animated.View style={bottomBarStyles.btnCircle}>
                    <TouchableOpacity
                        style={{
                            flex: 1,
                            justifyContent: 'center',
                        }}
                        onPress={() => {
                            if (selectedTab === PAGES.HOME) {
                                dashboardRef.current!.setModalVisible(true);
                            }
                        }}>
                        <Icon name={'add'} color={COLORS.white} size={SIZES.icon} />
                    </TouchableOpacity>
                </Animated.View>
            )}
            tabBar={renderTabBar}
        >
            <CurvedBottomBar.Screen
                name={PAGES.HOME}
                position="LEFT"
                children={props => <DashboardScreen ref={dashboardRef} isFocused={props.navigation.isFocused()} navigate={(page) => {
                    props.navigation.navigate(page);

                    if (page === PAGES.HOME) {
                        onNavigateHomeScreen();
                    } else if (page === PAGES.EXPENSE) {
                        onNavigateExpenseScreen();
                    }
                }} />} />
            <CurvedBottomBar.Screen
                name={PAGES.EXPENSE}
                position="RIGHT"
                children={props => <ExpenseScreen isFocused={props.navigation.isFocused()} navigate={(page) => {
                    props.navigation.navigate(page);

                    if (page === PAGES.HOME) {
                        onNavigateHomeScreen();
                    } else if (page === PAGES.EXPENSE) {
                        onNavigateExpenseScreen();
                    }
                }} />} />
        </CurvedBottomBar.Navigator>
    );
}

export default BottomBar;

export const bottomBarHeight = 70;

const bottomBarStyles = StyleSheet.create({
    container: {
        flex: 1
    },
    headerContainer: {
        flexDirection: "row",
        paddingHorizontal: SIZES.padding,
        alignItems: "center"
    },
    button: {
        // marginVertical: 5,
    },
    bottomBar: {
    },
    btnCircle: {
        width: 62,
        height: 60,
        borderRadius: 30,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: COLORS.lightBlue,
        padding: 10,
        shadowColor: shadow,
        shadowOffset: {
            width: 0,
            height: 10,
        },
        shadowOpacity: 0.5,
        shadowRadius: 12,
        elevation: 19,
        bottom: 25,
    },
    imgCircle: {
        width: 30,
        height: 30,
        tintColor: 'gray',
    },
    img: {
        width: 30,
        height: 30,
    },
});

const widgetStyles = StyleSheet.create({
    root: {
        paddingTop: SIZES.padding, // padding for topBar
    }
});