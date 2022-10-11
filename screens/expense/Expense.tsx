import React from "react";
import { BackHandler, NativeEventSubscription, ScrollView, StatusBar, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { PAGES } from "..";
import { MonthPicker } from "../../components";
import { COLORS, SIZES } from "../../constants";
import { DateTime, Item } from "../../objects";
import User from "../../objects/user";
import { UserContext } from "../../services/UserProvider";
import ItemListView from "./widgets/ItemListView";
import SummaryWidget from "./widgets/Summary";
import UserBottomBar, { getBottomUserBarHeight } from "./widgets/UserBottomBar";


export interface ExpenseScreenProps {
    navigate: (page: PAGES) => void,
    isFocused: boolean
};

interface ExpenseScreenState {
    loading: boolean,
    month?: DateTime.Month,
    paid: boolean,
    users: User[],
    focusUser?: User
}

class ExpenseScreen extends React.PureComponent<ExpenseScreenProps, ExpenseScreenState> {
    static contextType = UserContext;
    declare context: React.ContextType<typeof UserContext>;

    backHanlderSubscriber: NativeEventSubscription | undefined;

    constructor(props: ExpenseScreenProps) {
        super(props);

        this.state = {
            loading: true,
            paid: false,
            users: []
        }
    }

    prepareData = (month: DateTime.Month) => {
        if (this.state.month === undefined || this.state.month.toLocaleString() !== month.toLocaleString()) {
            this.setState({ loading: true })

            if (month.equal(DateTime.Month.now)) {
                const uid = this.state.focusUser?.uid ?? this.context?.selfUser!.uid;
                const focusUser = this.context!.users.find((user) => user.uid === uid)!;

                this.setState({ month: month, users: this.context!.users, focusUser: focusUser });
            } else {
                this.context?.getUsersInMonth(month).then((users) => {
                    const uid = this.state.focusUser?.uid ?? this.context?.selfUser!.uid;
                    const focusUser = users.find((user) => user.uid === uid)!;

                    this.setState({ month: month, users: users, focusUser: focusUser });
                });
            }

            this.context?.getPaidStatus(month).then((status) => {
                this.setState({ paid: status, loading: false })
            })
        }
    }

    componentDidMount(): void {
        this.backHanlderSubscriber = BackHandler.addEventListener("hardwareBackPress", () => {
            if (this.props.isFocused) {
                this.props.navigate(PAGES.HOME);

                return true;
            } else {
                return false;
            }
        });

        this.prepareData(DateTime.Month.now);
    }

    componentDidUpdate(prevProps: Readonly<ExpenseScreenProps>, prevState: Readonly<ExpenseScreenState>, snapshot?: any): void {
        // change from context
        if (this.state.month?.equal(DateTime.Month.now) &&
            this.state.focusUser?.boughtItems.length != this.context?.selfUser?.boughtItems.length) {
            this.setState({ users: this.context?.users!, focusUser: this.context?.selfUser });
        }
    }

    componentWillUnmount(): void {
        this.backHanlderSubscriber?.remove();
    }

    getSummaryInfo() {
        let total = 0
        let selfExpense = 0
        let diff = 0

        for (let user of this.state.users) {
            let sum_ = 0;

            user.boughtItems.forEach((item) => {
                sum_ += item.price.value
            })

            total += sum_

            if (user.uid === this.context?.selfUser?.uid) {
                selfExpense = sum_
            }
        }

        if (this.state.users.length > 0) {
            diff = Math.round(selfExpense - total / this.state.users.length)
        }

        return {
            total: total,
            expense: selfExpense,
            diff: diff,
            paid: this.state.paid,
            setPaid: (paid: boolean) => {
                this.setState({ paid: paid });
                this.context?.setPaidStatus(this.state.month!, paid);
            }
        }
    }

    getUserItems() {
        return this.state.focusUser?.boughtItems ?? [];
    }

    render() {
        return (
            <SafeAreaView style={{ flex: 1 }}>
                <StatusBar barStyle={"light-content"} backgroundColor={COLORS.black} />
                <View style={outcomeStyles.container}>
                    <MonthPicker onMonthChange={this.prepareData} />
                    <ScrollView
                        showsVerticalScrollIndicator={false}
                    >
                        <SummaryWidget {...this.getSummaryInfo()} />
                        <ItemListView items={this.getUserItems()} />
                    </ScrollView>
                    {this.state.loading ? null : <UserBottomBar
                        initialFocusUser={this.state.focusUser!}
                        users={this.state.users}
                        onClickUser={(user) => this.setState({ focusUser: user })} />}
                </View>
            </SafeAreaView>
        );
    }
}

export default ExpenseScreen;

const outcomeStyles = StyleSheet.create({
    container: {
        flex: 1
    },
    itemContainer: {
        width: SIZES.WINDOW_WIDTH * 0.9,
        marginVertical: 8,
        borderRadius: 15,
        backgroundColor: COLORS.darkGray,
        borderWidth: 0
    }
});