import React from "react";
// import "intl/locale-data/jsonp/en";
import { FlatList, StyleSheet, Text, TouchableOpacity, View, ViewStyle } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { COLORS, FONTS, SIZES } from "../constants";
import { DateTime } from "../objects";
import { colorWithOpacity } from "../utils";

export interface MonthPickerProps {
    onMonthChange?: (month: DateTime.Month) => void
    style?: ViewStyle;
    refesh?: boolean;
};

interface MonthPickerState {
    selectedMonth: DateTime.Month
}

class MonthPicker extends React.Component<MonthPickerProps, MonthPickerState> {
    constructor(props: MonthPickerProps) {
        super(props);

        this.state = {
            selectedMonth: DateTime.Month.now
        }
    }

    setSelectedMonth = (month: DateTime.Month) => {
        this.setState({ selectedMonth: month });

        if (this.props.onMonthChange) {
            this.props.onMonthChange(month);
        }
    }

    renderMonthWidget = (month: DateTime.Month) => {
        let containerStyle = styles.monthWidgetContainer;
        let monthTextStyle = styles.monthText;
        let monthContainerStyle = styles.monthContainer;

        if (month.equal(this.state.selectedMonth)) {
            monthContainerStyle = {
                ...monthContainerStyle,
                backgroundColor: COLORS.lightBlue,
                borderColor: COLORS.lightBlue
            };

            monthTextStyle = {
                ...monthTextStyle,
                color: COLORS.white
            }
        }

        return (
            <TouchableOpacity
                key={month.getMonth()}
                style={containerStyle}
                onPress={(event) => {
                    this.setSelectedMonth(month);
                }}
            >
                <View style={monthContainerStyle}>
                    <Text style={monthTextStyle}>
                        {month.getMonthStr("short")}
                    </Text>
                </View>
            </TouchableOpacity>
        );
    }

    renderYearPicker = () => {
        return (
            <View style={styles.yearPickerContainer}>
                <TouchableOpacity
                    onPress={() => {
                        this.setSelectedMonth(this.state.selectedMonth.copy({ year: this.state.selectedMonth.getYear() - 1 }))
                    }}
                    style={styles.forwardYearButton}
                >
                    <Icon name="chevron-back-outline" color={COLORS.white} size={25} />
                </TouchableOpacity>

                <View
                    style={{
                        flexDirection: "row",
                        alignItems: "center"
                    }}
                >
                    <Text style={styles.yearText}>{this.state.selectedMonth.getYear()}</Text>
                </View>

                <TouchableOpacity
                    onPress={() => {
                        this.setSelectedMonth(this.state.selectedMonth.copy({ year: this.state.selectedMonth.getYear() + 1 }))
                    }}
                    style={styles.forwardYearButton}
                >
                    <Icon name="chevron-forward-outline" color={COLORS.white} size={25} />
                </TouchableOpacity>
            </View>
        );
    }

    createMonthInYear = () => {
        let monthInYear: DateTime.Month[] = [];
        for (let i = 1; i <= 12; i++) {
            monthInYear.push(new DateTime.Month(i, this.state.selectedMonth.getYear()));
        }

        return monthInYear;
    }

    renderSeparator = () => {
        return <View style={{
            height: 1,
            backgroundColor: colorWithOpacity(COLORS.white, 0.5),
            width: "100%",
            marginTop: 10
        }} />
    }

    render() {
        return (
            <View style={{
                ...this.props.style,
                alignItems: "center",
                marginHorizontal: 5
            }}>
                {this.renderYearPicker()}
                <FlatList
                    initialScrollIndex={this.state.selectedMonth.getMonth() - 1}
                    data={this.createMonthInYear()}
                    renderItem={({ item }) => this.renderMonthWidget(item)}
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                />
                {this.renderSeparator()}
            </View>
        );
    }
};

export default MonthPicker;

const styles = StyleSheet.create({
    monthWidgetContainer: {
        alignItems: "center",
        width: (SIZES.WINDOW_WIDTH - 70) / 6,
        marginHorizontal: 5,
    },
    monthText: {
        ...FONTS.h4,
        paddingHorizontal: 10,
        paddingVertical: 3,
        color: COLORS.white
    },
    monthContainer: {
        borderRadius: 5,
        borderWidth: 1,
        borderColor: COLORS.lightGray,
        marginTop: 10,
        backgroundColor: "transparent"
    },
    yearText: {
        ...FONTS.h2,
        color: COLORS.white
    },
    yearPickerContainer: {
        flexDirection: "row",
        width: "60%",
        borderRadius: 50,
        borderWidth: 1,
        borderColor: colorWithOpacity(COLORS.lightGray, 0.4),
        backgroundColor: COLORS.darkGray,
        justifyContent: "space-between",
        alignItems: "center"
    },
    forwardYearButton: {
        width: 36,
        height: 36,
        // borderRadius: 18,
        // backgroundColor: COLORS.lightGray,
        justifyContent: "center",
        alignItems: "center"
    }
});