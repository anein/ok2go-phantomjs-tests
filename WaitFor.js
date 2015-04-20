var system = require('system');

var page = null;
var time = null;
var i = 0;


var addresses = getSystemArgs(system.args);
//console.assert( addresses.length > 0, "Array is empty" );
var length = addresses.length;

//our information
var information = {
  siteUrl: "",
  startTime: "",
  finishTime: "",
  searchTime: "",
  hotelsCount: ""
};


//call the init function
init();


/**
 * init - Get and check adresses.
 *
 */
function init() {

  if (length > 0) {

    time = Date.now();

    getAddressInformation(addresses[i]);

  } else {
    console.info("All Addresses has been parsed");
    //exit
    phantom.exit();
  }

}


/**
 * getAddressInformation - Display hotels information like title and hotels count.
 *
 * @param  {string} address page address
 */
function getAddressInformation(address) {

  //console.log( "\n\nSite URL: " + address );

  information.siteUrl = address;

  page = require('webpage').create();

  page.open(address, function(status) {

    // page load success
    if (status !== "success") {
      console.info("Unable to access network.");
      phantom.exit();
    } else {

      //console.info( "==Start at===========" + time + "===========" );
      information.startTime = time;

      waitFor(
        //testFx
        function() {
          // find hotel title
          return page.evaluate(function() {
            return ($(".b-hsr-hotel_title").length > 0);
          });

        },
        //onReady
        function() {

          //console.log( "Site URL: " + address );
          //get page title
          var title = page.evaluate(function() {
            return document.title;
          });
					// get hotel counts 
          var hotelCount = page.evaluate(function() {
            var titles = $("#lblCount").find("strong").html();
            return titles;

          });
          // get hotels titles
          var hotelsTitles = page.evaluate(function() {

            var hotels = $(".b-hsr-hotel_title").find("a");
            var titles = [];


            $.each(hotels, function() {
              var title = $(this).html();
              titles.push(title);
            });

            return titles;

          });

          information.hotelsCount = hotelCount;

          //console.info( "Page title:" + title );
          //console.info( "Hotels count:" + hotelsTitles.length );
          //console.info( "HotelCount: " + hotelCount );
          //console.info( "Hotels titles: ", JSON.stringify( hotelsTitles, undefined, 4 ) );
          //phantom.exit();


        },
        //timeOutMillis
        40000
      );
    }

  });

}

/**
 * waitFor - Measure the page loading time
 *
 * @param  {function} testFx    Condition callback function
 * @param  {function} onReady		On ready functon. Execute when testFx returns true.
 * @param  {int} timeOutMillis  Timeout. Nothing more.
 */
function waitFor(testFx, onReady, timeOutMillis) {
  //Default Max timeout is 5s
  var maxTimeOutMillis = (timeOutMillis) ? timeOutMillis : 40000;
  var start = Date.now();
  var condition = false;
  var interval = setInterval(function() {

    if ((new Date().getTime() - start < maxTimeOutMillis) && condition === false) {
      //If not time-out yet and condition not yet fulfilled
      condition = (typeof(testFx) === "string" ? eval(testFx) : testFx());

    } else {
      if (condition === false) {

        //If condition still not fulfilled (timeout but condition is 'false')
        //	console.info( "'WaitFor' timeout" );
        clearInterval(interval);

        //exit
        phantom.exit();
      } else {
        //Stop this interval
        clearInterval(interval);

        //Called Callback function
        onReady();

        //Calculating the page loading time
        var finishTime = (Date.now() - time);

        information.searchTime = finishTime + " ms.";
        information.finishTime = Date.now();

        console.info("Site: ", JSON.stringify(information, undefined, 4));

        //fix
        //set global variables
        length--;
        i++;
        init();

        //exit

      }
    }
  }, 250);
}

/**
 * getSystemArgs -  Parse system array and remove first element.
 *
 * @param  {Array|String} args  system.args
 * @return {{Array}      description
 */
function getSystemArgs(args) {
  //console.log( args );
  var addr = Array.prototype.slice.call(args);
  //remove first element ( name of javascript file )
  addr.splice(0, 1);
  return addr;
}
