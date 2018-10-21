$(document).ready(function(){

   $(".book_roll").on("click", "div.book_cell", function(){  // open full description of selected contact.     
           
      var cardID = "#card_" + this.id; // extracting "card_ID" from "cell_ID".
      var cardClass = $(cardID).attr("class"); 
      var chevronToShow =  `#${this.id} i.chevronUp`; // getting chevron mark of opened contact by ID.
      
      if (cardClass == "card") { 
        $(".card").attr("class","card hide"); //close opened card if its opened.
        $(chevronToShow).attr("class","material-icons chevronUp hide");  //hide shevron.

    } else {
      $(".card").attr("class","card hide"); //close all cards if one of them is opened.
      $(cardID).toggleClass("hide"); // open selected card.

      $(".chevronUp").attr("class","material-icons chevronUp hide"); // hiding all shevrons if one of them is showed.
      $(chevronToShow).attr("class","material-icons chevronUp");  // showing selected shevron.
     
    }

  });

  $(".book_roll").on("click", "div.btn", function(){ // this function handles "click edit button" event.

      var string = this.id; //extracting "card_ID" from "edit_button_ID".
      var ID = string.match(/\d+/g).map(Number);
      var cardID = "#card_" + ID; 

      var mydiv=$(`${cardID} .edit`), isEditable=mydiv.is('.editable'); // setting all fields of current card property "contenteditable" to true.
      $(mydiv).prop('contenteditable',!isEditable).toggleClass('editable');

      if(isEditable == true) { // this part is works when the "EDIT" button is clicked second time. This event saves changes to temp object and then to local storage.

        var tempUsername = $(`${cardID} #card_name`).text(); // set temp variables to write changes to Object.
        var tempPhone = $(`${cardID} #card_phone`).text();
        var tempEmail = $(`${cardID} #card_email`).text();
        var tempWebsite = $(`${cardID} #card_website`).text();
        var tempCompanyName = $(`${cardID} #card_company_name`).text();
        var tempCompanyBs = $(`${cardID} #card_company_bs`).text();
        var tempCompanyCatchPhrase = $(`${cardID} #card_company_catchPhrase`).text();

        var tempObj = JSON.parse(localStorage.getItem("localObj")) //parse serialized objectfrom LocalStorage to JS object.

        tempObj[ID].username = tempUsername;
        tempObj[ID].phone = tempPhone;
        tempObj[ID].email = tempEmail;
        tempObj[ID].website = tempWebsite;
        
        var serialObj = JSON.stringify(tempObj); // prepearing to store. serialize.
        localStorage.setItem('localObj', serialObj); // saveing to localStorage. 
        console.log("LocalStorage has been updated.");
      }

  });

  // var search_url='http://demo.sibers.com/users'; // if we want to download JSON contact file from Sibers server.
  var search_url='/users'; // if we want to load JSON from file in current directory.

  $.getJSON(search_url, function(jsonString) { // Get JSON from URL. Save object to LocalStorage. 
    
    if(!localStorage.getItem("localObj")) { // if local object do not exist. 
      var serialObj = JSON.stringify(jsonString); // Making object ready for sending to storage. serialization.
      localStorage.setItem('localObj', serialObj); //Saveing serialized object to localStorage.
      console.log("JSON has been loadead from the server");
    } else {
      console.log("we dont need to load JSON from the server. JSON has been loadead from localStorage");
    }
    generate_cells(); // start generating contact cells.
  });
  
  function  generate_cells(){ // function creating cells of our contatc list.

    var bookObj = JSON.parse(localStorage.getItem("localObj")) //parse serialized object to JS object.

    var sortArr = []; // writing "user objects" to array which we can sort.
    for (var key in bookObj) {
      sortArr.push(bookObj[key]);
    }  

    sortArr.sort(function(a, b){ // sorting array
     var nameA=a.name.toLowerCase(), nameB=b.name.toLowerCase();
       if (nameA < nameB) //sort string ascending
        return -1;
       if (nameA > nameB)
        return 1;
       return 0; //default return value (no sorting).
    });

    // console.log("array:"); //just checking if array sorted right.
    // console.log(sortArr);

  
    for (var key in sortArr) { // running an object elements to generate cells of a contact list.

        $('#print').append(`<div class='book_cell' id='${key}' contenteditable="false"> 
                            <img src="${sortArr[key].avatar}" onError="src='img/userpic.png'"  alt="pic" class="contact_icon noselect"> ${sortArr[key].name} <i class="material-icons chevronUp hide"> expand_less </i></div>`);
        $('#print').append(`<div class='card hide' id='card_${key}'>  
                              <div class="buttonfield">
                                <div class="btn" id="edit_btn_${key}"><i  class="material-icons" title="edit contact"> edit </i> </div>
                               </div> 
                              <table>
                                <tr><td>Username: </td><td></td></tr>
                                <tr><td></td><td class="edit" id="card_name" contenteditable="false"><h3>${sortArr[key].username} </h3></td></tr>
                                <tr><td> Contacts: </td></tr>
                                <tr><td> <i  class="material-icons"> phone </i> </td><td class="edit" id="card_phone" contenteditable="false">${sortArr[key].phone} </td></tr>
                                <tr><td> <i  class="material-icons"> email </i> </td><td class="edit" id="card_email" contenteditable="false">${sortArr[key].email} </td></tr>
                                <tr><td> <i  class="material-icons"> language </i> </td><td class="edit" id="card_website" contenteditable="false">${sortArr[key].website} </td></tr>
                                <tr><td> Company: </td></tr>
                                <tr><td> <i  class="material-icons"> work </i></td><td class="edit" id="card_company_name" contenteditable="false"><h3>${sortArr[key].company.name}</h3></td></tr>
                                <tr><td></td><td class="edit" id="card_company_bs" contenteditable="false">— ${sortArr[key].company.bs}</td></tr>
                                <tr><td></td><td class="edit" id="card_company_catchPhrase"contenteditable="false"><i>"${sortArr[key].company.catchPhrase}"</i></td></tr>
                              </table>
                              <div class="buttonfield">  <!-- This buttons are not working yet so we hide them -->
                                <div class="btn hide" id="undo_btn_${key}"><i  class="material-icons" title="undo changes"> undo </i> </div> 
                                <div class="btn hide" id="delete_btn_${key}"><i  class="material-icons" title="delete contacat"> delete_forever </i> </div>
                                <div class="btn hide" id="check_btn_${key}"><i  class="material-icons" title="save changes"> check </i> </div>
                               </div> 
                            </div>`);
         $('.material-icons.loader').attr("class","hide");  // hiding that spinning update icon when the work is done here.
    } 
  }
});

