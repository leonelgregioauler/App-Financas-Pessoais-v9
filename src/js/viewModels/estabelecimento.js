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
  "ojs/ojlistitemlayout",
  "ojs/ojselectsingle",
], function (
  ko,
  app,
  moduleUtils,
  accUtils,
  Context,
  BancoDeDados,
  ArrayDataProvider,
  keySet
) {
  function EstabelecimentoViewModel() {
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
    self.currentItem = ko.observable("");
    self.dataEstabelecimento = ko.observableArray([]);
    self.dataTipoCompra = ko.observableArray([]);
    self.exibe = ko.observable(false);

    self.consultaTipoCompra = function () {
      self.dataTipoCompra(
        BancoDeDados.consultaTipoCompra("SELECT * FROM TIPOCOMPRA")
      );
      setTimeout(function () {
        self.exibe(true);
      }, 500);
    };
    self.dataProviderTipoCompra = new ArrayDataProvider(self.dataTipoCompra, {
      keyAttributes: "idTipoCompra",
    });
    self.tipoCompra = ko.observable();
    self.valorItem = ko.observable();

    self.atualizaTipoCompraSelecionada = function () {
      console.log(self.tipoCompra());
      console.log(self.valorItem());
    };

    self.consultaEstabelecimento = function () {
      self.dataEstabelecimento(
        BancoDeDados.consultaEstabelecimento(
          ` SELECT E.idEstabelecimento, E.nomeEstabelecimento, E.idTipoCompra, T.nomeTipoCompra` +
            ` FROM ESTABELECIMENTO E` +
            `    , TIPOCOMPRA T` +
            ` WHERE E.idTipoCompra = T.idTipoCompra`
        )
      );
      setTimeout(function () {
        self.exibe(true);
        var items = self.dataEstabelecimento();
        var array = items.map(function (e) {
          return e.idEstabelecimento;
        });
        self.lastItemId = Math.max.apply(null, array);
        self.dataProviderEstabelecimento = new ArrayDataProvider(
          self.dataEstabelecimento,
          { keyAttributes: "idEstabelecimento" }
        );
      }, 500);
    };
    self.dataProviderEstabelecimento = new ArrayDataProvider(
      self.dataEstabelecimento,
      { keyAttributes: "idEstabelecimento" }
    );

    self.selectedItems = new keySet.ObservableKeySet();

    self.isTextEmpty = ko.observable(true);
    self.isTextAndSelecionFilled = ko.computed(function () {
      return (
        (!self.isTextEmpty() && !self.isSelectionEmpty()) || self.isTextEmpty()
      );
    }, self);

    self.isSelectionEmpty = ko.computed(function () {
      return self.selectedItems().values().size === 0;
    }, self);
    self.isTextOrSelectionEmpty = ko.computed(function () {
      return self.isTextEmpty() || self.isSelectionEmpty();
    }, self);

    self.addItem = function () {
      var itemToAdd = self.currentItem();
      if (itemToAdd !== "") {
        BancoDeDados.insereEstabelecimento(
          itemToAdd,
          self.valorItem().data.value
        );
        self.exibe(false);
        self.consultaEstabelecimento();
        self.tipoCompra("");
        self.currentItem("");
      }
    }.bind(self);

    self.updateSelected = function () {
      var itemToReplace = self.dataEstabelecimento()[self.currentIndex];
      self.dataEstabelecimento.splice(self.currentIndex, 1, {
        value: itemToReplace.value,
        label: self.currentItem(),
        idTipoCompra: self.valorItem().data.value,
        nomeTipoCompra: self.valorItem().data.label,
      });
      BancoDeDados.atualizaEstabelecimento(
        itemToReplace.value,
        self.currentItem(),
        self.tipoCompra()
      );
    }.bind(self);

    self.removeSelected = function () {
      const items = self.dataEstabelecimento();
      var itemToRemove = self.dataEstabelecimento()[self.currentIndex];
      estabelecimentoRestante = items.filter((estabelecimento) => {
        return estabelecimento.label !== self.currentItem();
      });
      BancoDeDados.removeEstabelecimento(itemToRemove.idEstabelecimento);
      self.exibe(false);
      self.consultaEstabelecimento();
      self.tipoCompra("");
      self.currentItem("");
      //self.dataEstabelecimento(estabelecimentoRestante);
      //self.dataProviderEstabelecimento = new ArrayDataProvider(self.dataEstabelecimento, { keyAttributes: "idTipoCompra" } );
      //self.exibe(true);
    }.bind(self);

    self.handleCurrentItemChanged = function (event) {
      var key = event.detail.value;
      var items = self.dataEstabelecimento();
      var indice = items
        .map(function (e) {
          return e.idEstabelecimento;
        })
        .indexOf(key);

      for (var i = 0; i < items.length; i++) {
        if (i === indice) {
          self.currentIndex = i;
          self.currentItem(items[i].label);
          self.tipoCompra(items[i].idTipoCompra);
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
      self.consultaTipoCompra();
      //BancoDeDados.removeBancoDeDados();
    };

    self.disconnected = function () {};

    self.transitionCompleted = function () {};
  }

  return EstabelecimentoViewModel;
});
