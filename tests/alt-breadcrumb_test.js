"use strict";

describe('altBreadcrumbDirective', function() {
  var _rootScope, _scope, _compile, _element, _breadcrumb, _AltBreadcrumbEventos, _AltBreadcrumbService
  var EVENTO_CRIACAO = "alt.criar_breadcrumb"
  var EVENTO_NAVEGACAO_SOLICITADA = "alt.navegacao_solicitada"
  var EVENTO_DESTRUICAO = "alt.destruir_breadcrumb"

  beforeEach(module('alt.breadcrumb'))

  beforeEach(inject(function($injector) {
    _rootScope = $injector.get('$rootScope')
    _scope = _rootScope.$new()
    _compile = $injector.get('$compile')
    _AltBreadcrumbEventos = $injector.get('AltBreadcrumbEventos')
    _AltBreadcrumbService = $injector.get('AltBreadcrumbService')

    var _html = '<div alt-breadcrumb></div>'

    _element = angular.element(_html)
    _compile(_element)(_scope)
    _scope.$digest()

    spyOn(_rootScope, '$broadcast').and.callThrough()

    _breadcrumb = _element.find('#breadcrumb')
  }));

  describe('service', function() {
    it('deve ter o service como objeto', function() {
      expect(typeof _AltBreadcrumbService).toBe('object')
    })

    it('navegar - deve chamar o $rootScope.$broadcast com os parâmetros corretos', function() {
      var _opcoes = {a: true}
      _AltBreadcrumbService.navegar(_opcoes)

      expect(_rootScope.$broadcast).toHaveBeenCalledWith(EVENTO_NAVEGACAO_SOLICITADA, _opcoes)
    })
  })

  describe('diretiva', function() {

    describe('criação', function() {
      it('deve ter element criado e acessível', function() {
        expect(_element).toBeDefined()
      })

      it('deve ter o _breadcrumb criado e acessível', function() {
        expect(_breadcrumb).toBeDefined()
      })

      it('deve ter os valores corretos para as constantes', function() {
        expect(_AltBreadcrumbEventos.EVENTO_CRIACAO_BREADCRUMB).toEqual('alt.criar_breadcrumb')
        expect(_AltBreadcrumbEventos.EVENTO_NAVEGACAO_SOLICITADA).toEqual('alt.navegacao_solicitada')
        expect(_AltBreadcrumbEventos.EVENTO_DESTRUICAO_BREADCRUMB).toEqual('alt.destruir_breadcrumb')
      })
    })

    xdescribe('reação ao $broadcast - criar breadcrumb', function() {
      it('deve retornar um erro, pois o objeto de configuração do breadcrumb não foi informado', function() {
        var _objMock = undefined

        expect(function() {
          try {
            _rootScope.$broadcast(_AltBreadcrumbEventos.EVENTO_CRIACAO_BREADCRUMB, _objMock)
          } catch(e) {
            console.log('pqp')
          }
        })
        .toThrow(new Error('obj was not informed.'))
      })
    })
  })
});
