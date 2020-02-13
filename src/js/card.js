export default class Card {
    constructor(suit, number) {
        this.suit = suit;
        this.number = number;
        this.value = number + suit;
    }
    get suitColor() {
        return this.suit;
    }
}