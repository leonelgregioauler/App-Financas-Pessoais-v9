/**
  Copyright (c) 2015, 2020, Oracle and/or its affiliates.
  Licensed under The Universal Permissive License (UPL), Version 1.0
  as shown at https://oss.oracle.com/licenses/upl/

*/
define(['ojs/ojcomposite', 'text!./demo-select-enum-view.html', './demo-select-enum-viewModel', 'text!./component.json', 'css!./demo-select-enum-styles'],
  function(Composite, view, viewModel, metadata) {
    Composite.register('demo-select-enum', {
      view: view,
      viewModel: viewModel,
      metadata: JSON.parse(metadata)
    });
  }
);