export interface Card {
    images: {
        svg: string;
        png: string;
    };
    image: string;
    value: string;
    suit: string;
    code: string;
}
