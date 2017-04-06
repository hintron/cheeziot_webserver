(function () {
    var app = angular.module("stats", []);

    app.controller('Main', function($scope, $http){
        console.log("Starting polling...");

        $scope.polling_active = true;
        $scope.records = [];

        // Start up the polling code
        start_polling();

        // Polling code
        function start_polling(){
            $scope.polling_active = true;

            // Create a periodic AJAX ping to the server
            // See http://stackoverflow.com/a/5052661
            // This will keep running until polling_active is set to false
            (function poll_worker() {
                console.log("Poll Worker start");

                var data_to_send = {};
                data_to_send.client_message = $scope.message;

                // Get statistics data
                $http.post("/get-stats", data_to_send)
                .then(function (response) {
                    // Success callback
                    console.log("Success!!!");

                    // Load records into angular model
                    $scope.records = response.data.data;

                    // Prove that the server got a message from the client
                    console.log("Client message server thinks it received: " + response.data.client_message);

                    if($scope.polling_active){
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
                    // Code guaranteed to execute after either success or failure
                    // console.log("Finally...");
                });
            })();
        }

        // Turns off polling
        function stop_polling(){
            $scope.polling_active = false;
        }


    });



})();