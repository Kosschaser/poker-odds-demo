import Card from './card.js';

export default class Deck {
    constructor() {
        this.cards = [];
        ['s', 'c', 'd', 'h'].forEach(back => {
            [2, 3, 4, 5, 6, 7, 8, 9, 'T', 'J', 'Q', 'K', 'A'].forEach(num => {
                this.cards.push(new Card(back, num));   //generating a deck of 52 cards
            })
        })
    }
    fetchCard(num) {
        let output = [];
        for (let i = 0; i < num; i++) {
            let item = this.cards.splice(Math.floor(Math.random()*this.cards.length), 1);
            output.push(item[0]);
        }
        return output;
    }
}