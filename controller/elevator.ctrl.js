var app = angular.module("elevatorApp", []);
app.controller("mainCtrl", function($scope, $http, $interval) {
    $scope.inside_elevator = false;
    $scope.totalFloors = 8;
    $scope.optionValues = [];
    for (var i = 0; i <= $scope.totalFloors; i++) $scope.optionValues.push(i); // Create array [0, ...,  tf]
    $scope.destination = 0;
    $scope.humanCurrFloor = 0;
    $scope.stopFloorsDrct = [
        {"floor": 5, "continue_up": false, "continue_down": true},
        {"floor": 6, "continue_up": false, "continue_down": true},
        {"floor": 3, "continue_up": true, "continue_down": false},
        {"floor": 4, "continue_up": true, "continue_down": false},
        {"floor": 7, "continue_up": false, "continue_down": false}
    ];

    //Functions
    function loadData () {
        $http.get("http://localhost:3000/api/elevatorStatus")
            .then(function(response) {
                console.log("Data loaded");
                $scope.current_floor = response.data.current_floor;
                $scope.destination = response.data.current_floor;
                
            }, function error(response) {
                console.error("Data not loaded... Trying to load.");
                loadData();
                $interval(refreshScene, 3000);
            });
    };

    function refreshScene () {
        /* Elevator and human movement */
        if ($scope.destination < $scope.current_floor) {
            $scope.current_floor -= 1;
            $scope.movement = -1;
            if ($scope.inside_elevator) $scope.humanCurrFloor -= 1;
        }
        else if ($scope.destination > $scope.current_floor) {
            $scope.current_floor += 1;
            $scope.movement = 1;
            if ($scope.inside_elevator) $scope.humanCurrFloor += 1;
        }
        else {
            $scope.movement = 0;
        }
        
        /* Remove floors */
        if ($scope.stopFloorsDrct.length == 1) {
            $scope.destination = $scope.stopFloorsDrct[0].floor;
            if ($scope.stopFloorsDrct[0].floor == $scope.current_floor) $scope.stopFloorsDrct = [];
        }
        else if ($scope.stopFloorsDrct.length > 0 && $scope.stopFloorsDrct[0].floor == $scope.current_floor) {
            $scope.stopFloorsDrct.shift();
        }
        else if ($scope.stopFloorsDrct.length > 0) {
            $scope.destination = $scope.stopFloorsDrct[0].floor;
        }
    }

    $scope.toggleElevator = function () {
        if (!$scope.inside_elevator && $scope.humanCurrFloor != $scope.current_floor) return;
        $scope.inside_elevator = !$scope.inside_elevator;
    }

    $scope.chooseDestinationInside = function (dest) {
        $scope.stopFloorsDrct.push({"floor":dest, "continue_up":false, "continue_down":false});
    }

    $scope.isHighlighted = function(floor) {
        return $scope.stopFloorsDrct.some(function(item) {
            return item.floor === floor;
        });
    };

    $scope.chooseFloorSel = function(newFloor) {
        $scope.humanCurrFloor = parseInt(newFloor);
    }

    $scope.chooseDestinationOutside = function (dest) {
        let tmp = {
            "floor": $scope.humanCurrFloor,
            "continue_up": (dest == 1 ? true : false),
            "continue_down": (dest == -1 ? true : false)
        };

        // Check for duplicity
        var isDuplicate = $scope.stopFloorsDrct.some(function(item) {
            return (
                item.floor === tmp.floor &&
                item.continue_up === tmp.continue_up &&
                item.continue_down === tmp.continue_down
            );
        });

        // Push 
        if (!isDuplicate) {
            $scope.stopFloorsDrct.push(tmp);
        }
    }

    $scope.isHighlightedEleButton = function(direction, floor) {    
        // Check if the button should be highlighted based on the JSON data
        if (direction === 'up') {
            return $scope.stopFloorsDrct.some(function(item) {
                return item.floor === floor && item.continue_up;
            });
        } else if (direction === 'down') {
            return $scope.stopFloorsDrct.some(function(item) {
                return item.floor === floor && item.continue_down;
            });
        }
    };

    //Data
    loadData();

    $interval(refreshScene, 3000);
});