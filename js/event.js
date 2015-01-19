angular.module("event", [])
    .controller("ChildCtrl", ["$scope", function($scope) {
        $scope.state = "normal";

        $scope.test = function() {
            $scope.$emit("emit", 1);
        };

        $scope.$on("broadcast", function(e) {
            e.stopPropagation();

            $scope.state = "broadcast";

            if (e.currentScope != $scope) {
                $timeout(function() {
                    $scope.$broadcast("broadcast", 1);
                }, 5000);
            }
        });

        $scope.$on("emit", function(e) {
            $scope.state = "emit";

            if (e.currentScope == $scope) {
                e.preventDefault();

                $timeout(function() {
                    $scope.$emit("emit", 1);
                }, 5000);
            }
        });
    }]);