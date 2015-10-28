Contacts = new Mongo.Collection("contacts")

if (Meteor.isClient) {
	Meteor.subscribe("contacts");
	
	Template.body.helpers({
		//sort contacts by last name
		contacts: function() {
			return Contacts.find({}, {sort: {lastName: 1}});
		}
  	});

  	Template.body.events({
  	
    		//click on Add button to open new contact form only if someone is logged on
    		"click #newContact": function(){
		  	if(Meteor.userId() !== null){
			        $('.addContactForm').toggleClass('hidden');
			}
    		},

		//listen to button to add contact
		"submit .new-contact": function(event){
      			
			//prevent default form submit
      			event.preventDefault();
        
      			//grab all info from new contact form
      			var fstName = event.target.firstName.value;
      			var lstName = event.target.lastName.value;
      			var company = event.target.company.value;
      			var eml = event.target.email.value;
      			var phNum = event.target.phoneNum.value;

      			//default img vs inputed img
      			if(event.target.picURL.value !== ''){
        			var pURL = event.target.picURL.value;
      			}else {
      				var pURL = "http://southerncalifornia.arlisna.org/wp-content/uploads/2008/03/generic-profile.png";
      			}

      			//run function to add contct to database
      			Meteor.call("addContact", fstName, lstName, company, eml, phNum, pURL);
  
      			//for testing
      			console.log(Contacts.find().fetch());
      
      			//clear form
      			event.target.firstName.value = '';
			event.target.lastName.value = '';
			event.target.company.value = '';
			event.target.email.value = '';
			event.target.phoneNum.value = '';
			event.target.picURL.value = '';
    		},

    		//click on contact to open up rest of info
    		"click .info": function(){
      			$(event.target).children('.moreInfo').toggleClass('hidden');
    		},

    		//make sure all of contact area can trigger info to display
    		"click .pInfo": function(){
      			$(event.target).parent().children('.moreInfo').toggleClass('hidden');
    		}
  	});
  
  	Template.contact.helpers({
    		//return true if contact belongs to user signed in
    		isOwner: function() {
       			return this.owner === Meteor.userId();
    		}
  	});

  	Template.contact.events({

    		//delete button inside contact
    		"click .delete": function(){
      			Contacts.remove(this._id);
		},

    		//open edit fields inside contact
    		"click .edit": function(){
      			$(event.target).parent().children('.editFields').toggleClass('hidden');
    		},

    		//update new info from edit form 
    		"submit .editFields": function(event){
      			//prevent refresh of page
      			event.preventDefault();
      			
      			//take info from edit form
      			var ID = this._id;
      			var fstName = event.target.firstName.value;
      			var lstName = event.target.lastName.value;
      			var company = event.target.company.value;
      			var eml = event.target.email.value;
      			var phNum = event.target.phoneNum.value;
			//img to be default or added by user
      			if(event.target.picURL.value !== ''){
          			var pURL = event.target.picURL.value;
      			}else {
      				var pURL = "http://southerncalifornia.arlisna.org/wp-content/uploads/2008/03/generic-profile.png";
      			}
      
      			//remove edit fields
      			$(event.target).toggleClass('hidden');
      			
      			//function to update contact in database
      			Meteor.call("updateContact", ID, fstName, lstName, company, eml, phNum, pURL);
    		}
  	});
}

if (Meteor.isServer) {
	Meteor.publish("contacts", function() {
		return Contacts.find({owner: this.userId});
	});
}

Meteor.methods({

  	//use info from form to add object in database
  	addContact: function(fstName, lstName, company, eml, phNum, pURL){
    		Contacts.insert({
      			owner: Meteor.userId(),
      			firstName: fstName,
			lastName: lstName,
      			company: company,
      			email: eml,
      			phoneNum: phNum,
      			picURL: pURL
    		});
  	},

  	//user info from edit form on contact to update info
  	updateContact: function(ID, fstName, lstName, company, eml, phNum, pURL){
    		Contacts.update(ID, {$set:{
			firstName: fstName, 
			lastName: lstName, 
			company: company, 
			email: eml, 
			phoneNum: phNum, 
			picURL: pURL}
       		})
  	}
});
