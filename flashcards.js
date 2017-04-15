var inquirer = require("inquirer");
var fs = require("fs");


//create basic card
function BasicCard(front, back){
    this.front = front;
    this.back = back;
}
//create Cloze card
function ClozeCard(text, cloze){
    this.text = text;
    this.cloze = cloze;
}

//make a partial prototype for cloze type cards
ClozeCard.prototype.partial = function () {
	//if the card has prototype of partial, replace cloze
	//string with ellipsis
    if(this.text.includes(this.cloze)){
        return this.text.replace(this.cloze, ' ... ');
    }
    else{
        return "ERROR";
    }
};


//prompt the user for card type
inquirer.prompt({
    type: 'list',
    name: 'cards',
    message: 'Choose your card?',
    choices: ['BasicCard', 'ClozureCard']
}).then(function (data) {
	//if user choses basic, ask for font and back info
    if(data.cards === 'BasicCard'){
        return inquirer.prompt([
            {
                type: 'input',
                name: 'front',
                message: 'What do you want on the front of the card?'
            }, {
                type: 'input',
                name: 'back',
                message: 'What do you want on the back of the card?'
            }
        ]);
    }

    else{
    	//else ask for cloze card info
        return inquirer.prompt([
            {
                type: 'input',
                name: 'text',
                message: 'What do you want on your card?'
            }, {
                type: 'input',
                name: 'cloze',
                message: 'What would you like deleted for your cloze card?'
            }
        ]);
    }
    //then make the cards using object Constructors
}).then(function(data){
		//construct basic card
        if(data.front){
            var basic = new BasicCard(data.front, data.back);
            addCards({data: basic});

        }
        //construct cloze card
        else{
            var cloze = new ClozeCard(data.text, data.cloze);
            addCards({data: cloze, partial: cloze.partial()});
        }


    })
	//catch and log errors should they happen
    .catch(function (err) {
     console.log(err);
});
//add cards to the cards json file for use later
var addCards = function (add) {
	console.log(add);

    fs.appendFile('./basic.json', "\r\n" + JSON.stringify(add), 'utf8', function (error, data) {
    	console.log("Your card has been added to the deck!");
   }); 
};