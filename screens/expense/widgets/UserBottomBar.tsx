import React from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { COLORS, FONTS, shadow, SIZES } from "../../../constants";
import User from "../../../objects/user";
import { colorWithOpacity } from "../../../utils";

export interface UserBottomBarProps {
    users: User[],
    onClickUser: (user: User) => void,
    initialFocusUser: User
}

let barLayout = {
    x: 0, y: 0, width: 0, height: 0
};

const UserBottomBar: React.FC<UserBottomBarProps> = ({
    users, onClickUser, initialFocusUser
}) => {
    const [currentUser, setCurrentUser] = React.useState<User>(initialFocusUser);

    const renderUser = (user: User) => {
        let color = COLORS.white;
        if (currentUser && user.uid === currentUser.uid) {
            color = COLORS.lightBlue;
        }
        color = colorWithOpacity(color, 0.8).toString();

        return (
            <TouchableOpacity
                key={user.uid}
                style={styles.userContainer}
                onPress={() => {
                    setCurrentUser(user);
                    onClickUser(user);
                }}
            >
                <Icon name="person-outline" size={SIZES.icon}
                    color={color} />
                <Text style={{ ...FONTS.h3, color: color }}>{user.name}</Text>
            </TouchableOpacity>
        );
    }

    return (
        <View
            style={styles.container}
            onLayout={(event) => barLayout = event.nativeEvent.layout}
        >
            {users.map((user) => renderUser(user))}
        </View>
    );
};

export function getBottomUserBarHeight() {
    return barLayout.height;
}

export default UserBottomBar;

const styles = StyleSheet.create({
    container: {
        position: "absolute",
        flexDirection: "row",
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        width: SIZES.WINDOW_WIDTH,
        bottom: 0,
        backgroundColor: COLORS.black,
        justifyContent: "space-around",
        shadowColor: shadow,
        shadowOffset: {
            width: 0,
            height: 30,
        },
        shadowOpacity: 0.25,
        elevation: 20,
        shadowRadius: 20,
        borderWidth: 1,
        borderTopColor: COLORS.lightGray,
        borderLeftColor: COLORS.lightGray,
        borderRightColor: COLORS.lightGray,
    },
    userContainer: {
        paddingVertical: SIZES.padding / 2,
        alignItems: "center",
        justifyContent: "center",
        height: 80,
    }
})