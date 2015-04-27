(function() {
  'use strict';
  angular.module('civic.events')
    .directive('revisionsGrid', revisionsGrid)
    .controller('RevisionsGridController', RevisionsGridController);

  // @ngInject
  function revisionsGrid() {
    var directive = {
      restrict: 'E',
      replace: true,
      scope: {
        changes: '=',
        baseState: '@'
      },
      templateUrl: 'app/views/events/common/revisionsGrid.tpl.html',
      controller: 'RevisionsGridController'
    };
    return directive;
  }

  // @ngInject
  function RevisionsGridController($scope, $state, $stateParams, $location, uiGridConstants) {
    /*jshint camelcase: false */
    var ctrl = $scope.ctrl = {};
    $scope.$state = $state;
    $scope.$stateParams = $stateParams;

    ctrl.revisionsGridOptions = {
      enablePaginationControls: true,
      paginationPageSizes: [8],
      paginationPageSize: 8,
      minRowsToShow: 9,

      enableHorizontalScrollbar: uiGridConstants.scrollbars.NEVER,
      enableVerticalScrollbar: uiGridConstants.scrollbars.NEVER,
      enableFiltering: true,
      enableColumnMenus: false,
      enableSorting: true,
      enableRowSelection: true,
      enableRowHeaderSelection: false,
      multiSelect: false,
      modifierKeysToMultiSelect: false,
      noUnselect: true,
      columnDefs: [
        { name: 'id',
          displayName: 'ID',
          enableFiltering: false,
          allowCellFocus: false,
          width: '5%'
        },
        { name: 'user',
          displayName: 'Submitted by',
          enableFiltering: true,
          allowCellFocus: false,
          filter: {
            condition: uiGridConstants.filter.CONTAINS
          }
        },
        { name: 'status',
          displayName: 'Status',
          allowCellFocus: false,
          enableFiltering: true,
          filter: {
            condition: uiGridConstants.filter.CONTAINS
          }
        },
        { name: 'created_at',
          displayName: 'Created',
          allowCellFocus: false,
          enableFiltering: true,
          sort: { direction: uiGridConstants.DESC },
          filter: {
            condition: uiGridConstants.filter.CONTAINS
          }
        }
      ]
    };

    // wait until grid instantiated, then assign data and row-click listener
    ctrl.revisionsGridOptions.onRegisterApi = function(gridApi){
      ctrl.gridApi = gridApi;

      $scope.$watch('changes', function(changes){
        ctrl.revisionsGridOptions.data = changes;
      });

      gridApi.selection.on.rowSelectionChanged($scope, function(row){
        var params = $scope.$stateParams;
        params.changeId = row.entity.id;
        var newState = $scope.baseState + '.summary';
        $scope.$state.go(newState, params);
      });
    };
  }

})();
