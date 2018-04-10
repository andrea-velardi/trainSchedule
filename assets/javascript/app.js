$(document).ready(function(){
    /*FireBase
    ==============================================================*/
    // Initialize Firebase
    var config = {
        apiKey: "AIzaSyAlcRrwt3lZQ7yect8cDGUU6BBem4EaJMg",
        authDomain: "trainschedule-fcb3c.firebaseapp.com",
        databaseURL: "https://trainschedule-fcb3c.firebaseio.com",
        projectId: "trainschedule-fcb3c",
        storageBucket: "trainschedule-fcb3c.appspot.com",
        messagingSenderId: "287746449237"
      };
      firebase.initializeApp(config);
    
      //Reference database
      database = firebase.database();
    
    /*Global Variables
    ==============================================================*/
    var trainName = '';
    var dest = '';
    var firstTrainTime = ''; 
    var freq = '';
    
    //Conversion Variables
    var firstTimeConverted = '';
    var timeDifference = '';
    var tRemainder; //going to be a # 
    var tMinutesTillTrain;
    var nextTrain; 
    
    //Data reference
    var trainNameData = '';
    var destData = '';
    var arrivalData = '';
    var freqData = '';
    var minutesAwayData = ''; 
     
    /*Functions
    ==============================================================*/
        //When Submit button is clicked it will run the below function and storing user input into variables
        $('#submit').on('click',function(event){
            event.preventDefault();// preventative
            //the user input information and storing as variables 
            trainName = $('#trainName').val().trim();//getting value in the trainName div and storing as a variable
            dest = $('#dest').val().trim();//getting the value in the dest div and storing as a variable
            firstTrainTime = $('#firstTrainTime').val().trim();// geting value in firstTrainTime and storing as variable
            freq = $('#freq').val().trim();// getting value of the freq div and storing as variable 
    
            //Removed input info - when submit is clicked remove the values from the input divs
            $('#trainName').val('');
            $('#dest').val('');
            $('#firstTrainTime').val('');
            $('#freq').val('');
    
            //Conversions for the table
                //Convert to HH:MM
                firstTimeConverted = moment(firstTrainTime, "hh:mm"); //Converts the firsTimeCover object into string
                
                
                
                // Current Time
                var currentTime = moment();
                console.log(currentTime); 
                timeDifference = moment().diff(moment(firstTimeConverted), "minutes");//.diff takes in two parameters
                
                // Time apart (remainder)
                tRemainder = timeDifference % freq;
    
                // Minute Until Train
                tMinutesTillTrain = freq - tRemainder;
                
                // Next Train
                nextTrain = moment().add(tMinutesTillTrain, "minutes");
                nextTrainFormat = moment(nextTrain).format('hh:mm');
                console.log(nextTrainFormat); 
            
            //pushing the data with time converstions onto the table
            database.ref('/trainschedule').push({
                trainName: trainName,
                destination: dest,
                arrival: nextTrainFormat, 
                minutesAway: tMinutesTillTrain,
                frequency: freq // in line 23 the freq variable is created and 48 the value is stored into the variable 
            }); 	
        }); 
            
            database.ref('/trainschedule').on('child_added',function(snap){ //using .ref to reference the /trainschedule and then taking snapshot of the data
                        
                        //Testing
                        trainNameData = snap.val().trainName;//taking spashot of the value inputted for trainNAme 
                        destData = snap.val().destination;
                        arrivalData = snap.val().arrival;
                        freqData = snap.val().frequency;
                        minutesAwayData = snap.val().minutesAway;
    
                        //Data array
                        var dataArray = [trainNameData, destData, freqData, arrivalData, minutesAwayData];//array of data variables
                        var newTr = $('<tr>'); //grabbing the tablerow div and storing as variable 
                        for(var i = 0; i< dataArray.length; i++){ //forloop through the array of data variables
                            var newTd = $('<td>');// grabbing the tabledata div and storing as a variable
                            newTd.text(dataArray[i]); 
                            newTd.appendTo(newTr);
                        }	
                        $('.table').append(newTr);
            });
    });// End of line