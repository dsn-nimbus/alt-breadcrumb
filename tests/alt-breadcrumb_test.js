"use strict";

describe('alt.breadcrumb', function() {
  var _AltBreadcrumbService;

  beforeEach(module('alt.breadcrumb'));

  beforeEach(inject(function($injector) {
    _GreetingService = $injector.get('AltBreadcrumbService');
  }));

  describe('sayHello', function() {
    it('should call the say hello function', function() {
      spyOn(_GreetingService, 'sayHello').and.callFake(angular.noop);

      _GreetingService.sayHello();

      expect(_GreetingService.sayHello).toHaveBeenCalled();
    });

    it('should say hello', function() {
      expect(_GreetingService.sayHello()).toEqual("hello there!");
    });
  });
});
