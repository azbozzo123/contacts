//test profiles [coach.bozzo@gmail.com, 123123], [abo@abo.com, 123123], [azbozzo@abo.com, 123123]



Contacts = new Mongo.Collection("contacts")



if (Meteor.isClient) {

  
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



      if(event.target.picURL.value !== ''){

        var pURL = event.target.picURL.value;

      }

      //default img

      else {var pURL = "http://southerncalifornia.arlisna.org/wp-content/uploads/2008/03/generic-profile.png";}

      

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


    //deletmmnme button inside contact

    "click .delete": function(){

      Contacts.remove(this._id);

    },



    //open edit fields inside contact

    "click .edit": function(){

      $(event.target).parent().children('.editFields').toggleClass('hidden');

    },


    //update new info from edit form 
    "submit .editFields": function(){

      console.log('Submition??');

      var fstName = this.firstName.value;

      var lstName = this.lastName.value;

      var company = this.company.value;

      var eml = this.email.value;

      var phNum = this.phoneNum.value;


      if(this.picURL.value !== ''){

          var pURL = this.picURL.value;

      }

      //default img

      else {var pURL = "http://southerncalifornia.arlisna.org/wp-content/uploads/2008/03/generic-profile.png";}




      
      //remove edit fields

      $('.editFields').toggleClass('hidden');
      Meteor.call("updateContact", fstName, lstName, company, eml, phNum, pURL);
    }

  });

}



if (Meteor.isServer) {

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
  updateContact: function(fstName, lstName, company, eml, phNum, pURL){

    Contacts.update(this._id,
 
      {$set:{
	firstName: fstName,
	lastName: lstName, 
	company: company, 
	email: eml, 
	phoneNum: phNum, 
	picURL: pURL}
       }

    )

  }

});