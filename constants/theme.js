import { Dimensions } from "react-native";
const { width, height } = Dimensions.get("window");


export const COLORS = {
    white: "#FFFFFF",
    black: "#242C3B",
    lightGray: "#4C5770",
    darkGray: "#363E51",
    lightBlue: "#34C8E8",
    darkBlue: "#4E4AF2",
    green: "#2ECC71",
    red: "#E74C3C"
};

export const SIZES = {
    // global sizes
    base: 8,
    font: 14,
    radius: 12,
    padding: 15,
    padding2: 30,
    margin: 15,
    margin2: 30,
    icon: 30,

    // font sizes
    largeTitle: 50,
    h1: 30,
    h2: 20,
    h3: 16,
    h4: 14,
    body1: 30,
    body2: 20,
    body3: 16,
    body4: 14,

    // app dimensions
    WINDOW_WIDTH: width,
    WINDOW_HEIGHT: height
};

export const fontFamily = {
    "Poppins-Regular": require("../assets/fonts/Poppins-Regular.ttf"),
    "Poppins-Bold": require("../assets/fonts/Poppins-Bold.ttf"),
    "Poppins-Medium": require("../assets/fonts/Poppins-Medium.ttf")
}

export const FONTS = {
    largeTitle: { fontFamily: "Poppins-Regular", fontSize: SIZES.largeTitle, lineHeight: 55 },
    h1: { fontFamily: "Poppins-Bold", fontSize: SIZES.h1, lineHeight: 36 },
    h2: { fontFamily: "Poppins-Bold", fontSize: SIZES.h2, lineHeight: 30 },
    h3: { fontFamily: "Poppins-Bold", fontSize: SIZES.h3, lineHeight: 22 },
    h4: { fontFamily: "Poppins-Medium", fontSize: SIZES.h4, lineHeight: 22 },
    body1: { fontFamily: "Poppins-Regular", fontSize: SIZES.body1, lineHeight: 36 },
    body2: { fontFamily: "Poppins-Regular", fontSize: SIZES.body2, lineHeight: 30 },
    body3: { fontFamily: "Poppins-Regular", fontSize: SIZES.body3, lineHeight: 22 },
    body4: { fontFamily: "Poppins-Regular", fontSize: SIZES.body4, lineHeight: 22 },
};

export const shadow = "#000";

const appTheme = { COLORS, SIZES, FONTS };

export default appTheme;