define([],
  function () {

    function criaBancoDeDados () { 
        try {
            db = openDatabase ('App-Financas-Pessoais', 1.0, 'App Finaças Pessoais', 2 * 1024 * 1024);

            db.transaction(function(tx) {
                tx.executeSql('CREATE TABLE IF NOT EXISTS TIPOCOMPRA (idTipoCompra INTEGER PRIMARY KEY AUTOINCREMENT, nomeTipoCompra VARCHAR2(100) NOT NULL)');
                tx.executeSql('CREATE TABLE IF NOT EXISTS ESTABELECIMENTO (idEstabelecimento INTEGER PRIMARY KEY AUTOINCREMENT, nomeEstabelecimento VARCHAR2(100) NOT NULL, idTipoCompra INTEGER NOT NULL, FOREIGN KEY (idTipoCompra) REFERENCES TIPOCOMPRA (idTipoCompra))');
                tx.executeSql('CREATE TABLE IF NOT EXISTS COMPRA (idCompra INTEGER PRIMARY KEY AUTOINCREMENT, idEstabelecimento NUMBER NOT NULL, descricaoCompra VARCHAR2(100) NOT NULL, dataCompra DATETIME NOT NULL, valorCompra DOUBLE NOT NULL, FOREIGN KEY (idEstabelecimento) REFERENCES ESTABELECIMENTO (idEstabelecimento))');
                console.warn("Banco de Dados criado");
            });
        } catch (err) {
          alert ('Erro ao criar tabelas '+ err);
        }
    }

    function removeBancoDeDados ()  {
        try {
            db = openDatabase ('App-Financas-Pessoais', 1.0, 'App Finanças Pessoais', 2 * 1024 * 1024);

            db.transaction(function(tx) {
                tx.executeSql('DROP TABLE COMPRA');
                tx.executeSql('DROP TABLE ESTABELECIMENTO');
                tx.executeSql('DROP TABLE TIPOCOMPRA');
            });
        } catch (err) {
        alert ('Erro ao remover tabelas '+ err);
        }
    }

    function insereTipoCompra (nomeTipoCompra) {
        try {
            db = openDatabase ('App-Financas-Pessoais', 1.0, 'App Finaças Pessoais', 2 * 1024 * 1024);

            db.transaction(function(tx) {
                tx.executeSql(`INSERT INTO TIPOCOMPRA (nomeTipoCompra) VALUES (\'${nomeTipoCompra}\')`);
            });
        } catch (err) {
        alert ('Erro ao inserir tipo de estabelecimento'+ err);
        }
    }

    function consultaTipoCompra (query) {
        var tipoCompra = [];
        try {
            db = openDatabase ('App-Financas-Pessoais', 1.0, 'App Finaças Pessoais', 2 * 1024 * 1024);

            db.transaction(function(tx) {
                tx.executeSql(query, [], function(tx, result) {
                    var len = result.rows.length;

                    for (var i = 0; i < len; i++) {
                      /* tipoCompra[i] = {};
                      tipoCompra[i].value = result.rows[i].idTipoCompra;
                      tipoCompra[i].label = result.rows[i].nomeTipoCompra; */
                      var row = result.rows.item(i);
                      tipoCompra[i] = {
                        value: row['idTipoCompra'],
                        label: row['nomeTipoCompra'],
                        idTipoCompra: row['idTipoCompra'],
                        nomeTipoCompra: row['nomeTipoCompra']
                      }
                    }
                }, null);
                
            });
        } catch (err) {
          alert ('Erro ao consultar o tipo de compra ' + err);
        }
        return tipoCompra;
    }
    
    function atualizaTipoCompra (idTipoCompra, nomeTipoCompra) {
        try {
            db = openDatabase ('App-Financas-Pessoais', 1.0, 'App Finaças Pessoais', 2 * 1024 * 1024);

            db.transaction(function(tx) {
                tx.executeSql(`UPDATE TIPOCOMPRA SET nomeTipoCompra = \'${nomeTipoCompra}\' WHERE idTipoCompra = ${idTipoCompra}`);
            });
        } catch (err) {
        alert ('Erro ao atualizar o tipo de compra '+ err);
        }
    }

    function removeTipoCompra (idTipoCompra) {
        try {
            db = openDatabase ('App-Financas-Pessoais', 1.0, 'App Finaças Pessoais', 2 * 1024 * 1024);

            db.transaction(function(tx) {
                tx.executeSql(`DELETE FROM TIPOCOMPRA WHERE idTipoCompra = ${idTipoCompra}`);
            });
        } catch (err) {
        alert ('Erro ao remover o tipo de compra '+ err);
        }
    }

    function insereEstabelecimento (nomeEstabelecimento, idTipoCompra) {
        try {
            db = openDatabase ('App-Financas-Pessoais', 1.0, 'App Finaças Pessoais', 2 * 1024 * 1024);

            db.transaction(function(tx) {
                /* tx.executeSql(`INSERT INTO ESTABELECIMENTO (nomeEstabelecimento, idTipoCompra) VALUES (\'${nomeEstabelecimento}\', ${idTipoCompra+1})`); */
                tx.executeSql(`INSERT INTO ESTABELECIMENTO (nomeEstabelecimento, idTipoCompra) VALUES (\'${nomeEstabelecimento}\', ${idTipoCompra})`);
            });
        } catch (err) {
        alert ('Erro ao inserir estabelecimento '+ err);
        }
    } 

    function consultaEstabelecimento (query) {
        var estabelecimentos = [];
        try {
            db = openDatabase ('App-Financas-Pessoais', 1.0, 'App Finaças Pessoais', 2 * 1024 * 1024);
            
            db.transaction(function(tx) {
                tx.executeSql(query, [], function(tx, result) {
                    var len = result.rows.length;

                    for (var i = 0; i < len; i++) {
                      /* estabelecimentos[i] = {};
                      estabelecimentos[i].idEstabelecimento = result.rows[i].idEstabelecimento;
                      estabelecimentos[i].nomeEstabelecimento = result.rows[i].nomeEstabelecimento; */
                      var row = result.rows.item(i);
                      estabelecimentos[i] = {
                        value: row['idEstabelecimento'],
                        label: row['nomeEstabelecimento'],
                        idEstabelecimento: row['idEstabelecimento'],
                        idTipoCompra: row['idTipoCompra'],
                        nomeTipoCompra: row['nomeTipoCompra']
                      }
                    }
                }, null);
            });
        } catch (err) {
          alert ('Erro ao consultar estabelecimento '+ err);
        }
        return estabelecimentos;
    } 

    function atualizaEstabelecimento (idEstabelecimento, nomeEstabelecimento, idTipoCompra) {
        try {
            db = openDatabase ('App-Financas-Pessoais', 1.0, 'App Finaças Pessoais', 2 * 1024 * 1024);

            db.transaction(function(tx) {
                tx.executeSql(`UPDATE ESTABELECIMENTO SET nomeEstabelecimento = \'${nomeEstabelecimento}\', idTipoCompra = ${idTipoCompra} WHERE idEstabelecimento = ${idEstabelecimento}`);
            });
        } catch (err) {
        alert ('Erro ao atualizar o estabelecimento '+ err);
        }
    }

    function removeEstabelecimento (idEstabelecimento) {
        try {
            db = openDatabase ('App-Financas-Pessoais', 1.0, 'App Finaças Pessoais', 2 * 1024 * 1024);

            db.transaction(function(tx) {
                tx.executeSql(`DELETE FROM ESTABELECIMENTO WHERE idEstabelecimento = ${idEstabelecimento}`);
            });
        } catch (err) {
        alert ('Erro ao remover o estabelecimento '+ err);
        }
    }

    function insereCompra (idEstabelecimento, descricaoCompra, dataCompra, valorCompra ) {
        try {
            db = openDatabase ('App-Financas-Pessoais', 1.0, 'App Finaças Pessoais', 2 * 1024 * 1024);

            db.transaction(function(tx) {
                tx.executeSql(`INSERT INTO COMPRA (idEstabelecimento, descricaoCompra, dataCompra, valorCompra) VALUES (${idEstabelecimento}, \'${descricaoCompra}\', \'${dataCompra}\', ${valorCompra})`);
            });
        } catch (err) {
        alert ('Erro ao inserir compra '+ err);
        }
    } 

    function consultaCompra (query) {
        var compra = [];
        try {
            db = openDatabase ('App-Financas-Pessoais', 1.0, 'App Finaças Pessoais', 2 * 1024 * 1024);

            db.transaction(function(tx) {
                tx.executeSql(query, [], function(tx, result) {
                    var len = result.rows.length;

                    for (var i = 0; i < len; i++) {
                      /* compra[i] = {};
                      compra[i].value = result.rows[i].idCompra;
                      compra[i].label = result.rows[i].idEstabelecimento;
                      compra[i].label = result.rows[i].dataCompra;
                      compra[i].label = result.rows[i].valorCompra; */
                      var row = result.rows.item(i);
                      compra[i] = {
                        idCompra: row['idCompra'],
                        idEstabelecimento: row['idEstabelecimento'],
                        nomeEstabelecimento: row['nomeEstabelecimento'],
                        descricaoCompra: row['descricaoCompra'],
                        dataCompra: row['dataCompra'],
                        valorCompra: row['valorCompra']
                      }
                    }
                }, null);
                
            });
        } catch (err) {
          alert ('Erro ao consultar Compra ' + err);
        }
        return compra;
    } 

    function atualizaCompra (idCompra, idEstabelecimento, descricaoCompra, dataCompra, valorCompra) {
        try {
            db = openDatabase ('App-Financas-Pessoais', 1.0, 'App Finaças Pessoais', 2 * 1024 * 1024);

            db.transaction(function(tx) {
                tx.executeSql(`UPDATE COMPRA SET idEstabelecimento = ${idEstabelecimento}, descricaoCompra = \'${descricaoCompra}\', dataCompra = \'${dataCompra}\', valorCompra = ${valorCompra} WHERE idCompra = ${idCompra}`);
            });
        } catch (err) {
        alert ('Erro ao atualizar a compra '+ err);
        }
    }

    function removeCompra (idCompra) {
        try {
            db = openDatabase ('App-Financas-Pessoais', 1.0, 'App Finaças Pessoais', 2 * 1024 * 1024);

            db.transaction(function(tx) {
                tx.executeSql(`DELETE FROM COMPRA WHERE idCompra = ${idCompra}`);
            });
        } catch (err) {
        alert ('Erro ao remover a compra '+ err);
        }
    }

    

    return { 
             criaBancoDeDados: criaBancoDeDados,
             removeBancoDeDados: removeBancoDeDados,

             insereTipoCompra: insereTipoCompra,
             consultaTipoCompra: consultaTipoCompra,
             atualizaTipoCompra: atualizaTipoCompra,
             removeTipoCompra: removeTipoCompra,

             insereEstabelecimento: insereEstabelecimento,
             consultaEstabelecimento: consultaEstabelecimento,
             atualizaEstabelecimento: atualizaEstabelecimento,
             removeEstabelecimento: removeEstabelecimento,

             insereCompra: insereCompra,
             consultaCompra: consultaCompra,
             atualizaCompra: atualizaCompra,
             removeCompra: removeCompra

           };
  }
);
