import React from "react";
import { EmitterSubscription, FlatList, Keyboard, KeyboardEvent, KeyboardEventListener, StyleSheet, Text, TextInput, TouchableOpacity, View, ViewStyle } from "react-native";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
import { InputField, LinearContainer, SlidingModal } from "../../../components";
import { VNDMask } from "../../../components/InputField";
import { COLORS, FONTS, shadow, SIZES } from "../../../constants";
import { Currency, Item } from "../../../objects";
import { Source } from "../../../objects/item";
import { colorWithOpacity } from "../../../utils";
import { getTopBarHeight } from "./TopBar";


interface ModalProps {
    visible: boolean,
    style?: ViewStyle
};

interface ModalState {
    keyboardHeight: number,
    itemIndex: number,
    itemQuantity: number,
    tmpItem: Record<"name" | "price", string>
};

class AddItemsModal extends React.PureComponent<ModalProps, ModalState> {
    inputRefs: Record<string, React.RefObject<TextInput>>;
    keyBoardWillShow?: EmitterSubscription;
    keyBoardWillHide?: EmitterSubscription;

    items: Item[];

    constructor(props: ModalProps) {
        super(props);

        this.inputRefs = {
            "name": React.createRef<TextInput>(),
            "price": React.createRef<TextInput>()
        };

        this.items = [];

        this.state = {
            keyboardHeight: 0,
            itemIndex: this.items.length,
            itemQuantity: this.items.length,
            tmpItem: {
                name: "",
                price: ""
            }
        };
    }

    clearItems = () => {
        this.items.length = 0;

        this.setState({
            itemIndex: 0,
            itemQuantity: 0,
            tmpItem: { name: "", price: "" }
        });
    }

    createItem = () => {
        const { name, price } = this.state.tmpItem;

        if (name.length > 0 && price.length > 0) {
            let newItem = new Item(name, Number.parseInt(price), Source.USER);

            // if edit mode
            if (this.state.itemIndex < this.items.length) {
                this.items[this.state.itemIndex] = newItem;
            } else { // add mode
                this.items.push(newItem);
            }

            this.setState({
                itemIndex: this.items.length,
                itemQuantity: this.items.length,
                tmpItem: { name: "", price: "" }
            });
        }
    }

    deleteItem = () => {
        if (this.state.itemIndex < this.items.length) {
            this.items.splice(this.state.itemIndex, 1);

            this.setState({
                itemIndex: this.items.length,
                itemQuantity: this.items.length,
                tmpItem: { name: "", price: "" }
            });
        }
    }

    keyboardAction: KeyboardEventListener = (event: KeyboardEvent) => {
        this.setState({ keyboardHeight: event.endCoordinates.height });
    }

    componentDidMount(): void {
        this.keyBoardWillShow = Keyboard.addListener("keyboardDidShow", this.keyboardAction);
        this.keyBoardWillHide = Keyboard.addListener("keyboardDidHide", this.keyboardAction);
    }

    componentWillUnmount(): void {
        this.keyBoardWillShow?.remove();
        this.keyBoardWillHide?.remove();
    }

    renderInputField() {
        return (
            <View style={addItemsModalStyles.formContainer}>
                <Text children={"Name"} style={addItemsModalStyles.inputLabel} />
                <InputField
                    textInput={{
                        value: this.state.tmpItem.name,
                        ref: this.inputRefs.name,
                        onSubmitEditing: () => this.inputRefs.price.current?.focus(), // jump to next input
                        style: addItemsModalStyles.inputField
                    }}
                    errorStyle={addItemsModalStyles.textError}
                    onChangeText={(text: string) => this.setState({ tmpItem: { name: text, price: this.state.tmpItem.price } })}
                    validator={(text: string) => {
                        if (this.state.tmpItem.name.length == 0 && this.state.tmpItem.price.length > 0) {
                            return "Item's name should not be empty";
                        }

                        return null;
                    }}
                />

                <Text children={"Buy Price"} style={addItemsModalStyles.inputLabel} />
                <InputField
                    textInput={{
                        value: this.state.tmpItem.price,
                        ref: this.inputRefs.price,
                        keyboardType: "number-pad",
                        onSubmitEditing: () => { // jump to next input
                            // this.props.callback!(false);
                            this.inputRefs.name.current?.focus();
                            this.createItem();
                        },
                        style: addItemsModalStyles.inputField,
                    }}
                    onChangeText={(text: string) => this.setState({ tmpItem: { name: this.state.tmpItem.name, price: text } })}
                    validator={(text: string) => {
                        if (text.length > 0) {
                            let price = parseInt(text);

                            if (isNaN(price)) {
                                return "Not a number";
                            } else if (price < Currency.min.value) {
                                return "Shouldn't be less than " + Currency.min.value.toString();
                            }
                        }

                        return null;
                    }}
                    mask={VNDMask}
                    errorStyle={addItemsModalStyles.textError}
                />
            </View>
        );
    }

    renderSubmittedItemList = () => {
        const renderItem = ({ item, index }: { item: Item, index: number }) => {
            let itemContainerStyle = submittedItemListStyles.animItemContainer;
            let itemTextStyle = submittedItemListStyles.itemText;

            if (this.state.itemIndex == index) {
                // is the selected item
                itemContainerStyle = {
                    ...itemContainerStyle,
                    backgroundColor: colorWithOpacity(COLORS.lightBlue, 0.5).toString()
                }

                itemTextStyle = {
                    ...itemTextStyle,
                    color: COLORS.white
                }
            }

            return (
                <Animated.View
                    key={index}
                    entering={FadeIn}
                    exiting={FadeOut}
                    style={itemContainerStyle}
                >
                    <TouchableOpacity
                        onPress={(event) => {
                            if (this.state.itemIndex == index) {
                                // if selecting this item, unselect it

                                this.setState({
                                    itemIndex: this.items.length,
                                    tmpItem: { name: "", price: "" }
                                });
                            } else {
                                this.setState({
                                    itemIndex: index,
                                    tmpItem: { name: item.name, price: item.price.value.toString() }
                                });
                            }
                        }}
                    >
                        <Text numberOfLines={1} children={item.name} style={itemTextStyle} />
                    </TouchableOpacity>
                </Animated.View>
            );
        };

        return (
            <FlatList
                data={this.items}
                horizontal={true}
                style={submittedItemListStyles.flatList}
                renderItem={renderItem}
                removeClippedSubviews={true}
                showsHorizontalScrollIndicator={false}
            />
        );
    }

    renderHandlingButtons = () => (
        <View
            style={{
                flexDirection: "row",
                flex: 1,
                flexGrow: 0,
                marginTop: SIZES.margin2
            }}
        >
            {this.state.itemIndex < this.items.length ? <TouchableOpacity // DELETE BUTTON
                style={{
                    width: "50%",
                    alignItems: "center",
                    justifyContent: "center",
                    left: 0
                }}
                onPress={this.deleteItem}
            >
                <LinearContainer
                    start={[0, 0]}
                    end={[2, 2]}
                    colors={[COLORS.lightGray, COLORS.darkGray]}
                    style={{
                        ...addItemsModalStyles.button,
                        borderColor: colorWithOpacity(COLORS.white, 0.2),
                        borderWidth: 1
                    }}
                >
                    <Text children={"Delete"} style={{
                        ...addItemsModalStyles.buttonText,
                        color: colorWithOpacity(COLORS.white, 0.7)
                    }} />
                </LinearContainer>
            </TouchableOpacity> : null}

            <TouchableOpacity // SAVE BUTTON
                style={{
                    width: "50%",
                    alignItems: "center",
                    justifyContent: "center"
                }}
                onPress={this.createItem}
            >
                <LinearContainer
                    start={[0, 0]}
                    end={[2, 2]}
                    colors={[COLORS.lightBlue, COLORS.darkBlue]}
                    style={addItemsModalStyles.button}
                >
                    <Text children={"Save"} style={addItemsModalStyles.buttonText} />
                </LinearContainer>
            </TouchableOpacity>
        </View>
    );

    render() {
        let maxContainerHeight = SIZES.WINDOW_HEIGHT - getTopBarHeight() - this.state.keyboardHeight;
        let dynamicContainerHeight = Math.min(maxContainerHeight, addItemsModalStyles.container.height);

        return (
            <SlidingModal
                visible={this.props.visible}
                style={{
                    ...this.props.style,
                    ...addItemsModalStyles.container,
                    height: dynamicContainerHeight
                }}
            >
                <LinearContainer
                    start={[0, 0]}
                    end={[0.5, 0.5]}
                    colors={[COLORS.lightGray, COLORS.darkGray]}
                    style={addItemsModalStyles.linearContainer}
                >
                    {this.renderSubmittedItemList()}
                    {this.renderInputField()}
                    {this.renderHandlingButtons()}
                </LinearContainer>
            </SlidingModal>
        );
    }
}

export default AddItemsModal;

const addItemsModalStyles = StyleSheet.create({
    container: {
        alignSelf: "center",
        height: SIZES.WINDOW_HEIGHT * 0.6,
        width: SIZES.WINDOW_WIDTH
    },
    linearContainer: {
        height: "100%",
        alignItems: "center",
        shadowColor: shadow,
        shadowOffset: {
            width: 0,
            height: 20,
        },
        shadowOpacity: 0.25,
        elevation: 10,
        shadowRadius: 10,
        paddingHorizontal: SIZES.padding,
        paddingTop: SIZES.padding,
        borderRadius: 30
    },
    formContainer: {
    },
    inputField: {
        ...FONTS.body3,
        width: SIZES.WINDOW_WIDTH * 0.7,
        height: 60,
        borderColor: colorWithOpacity(COLORS.white, 0.2),
        borderWidth: 1,
        borderRadius: 20,
        textAlign: "center",
        color: colorWithOpacity(COLORS.white, 0.7)
    },
    textError: {
        color: "red"
    },
    inputLabel: {
        ...FONTS.h3,
        color: COLORS.lightBlue,
        marginBottom: 10
    },
    button: {
        width: 100,
        height: 40,
        borderRadius: 10,
        borderWidth: 0,
        justifyContent: "center",
    },
    buttonText: {
        ...FONTS.h3,
        color: colorWithOpacity(COLORS.white, 0.9),
        textAlign: "center"
    }
});

const submittedItemListStyles = StyleSheet.create({
    animItemContainer: {
        backgroundColor: COLORS.darkGray,
        marginRight: 5,
        justifyContent: "center",
        maxWidth: 100,
        height: 30,
        paddingHorizontal: 3,
        overflow: "hidden",
        borderRadius: 20,
        borderWidth: 1,
        borderColor: colorWithOpacity(COLORS.white, 0.2)
    },
    itemText: {
        ...FONTS.h4,
        color: colorWithOpacity(COLORS.white, 0.5),
        textAlign: "center",
        paddingHorizontal: 1
    },
    flatList: {
        flexGrow: 0,
        marginBottom: SIZES.margin
    }
});