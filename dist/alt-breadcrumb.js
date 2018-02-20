;(function() {
  "use strict";

  angular
  .module('alt.breadcrumb', [])
    .constant('AltBreadcrumbEventos', {
      EVENTO_CRIACAO_BREADCRUMB: 'alt.criar_breadcrumb',
      EVENTO_NAVEGACAO_SOLICITADA: 'alt.navegacao_solicitada',
      EVENTO_DESTRUICAO_BREADCRUMB: 'alt.destruir_breadcrumb'
    })
    .service('AltBreadcrumbService', ['$rootScope', 'AltBreadcrumbEventos', function($rootScope, AltBreadcrumbEventos) {
      this.navegar = function(opt) {
        $rootScope.$broadcast(AltBreadcrumbEventos.EVENTO_NAVEGACAO_SOLICITADA, opt);
      };
    }])
    .directive('altBreadcrumb', ['$rootScope', '$sce', 'AltBreadcrumbEventos', function($rootScope, $sce, AltBreadcrumbEventos) {
      var _templateBreadcrumb = '';
      var _descricaoEtapaAtual = '';
      var _template = `<div id="alt-breadcrumb">
                         <div class="breadcrumb-itens-container">
                            {{_templateBreadcrumb}}
            			       </div>
                  			 <div class="breadcrumb-descricao-container text-center" ng-show="showDescription">
                  			    <span ng-bind="_descricaoEtapaAtual"></span>
                  			 </div>
                       </div>`;

      var _link = function(scope, element, attrs) {
        var _breadcrumb = element.find('#alt-breadcrumb');

        $scope.$on(AltBreadcrumbEventos.EVENTO_CRIACAO_BREADCRUMB, function(evento, obj) {
          if (!angular.isObject(obj)) {
            throw new Error('obj was not informed.');
          }

          scope._obj = obj;

          if (!!scope._obj && !!scope._obj.etapas) {
            for (var i = 0; i < scope._obj.etapas.length; i++) {
              _templateBreadcrumb += `<div class="breadcrumb-item text-center">
                                					<p ng-show="_obj.showNumbers">${i + 1}</p>
                                				</div>`;
            }
          }
        });

        $scope.$on(AltBreadcrumbEventos.EVENTO_DESTRUICAO_BREADCRUMB, function(evento, obj) {
          _breadcrumb = undefined;
        });
      }

      var _scope = {};

      var _replace = true;

      var _restrict = 'E';

      return {
                restrict: _restrict,
                replace: _replace,
                template: _template,
                link: _link,
                scope: _scope
             };
    }]);
}());
