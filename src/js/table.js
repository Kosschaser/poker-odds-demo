import Deck from './deck.js';
import Player from "./player.js";
import Evaluator from "./evaluator.js";
import { calculateEquity } from 'poker-odds';

export default class Table {
    constructor() {
        this.players = [];
        this.deck = new Deck();
        this.board = [];
    }
    addPlayer(name) {
        if(this.players.length < 9){
            return this.players.push(new Player(name, this.deck.fetchCard(2)));
        }
    }
    setFlop() {
        if(!this.board.length){
            this.board = this.deck.fetchCard(3);
        }else  if(!this.players.length){
            alert('Please add at least one player');
        }
    }
    setTurn() {
        this.board.push(this.deck.fetchCard(1)[0]);
    }
    setRiver() {
        this.board.push(this.deck.fetchCard(1)[0]);
    }
    calculateOdds() {
        const allCards = [];
        const allCardsBoard = this.board.map(item => item.value);
        for(let i = 0; i < this.players.length; i++){
            let tempCards = [];
            for(let j = 0; j < this.players[i].hand.length; j++){
                tempCards.push(this.players[i].hand[j].value);
            }
            allCards.push(tempCards);
        }
        return calculateEquity(allCards, allCardsBoard, 1000);
    }
    get evaluateHand() {
        const output = [];
        this.players.forEach((el) => {
            output.push(new Evaluator(el.hand, this.board).results);
        });
        return output;
    }
}