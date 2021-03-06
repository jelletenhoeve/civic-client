(function() {
  'use strict';
  angular.module('civic.config')
    .config(commentConfig);

  // @ngInject
  function commentConfig(formlyConfigProvider) {
    var _ = window._;
    formlyConfigProvider.setType({
      name: 'comment',
      extends: 'textarea',
      wrapper: ['validationMessages', 'horizontalBootstrapComment', 'bootstrapHasError', 'mentioCommentMenus'],
      data: {
        users: [],
        entities: []
      },
      controller: /* @ngInject */ function($scope, $filter, CommentSuggestions) {
        $scope.searchUsers = function(term) {
          CommentSuggestions.getUserSuggestions(term).then(function(response) {
            $scope.users = response;
          });
        };

        $scope.getUser = function(user) {
          return '@' + user.display_name;
        };

        $scope.searchEntities = function(term) {
          CommentSuggestions.getEntitySuggestions(term).then(function(response) {
            $scope.entities = _.map(response, function(entity) {
              entity.display_type = $filter('keyToLabel')(entity.type).toUpperCase();
              return entity;
            });
          });
        };

        $scope.getEntity= function(entity) {
          var types = {
            gene: 'G',
            variant: 'V',
            variant_group: 'VG',
            evidence_item: 'E',
            revision: 'R'
          };
          return '#' + types[entity.type] + entity.id;
        };

        $scope.typedTerm = '';
      }
    });
  }

})();
