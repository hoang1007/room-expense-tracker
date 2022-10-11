import React from "react";
import { View, ViewProps, ViewStyle, } from 'react-native';
import Animated, { Layout, SlideInDown, SlideOutDown } from "react-native-reanimated";


export interface ModalProps extends ViewProps {
    visible?: boolean;
};


const SlidingModal: React.FC<ModalProps> = ({
    ...props
}) => {
    let children = null;

    if (props.visible) {
        children = <Animated.View
            key={"anim-view"}
            entering={SlideInDown}
            exiting={SlideOutDown}
            layout={Layout}
        >
            {props.children}
        </Animated.View>
    }

    return (
        <View {...props} children={children} />
    );
};

export default SlidingModal;