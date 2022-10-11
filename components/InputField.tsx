import React from "react";
import { Text, TextInput, TextInputProps, TextStyle, View, ViewProps, ViewStyle } from "react-native";
import MaskInput, { Mask, createNumberMask } from "react-native-mask-input";


export interface InputFieldProps extends ViewProps {
    textInput?: TextInputProps & React.RefAttributes<TextInput>,
    validator?: (text: string) => string | null,
    errorStyle?: TextStyle,
    onChangeText?: (text: string) => void,
    mask?: Mask | undefined,
}

type State = {
    text: string
}

class InputField extends React.PureComponent<InputFieldProps, State> {
    public static defaultProps: InputFieldProps = {
        errorStyle: {
            color: "red"
        },
    };

    render() {
        let value = this.props.textInput!.value!;

        return (
            <View
                {...this.props}
            >
                {this.props.mask ? // if mask is provided
                    <MaskInput
                        {...this.props.textInput}
                        onChangeText={(masked: string, unmasked: string, obfuscated: string) => {
                            if (this.props.onChangeText) {
                                this.props.onChangeText(unmasked);
                            }

                            this.setState({ text: unmasked });
                        }}
                        value={value}
                        mask={this.props.mask}
                        showObfuscatedValue={false}
                    /> :
                    <TextInput
                        {...this.props.textInput}
                        onChangeText={(text: string) => {
                            if (this.props.onChangeText) {
                                this.props.onChangeText(text);

                                this.setState({ text: text });
                            }
                        }}
                        value={value}
                    />}
                <Text
                    children={this.props.validator ? this.props.validator(value) : null}
                    style={this.props.errorStyle}
                />
            </View>
        );
    }
}

export default InputField;

export const VNDMask = createNumberMask({
    prefix: ['đ'],
    delimiter: '.',
    precision: 0
});