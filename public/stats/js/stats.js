$(function(){

    console.log("Starting polling...");
    // Start up the polling code
    start_polling();

    // Polling code
    function start_polling(){
        polling_active = true;

        // Create a periodic AJAX ping to the server
        // See http://stackoverflow.com/a/5052661
        // This will keep running until polling_active is set to false
        (function poll_worker() {
            $.ajax({
                // TODO: Change this url to the /stats endpoint
                url: '/data',
                dataType: "json",
                success: function(json) {
                    console.log("Success!!!");

                    // TODO: Start working with the new stats data, and start updating the HTML page

                    // TODO: Take code from
                },

                failure: function(){
                    console.log("Failure...");
                    stop_polling();
                },

                // Note: Complete executes after success does
                complete: function() {
                    if(polling_active){
                        // Schedule the next request once the current one is complete
                        setTimeout(poll_worker, 5000);
                    }
                }
            });
        })();
    }


    // Turns off polling
    function stop_polling(){
        polling_active = false;
    }



});
