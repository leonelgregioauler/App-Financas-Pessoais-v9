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
  "ojs/ojhtmlutils",
  "ojs/ojarraydataprovider",
  "text!../../cookbook/dataVisualizations/chart/resources/twoSeriesData.json",
  "text!../../cookbook/dataVisualizations/chart/resources/basicCoordData.json",
  "ojs/ojknockout",
  "ojs/ojchart",
  "ojs/ojformlayout",
  "ojs/ojbinddom",
  "jet-composites/demo-radioset-enum/1.0.0/loader"
], function (ko, app, moduleUtils, accUtils, Context, HtmlUtils, ArrayDataProvider, barData, coordData) {
  function DashboardViewModel() { 
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

    /* toggle button variables */
    this.selectionValue = ko.observable("multiple");

    /* basic chart data */
    var barJsonData = JSON.parse(barData);
    this.barDataProvider = new ArrayDataProvider(barJsonData, {
      keyAttributes: "id",
    });
    var bubbleJsonData = JSON.parse(coordData);
    this.bubbleDataProvider = new ArrayDataProvider(bubbleJsonData, {
      keyAttributes: "id",
    });

    var selected = [0, 3, 9];
    this.selectedItemsValueBubble = ko.observableArray(selected);
    this.selectedItemsValueBar = ko.observableArray(selected);

    /* toggle button functionality */
    this.selectionValue.subscribe(
      function (value) {
        this.selectionValue(value);
        // reset initial selections
        if (value === "multiple") {
          selected = [0, 3, 9];
        } else if (value === "single") {
          selected = [0];
        } else {
          selected = [];
        }
        this.selectedItemsValueBubble(selected);
        this.selectedItemsValueBar(selected);
      }.bind(this)
    );

    var getSelectionNodes = function (selection, data) {
      var items = "";
      if (selection.length > 0) {
        for (var i = 0; i < selection.length; i++) {
          var index = selection[i];
          var item = data[index];
          items += "    " + item.series + ", " + item.group + "<br/>";
        }
      }
      return HtmlUtils.stringToNodeArray(items);
    }.bind(this);

    this.selectionInfo = ko.pureComputed(
      function () {
        return getSelectionNodes(
          this.selectedItemsValueBubble(),
          bubbleJsonData
        );
      }.bind(this)
    );

    this.selectionInfo2 = ko.pureComputed(
      function () {
        return getSelectionNodes(this.selectedItemsValueBar(), barJsonData);
      }.bind(this)
    );

    self.connected = function () {
      accUtils.announce("Dashboard page loaded.", "assertive");
      document.title = "Dashboard";
      // Implement further logic if needed
    };

    /**
     * Optional ViewModel method invoked after the View is disconnected from the DOM.
     */
    self.disconnected = function () {
      // Implement if needed
    };

    /**
     * Optional ViewModel method invoked after transition to the new View is complete.
     * That includes any possible animation between the old and the new View.
     */
    self.transitionCompleted = function () {
      // Implement if needed
    };
  }

  /*
   * Returns an instance of the ViewModel providing one instance of the ViewModel. If needed,
   * return a constructor for the ViewModel so that the ViewModel is constructed
   * each time the view is displayed.
   */
  return DashboardViewModel;
});
