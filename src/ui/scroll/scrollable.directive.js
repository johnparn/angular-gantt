'use strict';
gantt.directive('ganttScrollable', ['Scrollable', 'debounce', 'GANTT_EVENTS', function(Scrollable, debounce, GANTT_EVENTS) {
    return {
        restrict: 'E',
        transclude: true,
        replace: true,
        templateUrl: function(tElement, tAttrs) {
            if (tAttrs.templateUrl === undefined) {
                return 'template/default.scrollable.tmpl.html';
            } else {
                return tAttrs.templateUrl;
            }
        },
        controller: ['$scope', '$element', function($scope, $element) {
            $scope.template.scrollable = new Scrollable($element);

            // Bind scroll event
            $element.bind('scroll', debounce(function() {
                var el = $element[0];
                var direction;
                var date;

                if (el.scrollLeft === 0) {
                    direction = 'left';
                    date = $scope.gantt.from;
                } else if (el.offsetWidth + el.scrollLeft >= el.scrollWidth) {
                    direction = 'right';
                    date = $scope.gantt.to;
                }

                if (date !== undefined) {
                    $scope.autoExpandColumns(el, date, direction);
                    $scope.$emit(GANTT_EVENTS.SCROLL, {left: el.scrollLeft, date: date, direction: direction});
                } else {
                    $scope.$emit(GANTT_EVENTS.SCROLL, {left: el.scrollLeft});
                }
            }, 5));
        }]
    };
}]);
