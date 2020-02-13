export default class evaluateHand{
    constructor(hand, board){
        this.hand = [...hand];
        this.board = [...board];
        this.results = [];
        this.cards = 52 - (this.board.length + this.hand.length);
        this.handValues = [...hand, ...board].map(el => {
            return el.number;
        })
        this.handColor = [...hand, ...board].map(el => {
            return el.suitColor;
        })
        this.duplicates = this.hasDuplicates(this.handValues);
        
        this.checkForPair();
        this.checkForTwoPairs();
        this.checkForThreeofAKind();
        this.checkForFourofAKind();
        this.checkForFlush();
        this.checkForStraight();
        this.checkForFullHouse();
        this.checkForStraightFlush();
        this.checkForRoyalFlush();
    }
    checkForPair() {
        const output = {
            combo: 'Pair',
            odds: null
        }
        if(Object.values(this.duplicates).some(val => val >= 2)){
            output.odds = 'Already on the board';
        }else{
            output.odds = ((this.handValues.length * 3) / this.cards) * 100;
        }
        this.results.push(output);
    }
    checkForTwoPairs() {
        const output = {
            combo: 'Two Pairs',
            odds: null
        };
        const valuesToCompare = {};
        for(const prop in this.duplicates){
            if(this.duplicates[prop] > 1){
                valuesToCompare[prop] = this.duplicates[prop];
            }
        }
        if(Object.keys(valuesToCompare).length >= 2){
            output.odds = 'Already on the board';
        }else if(Object.keys(valuesToCompare).length == 1){
            output.odds = (((this.handValues.length - 2) * 3) / this.cards) * 100;
        }
        else if(Object.keys(valuesToCompare).length == 0){
            if(this.isFlop()){
                output.odds = 
                (((this.handValues.length * 3) / this.cards) *
                (((this.handValues.length - 1) * 3) / (this.cards - 1)))
                * 100;
            }else{
                output.odds = 'Not possible!';
            }
        }
        this.results.push(output);
    }
    checkForThreeofAKind() {
        const output = {
            combo: 'Three of a Kind',
            odds: null
        };
        if(Object.values(this.duplicates).some(val => val == 3)){
            output.odds = 'Already on the board';
        }else if(Object.values(this.duplicates).some(val => val == 2)){
            output.odds = (2 / this.cards) * 100;
        }else if(Object.values(this.duplicates).some(val => val == 1)){
            if(this.isFlop()){
                output.odds = 
                (3 / this.cards) *
                (2 / (this.cards - 1)) * 100;
            }else{
                output.odds = 'Not possible!';
            }
        }
        this.results.push(output);
    }
    checkForFourofAKind() {
        const output = {
            combo: 'Four of a Kind',
            odds: null
        };
        if(Object.values(this.duplicates).some(val => val == 4)){
            output.odds = 'Already on the board';
        }else if(Object.values(this.duplicates).some(val => val == 3)){
            output.odds = (1 / this.cards) * 100;
        }else if(Object.values(this.duplicates).some(val => val == 2)){
            if(this.isFlop()){
                output.odds = (2 / this.cards) *
                (1 / (this.cards - 1)) * 100;
            }else{
                output.odds = 'Not possible!';
            }
        }else{
            output.odds = 'Not possible!';
        }
        this.results.push(output);
    }
    checkForFlush() {
        const suits = this.hasDuplicates(this.handColor);
        const output = {
            combo: 'Flush',
            odds: null
        };
        if(Object.values(suits).some(val => val == 5)){
            output.odds = 'Already on the board';
        }else if(Object.values(suits).some(val => val == 4)){
            output.odds = ((13 - 4) / this.cards) * 100;
        }else if(Object.values(suits).some(val => val == 3)){
            if(this.isFlop()){
                output.odds = 
                ((13 - 3) / this.cards) *
                ((13 - 4) / (this.cards - 1)) * 100;
            }else{
                output.odds = 'Not possible!';
            }
        }else if(Object.values(suits).some(val => val < 3)) {
            output.odds = 'Not possible!';
        }
        this.results.push(output);
    }
    checkForStraight() {
        const output = {
            combo: 'Straight',
            odds: null
        };
        const allStraights = ['A2345','23456', '34567', '45678', '56789',
                            '6789T', '789TJ', '89TJQ', '9TJQK', 'TJQKA'];
        const orderedCards = this.handValues.filter((v, i) => this.handValues.indexOf(v) === i);
        const possibleStraights = {};
        for(let i = 0; i < allStraights.length; i++) {
            for(let j = 0; j < orderedCards.length; j++) {
                if(allStraights[i].includes(orderedCards[j])){
                    possibleStraights[allStraights[i]] = (possibleStraights[allStraights[i]] || 0) + 1;
                }
            }
        }
        if(Object.values(possibleStraights).some(val => val == 5)) {
            output.odds = 'Already on the board';
        }else if(Object.values(possibleStraights).some(val => val == 4)){
            output.odds = (
                4 * Object.values(possibleStraights).filter(v => v == 4).length 
                / this.cards) 
                * 100;
        }else if(Object.values(possibleStraights).some(val => val == 3)){
            if(this.isFlop()){
                output.odds = 
                (8 * Object.values(possibleStraights).filter(v => v == 3).length / this.cards) *
                (4 * Object.values(possibleStraights).filter(v => v == 3).length / (this.cards - 1)) 
                * 100;
            }else{ 
                output.odds = 'Not possible!';
            }
        }else{
            output.odds = 'Not possible!';
        }
        this.results.push(output);
    }
    checkForFullHouse() {
        const output = {
            combo: 'Full House',
            odds: null
        };
        const valuesToCompare = {};
        for(const prop in this.duplicates){
            if(this.duplicates[prop] > 1){
                valuesToCompare[prop] = this.duplicates[prop];
            }
        }
        if(Object.values(this.duplicates).some(val => val == 2) &&
        Object.values(this.duplicates).some(val => val == 3)){
            output.odds = 'Already on the board';
        }else if(Object.keys(valuesToCompare).length == 2){
            output.odds = (4 / this.cards) * 100;
        }else if(Object.values(this.duplicates).some(val => val == 3)){
            output.odds = (((this.handValues.length - 3) * 3) / this.cards) * 100;
        }else if(Object.values(this.duplicates).some(val => val == 2)){
            if(this.isFlop()){
                output.odds = (((this.handValues.length - 2) * 3) / this.cards) * 
                (4 / (this.cards -1)) * 100;
            }else{
                output.odds = 'Not possible!';
            }
        }else{
            output.odds = 'Not possible!';
        }
        this.results.push(output);
    }
    checkForStraightFlush() {
        const output = {
            combo: 'Straight Flush',
            odds: null
        };
        const allStraights = ['A2345','23456', '34567', '45678', '56789',
                            '6789T', '789TJ', '89TJQ', '9TJQK', 'TJQKA'];
        const sortedByValue = [...this.hand, ...this.board].reduce((rd, acc) => {
            rd[acc.suit] = rd[acc.suit] || [];
            rd[acc.suit].push(acc.number);
            return rd
        }, {});
        let orderedCards = null;
        for(let i = 0; i < Object.values(sortedByValue).length; i++){
            if(this.isFlop()){
                if(Object.values(sortedByValue)[i].length >= 3) {
                    orderedCards = Object.values(sortedByValue)[i];
                }
            }else if(this.isTurn()){
                if(Object.values(sortedByValue)[i].length >= 4) {
                    orderedCards = Object.values(sortedByValue)[i];
                }
            }
        }
        const possibleStraights = {};
        if(orderedCards){
            for(let i = 0; i < allStraights.length; i++) {
                for(let j = 0; j < orderedCards.length; j++) {
                    if(allStraights[i].includes(orderedCards[j])){
                        possibleStraights[allStraights[i]] = (possibleStraights[allStraights[i]] || 0) + 1;
                    }
                }
            }
            if(Object.values(possibleStraights).some(val => val == 5)) {
                output.odds = 'Already on the board';
            }else if(Object.values(possibleStraights).some(val => val == 4)){
                output.odds = (1 / this.cards) * 100;
            }else if(Object.values(possibleStraights).some(val => val == 3)){
                if(this.isFlop()){
                    output.odds = (2 / this.cards) * (1 / (this.cards - 1)) * 100;
                }else{
                    output.odds = 'Not possible!';
                }
            }else{
                output.odds = 'Not possible!'; 
            }
        }else{
            output.odds = 'Not possible!';
        }
        this.results.push(output);
        // console.log(orderedCards, Object.values(sortedByValue), possibleStraights);
    }
    checkForRoyalFlush() {
        const output = {
            combo: 'Royal Flush',
            odds: null
        };
        const theStraight = 'TJQKA';
        const sortedByValue = [...this.hand, ...this.board].reduce((rd, acc) => {
            rd[acc.suit] = rd[acc.suit] || [];
            rd[acc.suit].push(acc.number);
            return rd
        }, {});
        let orderedCards = null;
        for(let i = 0; i < Object.values(sortedByValue).length; i++){
            if(this.isFlop()){
                if(Object.values(sortedByValue)[i].length >= 3) {
                    orderedCards = Object.values(sortedByValue)[i];
                }
            }else if(this.isTurn()){
                if(Object.values(sortedByValue)[i].length >= 4) {
                    orderedCards = Object.values(sortedByValue)[i];
                }
            }
        }
        const possibleStraights = {};
        if(orderedCards){
            for(let j = 0; j < orderedCards.length; j++) {
                if(theStraight.includes(orderedCards[j])){
                    possibleStraights[theStraight[j]] = (possibleStraights[theStraight[j]] || 0) + 1;
                }
            }
            if(Object.values(possibleStraights).some(val => val == 5)) {
                output.odds = 'Already on the board';
            }else if(Object.values(possibleStraights).some(val => val == 4)){
                output.odds = (1 / this.cards) * 100;
            }else if(Object.values(possibleStraights).some(val => val == 3)){
                if(this.isFlop()){
                    output.odds = (2 / this.cards) * (1 / (this.cards - 1)) * 100;
                }else{ 
                    output.odds = 'Not possible!';
                }
            }else{
                output.odds = 'Not possible!';  
            }
        }else{
            output.odds = 'Not possible!';
        }
        this.results.push(output);
    }

    // Utility functions

    hasDuplicates(arr){
        let dupes = {};
        for(let  i = 0; i < arr.length; i++) {
            dupes[arr[i]] = (dupes[arr[i]] || 0) + 1;
        }
        return dupes;
    }
    isPreflop() {
        return this.handValues.length == 2;
    }
    isFlop() {
        return this.handValues.length == 5;
    }
    isTurn() {
        return this.handValues.length == 6;
    }
}