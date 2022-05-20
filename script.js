(function(){
  
  // get current datetime for default value
  let today = new Date().toISOString().slice(0,-8);
  // set default values using current datetime
  $('input[type="datetime-local"]').val(today);
  
  // init reused elements
  let eventList = $('#eventList');
  let cal = ics();

  // converst datetime to readable format
  function convertDate(date) {
    let timeZone = $('#timeZone').children("option:selected").val();
    let convDate = new Date(date + timeZone).toLocaleString('en-US', {
      weekday: 'short', // long, short, narrow
      day: 'numeric', // numeric, 2-digit
      year: 'numeric', // numeric, 2-digit
      month: 'short', // numeric, 2-digit, long, short, narrow
      hour: 'numeric', // numeric, 2-digit
      minute: 'numeric', // numeric, 2-digit
      }
    );
    // out example: "Mon, Jan 1, 2022, 4:00 PM"
    return convDate;
  };
  
  // create a readable filename
  function setFileName(subject){
    let fileName = subject.replace(/[^a-z0-9]/gi, '_').toLowerCase();
    return fileName;
  }
  

  
  // clear the event adding form  
  $('#clear').click(function(){
    $('#icsForm')[0].reset();
  });

  // clear the list of added events
  $('#restart').click(function(){
    eventList.empty();
  });
  
  // save the form values as an event
  $('#save').click(function(e) {
    e.preventDefault();
    let data = $('#icsForm').serializeArray();
    //console.log(data);
    let subject = data[3].value;
    let description = data[5].value;
    let location = data[4].value;
    let begin = convertDate(data[1].value);
    let end = convertDate(data[2].value);
    
    // used to set the filename using the title field
    $('#download').attr('data-filename', setFileName(subject));
    
    // add event to list of events
    let eventElement = '<li class="list-group-item"><h4 class="list-group-item-heading">' + subject + '</h4>' + '<p class="list-group-item-text">' + begin + ' &rarr; ' + end + '</p></li>';
    eventList.append(eventElement);
    
    // add event to cal object for building ics file
    cal.addEvent(subject, description, location, begin, end);
  });
  
  // download the ics file with all of the events added
  $('#download').click(function(){
    //cal.download($(this).attr('data-filename')); // what if val for title changes?
    cal.download();
  })
  
  
})($);