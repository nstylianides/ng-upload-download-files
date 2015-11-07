/**
 * Created by nstyladmin on 4/11/2015.
 */
/**
 * THis is code is from the internet
 * It converts a byte array to base64
 *
 *
 * @param arrayBuffer
 * @returns {string}
 */
function base64ArrayBuffer(arrayBuffer) {
    var base64    = ''
    var encodings = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'

    var bytes         = new Uint8Array(arrayBuffer)
    var byteLength    = bytes.byteLength
    var byteRemainder = byteLength % 3
    var mainLength    = byteLength - byteRemainder

    var a, b, c, d
    var chunk

    // Main loop deals with bytes in chunks of 3
    for (var i = 0; i < mainLength; i = i + 3) {
        // Combine the three bytes into a single integer
        chunk = (bytes[i] << 16) | (bytes[i + 1] << 8) | bytes[i + 2]

        // Use bitmasks to extract 6-bit segments from the triplet
        a = (chunk & 16515072) >> 18 // 16515072 = (2^6 - 1) << 18
        b = (chunk & 258048)   >> 12 // 258048   = (2^6 - 1) << 12
        c = (chunk & 4032)     >>  6 // 4032     = (2^6 - 1) << 6
        d = chunk & 63               // 63       = 2^6 - 1

        // Convert the raw binary segments to the appropriate ASCII encoding
        base64 += encodings[a] + encodings[b] + encodings[c] + encodings[d]
    }

    // Deal with the remaining bytes and padding
    if (byteRemainder == 1) {
        chunk = bytes[mainLength]

        a = (chunk & 252) >> 2 // 252 = (2^6 - 1) << 2

        // Set the 4 least significant bits to zero
        b = (chunk & 3)   << 4 // 3   = 2^2 - 1

        base64 += encodings[a] + encodings[b] + '=='
    } else if (byteRemainder == 2) {
        chunk = (bytes[mainLength] << 8) | bytes[mainLength + 1]

        a = (chunk & 64512) >> 10 // 64512 = (2^6 - 1) << 10
        b = (chunk & 1008)  >>  4 // 1008  = (2^6 - 1) << 4

        // Set the 2 least significant bits to zero
        c = (chunk & 15)    <<  2 // 15    = 2^4 - 1

        base64 += encodings[a] + encodings[b] + encodings[c] + '='
    }

    return base64
}

myApp
    .controller('FileCtrl',['$scope','Upload','$http', function($scope,Upload,$http){

        /**
         *
         * @param data
         */
        function setInMemoryURL(data){

            /*
            var urlCreator = window.URL || window.webkitURL;
            var img = document.querySelector( "#animg" );
            */
            $scope.inMemoryURL = 'data:image/png;base64,'+data;
        }

        $scope.acceptSelect = true;

        /**
         * Image file raw data
         */
        $scope.image;

        /**
         * in memory URL
         * @param file
         */
        $scope.inMemoryURL;


        //$scope.files = [];
        // upload on file select or drop
        $scope.upload = function (file) {
            Upload.upload({
                url: 'file/upload',
                data: {file: file, 'username': $scope.username}
            }).then(function (resp) {
                console.log('Success ' + resp.config.data.file.name + 'uploaded. Response: ' + resp.data);
            }, function (resp) {
                console.log('Error status: ' + resp.status);
            }, function (evt) {
                var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                console.log('progress: ');// + progressPercentage + '% ' + evt.config.data.file.name);
            });
        };

        $scope.getImage = function(){
            $http({
                method: 'GET',
                url: '/file/download'
            }).then(function successCallback(response) {

                // Keep both byte array and base64
                $scope.image = response.data.file.data;
                setInMemoryURL(base64ArrayBuffer(response.data.file.data))

            }, function errorCallback(response) {
                console.log(response);
            });
        }

    }]);