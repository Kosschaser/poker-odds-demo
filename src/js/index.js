import '../style/style.scss';
import '../style/reset.scss';
import { names } from './names.js';
import Table from "./table.js";

function bindShowOdds(e){
    showOdds(e.currentTarget.thisNum);
}

function toggleBoardButton() {
    const cardsButton = document.querySelector('.addcards');
    if(table.players.length == 0 || table.board.length == 5) {
        cardsButton.classList.add('addcards--none');
    }else if(table.players.length > 0){
        cardsButton.classList.remove('addcards--none');
        if(table.board.length == 0){
            cardsButton.innerHTML = 'Set Flop';
        }else if(table.board.length == 3) {
            cardsButton.innerHTML = 'Set Turn';
        }else if(table.board.length == 4) {
            cardsButton.innerHTML = 'Set River';
        }
    }
}

function takeName(arr) {
    let userName = arr[Math.floor(Math.random()*arr.length)];
    if(userName.taken){
        return takeName(arr);
    }else{
        userName.taken = true;
        return userName.name;
    }
}

function toggleBoard(e) {
    const target = e.target;
    const boardCards = document.querySelector('.cardplace');
    if(target.innerHTML == 'Set Flop'){
        table.setFlop();
    }else if(target.innerHTML == 'Set Turn'){
        table.setTurn();
    }else if(target.innerHTML == 'Set River'){
        table.setRiver();
    }
    boardCards.innerHTML = '';
    for (let i = 0; i < table.board.length; i++) {
        boardCards.insertAdjacentHTML('beforeend', 
        `
        <div class='card card--${table.board[i].suit}'>
            <div class="card--num">
            ${table.board[i].number == 'T' ? 10 : table.board[i].number}
            </div>
            <div class="card--num-inverted">
            ${table.board[i].number == 'T' ? 10 : table.board[i].number}
            </div>
        </div>
    `);
    }
    toggleBoardButton();
}
function startPlayer(e) {
    const thisNode = e.target.parentNode;
    const nextNode = thisNode.nextElementSibling;
    const cardPlace = thisNode.querySelector('.cards');
    if(nextNode.classList.contains('player')){
        nextNode.classList.remove('player--empty');
    }
    table.addPlayer(takeName(names));
    let handNumber;
    for(const item of cells.entries()){
        if(item[1].classList.toString() == thisNode.classList.toString()){
            handNumber = item[0];
            break;
        }
    }
    const player = table.players[handNumber];
    for (let i = 0; i < player.hand.length; i++) {
        cardPlace.insertAdjacentHTML('beforeend', 
        `
        <div class='card card--${player.hand[i].suit}'>
            <div class="card--num">
            ${player.hand[i].number == 'T' ? 10 : player.hand[i].number}
            </div>
            <div class="card--num-inverted">
            ${player.hand[i].number == 'T' ? 10 : player.hand[i].number}
            </div>
        </div>
        `);
    }
    e.target.insertAdjacentHTML('beforebegin', 
    `
        <div class='player--name'>${player.name}</div>
    `)
    e.target.classList.add('addplayer--exists');
    thisNode.thisNum = handNumber;
    thisNode.addEventListener('click', bindShowOdds);
    toggleBoardButton();
}
function showOdds(hand) {
    if(table.board.length > 0){
        const data = table.evaluateHand[hand];
        const results = table.calculateOdds()[hand];
        const wins = results.wins / results.count * 100;
        const dataNest = document.querySelector('.evaluator');
        const winsNest = document.querySelector('.wins');
        dataNest.innerHTML = '';
        dataNest.insertAdjacentHTML('beforeend', `
            <div class='evaluator--name'>${table.players[hand].name}</div>
        `)
        data.forEach((el) => {
            if(table.board.length == 5 && typeof el.odds == 'number'){
                el.odds = 'Not possible!';
            }
            dataNest.insertAdjacentHTML('beforeend', `
                <div class='evaluator--cell'>
                <div>${el.combo}</div>
                <div>${typeof el.odds == 'string' ? el.odds : el.odds.toFixed(2) + '%'}</div>
                </div>
            `)
        })
        winsNest.innerHTML = '';
        winsNest.insertAdjacentHTML('beforeend', `
            <div>${wins.toFixed(2)}%</div>
        `)
    }
}
function reset() {
    const players = document.querySelectorAll('.player');
    const board = document.querySelector('.cardplace');
    const results = document.querySelectorAll('.results--block');
    players.forEach((el, inx) => {
        el.querySelector('.cards').innerHTML = '';
        el.querySelector('.addplayer').classList.remove('addplayer--exists');
        if(el.querySelector('.player--name')){
            el.removeChild(el.querySelector('.player--name'));
        }
        if(!inx == 0){
            el.classList.add('player--empty')
        }
        el.removeEventListener('click', bindShowOdds);
    })
    results.forEach(el => el.innerHTML = '')
    board.innerHTML = '';
    names.forEach(el => el.taken = false);
    table = new Table();
    console.log(table);
    toggleBoardButton();
}

const boardButton = document.querySelector('.addcards');
const buttons = document.querySelectorAll('.addplayer');
const resetButton = document.querySelector('.reset');
const cells = document.querySelectorAll('.player');

buttons.forEach((el) => {
    el.addEventListener('click', startPlayer);
})
boardButton.addEventListener('click', toggleBoard);
resetButton.addEventListener('click', reset)

let table = new Table();