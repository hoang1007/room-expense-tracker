// import "intl";
// import "intl/locale-data/jsonp/vi";

export function currencyFormatter(value: number) {
    return value.toLocaleString("vi-VN", {
        style: "currency",
        currency: "VND"
    });
}