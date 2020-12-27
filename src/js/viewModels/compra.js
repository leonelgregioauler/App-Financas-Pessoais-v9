define([
  "knockout",
  "appController",
  "ojs/ojmodule-element-utils",
  "accUtils",
  "ojs/ojcontext",
  "../bancoDeDados",
  "ojs/ojarraydataprovider",
  "ojs/ojconverter-datetime",
  "ojs/ojconverter-number",
  "ojs/ojknockout-keyset",
  "ojs/ojknockout",
  "ojs/ojinputtext",
  "ojs/ojinputnumber",
  "ojs/ojlabel",
  "ojs/ojbutton",
  "ojs/ojformlayout",
  "ojs/ojmessaging",
  "ojs/ojlistview",
  "ojs/ojlistitemlayout",
  "ojs/ojselectsingle",
  "ojs/ojdatetimepicker"
], function (ko, app, moduleUtils, accUtils, Context, BancoDeDados, ArrayDataProvider, DateTimeConverter, NumberConverter, keySet) {
  function CompraViewModel() {
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
    self.dataEstabelecimento = ko.observableArray([]);
    self.dadosCompra = ko.observableArray([]);
    self.exibe = ko.observable(false);

    self.consultaEstabelecimento = function () {
      self.dataEstabelecimento(BancoDeDados.consultaEstabelecimento(`SELECT E.idEstabelecimento, E.nomeEstabelecimento, E.idTipoCompra, T.nomeTipoCompra`+
                                                                    ` FROM ESTABELECIMENTO E`+
                                                                    `    , TIPOCOMPRA T`+
                                                                    ` WHERE E.idTipoCompra = T.idTipoCompra`));
      setTimeout(function() {
        self.exibe(true);
      }, 500); 
    }
    self.dataProviderEstabelecimento = new ArrayDataProvider(self.dataEstabelecimento , { keyAttributes: "idEstabelecimento" } );
    self.estabelecimento = ko.observable();
    self.descricaoCompra = ko.observable();
    self.dataCompra = ko.observable();
    self.valorCompra = ko.observable();
    self.valorItem = ko.observable();
 
    self.atualizaEstabelecimentoSelecionado = function () {
      console.log(self.estabelecimento());
      console.log(self.valorItem());
    }

    self.consultaCompra = function () {
    self.dadosCompra(BancoDeDados.consultaCompra(` SELECT C.idCompra, C.idEstabelecimento, E.nomeEstabelecimento, C.descricaoCompra, C.dataCompra, C.valorCompra`+
                                                 ` FROM COMPRA C`+
                                                 `    , ESTABELECIMENTO E`+
                                                 `    , TIPOCOMPRA T`+
                                                 ` WHERE E.idTipoCompra = T.idTipoCompra`+
                                                 ` AND C.idEstabelecimento = E.idEstabelecimento`));
      setTimeout(function() {
        self.exibe(true);
        var items = self.dadosCompra();
        var array = items.map(function(e) {
          return e.idCompra;
        });
        self.lastItemId = Math.max.apply(null, array);
        self.dataProviderCompra = new ArrayDataProvider(self.dadosCompra , { keyAttributes: "idCompra" } );
      }, 500); 
    }
    self.dataProviderCompra = new ArrayDataProvider(self.dadosCompra , { keyAttributes: "idCompra" } );

    self.selectedItems = new keySet.ObservableKeySet();

    self.dateShortConverter = new DateTimeConverter.IntlDateTimeConverter({
      formatType: 'date',
      dateFormat: 'short'
    });

    self.conversor = new NumberConverter.IntlNumberConverter({
      style: "decimal",
      minimumIntegerDigits: "1",
      minimumFractionDigits: "2"
    });
    
    self.dataCompra(self.dateShortConverter.format(self.dataCompra));
    
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
      var itemToAdd = self.descricaoCompra();
      if ((itemToAdd !== '')) {
        BancoDeDados.insereCompra(self.valorItem().data.value, self.descricaoCompra(), self.dataCompra(), self.valorCompra());
        self.exibe(false);
        self.consultaCompra();
        self.estabelecimento('');
        self.descricaoCompra('');
        self.dataCompra('');
        self.valorCompra(''); 
      }
    }.bind(self);
  
    self.updateSelected = function () {
      var itemToReplace = self.dadosCompra()[self.currentIndex];
      self.dadosCompra.splice(self.currentIndex, 1,
        { idCompra: itemToReplace.idCompra, idEstabelecimento: self.valorItem().data.value, nomeEstabelecimento: self.valorItem().data.label, descricaoCompra: self.descricaoCompra(), dataCompra: self.dataCompra(), valorCompra: self.valorCompra() });
      BancoDeDados.atualizaCompra(itemToReplace.idCompra, self.valorItem().data.value, self.descricaoCompra(), self.dataCompra(), self.valorCompra());
    }.bind(self);
  
    self.removeSelected = function () {
      const items = self.dadosCompra();
      var itemToRemove = self.dadosCompra()[self.currentIndex];
      compraRestante = items.filter( (compra) => {
        return compra.idCompra != itemToRemove.idCompra;
      })
      BancoDeDados.removeCompra(itemToRemove.idCompra);
      self.exibe(false);
      self.consultaCompra();
      self.estabelecimento('');
      self.descricaoCompra('');
      self.dataCompra('');
      self.valorCompra('');
      /* self.dadosCompra(compraRestante);
      self.dataProviderCompra = new ArrayDataProvider(self.dadosCompra, { keyAttributes: "idCompra" } );
      self.exibe(true); */
    }.bind(self);
  
    self.handleCurrentItemChanged = function (event) {
      var key = event.detail.value;
      var items = self.dadosCompra();
      var indice = items.map(function(e) {
        return e.idCompra;
      }).indexOf(key);
      
      for (var i = 0; i < items.length; i++) { 
        if (i === indice) {
          self.currentIndex = i;
          self.estabelecimento(items[i].idEstabelecimento);
          self.descricaoCompra(items[i].descricaoCompra);
          self.dataCompra(items[i].dataCompra);
          self.valorCompra(items[i].valorCompra);
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
      self.consultaEstabelecimento();
      self.consultaCompra();
      //BancoDeDados.removeBancoDeDados();
    };

    self.disconnected = function () {};

    self.transitionCompleted = function () {};
  }

  return CompraViewModel;
});
