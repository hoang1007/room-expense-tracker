import { ColorValue } from "react-native";

/**
 * Parse color value to array of [R, G, B, A]
 * @param input Color value
 * @returns Array of [R, G, B, A]
 */
function parseColor(input: ColorValue): number[] {
    input = input.toString();

    if (input[0] == "#") {
        var collen = (input.length - 1) / 3;
        var fact = [17, 1, 0.062272][collen - 1];

        let start = 1;
        let color: number[] = [];

        for (let i = 0; i < 3; i++) {
            let end = start + collen;
            color.push(
                Math.round(parseInt(input.slice(start, end), 16) * fact)
            )
            start = end;
        }

        color.push(1); // for opacity

        return color;
    }
    else {
        return input.split("(")[1].split(")")[0].split(",").map(x => +x);
    }
};

function toColorStr(color: number[]): ColorValue {
    return `rgba(${color[0]}, ${color[1]}, ${color[2]}, ${color[3]})`;
}

function colorWithOpacity(input: ColorValue, opacity: number) {
    let colorArr = parseColor(input);
    colorArr[3] = opacity;

    return toColorStr(colorArr);
}

function overlayBlending(topColor: ColorValue, baseColor: ColorValue): ColorValue {
    const THRESHOLD = 127.5;

    let _topColor = parseColor(topColor);
    let _baseColor = parseColor(baseColor);

    for (let i = 0; i < 3; i++) {
        if (_baseColor[i] < THRESHOLD) {
            _topColor[i] = _baseColor[i] * _topColor[i] / THRESHOLD;
        } else {
            _topColor[i] = 255 - (255 - _baseColor[i]) * (2 - _topColor[i] / THRESHOLD);
        }
    }

    topColor = toColorStr(_topColor);
    return topColor;
};

export { parseColor, overlayBlending, colorWithOpacity };