
// A map of Hindi words for numbers 1 to 100 for accurate conversion.
const HINDI_MAP_1_TO_100: string[] = [
    '', 'एक', 'दो', 'तीन', 'चार', 'पाँच', 'छह', 'सात', 'आठ', 'नौ',
    'दस', 'ग्यारह', 'बारह', 'तेरह', 'चौदह', 'पंद्रह', 'सोलह', 'सत्रह', 'अठारह', 'उन्नीस',
    'बीस', 'इक्कीस', 'बाईस', 'तेईस', 'चौबीस', 'पच्चीस', 'छब्बीस', 'सत्ताईस', 'अट्ठाईस', 'उनतीस',
    'तीस', 'इकतीस', 'बत्तीस', 'तैंतीस', 'चौंतीस', 'पैंतीस', 'छत्तीस', 'सैंतीस', 'अड़तीस', 'उनतालीस',
    'चालीस', 'इकतालीस', 'बयालीस', 'तैंतालीस', 'चौवालीस', 'पैंतालीस', 'छियालीस', 'सैंतालीस', 'अड़तालीस', 'उनचास',
    'पचास', 'इक्यावन', 'बावन', 'तिरपन', 'चौवन', 'पचपन', 'छप्पन', 'सत्तावन', 'अट्ठावन', 'उनसठ',
    'साठ', 'इकसठ', 'बासठ', 'तिरसठ', 'चौंसठ', 'पैंसठ', 'छियासठ', 'सरसठ', 'अड़सठ', 'उनहत्तर',
    'सत्तर', 'इकहत्तर', 'बहत्तर', 'तिहत्तर', 'चौहत्तर', 'पचहत्तर', 'छिहत्तर', 'सतहत्तर', 'अठहत्तर', 'उनासी',
    'अस्सी', 'इक्यासी', 'बयासी', 'तिरासी', 'चौरासी', 'पचासी', 'छियासी', 'सत्तासी', 'अट्ठासी', 'नवासी',
    'नब्बे', 'इक्यानबे', 'बानबे', 'तिरानबे', 'चौरानबे', 'पंचानबे', 'छियानबे', 'सतानबे', 'अठानबे', 'निन्यानबे', 'सौ'
];

const ONES = ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];
const TEENS = ['ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
const TENS = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];

const convertLessThanOneThousand = (num: number): string => {
    if (num === 0) return '';
    if (num < 10) return ONES[num];
    if (num < 20) return TEENS[num - 10];
    if (num < 100) return `${TENS[Math.floor(num / 10)]} ${ONES[num % 10]}`;
    return `${ONES[Math.floor(num / 100)]} hundred ${convertLessThanOneThousand(num % 100)}`;
};

const toIndianEnglish = (num: number): string => {
    const number = Math.floor(num);
    if (number === 0) return 'Zero';

    const process = (n: number, divisor: number, unit: string): string => {
        const quotient = Math.floor(n / divisor);
        const remainder = n % divisor;
        const remainderStr = toIndianEnglish(remainder);
        return `${convertLessThanOneThousand(quotient)} ${unit} ${remainderStr === 'Zero' ? '' : remainderStr}`.trim();
    };

    if (number < 1000) return convertLessThanOneThousand(number);
    if (number < 100000) return process(number, 1000, 'thousand');
    if (number < 10000000) return process(number, 100000, 'lakh');
    return process(number, 10000000, 'crore');
};

const toHindi = (num: number): string => {
    const number = Math.floor(num);
    if (number === 0) return '';
    if (number <= 100) return HINDI_MAP_1_TO_100[number];

    const process = (n: number, divisor: number, unit: string): string => {
        const quotient = Math.floor(n / divisor);
        const remainder = n % divisor;
        const remainderStr = toHindi(remainder);
        return `${toHindi(quotient)} ${unit} ${remainderStr}`.trim();
    };

    if (number < 1000) {
        const hundreds = Math.floor(number / 100);
        const remainder = number % 100;
        let hundredsStr = "";
        // Special case for 100-199 to ensure 'एक सौ' is used.
        if (hundreds === 1) {
            hundredsStr = "एक सौ";
        } else if (hundreds > 1) {
            hundredsStr = `${HINDI_MAP_1_TO_100[hundreds]} सौ`;
        }
        return `${hundredsStr} ${toHindi(remainder)}`.trim();
    }
    if (number < 100000) return process(number, 1000, 'हज़ार');
    if (number < 10000000) return process(number, 100000, 'लाख');
    return process(number, 10000000, 'करोड़');
};

export const numberToWords = (num: number): { english: string; hindi: string } => {
    if (num === null || num === undefined) return { english: '', hindi: '' };

    // Round the number to the nearest integer for word conversion.
    const roundedNum = Math.round(num);

    const englishInteger = toIndianEnglish(roundedNum)
        .replace(/\s+/g, ' ')
        .trim()
        .replace(/\s$/, '')
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');

    const hindiInteger = toHindi(roundedNum).replace(/\s+/g, ' ').trim();

    return {
        english: `${englishInteger} / Rupees`,
        hindi: `${hindiInteger} / रुपये`
    };
};
