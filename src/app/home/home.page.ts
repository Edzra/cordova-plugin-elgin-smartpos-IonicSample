import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';
declare var cordova: any;

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  smartposPlugin : any;

  xmlSatPath? : string = "../../assets/xmlsat.xml";
  xmlNfcePath? : string = "../../assets/xmlnfce.xml";

  xmlSat? : string;
  xmlNfce? : string;

  //é mais seguro esperar a plataforma carregar antes de iniciar o plugin cordova.
  constructor(public platform: Platform)
  {
    this.platform.ready().then(() => {
      this.smartposPlugin = cordova.plugins.elgin.smartpos;
    });
  }

  //Carregando os xmls de exemplo usado nas funções
  async ngOnInit(){
    await this.saveReadXmlSatTextToString("file//" + this.xmlSatPath);
    await this.saveReadXmlNfceTextToString("file//" + this.xmlNfcePath);
  }
  

  /**
    * Funções ElginPay
    * @param valorTotal O valorTotal da transação deve ser especificado em centavos;  ex: 2260 para 22,60 R$.
    * @callback suc O callback de sucesso nas funções do ElginPay sempre retornará a string formatada com todos os dados da ultima transação/operação. 
    * @callback err O callback de erro sempre retornará alguma exception ocorrida na ação requisitada.
  */

  async testIniciaVendaDebito(){
    await this.smartposPlugin.iniciaVendaDebito(
      {
        valorTotal : "2500"
      },
      (suc) => alert(suc),
      (err) => alert(err)
    );
  }

  /**
   * Como especificado pela documentação:
   * @param tipoFinanciamento FINANCIAMENTO_A_VISTA = 1;
   *                          FINANCIAMENTO_PARCELADO_EMISSOR = 2;
   *                          FINANCIAMENTO_PARCELADO_ESTABELECIMENTO = 3;
   */
  async testIniciaVendaCredito(){
    await this.smartposPlugin.iniciaVendaCredito(
      {
        valorTotal : "2500",
        tipoFinanciamento : 1,
        numeroParcelas : 1
      },
      (suc) => alert(suc),
      (err) => alert(err)
    );
  }

  /**
   * @param ref A referência da transação a ser cancelada.
   * @param data A data da transação a ser cancelada, deve estar no formato dd/mm/aa. ex: 08/02/22
   */
  async testIniciaCancelamentoVenda(){
    await this.smartposPlugin.iniciaCancelamentoVenda(
      {
        valorTotal : "2500",
        ref : "11972",
        data : "10/02/22"
      },
      (suc) => alert(suc),
      (err) => alert(err)
    );
  }

  async testIniciaOperacaoAdministrativa(){
    await this.smartposPlugin.iniciaOperacaoAdministrativa(
      (suc) => alert(suc),
      (err) => alert(err)
    );
  }

  /**
   * Funções da Impressora
   * @callback suc O callback de sucesso sempre retornará o resultado da função executada como o esperado.
   *               para conhecer mais a fundo os parametros a serem enviados em cada função e os seus retornos e seus significados veja:
   *               {@link https://elgindevelopercommunity.github.io/group___m1.html }
   * 
   * @callback err O callback de erro sempre retornará algum tipo de exception que ocorreu devido a integridade da chamada e seus parâmetros.
   */
  
  async inicializarImpressora(){
    //Parâmetros para o SmartPos
    await this.smartposPlugin.AbreConexaoImpressora(
      {
        tipo : 5 ,
        modelo : "SMARTPOS" ,
        conexao : "" ,
        parametro : 0
      },
      (suc) => alert(suc) ,
      (err) => alert(err)
    );
  }

  async inicializarImpressoraExterna(){
    await this.smartposPlugin.AbreConexaoImpressora(
      //Parametros para abrir a conexão com uma i9
      {
        tipo : 3 ,
        modelo : "I9" ,
        conexao : "192.168.0.34" ,
        parametro : 9100
      },
      (suc) => alert(suc) ,
      (err) => alert(err)
    )
  }

  async testarDesligamentoImpressora(){
    await this.smartposPlugin.FechaConexaoImpressora( 
      (suc) => alert(suc) ,
      (err) => alert(err)
    );
  }

  async testarImpressao(){ 
    await this.smartposPlugin.ImpressaoTexto(
      {
        dados : "Hello World" ,
        posicao : 1,
        stilo : 0,
        tamanho : 17
      },
      (success) => alert(success) ,
      (error) => alert(error)
    );
    //Avança papel para garantir a visualização da impressao
    await this.smartposPlugin.AvancaPapel(
      {
        linhas : 10
      },
      (suc) => alert(suc) ,
      (err) => alert(err)
    );

  }

  async testarImpressaoBarCode(){
    await this.smartposPlugin.DefinePosicao(
      {
        posicao : 0
      },
      (suc) => alert(suc) ,
      (err) => alert(err)
    )

    await this.smartposPlugin.ImpressaoCodigoBarras(
      {
        tipo : 3 ,
        dados : "40170725" ,
        altura : 120 ,
        largura : 6 ,
        HRI : 4
      },
      (suc) => alert(suc) ,
      (err) => alert(err) 
      
    );

    await this.smartposPlugin.AvancaPapel(
      {
        linhas : 10
      },
      (suc) => alert(suc) ,
      (err) => alert(err)
    );

  }

  async testarImpressaoQRCode(){

    await this.smartposPlugin.DefinePosicao(
      {
        posicao : 1
      },
      (suc) => alert(suc) ,
      (err) => alert(err)
    )

    await this.smartposPlugin.ImpressaoQRCode(
      {
        dados : "Hello World" ,
        tamanho : 6 ,
        nivelCorrecao : 2
      } ,
      (suc) => alert(suc) ,
      (err) => alert(err)
    )

    await this.smartposPlugin.AvancaPapel(
      {
        linhas : 10
      },
      (suc) => alert(suc) ,
      (err) => alert(err)
    );

  }

  /**
   * @param dados O xml deve ser enviado como string para as funções de impressão de xml.
   */

  async testarImpressaoXMLNFCe(){
    await this.smartposPlugin.ImprimeXMLNFCe(
      {
        dados : this.xmlNfce ,
        indexcsc : 1 , 
        csc : "CODIGO-CSC-CONTRIBUINTE-36-CARACTERES" ,
        param : 0
      },
      (suc) => alert(suc) ,
      (err) => alert(err)
    );

    await this.smartposPlugin.AvancaPapel(
      {
        linhas : 10
      },
      (suc) => alert(suc) ,
      (err) => alert(err)
    );

  }

  async testarImpressaoXMLSAT(){
    this.smartposPlugin.ImprimeXMLSAT(
      {
        dados : this.xmlSat ,
        param : 0
      },
      (suc) => alert(suc) ,
      (err) => alert(err)
    );

    await this.smartposPlugin.AvancaPapel(
      {
        linhas : 10
      },
      (suc) => alert(suc) ,
      (err) => alert(err)
    );

  }

  async testarStatusSensorPapel(){
    await this.smartposPlugin.StatusImpressora(
      {
        param : 3
      },
      (suc) => alert(suc) ,
      (err) => alert(err)
    )
  }


  //Função extra criada no plugin para o teste de impressão de imagem a partir da galeria
  async testarSelecionarEImprimir(){
    await this.smartposPlugin.imprimeImagem(
      (suc) => alert(suc) ,
      (err) => alert(err)
    );

  }
  
  //Funções que leêm o xml e salvam numa string
  async saveReadXmlSatTextToString?(xmlSatPath: string){
    await fetch(xmlSatPath)
      .then(response => response.text())
      .then(text => { this.xmlSat = text } );
  }

  async saveReadXmlNfceTextToString?(xmlNfcePath: string){
    await fetch(xmlNfcePath)
      .then(response => response.text())
      .then(text => { this.xmlNfce = text } );
  };

}
