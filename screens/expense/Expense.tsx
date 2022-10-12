import React from "react";
import { BackHandler, NativeEventSubscription, RefreshControl, ScrollView, StatusBar, StyleSheet, View } from "react-native";
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
    monthPickerRef: React.RefObject<MonthPicker>;

    constructor(props: ExpenseScreenProps) {
        super(props);

        this.state = {
            loading: true,
            paid: false,
            users: []
        }

        this.monthPickerRef = React.createRef<MonthPicker>();
    }

    loadData = async (month: DateTime.Month) => {
        this.setState({loading: true});

        try {
            const users: User[] = await this.context?.getUsersInMonth(month)!;
            const status = await this.context?.getPaidStatus(month)!;

            const focusUserUID = this.state.focusUser?.uid ?? this.context?.selfUser?.uid;

            const focusUser = users.find((user) => user.uid === focusUserUID)!;

            this.setState({ users: users, focusUser: focusUser, month: month, paid: status, loading: false });
        } catch (err) {
            this.setState({loading: false});
            console.log(err);
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

        this.loadData(DateTime.Month.now);
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

            if (user.uid === this.state.focusUser!.uid) {
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
                    <MonthPicker ref={this.monthPickerRef} onMonthChange={(month) => this.loadData(month)} />
                    <ScrollView
                        showsVerticalScrollIndicator={false}
                        refreshControl={<RefreshControl
                            refreshing={this.state.loading}
                            onRefresh={() => {
                                this.monthPickerRef.current?.setSelectedMonth(DateTime.Month.now);
                            }}
                        />}
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