const Base64 = (() => {
    const alphabet = '-0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz';
    const base64Values = {'0': 1n, '1': 2n, '2': 3n, '3': 4n, '4': 5n, '5': 6n, '6': 7n, '7': 8n, '8': 9n, '9': 10n, '-': 0n, 'A': 11n, 'B': 12n, 'C': 13n, 'D': 14n, 'E': 15n, 'F': 16n, 'G': 17n, 'H': 18n, 'I': 19n, 'J': 20n, 'K': 21n, 'L': 22n, 'M': 23n, 'N': 24n, 'O': 25n, 'P': 26n, 'Q': 27n, 'R': 28n, 'S': 29n, 'T': 30n, 'U': 31n, 'V': 32n, 'W': 33n, 'X': 34n, 'Y': 35n, 'Z': 36n, '_': 37n, 'a': 38n, 'b': 39n, 'c': 40n, 'd': 41n, 'e': 42n, 'f': 43n, 'g': 44n, 'h': 45n, 'i': 46n, 'j': 47n, 'k': 48n, 'l': 49n, 'm': 50n, 'n': 51n, 'o': 52n, 'p': 53n, 'q': 54n, 'r': 55n, 's': 56n, 't': 57n, 'u': 58n, 'v': 59n, 'w': 60n, 'x': 61n, 'y': 62n, 'z': 63n};

    return {
        fromInt: (bigNum) => {
            if(typeof bigNum != 'bigint')
                bigNum = BigInt(bigNum);

            let length = 1 + bigNum.toString().length / 2 | 0;
            const result = Array(length); //to calculate the exact size of the output some complex log calcs are needed, I use this to get an approximation
            do {
                result[--length] = alphabet[(bigNum & 0x3fn)];
                bigNum >>= 6n;
            } while (bigNum > 0)
            return result.join('');
        },
        toInt: (input) => {
            if(!input)
                return 0;

            var result = 0n;
            for (var i = 0n; i < input.length; i++) 
                result = (result << 6n) + base64Values[input[i]];

            return `${result}`;
        }
    };
})();

export function ntob(number) {
    return Base64.fromInt(number);
}

export function bton(string) {
    return Base64.toInt(string);
}

export function capitalize(string) {
    return string[0].toUpperCase() + string.slice(1);
}