$(document).ready(function(){

$("#currentDay").text(moment().format("dddd MMMM D, YYYY"));


  let schedStart = "";
  let schedEnd = "";


    // this pulls schedule & default data from local storage if it exists
let dailyTaskDefaults = JSON.parse(localStorage.getItem("dailyTaskDefaults") || "[]");
let dailyTaskSchedule = JSON.parse(localStorage.getItem("dailyTaskSchedule") || "[]");

// this creates the timeslots and saves them to local storage
const createTimeSlots = (start, end) => {
  let timeSlots = [];
  let startTime = moment(start, 'hh:mm');
    let endTime = moment(end, 'hh:mm');
    
    // this creates an array (timeSlots) for each hour from start to end
    while(startTime <= endTime){
      timeSlots.push(new moment(startTime).format('YYYYMMDDhh:mma'));
      startTime.add(1, 'hour');
    }

    // This takes the timeSlots array and creates the array (dailyTaskSchedule) for user input & local storage
    // timeSlots.forEach = (timeSlot) => {
    timeSlots.forEach(function(timeSlot) {

      
    let slot = timeSlot;
    let momentObj = moment(slot, 'YYYYMMDDhh:mma');
    let hour = momentObj.format('ha');

    let items = {
        timeSlot: slot,
        hour: hour,
        desc: ""
    };
   dailyTaskSchedule.push(items);


  });
    localStorage.setItem("dailyTaskSchedule", JSON.stringify(dailyTaskSchedule));
};

const schedule = $("#schedule");

// this renders the schedule to the screen
const renderSchedule = () => {
  dailyTaskSchedule.forEach(function(item, index) {
  const tsContainer = $(`<div class="container w-100 px-0">`);
  const tsRow = $(`<div class="row schedRow w-100">`);

  const tsCol1 = $(`<div class="col-1 h-100 px-0 text-center hour">`);
  const tsPara = $(`<p id="hour`+index+`" class="pt-2">`);

  const tsCol2 = $(`<div id="descBox`+index+`">`);  // class is defined in the update color function
  const tsTextArea = $(`<textarea id="desc`+index+`" class="w-100 h-100 pl-2 border-0">`);

  const tsCol3 = $(`<div class="col-1 h-100 px-0">`);
  const tsButton = $(`<button id="saveBtn`+index+`" data-Index = "`+index+`" type ="submit" class="btn btn-block saveBtn h-100 d-inline"><i class="fa fa-lock"></i></button>`);

  schedule.append(tsContainer);
  tsContainer.append(tsRow);
  tsRow.append(tsCol1, tsCol2, tsCol3);
  tsCol1.append(tsPara);
  tsPara.text(dailyTaskSchedule[index].hour);
  tsCol2.append(tsTextArea);
  tsTextArea.val(dailyTaskSchedule[index].desc);
  tsCol3.append(tsButton);

  })  
};

const startup = () => {

  // if dailyTaskDefaults doesn't exist this will add defaults and set the starting and ending times 
  if (!localStorage.getItem("dailyTaskDefaults")) {
    let defaults = {
      startTime: "9:00am",
      endTime: "17:00pm",
      cat1: "A",
      cat2: "B",
      cat3: "C"
  };
  dailyTaskDefaults.push(defaults);

  localStorage.setItem("dailyTaskDefaults", JSON.stringify(dailyTaskDefaults));

  schedStart = dailyTaskDefaults[0].startTime;
  schedEnd = dailyTaskDefaults[0].endTime;
  $("#dayStart").val(dailyTaskDefaults[0].startTime);
  $("#dayEnd").val(dailyTaskDefaults[0].endTime);
    }

// This uses start & end times from dailyTaskDefaults if it exists
    else {
    
      schedStart = dailyTaskDefaults[0].startTime;
      schedEnd = dailyTaskDefaults[0].endTime;
      $("#dayStart").val(dailyTaskDefaults[0].startTime);
      $("#dayEnd").val(dailyTaskDefaults[0].endTime);


    };

  
// if there is no data in dailyTaskSchedule in local storage, this creates a new schedule
  if (!localStorage.getItem("dailyTaskSchedule")) {
    createTimeSlots(schedStart, schedEnd);
    renderSchedule();
  }
  else {useExistingData();
  };
};

const useExistingData = ()  => {
  // this compares the date in local storage to todays date
    // if dates match it leaves existing data otherwise it creates a new schedule
    const currDate = moment().format('YYYYMMDD');
    const scheduleDate = moment(dailyTaskSchedule[0].timeSlot, 'YYYYMMDDhh:mma');
    const  itemDate = scheduleDate.format('YYYYMMDD');

  if ( itemDate !== currDate) {
      dailyTaskSchedule = [];
      
      createTimeSlots(schedStart, schedEnd);
      renderSchedule();
  } 
  else {
    renderSchedule();
  } 
};


startup();

// this remakes the schedule based on the starting & ending times selected by the user
// and updates the selected values to local storage so they will be used next time app is opened
$("#newSched").on("click", function(event) {
  event.preventDefault();
  schedStart = $("#dayStart").val();
  schedEnd = $("#dayEnd").val();
  dailyTaskDefaults[0].startTime = $("#dayStart").val();
  dailyTaskDefaults[0].endTime = $("#dayEnd").val();
  localStorage.setItem("dailyTaskDefaults", JSON.stringify(dailyTaskDefaults));

  schedule.empty();
  dailyTaskSchedule = [];
  createTimeSlots(schedStart, schedEnd);
  renderSchedule();
  updateColor();
  
});  

// $("#dayEnd").on("change", function(event){
//   event.preventDefault();
//   $("#dayEnd").children().removeAttr("selected");
//   $("#dayEnd option:selected").attr("selected", "selected");

// }) 


// this updates the background color of the text area based on past, present & future
const updateColor = () => {
  dailyTaskSchedule.forEach(function(item, index) {
    const currHour = moment().format('YYYYMMDDHH');
    const itemMoment = moment(dailyTaskSchedule[index].timeSlot, 'YYYYMMDDhh:mma');
    const itemHour = itemMoment.format('YYYYMMDDHH');
    
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

updateColor();

// this is a timer that updates the background colors every minute
window.setInterval(updateColor, 60 * 1000);

// this saves data to to the dailyTaskSchedule array and local storage after the user clicks a save button
$(".saveBtn").on("click", function(event) {
  event.preventDefault();
    let element = event.target;
    let index = element.getAttribute("data-index");
    dailyTaskSchedule[index].desc = $("#desc"+index).val();
    localStorage.setItem("dailyTaskSchedule", JSON.stringify(dailyTaskSchedule));
});

});
