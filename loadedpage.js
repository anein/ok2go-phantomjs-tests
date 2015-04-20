
/**
 * Test the page loading time.
 */
var page = require('webpage').create();
var system = require('system');

var t = Date.now();
var address = "http://oktogo.ru/search?in=01.09.2014&out=03.09.2014&destid=12196&dest=_D0_A1_D0_B0_D0_BD_D0_BA_D1_82-_D0_9F_D0_B5_D1_82_D0_B5_D1_80_D0_B1_D1_83_D1_80_D0_B3&country=_2C_20_D0_A0_D0_BE_D1_81_D1_81_D0_B8_D1_8F&occ=1";

page.open(address, function(status) {
  if (status !== 'success') {
    console.log('FAIL to load the address');
  } else {

    console.log("Site URL : " + address);

    var title = page.evaluate(function() {
      return document.title;
    });

    console.info("Page title: " + title);

    t = Date.now() - t;
    console.info("Loading time: ", t + ' msec');


  }
  phantom.exit();
});
