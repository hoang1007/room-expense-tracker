import LinearGradient from "react-native-linear-gradient";
import React from "react";
import { StyleSheet, ViewProps, ViewStyle } from "react-native";
import { colorWithOpacity } from "../utils";


export interface LinearContainerProps extends ViewProps {
    start: [number, number];
    end: [number, number];
    colors: string[];
};

const LinearContainer: React.FC<LinearContainerProps> = ({
    start = [0, 0],
    end = [1, 0],
    colors,
    ...props
}) => {

    const defaultStyle = StyleSheet.create({
        default: {
            borderColor: colorWithOpacity("#FFF", 0.2),
            backgroundColor: colorWithOpacity("#FFF", 0.2),
            borderWidth: 1,
            borderRadius: 30
        }
    });

    return (
        <LinearGradient
            {...props}
            start={{x: start[0], y: start[1]}}
            end={{x: end[0], y: end[1]}}
            colors={colors}
            style={{ ...defaultStyle.default, ...props.style as ViewStyle }} />
    );
};

export default LinearContainer;