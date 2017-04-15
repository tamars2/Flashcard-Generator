//required node packages
var inquirer = require("inquirer");
var fs = require("fs");

//object constructor for basic card
function BasicCard(front, back) {
    this.front = front;
    this.back = back;
    //create method makes the basic card object
    this.create = function() {
		var cardData = {
			type: "basic",
			front: this.front,
			back: this.back
    	};
    	//write the object to .txt file
    	writeFile(cardData);
    }
}
//object constructor for Cloze card
function ClozeCard(text, cloze){
    this.text = text;
    this.cloze = cloze;
    //replace cloze word with ellipsis
    this.clozeDeleted = this.text.replace(this.cloze, ' ... ');
    //create method makes the cloze card object
    this.create = function() {
    	var cardData = {
    		type: "cloze",
    		text: this.text,
    		cloze: this.cloze,
    		clozeDeleted: this.clozeDeleted
    		
    	};
    	//write the object to .txt file
    	writeFile(cardData); 
    }
}
//this is the API that prompts user for card info, creates cards and logs them
function addCards() {
	inquirer.prompt({
	    type: 'list',
	    name: 'cards',
	    message: 'Which type of card would you like to create? (press control^c to exit)',
	    choices: ['BasicCard', 'ClozeCard']
	}).then(function (data) {
		//if user choses basic, ask for font and back info
		if(data.cards === 'BasicCard'){
        	return inquirer.prompt([
       	    {
                type: 'input',
                name: 'front',
                message: 'What do you want on the front of the card?'
            }, 
            {
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
    	        }, 
    	        {
        	        type: 'input',
            	    name: 'cloze',
            	    message: 'What would you like deleted from your cloze card?'
            	}
        	]);
    	}
    //then make the cards using object Constructors
}).then(function(data){
		//construct basic card and begin input validation
        if (data.front && data.back){
            var basic = new BasicCard(data.front, data.back);
            basic.create();
            console.log("Your Basic card has been added to the deck!");
            addCards();

        }
        //construct cloze card and continue input validation
        else if (data.text && data.cloze) {
            var cloze = new ClozeCard(data.text, data.cloze);
            cloze.create();
            console.log("Your Cloze card has been added to the deck!");
            addCards();
        }
        else {
        	console.log('You must fill out each side of the card!  Please try again.');
		 	addCards();
        }
    })
	//catch and log errors should they happen
    .catch(function (err) {
     console.log(err);
});
}
//function for writing data to the .txt file
function writeFile(cardData) {
	fs.appendFile('./log.txt', "\r\n" + JSON.stringify(cardData), 'utf8', function (error, data) {
   	});
}
//run the API at least one time
addCards();