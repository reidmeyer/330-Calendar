//Reid Meyer
//Kevin Kowalsky
//Module 5 CS 330


/* * * * * * * * * * * * * * * * * * * *\
 *               Module 4              *
 *      Calendar Helper Functions      *
 *                                     *
 *        by Shane Carr '15 (TA)       *
 *  Washington University in St. Louis *
 *    Department of Computer Science   *
 *               CSE 330S              *
 *                                     *
 *      Last Update: October 2017      *
\* * * * * * * * * * * * * * * * * * * */

/*  This program is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation, either version 3 of the License, or
 *  (at your option) any later version.
 *
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

(function () {
    "use strict";

    /* Date.prototype.deltaDays(n)
	 * 
	 * Returns a Date object n days in the future.
	 */
    Date.prototype.deltaDays = function (n) {
        // relies on the Date object to automatically wrap between months for us
        return new Date(this.getFullYear(), this.getMonth(), this.getDate() + n);
    };

    /* Date.prototype.getSunday()
	 * 
	 * Returns the Sunday nearest in the past to this date (inclusive)
	 */
    Date.prototype.getSunday = function () {
        return this.deltaDays(-1 * this.getDay());
    };
}());

/** Week
 * 
 * Represents a week.
 * 
 * Functions (Methods):
 *	.nextWeek() returns a Week object sequentially in the future
 *	.prevWeek() returns a Week object sequentially in the past
 *	.contains(date) returns true if this week's sunday is the same
 *		as date's sunday; false otherwise
 *	.getDates() returns an Array containing 7 Date objects, each representing
 *		one of the seven days in this month
 */
function Week(initial_d) {
    "use strict";

    this.sunday = initial_d.getSunday();


    this.nextWeek = function () {
        return new Week(this.sunday.deltaDays(7));
    };

    this.prevWeek = function () {
        return new Week(this.sunday.deltaDays(-7));
    };

    this.contains = function (d) {
        return (this.sunday.valueOf() === d.getSunday().valueOf());
    };

    this.getDates = function () {
        var dates = [];
        for(var i=0; i<7; i++){
            dates.push(this.sunday.deltaDays(i));
        }
        return dates;
    };
}

/** Month
 * 
 * Represents a month.
 * 
 * Properties:
 *	.year == the year associated with the month
 *	.month == the month number (January = 0)
 * 
 * Functions (Methods):
 *	.nextMonth() returns a Month object sequentially in the future
 *	.prevMonth() returns a Month object sequentially in the past
 *	.getDateObject(d) returns a Date object representing the date
 *		d in the month
 *	.getWeeks() returns an Array containing all weeks spanned by the
 *		month; the weeks are represented as Week objects
 */
function Month(year, month) {
    "use strict";

    this.year = year;
    this.month = month;

    this.nextMonth = function () {
        return new Month( year + Math.floor((month+1)/12), (month+1) % 12);
    };

    this.prevMonth = function () {
        return new Month( year + Math.floor((month-1)/12), (month+11) % 12);
    };

    this.getDateObject = function(d) {
        return new Date(this.year, this.month, d);
    };

    this.getWeeks = function () {
        var firstDay = this.getDateObject(1);
        var lastDay = this.nextMonth().getDateObject(0);

        var weeks = [];
        var currweek = new Week(firstDay);
        weeks.push(currweek);
        while(!currweek.contains(lastDay)){
            currweek = currweek.nextWeek();
            weeks.push(currweek);
        }

        return weeks;
    };
}

//login function
function loginAjax(event) {
    //gets input data from html
    const username = document.getElementById("luser").value; // Get the username from the form
    const password = document.getElementById("lpass").value; // Get the password from the form
    // Make a URL-encoded string for passing POST data:
    var data = { 'luser': username, 'lpass': password };
    fetch("login_ajax.php", {
        method: 'POST',
        body: JSON.stringify(data),
        headers: { 'content-type': 'application/json' }
    })
        .then(function(response){
        return response.json();
    })
        .then(function(stuff){
        //console.log(JSON.stringify(stuff));
        if(stuff.success == true){
            //hide logins tuff if successful and update calendar
            document.getElementById("loginSec").style.visibility = "hidden";
            document.getElementById("regDiv").style.visibility = "hidden";
            initializeAjax();
            updateCalendar();
        }
    });
}

//logout
function logoutAjax(event) {
    // Make a URL-encoded string for passing POST data:
    var not = "nothing"
    data = { 'nothing' : not};

    fetch("logout_ajax.php", {
        method: 'POST',
        body: JSON.stringify(data),
        headers: { 'content-type': 'application/json' }
    })
        .then(function(response){
        return response.json();
    })
        .then(function(stuff){
        //if successful, make login and register stuff visible and update calendar
        if(stuff.success == true){
            document.getElementById("loginSec").style.visibility = "visible";
            document.getElementById("regDiv").style.visibility = "visible";
            initializeAjax();
            updateCalendar();

        }
    });
}

//registration
function registerAjax(event) {
    const username = document.getElementById("ruser").value; // Get the username from the form
    const password = document.getElementById("rpass").value; // Get the password from the form
    // Make a URL-encoded string for passing POST data:
    var data = { 'ruser': username, 'rpass': password };
    fetch("register_ajax.php", {
        method: 'POST',
        body: JSON.stringify(data),
        headers: { 'content-type': 'application/json' }
    })
        .then(function(response){
        return response.json();
    })
        .then(function(stuff){
        //hide registration, since they wont want to register twice. also indicates success
        if(stuff.success == true){
            //document.getElementById("1").innerHTML = "helllllloooo";
            document.getElementById("regDiv").style.visibility = "hidden";

        }
    });
}

//delete event
function deleteEvent(event) {
    const eventId = document.getElementById("eventId").value; // Get the username from the form
    // Make a URL-encoded string for passing POST data:
    var data = { 'eventId': eventId };
    fetch("deleteEvent.php", {
        method: 'POST',
        body: JSON.stringify(data),
        headers: { 'content-type': 'application/json' }
    })
        .then(function(response){
        return response.json();
    })
        .then(function(stuff){
        if(stuff.success == true){
            updateCalendar();
        }
    });
}

function deleteAllEvent(event) {
    // Get the username from the form
    // Make a URL-encoded string for passing POST data:
    var not = "nothing";
    data = { 'nothing' : not};
    fetch("deleteAllEvents.php", {
        method: 'POST',
        body: JSON.stringify(data),
        headers: { 'content-type': 'application/json' }
    })
        .then(function(response){
        return response.json();
    })
        .then(function(stuff){
        if(stuff.success == true){
            updateCalendar();
        }
    });
}

//modify
function modifyEvent(event) {
    const eventId = document.getElementById("eventIdMod").value; // Get the username from the form
    const contentOfEvent = document.getElementById("eventContentMod").value; // Get the password from the form
    const timeOfEvent = document.getElementById("eventTimeMod").value;
    // Make a URL-encoded string for passing POST data:
    var data = { 'eventId': eventId, 'content': contentOfEvent, 'time': timeOfEvent };
    fetch("modifyEvent.php", {
        method: 'POST',
        body: JSON.stringify(data),
        headers: { 'content-type': 'application/json' }
    })
        .then(function(response){
        return response.json();
    })
        .then(function(stuff){
        if(stuff.success == true){
            updateCalendar();
        }
    });
}

//add Event
function addEvent(event) {
    var dayOfEvent = document.getElementById("dateOfMonth").value; // Get the username from the form
    var contentOfEvent = document.getElementById("eventContent").value; // Get the password from the form
    var timeOfEvent = document.getElementById("timeOfEvent").value;
    
    if(document.getElementById("first").checked){
       var tagOfEvent =  "CSE 330";
    }
       if(document.getElementById("second").checked){
       var tagOfEvent =  "CSE 361";
    }
       if(document.getElementById("third").checked){
       var tagOfEvent =  "CSE 332";
    }
    var curmonth = currentMonth.month + 1;
    var currmonth = currentMonth.month + 1;

    //Makes it ok to enter 1 instead of 01 as a day
    if (dayOfEvent=="1")
    {
        dayOfEvent = "01";
    }
    if (dayOfEvent=="2")
    {
        dayOfEvent = "02";
    }
    if (dayOfEvent=="3")
    {
        dayOfEvent = "03";
    }
    if (dayOfEvent=="4")
    {
        dayOfEvent = "04";
    }
    if (dayOfEvent=="5")
    {
        dayOfEvent = "05";
    }
    if (dayOfEvent=="6")
    {
        dayOfEvent = "06";
    }
    if (dayOfEvent=="7")
    {
        dayOfEvent = "07";
    }
    if (dayOfEvent=="8")
    {
        dayOfEvent = "08";
    }
    if (dayOfEvent=="9")
    {
        dayOfEvent = "09";
    }



    //standardizes the month
    if(currmonth == 1){
        currmonth = "01";
    }
    if(currmonth == 2){
        currmonth = "02";

    }
    if(currmonth == 3){
        currmonth = "03";

    }
    if(currmonth == 4){
        currmonth = "04";

    }
    if(currmonth == 5){
        currmonth = "05";

    }
    if(currmonth == 6){
        currmonth = "06";
    }
    if(currmonth == 7){
        currmonth = "07";

    }
    if(currmonth == 8){
        currmonth = "08";

    }
    if(currmonth == 9){
        currmonth = "09";

    }
    // Make a URL-encoded string for passing POST data:
    var data = { 'day': dayOfEvent, 'content': contentOfEvent, 'time': timeOfEvent, 'month': currmonth, 'year': currentMonth.year, 'tag': tagOfEvent };
    fetch("addEvent.php", {
        method: 'POST',
        body: JSON.stringify(data),
        headers: { 'content-type': 'application/json' }
    })
        .then(function(response){
        return response.json();
    })
        .then(function(stuff){
        if(stuff.success == true){
            updateCalendar();
        }
    });
}

//some useful functions for d
function initializeAjax(event) 
{
    var not = "nothing"
    data = { 'nothing' : not};

    fetch("initialize.php", 
          {
        method: 'POST',
        body: JSON.stringify(data),
        headers: { 'content-type': 'application/json' }})
        .then(function(response)
              {
        return response.json();
    })
        .then(function(stuff){
        if(stuff.success == true)
        {
            document.getElementById("mytext").innerHTML = stuff.randomuservar + " is logged in";
            if(stuff.randomuservar!="no one" && stuff.randomuservar!="")
            {
                document.getElementById("loginSec").style.visibility = "hidden";
                document.getElementById("regDiv").style.visibility = "hidden";

            }
        }
    })

    ;
}

//fill the calendar with appropriate events
function geteventsAjax(event) {

    var thedate = tempdate;

    data = { 'jdate' : thedate};
    fetch("getevents_ajax.php", {
        method: 'POST',
        body: JSON.stringify(data),
        headers: { 'content-type': 'application/json' }
    })
        .then(function(response){
        return response.json();
    })
        .then(function(stuff){
        if(stuff.success == true){
            if (stuff.message!=null)
            {
                for (var j = 1; j< 43; ++j)
                {
                    //checks if the days and month match up   
                    var newj = '' + j;
                    if(currentMonth.month+1 == thedate.charAt(5)+thedate.charAt(6) && document.getElementById(newj).innerHTML.charAt(0)+document.getElementById(newj).innerHTML.charAt(1) == thedate.charAt(8)+thedate.charAt(9))
                    {
                        document.getElementById(newj).innerHTML = document.getElementById(newj).innerHTML + stuff.message;
                    }
                }
            }


        }
    });

}





//Listeners
document.getElementById("login_button").addEventListener("click", loginAjax, false);
document.getElementById("logout_button").addEventListener("click", logoutAjax, false);

document.getElementById("login_button").addEventListener("click", initializeAjax, false);
document.getElementById("logout_button").addEventListener("click", initializeAjax, false);

document.getElementById("register_button").addEventListener("click", registerAjax, false);
document.getElementById("register_button").addEventListener("click", initializeAjax, false);

document.getElementById("event_add").addEventListener("click", addEvent, false);
document.getElementById("delete_event").addEventListener("click", deleteEvent, false);
document.getElementById("modify_event").addEventListener("click", modifyEvent, false);

document.getElementById("delete_allevent").addEventListener("click", deleteAllEvent, false);
document.addEventListener('DOMContentLoaded', initializeAjax, false);



// For our purposes, we can keep the current month in a variable in the global scope
var currentMonth = new Month(2018, 09); // October 2017

// Change the month when the "next" button is pressed
document.getElementById("next_month_btn").addEventListener("click", function(event){
    currentMonth = currentMonth.nextMonth(); // Previous month would be currentMonth.prevMonth()
    updateCalendar(); // Whenever the month is updated, we'll need to re-render the calendar in HTML
    //alert("The new month is "+currentMonth.month+" "+currentMonth.year);
}, false);


document.getElementById("prev_month_btn").addEventListener("click", function(event){
    currentMonth = currentMonth.prevMonth(); // Previous month would be currentMonth.prevMonth()
    updateCalendar(); // Whenever the month is updated, we'll need to re-render the calendar in HTML
    //alert("The new month is "+currentMonth.month+" "+currentMonth.year);
}, false);

// This updateCalendar() function only alerts the dates in the currently specified month.  You need to write
// it to modify the DOM (optionally using jQuery) to display the days and weeks in the current month.
function monthtostring(i)
{
    if (i==1)
        return "January";
    if (i==2)
        return "February";
    if (i==3)
        return "March";
    if (i==4)
        return "April";
    if (i==5)
        return "May";
    if (i==6)
        return "June";
    if (i==7)
        return "July";
    if (i==8)
        return "August";
    if (i==9)
        return "September";
    if (i==10)
        return "October";
    if (i==11)
        return "November";
    if (i==12)
        return "December";
    return "fail";
}

var data;
var tempdate;
//fills calendar with appropriate number days and events
function updateCalendar(){
    var weeks = currentMonth.getWeeks();

    for (var j = 1; j< 43; ++j)
    {
        var newj = '' + j;
        document.getElementById(newj).innerHTML = '';
    }

    var i = 1;
    for(var w in weeks){
        var days = weeks[w].getDates();

        // days contains normal JavaScript Date objects.

        for(var d in days){
            // You can see console.log() output in your JavaScript debugging tool, like Firebug,
            // WebWit Inspector, or Dragonfly.
            var newi = '' + i;

            if(days[d].toISOString().charAt(5)+days[d].toISOString().charAt(6) == currentMonth.month+1)
            {
                document.getElementById(newi).innerHTML = days[d].toISOString().charAt(8)+days[d].toISOString().charAt(9) + "<br />";
            }
            ++i;

            tempdate = days[d].toISOString().substr(0,10);

            geteventsAjax();

            {

            }


        }
        //makes it so the extra row only appears when necessary
        if (document.getElementById("36").innerHTML === '')
        {
            document.getElementById("36").style.display = "none";
            document.getElementById("37").style.display = "none";
            document.getElementById("38").style.display = "none";
            document.getElementById("39").style.display = "none";
            document.getElementById("40").style.display = "none";
            document.getElementById("41").style.display = "none";
            document.getElementById("42").style.display = "none";
        }
        else
        {
            document.getElementById("36").style.display = "block";
            document.getElementById("37").style.display = "block";
            document.getElementById("38").style.display = "block";
            document.getElementById("39").style.display = "block";
            document.getElementById("40").style.display = "block";
            document.getElementById("41").style.display = "block";
            document.getElementById("42").style.display = "block";
        }
    }
    //assigns the month and year dom elements
    document.getElementById("year").innerHTML = currentMonth.year;
    document.getElementById("month").innerHTML = monthtostring(currentMonth.month+1);

}
//sets up calendar when loaded
updateCalendar();

