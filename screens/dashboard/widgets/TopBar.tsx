import Icon from "react-native-vector-icons/Ionicons";
import React from "react";
import { Image, ImageSourcePropType, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { COLORS, FONTS, SIZES } from "../../../constants";
import { colorWithOpacity } from "../../../utils";


let topBarLayout = {
    x: 0, y: 0, width: 0, height: 0
};

export interface TopBarProps {
    username: string;
    avatar?: ImageSourcePropType;
};

const TopBar: React.FC<TopBarProps> = ({
    username, avatar
}) => {

    return (
        <View
            style={topBarStyles.container}
            onLayout={(event) => {topBarLayout = event.nativeEvent.layout}}
        >
            <View style={topBarStyles.userContainer}>
                <Image style={topBarStyles.userAvatar} source={avatar}></Image>
                <View style={topBarStyles.greeting}>
                    <Text style={[FONTS.h2, { color: COLORS.white }]}>Hi, {username}</Text>
                </View>
            </View>
            <TouchableOpacity>
                <Icon name="notifications-outline" size={SIZES.icon} color={COLORS.white} />
            </TouchableOpacity>
        </View>
    )
}

export function getTopBarHeight(): number {
    return topBarLayout.height;
}

export default TopBar;

const topBarStyles = StyleSheet.create({
    container: {
        height: SIZES.WINDOW_HEIGHT * 0.12,
        flexDirection: "row",
        paddingHorizontal: SIZES.padding,
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: COLORS.black,
        borderBottomWidth: 1,
        borderBottomColor: colorWithOpacity(COLORS.white, 0.3)
    },
    userContainer: {
        flexDirection: "row",
        alignItems: "center",
        alignContent: "center",
    },
    userAvatar: {
        width: 60,
        height: 60,
        borderRadius: 30,
        borderColor: COLORS.white,
        borderWidth: 4
    },
    greeting: {
        flexDirection: "column",
        justifyContent: "space-around",
        paddingVertical: 10,
        paddingLeft: 15
    },
    icon: {
        width: 30,
        height: 30,
    }
});