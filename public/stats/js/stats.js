(function () {
    var app = angular.module("stats", []);

    app.controller('Main', function($scope, $http){
        console.log("Hello, Angular 1!");
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
                console.log("Poll Worker start");
                $http.get("/data", {})
                .then(function (response) {
                    // Success callback
                    console.log("Success!!!");
                    console.log(response.data.data);

                    // TODO: Get statistics data
                    $scope.records = response.data.data;

                    if(polling_active){
                        // Schedule the next request once the current one is complete
                        setTimeout(poll_worker, 5000);
                    }
                }
                , function errorCallback(response) {
                    // For any errors during the request
                    console.log("Failure...");
                    stop_polling();
                })
                .catch(function(err){
                    console.log(err);
                })
                .finally(function(){
                    // Code to execute after either success or failure
                    console.log("Finally...");
                });
            })();
        }

        // Turns off polling
        function stop_polling(){
            polling_active = false;
        }


    });



})();