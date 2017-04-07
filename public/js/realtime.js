// TODO: Get it so test_out is constantly updated, and this constantly refreshes the image
(function () {
    var app = angular.module("realtime", []);

    app.controller('Main', function($scope, $http){

        var images = ["test_out.bmp","faces.png","404.png"];
        var image_folder = "/images/";

        // $scope.image_src = image_folder + images[0];

        var counter = 0;
        var INTERVAL = 3000;

        (function poll_worker() {
            // TODO: Is there an angular way of doing this? I couldn't get it to work...

            // See http://stackoverflow.com/questions/1077041/refresh-image-with-a-new-one-at-the-same-url
            document.getElementById("face").src = image_folder + images[counter] + "?" + new Date().getTime();

            counter = (counter + 1) % images.length;
            setTimeout(poll_worker, INTERVAL);
        })();

    });

})();