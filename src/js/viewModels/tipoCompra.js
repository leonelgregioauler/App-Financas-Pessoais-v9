define([
  "knockout",
  "appController",
  "ojs/ojmodule-element-utils",
  "accUtils",
  "ojs/ojcontext",
  "../bancoDeDados",
  "ojs/ojarraydataprovider",
  "ojs/ojknockout-keyset",
  "ojs/ojknockout",
  "ojs/ojinputtext",
  "ojs/ojlabel",
  "ojs/ojbutton",
  "ojs/ojformlayout",
  "ojs/ojmessaging",
  "ojs/ojlistview",
  "ojs/ojlistitemlayout"
], function (ko, app, moduleUtils, accUtils, Context, BancoDeDados, ArrayDataProvider, keySet) {
  function TipoCompraViewModel() {
    var self = this; 

    // Wait until header show up to resolve
    var resolve = Context.getPageContext().getBusyContext().addBusyState({description: "wait for header"});
    // Header Config
    self.headerConfig = ko.observable({'view':[], 'viewModel':null});
    moduleUtils.createView({'viewPath':'views/header.html'}).then(function(view) {
      self.headerConfig({'view':view, 'viewModel': app.getHeaderModel()});
      resolve();
    })

    self.currentIndex;
    self.currentItem = ko.observable('');
    self.nomeTipoCompra = ko.observable();
    self.dataTipoCompra = ko.observableArray([]);
    self.exibe = ko.observable(false);

    self.consultaTipoCompra = function () {
      self.dataTipoCompra(BancoDeDados.consultaTipoCompra('SELECT * FROM TIPOCOMPRA'));
      setTimeout(function() {
        self.exibe(true);
        var items = self.dataTipoCompra();
        var array = items.map(function(e) {
          return e.idTipoCompra;
        });
        self.lastItemId = Math.max.apply(null, array);
        self.dataProviderTipoCompra = new ArrayDataProvider(self.dataTipoCompra, { keyAttributes: "idTipoCompra" } );
      }, 500); 
    }
    self.dataProviderTipoCompra = new ArrayDataProvider(self.dataTipoCompra, { keyAttributes: "idTipoCompra" } );
    
    self.selectedItems = new keySet.ObservableKeySet();
    
    self.isTextEmpty = ko.observable(true);
    self.isTextAndSelecionFilled = ko.computed(function(){
      return  ( !self.isTextEmpty() && !self.isSelectionEmpty() ) || self.isTextEmpty();
    }, self);

    self.isSelectionEmpty = ko.computed(function () {
      return self.selectedItems().values().size === 0;
    }, self);
    self.isTextOrSelectionEmpty = ko.computed(function () {
      return self.isTextEmpty() || self.isSelectionEmpty();
    }, self);
  
    self.addItem = function () {
      var itemToAdd = self.currentItem();
      if ((itemToAdd !== '')) {
        BancoDeDados.insereTipoCompra(itemToAdd);
        self.exibe(false);
        self.consultaTipoCompra();
        self.currentItem('');
      }
    }.bind(self);
  
    self.updateSelected = function () {
      var itemToReplace = self.dataTipoCompra()[self.currentIndex];
      self.dataTipoCompra.splice(self.currentIndex, 1,
        { value: itemToReplace.value, label: self.currentItem(), idTipoCompra: itemToReplace.idTipoCompra, nomeTipoCompra: self.currentItem() });
      BancoDeDados.atualizaTipoCompra(itemToReplace.value, self.currentItem());
    }.bind(self);
  
    self.removeSelected = function () {
      const items = self.dataTipoCompra();
      var itemToRemove = self.dataTipoCompra()[self.currentIndex];
      tipoCompraRestante = items.filter( (compra) => {
        return compra.label !== self.currentItem();
      })
      BancoDeDados.removeTipoCompra(itemToRemove.idTipoCompra);
      self.exibe(false);
      self.consultaTipoCompra();
      self.currentItem('');
      /* self.exibe(false);
      self.dataTipoCompra(tipoCompraRestante);
      self.dataProviderTipoCompra = new ArrayDataProvider(self.dataTipoCompra, { keyAttributes: "idTipoCompra" } );
      self.exibe(true);
      self.currentItem(''); */
    }.bind(self);
 
    self.handleCurrentItemChanged = function (event) {
      var key = event.detail.value;
      var items = self.dataTipoCompra();
      var indice = items.map(function(e) {
        return e.idTipoCompra;
      }).indexOf(key);

      for (var i = 0; i < items.length; i++) { 
        if (i === indice) {
          self.currentIndex = i;
          self.currentItem(items[i].label);
          break;
        }
      }
    }.bind(self);
  
    self.handleRawValueChanged = function (event) {
      var value = event.detail.value;
      self.isTextEmpty(value.trim().length === 0);
    }.bind(self);

    self.connected = function () {
      accUtils.announce("About page loaded.", "assertive");
      document.title = "About";
      self.consultaTipoCompra();
    };

    self.disconnected = function () {};

    self.transitionCompleted = function () {};
  }

  return TipoCompraViewModel;
});
