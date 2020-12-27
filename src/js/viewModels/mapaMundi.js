/**
 * @license
 * Copyright (c) 2014, 2020, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
/*
 * Your dashboard ViewModel code goes here
 */
define([
  "knockout",
  "appController",
  "ojs/ojmodule-element-utils",
  "accUtils",
  "ojs/ojcontext",
  "ojs/ojbootstrap",
  "text!../../cookbook/dataVisualizations/thematicMap/resources/maps/africa_countries.json",
  "text!../../cookbook/dataVisualizations/thematicMap/resources/maps/asia_countries.json",
  "text!../../cookbook/dataVisualizations/thematicMap/resources/maps/australia_countries.json",
  "text!../../cookbook/dataVisualizations/thematicMap/resources/maps/europe_countries.json",
  "text!../../cookbook/dataVisualizations/thematicMap/resources/maps/north_america_countries.json",
  "text!../../cookbook/dataVisualizations/thematicMap/resources/maps/south_america_countries.json",
  "text!../../cookbook/dataVisualizations/thematicMap/resources/maps/world_countries.json",
  "ojs/ojattributegrouphandler", 
  "ojs/ojarraydataprovider",
  "ojs/ojknockout", 
  "ojs/ojthematicmap", 
  "ojs/ojformlayout", 
  "jet-composites/demo-select-enum/1.0.0/loader",
  "ojs/ojselectsingle"
], function (ko, app, moduleUtils, accUtils, Context, Bootstrap, africa, asia, australia, europe, nAmerica, sAmerica, world, attributeGroupHandler, ArrayDataProvider) {
  function MapaMundiViewModel() { 
    var self = this;

    // Wait until header show up to resolve
    var resolve = Context.getPageContext()
      .getBusyContext()
      .addBusyState({ description: "wait for header" });
    // Header Config
    self.headerConfig = ko.observable({ view: [], viewModel: null });
    moduleUtils
      .createView({ viewPath: "views/header.html" })
      .then(function (view) {
        self.headerConfig({ view: view, viewModel: app.getHeaderModel() });
        resolve();
      });

    const continentes = [{ value: "Africa", label: "Africa"},
                         { value: "Asia", label: "Asia"},
                         { value: "Australia", label: "Australia"},
                         { value: "Europe", label: "Europe"},
                         { value: "North America", label: "North America"},
                         { value: "South America", label: "South America"},
                         { value: "World", label: "World"}];
    self.listaContinentes = new ArrayDataProvider(continentes, { keyAttributes: 'value'} );
    
    this.map = ko.observable("Europe");
    var areaData = ko.observableArray();
    this.dataProvider = new ArrayDataProvider(areaData, {keyAttributes: '@index'});
    this.mapProvider = ko.observable();
    var handler;

    this.getColor = function(id) {
      return handler.getValue(id);
    };

    var updateMap = function (map) {
      var geo;
      switch(map) {
        case 'Africa':
          geo = JSON.parse(africa);
          break;
        case 'Asia':
          geo = JSON.parse(asia);
          break;
        case 'Australia':
          geo = JSON.parse(australia);
          break;
        case 'Europe':
          geo = JSON.parse(europe);
          break;
        case 'North America':
          geo = JSON.parse(nAmerica);
          break;
        case 'South America':
          geo = JSON.parse(sAmerica);
          break;
        case 'World':
        defaut:
          geo = JSON.parse(world);
      }
      this.mapProvider({
        geo: geo,
        propertiesKeys: {
          id: 'iso_a3',
          shortLabel: 'iso_a3',
          longLabel: 'name_long'
        }
      });

      areaData(geo["features"]);
      // For demo purposes, use the color attribute group handler to give
      // areas different colors based on a non important data dimension.
      // In a real application, the color attribute group handler should be
      // passed a meaningful data dimension.
      handler = new attributeGroupHandler.ColorAttributeGroupHandler();
    }.bind(this);

    updateMap(this.map());

    self.mapListener = function (event) {
      updateMap(event.detail.value);
    };

    self.connected = function () {
      accUtils.announce("Dashboard page loaded.", "assertive");
      document.title = "Dashboard";
      // Implement further logic if needed
    };

    self.disconnected = function () {
      // Implement if needed
    };

    self.transitionCompleted = function () {
      // Implement if needed
    };
  }

  return MapaMundiViewModel;
});
