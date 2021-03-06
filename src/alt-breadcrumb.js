;(function() {
  "use strict";

  angular
  .module('alt.breadcrumb', [])
    .constant('AltBreadcrumbEventos', {
      EVENTO_BREADCRUMB_PRONTO: 'alt.breadcrumb_pronto',
      EVENTO_CRIACAO_BREADCRUMB: 'alt.criar_breadcrumb',
      EVENTO_NAVEGACAO_SOLICITADA: 'alt.navegacao_solicitada',
      EVENTO_DESTRUICAO_BREADCRUMB: 'alt.destruir_breadcrumb',
      EVENTO_REINICIALIZACAO_BREADCRUMB: 'alt.reiniciar_breadcrumb'
    })
    .service('AltBreadcrumbService', ['$rootScope', 'AltBreadcrumbEventos', function($rootScope, AltBreadcrumbEventos) {
      this.navegar = function(opt) {
        $rootScope.$broadcast(AltBreadcrumbEventos.EVENTO_NAVEGACAO_SOLICITADA, opt);
      };
    }])
    .directive('altBreadcrumb', ['$rootScope', '$sce', 'AltBreadcrumbEventos', function($rootScope, $sce, AltBreadcrumbEventos) {
      var _mainDescription = '';
      var _template = '<div id="alt-breadcrumb">\
                         <div class="breadcrumb-items-container">\
                           <div class="breadcrumb-item text-center"\
                                ng-class="{\'breadcrumb-selected-item\': step.isActive}"\
                                ng-click="_onClick(step)"\
                                ng-repeat="step in _obj.steps"\
                                ng-show="!!step.isVisible">\
                             <p ng-show="!step.isCompleted && _obj.showNumbers">{{step.label}}</p>\
                             <p ng-show="!!_obj.showCompletion && !!step.isCompleted" class="fa fa-fw fa-check"></p>\
                             <p ng-show="!_obj.showNumbers && (!_obj.showCompletion || !step.isCompleted)" class="fa fa-fw {\{step.icon}}"></p>\
                           </div>\
            			       </div>\
                  			 <div class="breadcrumb-description-container text-center" ng-show="_obj.showDescription">\
                  			    <span>{{_mainDescription}}</span>\
                  			 </div>\
                       </div>';

      var _link = function(scope, element, attrs) {
        var _breadcrumb = element.find('#alt-breadcrumb');
        scope._obj = {
          showNumbers: false,
          showDescription: false,
          showCompletion: false,
          steps: []
        };

        scope._onClick = function(step) {
          scope.$emit(AltBreadcrumbEventos.EVENTO_NAVEGACAO_SOLICITADA, step);
        };

        scope.$on(AltBreadcrumbEventos.EVENTO_CRIACAO_BREADCRUMB, function(evento, obj) {
          if (!angular.isObject(obj)) {
            throw new Error('obj was not informed.');
          }

          scope._obj = obj;

          var stepNumber = 0;
          for (var i = 0; i < scope._obj.steps.length; i++) {
            if (i === 0) {
              stepNumber = i;
            }

            if (!!scope._obj.steps[i].isVisible) {
              scope._obj.steps[i].label = stepNumber + 1;
              stepNumber++;
            }

            scope._obj.steps[i].index = i;
            if(!!scope._obj.steps[i].isActive) {
              scope._mainDescription = scope._obj.steps[i].description;
            }

            if(!scope._obj.steps[i].icon) {
              scope._obj.steps[i].icon = 'fa-minus';
            }
          }
        });

        scope.$on(AltBreadcrumbEventos.EVENTO_NAVEGACAO_REALIZADA, function(evento, obj) {
          if (!obj) {
            throw new Error('The breadcrumb update object has not been given.');
          }

          if (obj.index < 0) {
            throw new Error('The given index is not valid.');
          }
          
          for (var i = 0; i < scope._obj.steps.length; i++) {
            scope._obj.steps[i].isActive = false;
            if(scope._obj.steps[i].index === obj.index) {
              scope._obj.steps[i].isActive = true;
              scope._mainDescription = scope._obj.steps[i].description;

              if (obj.mudancaStatus) {
                if (i > 0 && obj.mudancaStatus.etapaAvancando) {
                  scope._obj.steps[i-1].isCompleted = obj.mudancaStatus.isCompleted;
                } else if (i < scope._obj.steps.length - 1 && !obj.mudancaStatus.etapaAvancando) {
                  scope._obj.steps[i+1].isCompleted = obj.mudancaStatus.isCompleted;
                }
              }
            }
          }
        });

        scope.$on(AltBreadcrumbEventos.EVENTO_REINICIALIZACAO_BREADCRUMB, function(evento, obj) {
          for (var i = 0; i < scope._obj.steps.length; i++) {
            scope._obj.steps[i].isCompleted = false;
            scope._obj.steps[i].isActive = false;
          }
          scope._obj.steps[0].isActive = true;
          scope._mainDescription = scope._obj.steps[0].description;
        })

        scope.$on(AltBreadcrumbEventos.EVENTO_DESTRUICAO_BREADCRUMB, function(evento, obj) {
          _breadcrumb = undefined;
        });

        scope.$emit(AltBreadcrumbEventos.EVENTO_BREADCRUMB_PRONTO);
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
