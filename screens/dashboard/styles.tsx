import { StyleSheet } from "react-native";
import { shadow, SIZES } from "../../constants";

export const rootStyles = StyleSheet.create({
    container: {
        width: SIZES.WINDOW_WIDTH * 0.94,
        shadowColor: shadow,
        shadowOffset: {
            width: 0,
            height: 20,
        },
        shadowOpacity: 0.25,
        elevation: 10,
        shadowRadius: 10,
        borderRadius: 30
    }
});