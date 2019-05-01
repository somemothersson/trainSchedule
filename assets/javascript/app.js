//base firebase config info for usage
var config = {
  apiKey: "AIzaSyDlVgn_FLoIIjKDJdoJnzPevuiI2cOY8BY",
  authDomain: "fir-practice-82105.firebaseapp.com",
  databaseURL: "https://fir-practice-82105.firebaseio.com",
  projectId: "fir-practice-82105",
  storageBucket: "fir-practice-82105.appspot.com",
  messagingSenderId: "827302886731"
};

//initialize firebase
firebase.initializeApp(config);

//set variable for databse 
var database = firebase.database();


// var timepicker = new TimePicker('time', {
//    lang: 'en',
//    theme: 'dark'
//  });
//  timepicker.on('change', function(evt) {
   
// var value = (evt.hour || '00') + ':' + (evt.minute || '00');
// evt.element.value = value;

//  });

$("#train-time").flatpickr({
   enableTime: true,
   noCalendar: true,
   time_24hr: true,
   dateFormat: "H:i",
});
$("#frequency").flatpickr({
   enableTime: true,
   noCalendar: true,
   time_24hr: true,
   dateFormat: "i",
});
//on click of submit to grab user input fields and submit to firebase
$(document).on("click", "button", function () {

    //event prevent default will keep the page from reloading and losing the information already stored from the db
    event.preventDefault();

 //jquery varibles to capture the specified form fields
    var trainName = $("#train-name").val().trim()
    var destination = $("#destination").val().trim()
    var trainTime = $("#train-time").val().trim()
    var frequency = $("#frequency").val().trim()
    console.log("freq", frequency)

 //object created to store the captured information that will be pushed to the database   
    var newTrain = {
        tName: trainName,
        tDest: destination,
        tTime: trainTime,
        tFreq: frequency,
}
//will push this newly captured information into the databse, this needs to be inside the click function
//at this point we are complted with pushing our information to the database
//see the next databse ref call that will be used to populate the DOM via jQuery with live data from the server
database.ref().push(newTrain);

});
//firebase db config to capture the existing items in the database
database.ref().on("child_added", function (childsnapshot) {

//create variables to grab the databse values for load into the dom
    var dbTrain = childsnapshot.val().tName;
    var dbDest = childsnapshot.val().tDest;
    var dbTime = childsnapshot.val().tTime;
    var dbFreq = childsnapshot.val().tFreq;

    //calculations will be done in the app and not stored on the db to save space

    
   //Calculations from https://www.codeseek.co/dquez/train-schedule-wrpxzY - couldnt figure this out myself
   //create momentInst to hold the date we are using to calculate and then specify it's format
   var momentIsnt = moment(dbTime, "hh:mm")
   //Capture the current time
   var currentTime = moment().format("hh:mm")

   var diffTime = moment().diff(moment(momentIsnt), "minutes");
   var tRemainder = diffTime % dbFreq;
   console.log(tRemainder);
   //calculate how many minutes away the train is
   var minutesAway = dbFreq - tRemainder;
   console.log("min-away", minutesAway);

   var nextTrain = moment().add(minutesAway, "minutes");
   var nextTrain2 = moment().add(2, "minutes")
   console.log("num1" + nextTrain);
   console.log("num2" + nextTrain2);
   nextTrain = moment(nextTrain).format("HH:mm");
   console.log("num1" + nextTrain);
   console.log(currentTime)
   console.log(momentIsnt)
     //calculate when the next train will arrive
     
    
    
   

   
   

   //jquery variables for ease of use to append and create a new row with the captured data from the database
    var tBody = $("tbody");
    var tRow = $("<tr>")
    var trainTd = $("<td>").text(dbTrain)
    var destTd = $("<td>").text(dbDest)
    var freqTd = $("<td>").text(dbFreq)
    var nextTd = $("<td>").text(nextTrain)
    var minuesTd = $("<td>").text(minutesAway)
    


    //create a new row append the data valaues from the db
    tRow.append(trainTd, destTd, freqTd,nextTd, minuesTd);

    //append the newly created row to the body of table
    tBody.append(tRow);
      
      
    })




