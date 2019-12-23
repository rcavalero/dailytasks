$(document).ready(function(){

$("#currentDay").text(moment().format("dddd MMMM D, YYYY"));

// this pulls data from local storage if it exists
var scheduler = JSON.parse(localStorage.getItem("scheduler") || "[]");

var schedStart = "9:00am";
var schedEnd = "17:00pm";


// if there is no data in local storage, this creates a new schedule
if (!localStorage.getItem("scheduler")) {
  createTimeSlots(schedStart, schedEnd);
};

// when app opens this compares the date in local storage to todays date
// if dates match it leaves existing data otherwise it creates a new schedule
var currDate = moment().format('YYYYMMDD');
var schedulerDate = moment(scheduler[0].timeSlot, 'YYYYMMDDhh:mma');
var  itemDate = schedulerDate.format('YYYYMMDD');

if ( itemDate !== currDate) {
  scheduler = [];
  createTimeSlots(schedStart, schedEnd);
}; 

// this creates the timeslots and saves them to local storage
function createTimeSlots(start, end){
  var timeSlots = [];
  var startTime = moment(start, 'hh:mm');
    var endTime = moment(end, 'hh:mm');

   
    // this creates an array (timeSlots) for each hour from start to end
    while(startTime <= endTime){
      timeSlots.push(new moment(startTime).format('YYYYMMDDhh:mma'));
      startTime.add(1, 'hour');
    }

    // This takes the timeSlots array and creates the array (scheduler) for user input & local storage
    timeSlots.forEach(function(timeSlot) {
      
    var slot = timeSlot;
    var momentObj = moment(slot, 'YYYYMMDDhh:mma');
    var hour = momentObj.format('hA');

    var items = {
        timeSlot: slot,
        hour: hour,
        desc: ""
    };
    scheduler.push(items);
  });
    localStorage.setItem("scheduler", JSON.stringify(scheduler));
};

const schedule = $("#schedule");

renderSchedule();
updateColor();

// this renders the schedule to the screen
function renderSchedule(){
  scheduler.forEach(function(item, index) {
let tsContainer = $(`<div class="container w-100 px-0">`);
let tsRow = $(`<div class="row w-100">`);

let tsCol1 = $(`<div class="col-1 h-100 px-0 text-center hour">`);
let tsPara = $(`<p id="hour`+index+`" class="pt-2">`);

let tsCol2 = $(`<div class="col-10 h-100 px-0" id="descBox`+index+`">`);
let tsTextArea = $(`<textarea id="desc`+index+`" class="w-100 h-100 pl-2 border-0">`);

let tsCol3 = $(`<div class="col-1 h-100 px-0">`);
let tsButton = $(`<button id="saveBtn`+index+`" data-Index = "`+index+`" type ="submit" class="btn btn-block saveBtn h-100 d-inline"><i class="fa fa-lock"></i></button>`);

schedule.append(tsContainer);
tsContainer.append(tsRow);
tsRow.append(tsCol1, tsCol2, tsCol3);
tsCol1.append(tsPara);
tsPara.text(scheduler[index].hour);
tsCol2.append(tsTextArea);
tsTextArea.val(scheduler[index].desc);
tsCol3.append(tsButton);

})  
};



// this updates the background color of the text area based on past, present & future
function updateColor(){
  scheduler.forEach(function(item, index) {
    var currHour = moment().format('YYYYMMDDHH');
    var itemMoment = moment(scheduler[index].timeSlot, 'YYYYMMDDhh:mma');
    var itemHour = itemMoment.format('YYYYMMDDHH');
    
    if (itemHour === currHour) {
      $("#descBox"+index).attr("class", "col-10 h-100 px-0 present")
    }
    else if (itemHour>currHour) {
      $("#descBox"+index).attr("class", "col-10 h-100 px-0 future")
    }
    else if (itemHour<currHour) {
    $("#descBox"+index).attr("class", "col-10 h-100 px-0 past")
    }
  });
};


// this is a timer that updates the background colors every minute
window.setInterval(updateColor, 60 * 1000);

// this saves data to to the scheduler array and local storage after the user clicks a save button
$(".saveBtn").on("click", function(event) {
  event.preventDefault();
    var element = event.target;
    var index = element.getAttribute("data-index");
    scheduler[index].desc = $("#desc"+index).val();
    localStorage.setItem("scheduler", JSON.stringify(scheduler));
});

});
