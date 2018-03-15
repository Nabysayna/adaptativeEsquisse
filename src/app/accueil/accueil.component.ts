import { Component, OnInit } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import {TntService} from "../services/tnt.service";
import {WizallService} from "../services/wizall.service";
import {OrangemoneyService} from "../services/orangemoney.service";
import {TigocashService} from "../services/tigocash.service";
import {AuthService} from "../services/auth.service";
import { PostCashService } from 'app/services/postCash.service';


class Article {
  public id:number;
  public nomImg:string;
  public designation:string;
  public description:string;
  public prix:number;
  public quantite:number;
}

@Component({
  selector: 'app-accueil',
  templateUrl: './accueil.component.html',
  styleUrls: ['./accueil.component.css']
})
export class AccueilComponent implements OnInit {
  articles=[];
  process=[];
   quinzeMinutes = 900000;
  registredAPIs : string [] = ['POSTECASH', 'ORANGEMONEY', 'E-MONEY', 'TIGOCASH', 'WIZALL'] ;

  authorisedToUseCRM = false ;
  load="loader";
  actif = -1 ;
  dataImpression:any;
    displayedPage : string = 'accueil' ;
    isMobile : boolean ;


  constructor(private _authService:AuthService, private _postCashService: PostCashService, private _tntService:TntService, private router: Router, private _wizallService : WizallService, private _omService:OrangemoneyService, private _tcService: TigocashService){

      if ( window.screen.width <= 768 )
          this.isMobile = true ;
      else
          this.isMobile = false ;
  }

/******************************************************************************************************/


  ngOnInit() {
    localStorage.removeItem('om-depot') ;
    localStorage.removeItem('om-retrait') ;

    localStorage.removeItem('tc-depot') ;
    localStorage.removeItem('tc-retrait') ;

    if (!sessionStorage.getItem('currentUser'))
       this.router.navigate(['']);
    this.processus();
  }

/******************************************************************************************************/

  processus(){

    setInterval(()=>{

    if(sessionStorage.getItem('curentProcess')!="" && sessionStorage.getItem('curentProcess')!=undefined){
      let mag=JSON.parse(sessionStorage.getItem('curentProcess')).operateur;
      let infoOperation:any;
     if(mag==5){
          infoOperation={'etat':false,'id':this.process.length,'load':'fa fa-shopping-cart fa-2x pull-left','color':'', 'errorCode':'*'};
      }
     else{
           infoOperation={'etat':false,'id':this.process.length,'load':'loader','color':'', 'errorCode':'*', nbtour:0};
      }
      let sesion={'data':JSON.parse(sessionStorage.getItem('curentProcess')),'etats':infoOperation,'dataI':''};
     // var newprocess={'operation':sesion.operation,'montant':sesion.montant,'num':sesion.num};

      if(sesion.data.operateur==5){
        this.articles.push(sesion);
        sessionStorage.setItem('panier',JSON.stringify(this.articles));
        console.log(this.articles);
        if(this.articles.length==1){
          this.process.push(sesion);
        }
      }
      else{
           this.process.push(sesion);
      }

      console.log(sesion.etats.id);
      sessionStorage.removeItem('curentProcess');
      var operateur=sesion.data.operateur;
      switch(operateur){
        case 1:{
                var operation=sesion.data.operation;
                switch(operation){
                  case 1:{
                        this.validrechargementespece(sesion);
                        break;
                  }
                  case 2:{
                        this.validateachatjula(sesion);
                        break;
                  }
                  case 3:{
                        this.validatedetailfacturesenelec(sesion);
                        break;
                  }
                  case 4:{
                        this.validateachatcodewoyofal(sesion);
                        break;
                  }
                  default:break;
                }
                   break ;
        }

        case 2:{
             var operation=sesion.data.operation;

              switch(operation){
                case 1:{
                       this.deposer(sesion);
                       break;
                       }
                case 2:{
                       this.retirer(sesion);
                       break;
                }
                case 3:{
                       this.retraitAvecCode(sesion);
                       break;
                }
                case 4:{
                       this.retraitCpteRecep(sesion);
                       break;
                }
                case 5:{
                       this.acheterCredit(sesion);
                       break;
                }
                default :break;
              }
               break ;
        }

        case 3:{
             var operation=sesion.data.operation;

              switch(operation){
                case 1:{
                       this.deposertc(sesion);
                       break;
                       }
                case 2:{
                       this.retirertc(sesion);
                       break;
                }
                default :break;
              }
               break ;
        }


       case 4:{
             var operation=sesion.data.operation;

             switch(operation){
              case 1:{
                   this.validnabon(sesion);
                   break;
              }
              case 2:{
                  this.vendreDecodeur(sesion);
                  break;
              }
              case 3:{
                  this.vendreCarte(sesion);
                  break;
              }
              default : break;
             }
             break ;
       }



       case 6:{
             var operation=sesion.data.operation;
         console.log(sesion);
         console.log('Willa');
             switch(operation){
              case 1:{
                   this.cashInWizall(sesion);
                   break;
              }
              case 2:{
                  this.cashOutWizall(sesion);
                  break;
              }
              case 3:{
                  this.payerSDEWizall(sesion);
                  break;
              }
              case 4:{
                  this.payerSenelecWizall(sesion);
                  break;
              }
              default : break;
             }
       }

        default:break;
      }
    }
    else{
     console.log('not nice');
    }
  },3000);
  }


/******************************************************************************************************/

   totalpanier(){
		  let total=0;
		  for(let i=0;i<this.articles.length;i++){
			 total+=this.articles[i].data.prix*this.articles[i].data.quantite;
			 }
			return total;
      }
  deposer(objet:any){

    let requete = "1/"+objet.data.montant+"/"+objet.data.num ;

    if (this.repeatedInLastFifteen('om-depot', requete)==1){
      objet.etats.etat=true;
      objet.etats.load='terminated';
      objet.etats.color='red';
      objet.etats.errorCode='r';
      return 0 ;
    }


    this._omService.requerirControllerOM(requete).then( resp => {
      if (resp.status==200){
           console.log("For this 'depot', we just say : "+resp._body) ;
            if(resp._body.trim()=='0'){
               objet.etats.etat=true;
               objet.etats.load='terminated';
               objet.etats.color='red';
               objet.etats.errorCode='0';
            }else
            if(resp._body.match('-12')){
               objet.etats.etat=true;
               objet.etats.load='terminated';
               objet.etats.color='red';
               objet.etats.errorCode='-12';
            }
            else

           setTimeout(()=>{
              this._omService.verifierReponseOM(resp._body.trim().toString()).then(rep =>{
                var donnee=rep._body.trim().toString();
                console.log("Inside verifier depot : "+donnee) ;
                if(donnee=='1'){
                   objet.etats.etat=true;
                   objet.etats.load='terminated';
                   objet.etats.color='green';
                }
                else{
                  if(donnee!='-1'){
                     objet.etats.etat=true;
                     objet.etats.load='terminated';
                     objet.etats.color='red';
                     objet.etats.errorCode=donnee;
                   }else{
                        var periodicVerifier = setInterval(()=>{
                        objet.etats.nbtour = objet.etats.nbtour + 1 ;
                        this._omService.verifierReponseOM(resp._body.trim().toString()).then(rep =>{
                          var donnee=rep._body.trim().toString();
                          console.log("Inside verifier depot : "+donnee) ;
                          if(donnee=='1'){
                             objet.etats.etat=true;
                             objet.etats.load='terminated';
                             objet.etats.color='green';
                             clearInterval(periodicVerifier) ;
                          }
                          else{
                            if(donnee!='-1'){
                             objet.etats.etat=true;
                             objet.etats.load='terminated';
                             objet.etats.color='red';
                             objet.etats.errorCode=donnee;
                             clearInterval(periodicVerifier) ;
                            }
                            if(donnee=='-1' && objet.etats.nbtour>=45){
                              this._omService.demanderAnnulationOM(resp._body.trim().toString()).then(rep =>{
                                var donnee=rep._body.trim().toString();
                                 if(donnee=="c"){
                                   objet.etats.etat=true;
                                   objet.etats.load='terminated';
                                   objet.etats.color='red';
                                   objet.etats.errorCode="c";
                                   clearInterval(periodicVerifier) ;
                                   }
                              }) ;
                            }
                          }
                        });
                        },2000);
                   }
                }
              });

           },5000);
      }
      else{
        console.log("error") ;

        }
    });

  }


/******************************************************************************************************/

   retirer(objet:any){
    let requete = "2/"+objet.data.numclient+"/"+objet.data.montant ;

    if (this.repeatedInLastFifteen('om-retrait', requete)==1){
      objet.etats.etat=true;
      objet.etats.load='terminated';
      objet.etats.color='red';
      objet.etats.errorCode='r';
      return 0 ;
    }

    this._omService.requerirControllerOM(requete).then( resp => {
      if (resp.status==200){

        console.log("For this 'retrait', we just say : "+resp._body) ;

        if(resp._body.trim()=='0'){
           objet.etats.etat=true;
           objet.etats.load='terminated';
           objet.etats.color='red';
           objet.etats.errorCode='0';
        }else
            if(resp._body.match('-12')){
               objet.etats.etat=true;
               objet.etats.load='terminated';
               objet.etats.color='red';
               objet.etats.errorCode='-12';
            }
            else

           setTimeout(()=>{

              this._omService.verifierReponseOM(resp._body.trim().toString()).then(rep =>{
                var donnee=rep._body.trim().toString();
                console.log("Inside verifier retrait: "+donnee) ;
                if(donnee=='1'){
                   objet.etats.etat=true;
                   objet.etats.load='terminated';
                   objet.etats.color='green';
                   clearInterval(periodicVerifier) ;
                }
                else{
                  if(donnee!='-1'){
                   objet.etats.etat=true;
                   objet.etats.load='terminated';
                   objet.etats.color='red';
                   objet.etats.errorCode=donnee;
                   clearInterval(periodicVerifier) ;
                  }else{
                      var periodicVerifier = setInterval(()=>{
                        objet.etats.nbtour = objet.etats.nbtour + 1 ;
                      this._omService.verifierReponseOM(resp._body.trim().toString()).then(rep =>{
                        var donnee=rep._body.trim().toString();
                        console.log("Inside verifier retrait: "+donnee) ;
                        if(donnee=='1'){
                           objet.etats.etat=true;
                           objet.etats.load='terminated';
                           objet.etats.color='green';
                           clearInterval(periodicVerifier) ;
                        }
                        else{
                          if(donnee!='-1'){
                           objet.etats.etat=true;
                           objet.etats.load='terminated';
                           objet.etats.color='red';
                           objet.etats.errorCode=donnee;
                           clearInterval(periodicVerifier) ;
                          }
                            if(donnee=='-1' && objet.etats.nbtour>=10){
                              this._omService.demanderAnnulationOM(resp._body.trim().toString()).then(rep =>{
                                var donnee=rep._body.trim().toString();
                                 if(donnee=="c"){
                                   objet.etats.etat=true;
                                   objet.etats.load='terminated';
                                   objet.etats.color='red';
                                   objet.etats.errorCode="c";
                                   clearInterval(periodicVerifier) ;
                                   }
                              }) ;
                            }
                        }
                      });
                      },2000);
                  }
                }
              });

           },20000);
      }
      else{
        console.log("error") ;

        }
    });

  }

/******************************************************************************************************/


   retraitAvecCode(objet:any){
    let requete = "3/"+objet.data.coderetrait+"/"+objet.data.prenom+"/"+objet.data.nomclient+"/"+objet.data.date+"/"+objet.data.cni+"/"+objet.data.num+"/"+objet.data.montant;

    if (this.repeatedInLastFifteen('om-retraitcode', requete)==1)
           requete = requete+'R' ;

    this._omService.requerirControllerOM(requete).then( resp => {
      if (resp.status==200){
          console.log("For this 'retrait-code', we just say : "+resp._body) ;

        if(resp._body.trim()=='0'){
           objet.etats.etat=true;
           objet.etats.load='terminated';
           objet.etats.color='red';
           objet.etats.errorCode='0';
        }else
            if(resp._body.match('-12')){
               objet.etats.etat=true;
               objet.etats.load='terminated';
               objet.etats.color='red';
               objet.etats.errorCode='-12';
            }
            else

           setTimeout(()=>{

              this._omService.verifierReponseOM(resp._body.trim().toString()).then(rep =>{
                var donnee=rep._body.trim().toString();
                console.log("Inside verifier retrait: "+donnee) ;
                if(donnee=='1'){
                   objet.etats.etat=true;
                   objet.etats.load='terminated';
                   objet.etats.color='green';
                   clearInterval(periodicVerifier) ;
                }
                else
                  if(donnee!='-1'){
                   objet.etats.etat=true;
                   objet.etats.load='terminated';
                   objet.etats.color='red';
                   objet.etats.errorCode=donnee;
                   clearInterval(periodicVerifier) ;
                  }else
                var periodicVerifier = setInterval(()=>{
                objet.etats.nbtour = objet.etats.nbtour + 1 ;
                this._omService.verifierReponseOM(resp._body.trim().toString()).then(rep =>{
                  var donnee=rep._body.trim().toString();
                  console.log("Inside verifier retrait: "+donnee) ;
                  if(donnee=='1'){
                     objet.etats.etat=true;
                     objet.etats.load='terminated';
                     objet.etats.color='green';
                     clearInterval(periodicVerifier) ;
                  }else
                    if(donnee!='-1'){
                       objet.etats.etat=true;
                       objet.etats.load='terminated';
                       objet.etats.color='red';
                       objet.etats.errorCode=donnee;
                       clearInterval(periodicVerifier) ;
                    }
                    if(donnee=='-1' && objet.etats.nbtour>=10){
                      this._omService.demanderAnnulationOM(resp._body.trim().toString()).then(rep =>{
                        var donnee=rep._body.trim().toString();
                         if(donnee=="c"){
                           objet.etats.etat=true;
                           objet.etats.load='terminated';
                           objet.etats.color='red';
                           objet.etats.errorCode="c";
                           clearInterval(periodicVerifier) ;
                           }
                      }) ;
                    }
                });
                },2000);
              });
             },5000);
        }
      else{
        console.log("error") ;

        }
    });

  }


/******************************************************************************************************/


  retraitCpteRecep(objet:any){

    let requete = "4/"+objet.data.numclient+"/"+objet.data.montant;
    if (this.repeatedInLastFifteen('om-retraitcptercpt', requete)==1)
           requete = requete+'R' ;

    this._omService.requerirControllerOM(requete).then( resp => {
      if (resp.status==200){
        if (resp._body.trim().toString()=='1'){
          objet.etats.etat=true;
          objet.etats.load='terminated';
          objet.etats.color='green';
          //this.etats.process[objet.id]=objet;
        }
      }
      else
        console.log("error") ;
    });
  }

/******************************************************************************************************/


  acheterCredit(objet:any){

    let requete = "5/"+objet.data.numclient+"/"+objet.data.montant;
    console.log("Achat de crédit avec : "+requete) ;

    if (this.repeatedInLastFifteen('om-vente-credit', requete)==1)
           requete = requete+'R' ;

    this._omService.requerirControllerOM(requete).then( resp => {
      if (resp.status==200){

            if(resp._body.trim()=='0'){
               objet.etats.etat=true;
               objet.etats.load='terminated';
               objet.etats.color='red';
               objet.etats.errorCode='0';
            }else
            if(resp._body.trim()=='-12'){
               objet.etats.etat=true;
               objet.etats.load='terminated';
               objet.etats.color='red';
               objet.etats.errorCode='-12';
            }
            else
           setTimeout(()=>{
              this._omService.verifierReponseOM(resp._body.trim().toString()).then(rep =>{
                var donnee=rep._body.trim().toString();
                console.log("Inside verifier depot : "+donnee) ;
                if(donnee=='1'){
                   objet.etats.etat=true;
                   objet.etats.load='terminated';
                   objet.etats.color='green';
                }
                else{
                  if(donnee!='-1'){
                     objet.etats.etat=true;
                     objet.etats.load='terminated';
                     objet.etats.color='red';
                     objet.etats.errorCode=donnee;
                   }else{
                        var periodicVerifier = setInterval(()=>{
                        objet.etats.nbtour = objet.etats.nbtour + 1 ;
                        this._omService.verifierReponseOM(resp._body.trim().toString()).then(rep =>{
                          var donnee=rep._body.trim().toString();
                          console.log("Inside verifier depot : "+donnee) ;
                          if(donnee=='1'){
                             objet.etats.etat=true;
                             objet.etats.load='terminated';
                             objet.etats.color='green';
                             clearInterval(periodicVerifier) ;
                          }
                          else{
                            if(donnee!='-1'){
                             objet.etats.etat=true;
                             objet.etats.load='terminated';
                             objet.etats.color='red';
                             objet.etats.errorCode=donnee;
                             clearInterval(periodicVerifier) ;
                            }
                            if(donnee=='-1' && objet.etats.nbtour>=10){
                              this._omService.demanderAnnulationOM(resp._body.trim().toString()).then(rep =>{
                                var donnee=rep._body.trim().toString();
                                 if(donnee=="c"){
                                   objet.etats.etat=true;
                                   objet.etats.load='terminated';
                                   objet.etats.color='red';
                                   objet.etats.errorCode="c";
                                   clearInterval(periodicVerifier) ;
                                   }
                              }) ;
                            }
                          }
                        });
                        },2000);
                   }
                }
              });

           },5000);
      }
      else{
        console.log("error") ;

        }
    });

  }


/******************************************************************************************************/


  validrechargementespece(objet:any){
    this._postCashService.rechargementespece('00221'+objet.data.telephone+'',''+objet.data.montant).then(postcashwebserviceList => {

      if( (typeof postcashwebserviceList.errorCode != "undefined") && postcashwebserviceList.errorCode == "0" && postcashwebserviceList.errorMessage == ""){
            objet.etats.etat=true;
            objet.etats.load='terminated';
            objet.etats.color='green';
            objet.dataI = {
            apiservice:'postecash',
            service:'rechargementespece',
            infotransaction:{
              client:{
                transactionPostCash: postcashwebserviceList.transactionId,
                transactionBBS: 'Id BBS',
                telephone:'00221'+objet.data.telephone,
                montant:objet.data.montant,
              },

            },
          } ;
      }else{
            objet.etats.etat=true;
            objet.etats.load='terminated';
            objet.etats.color='red';
      }
    });

  }


/******************************************************************************************************/


  validateachatjula(objet:any){
     this._postCashService.achatjula(objet.data.montant+'',objet.data.nbcarte+'').then(postcashwebserviceList => {
        if( (typeof postcashwebserviceList.errorCode != "undefined") && postcashwebserviceList.errorCode == "0" && postcashwebserviceList.errorMessage == ""){
        let montant = objet.data.nbcarte * objet.data.montant ;
         objet.dataI = {
              apiservice:'postecash',
              service:'achatjula',
              infotransaction:{
                client:{
                  transactionPostCash: postcashwebserviceList.transactionId,
                  transactionBBS: 'id BBS',
                  typecarte:objet.data.montant,
                  nbcarte:objet.data.nbcarte,
                  montant:montant,
                },

              },
            }
         objet.etats.etat=true;
         objet.etats.load='terminated';
         objet.etats.color='green';
        }else{
             objet.etats.etat=true;
             objet.etats.load='terminated';
             objet.etats.color='red';
        }
      });

  }


/******************************************************************************************************/


  validatedetailfacturesenelec(objet:any){
        objet.dataI = {
            apiservice:'postecash',
            service:'reglementsenelec',
            infotransaction:{
              client:{
                transactionPostCash: 40,
                transactionBBS: "transactionId BBS",
                montant:10000,
                numfacture:objet.data.facture,
                police:objet.data.police,
              },

            },
          }
     objet.etats.etat=true;
     objet.etats.load='terminated';
     objet.etats.color='green';
      /*this.detailfacturepostcash = null;
      console.log('Police et Numero Facture : '+objet.data.police+'-'+objet.data.numfacture);
      this.postcashwebservice.detailfacturesenelec(objet.data.police,objet.data.numfacture.toString()).then(postcashwebserviceList => {
        this.detailfacturepostcash = postcashwebserviceList;
        console.log(postcashwebserviceList);
      });
      */
  }


/******************************************************************************************************/


  validateachatcodewoyofal(objet:any){

      this._postCashService.achatcodewoyofal(objet.data.montant+'',objet.data.compteur+'').then(postcashwebserviceList => {
        if( (typeof postcashwebserviceList.errorCode != "undefined") && postcashwebserviceList.errorCode == "0" && postcashwebserviceList.errorMessage == ""){
        objet.dataI = {
            apiservice:'postecash',
            service:'achatcodewayafal',
            infotransaction:{
              client:{
                transactionPostCash: postcashwebserviceList.transactionId,
                transactionBBS: 'Id BBS',
                codewoyafal: postcashwebserviceList.code,
                montant: objet.data.montant,
                compteur: objet.data.compteur,
              },
            },
          };
          objet.etats.etat=true;
          objet.etats.load='terminated';
          objet.etats.color='green';

        }else{
          objet.etats.etat=true;
          objet.etats.load='terminated';
          objet.etats.color='red';
        }
      });
  }

/******************************************************************************************************/


  finprocess(etat:any,imprime:any){
      if(etat.data.operateur==5){
          this.router.navigate(['/accueil','panier']);
        }
     if(etat.etats.etat==true){

     if(etat.etats.etat==true){

       if(etat.data.operateur!=2 && etat.etats.color=='green'){

  			 sessionStorage.setItem('dataImpression', JSON.stringify(imprime));
  			 this.router.navigate(['accueil']);
  			 setTimeout(()=>this.router.navigate(['accueil/impression']),100);
        }

     	   this.process.splice(etat.etats.id,1);
         for (let i=0 ; i<this.process.length ; i++){
          if(this.process[i].etats.id > etat.etats.id)
            this.process[i].etats.id = this.process[i].etats.id - 1 ;
         }
    	   console.log(etat.etats.id);
    }
  }
  }


/******************************************************************************************************/



  validnabon(objet:any){

    this._tntService.abonner(objet.data.token, objet.data.prenom,objet.data.nomclient, objet.data.tel,objet.data.cni, objet.data.chip, objet.data.carte, objet.data.duree, objet.data.typedebouquet).then( response =>
      {

        let typedebouquet = "" ;
        console.log(response);
        if(response.response=="ok"){

           objet.etats.etat=true;
           objet.etats.load='terminated';
           objet.etats.color='green';

          let montant:number = 0;
          if(objet.data.typedebouquet == 1){
            montant = 5000 * objet.data.duree;
            typedebouquet = 'Maanaa';
          }
          if(objet.data.typedebouquet == 2){
            montant = 3000 * objet.data.duree;
            typedebouquet = 'Boul khool';
          }
          if(objet.data.typedebouquet == 3){
            montant = 8000 * objet.data.duree;
            typedebouquet = 'Maanaa & Boul khool';
          }

          objet.dataI = {
            apiservice:'tnt',
            service:'abonnement',
            infotransaction:{
              client:{
                transactionBBS: response.idtransactionbbs,
                prenom:objet.data.prenom,
                nom:objet.data.nomclient,
                telephone:objet.data.tel,
                carte:objet.data.carte,
                chip:objet.data.chip,
                typebouquet:typedebouquet,
                montant: montant,
                duree:objet.data.duree
              },

            },
          }
        }else{
           objet.etats.etat=true;
           objet.etats.load='terminated';
           objet.etats.color='red';
           objet.etats.errorCode='0';
      }

      });

  }

/******************************************************************************************************/


   vendreDecodeur(objet:any){

    this._tntService.vendreDecodeur(objet.data.token, objet.data.prenom,objet.data.nomclient,objet.data.tel, objet.data.adresse, objet.data.region, objet.data.cni,objet.data.chip,objet.data.carte, objet.data.duree, objet.data.typedebouquet, objet.data.montant).then( response =>
      {
        if(response=="ok"){

           objet.dataI = {
            apiservice:'tnt',
            service:'ventedecodeur',
            infotransaction:{
                client:{
                transactionBBS: 'Id BBS',
                prenom:objet.data.prenom,
                nom:objet.data.nomclient,
                telephone:objet.data.tel,
                chip:objet.data.chip,
                carte:objet.data.carte,
                montant:objet.data.montant,
                typedebouquet:objet.data.typedebouquet,
              },

            },
          } ;

          objet.etats.etat=true;
          objet.etats.load='terminated';
          objet.etats.color='green';

        }else{
           objet.etats.etat=true;
           objet.etats.load='terminated';
           objet.etats.color='red';
           objet.etats.errorCode='0';
        }

      });
  }


/******************************************************************************************************/


   vendreCarte(objet:any){
    this._tntService.vendreCarte('55555', objet.data.prenom, objet.data.nomclient,objet.data.tel,objet.data.tel, objet.data.region,objet.data.cni,objet.data.carte, 5000).then( response =>{
        if(response=="ok"){
          objet.dataI = {
            apiservice:'tnt',
            service:'ventecarte',
           infotransaction:{
              client:{
              transactionBBS: 'Id BBS',
              prenom:objet.data.prenom,
              nom:objet.data.nom,
              telephone:objet.data.tel,
              carte:objet.data.carte,
              montant:5000,
            },

          },
        };
          objet.etats.etat=true;
          objet.etats.load='terminated';
          objet.etats.color='green';
        }
        else{
           objet.etats.etat=true;
           objet.etats.load='terminated';
           objet.etats.color='red';
           objet.etats.errorCode='0';
        }
    });
  }

/******************************************************************************************************/
/******************************************************************************************************/

    cashInWizall(objet : any){
      console.log('cashInWizall');
      this._wizallService.intouchCashin("test 1", objet.data.num, objet.data.montant).then( response =>{
              console.log(response)
              if(response.commission!=undefined){
                objet.dataI = {
                  apiservice:'wizall',
                  service:'senelec',
                 infotransaction:{
                    client:{
                  },

                },
              };
                objet.etats.etat=true;
                objet.etats.load='terminated';
                objet.etats.color='green';
              }
              else{
                 objet.etats.etat=true;
                 objet.etats.load='terminated';
                 objet.etats.color='red';
                 objet.etats.errorCode=500;
              }
        });
    }

    cashOutWizall(objet : any){
      console.log('cashOutWizall');
      this._wizallService.intouchCashout("test 1", objet.data.num, objet.data.montant).then( response =>{
              console.log(response) ;
              if(response.status=="PENDING"){
                objet.dataI = {
                  apiservice:'wizall',
                  service:'senelec',
                 infotransaction:{
                    client:{
                  },

                },
              };
                objet.etats.etat=true;
                objet.etats.load='terminated';
                objet.etats.color='green';
              }
              else{
                 objet.etats.etat=true;
                 objet.etats.load='terminated';
                 objet.etats.color='red';
                 objet.etats.errorCode=500;
              }
      });
    }

    payerSDEWizall(objet : any){
      console.log('payerSDEWizall');
      this._wizallService.intouchPayerFactureSde(objet.data.montant, objet.data.refclient, objet.data.refFacture).then( response =>{
        if(response=="ok"){
          objet.dataI = {
            apiservice:'wizall',
            service:'senelec',
           infotransaction:{
              client:{
            },

          },
        };
          objet.etats.etat=true;
          objet.etats.load='terminated';
          objet.etats.color='green';
        }
        else{
           objet.etats.etat=true;
           objet.etats.load='terminated';
           objet.etats.color='red';
           objet.etats.errorCode=response.code;
        }
      });
    }

    payerSenelecWizall(objet : any){
      console.log('payerSenelecWizall');
      this._wizallService.intouchPayerFactureSenelec(objet.data.montant, objet.data.police, objet.data.numfacture).then( response =>{
        if(response=="ok"){
          objet.dataI = {
            apiservice:'wizall',
            service:'senelec',
           infotransaction:{
              client:{
            },

          },
        };
          objet.etats.etat=true;
          objet.etats.load='terminated';
          objet.etats.color='green';
        }
        else{
           objet.etats.etat=true;
           objet.etats.load='terminated';
           objet.etats.color='red';
           objet.etats.errorCode=response.code;
        }

      });
    }


/******************************************************************************************************/

  repeatedInLastFifteen(operation : any, incomingRequest : any) : number{

    let today = Number( Date.now() ) ;
    let omOps = [] ;
    console.log(localStorage.getItem(operation)) ;

    if (localStorage.getItem(operation)==null ){
      localStorage.setItem(operation, JSON.stringify([{requete:incomingRequest, tstamp:today}]) );
      return 0 ;
    }else{
      omOps = JSON.parse( localStorage.getItem(operation) ) ;
      for (let i=0 ; i<omOps.length ; i++){
        if (omOps[i].requete==incomingRequest){
          let ilYa15Minutes = today - this.quinzeMinutes;

          let diff =  today - omOps[i].tstamp  ;

//          console.log("Diff vaut "+diff) ;

          if (  diff < this.quinzeMinutes ){
            return 1 ;
          }else{
            omOps[i].tstamp = today ;
            localStorage.setItem(operation, JSON.stringify(omOps) );
            return 0;
          }
        }
      }
      omOps.push({requete:incomingRequest, tstamp:today}) ;
      localStorage.setItem(operation, JSON.stringify(omOps) );
      return 0 ;
    }
  }

/****************************************************************************************************/


  retrieveOperationInfo(item : any) : string{

/* OM */
     if(item.data.operateur==2 ){

        if (item.etats.errorCode=='r')
          return "Vous venez d'effectuer la même opèration sur le même numéro." ;

        if (item.etats.errorCode=='c')
          return "Opèration annulée. La requête n'est pas parvenue au serveur. Veuillez recommencer." ;

        if (item.etats.errorCode=='0')
          return "Vous n'êtes pas autorisé à effectuer cette opèration." ;

        if (item.etats.errorCode=='-2')
          return "Le client a atteint le nombre maximum de transactions par jour en tant que beneficiaire" ;
        if (item.etats.errorCode=='-3')
          return "Le solde du compte du client ne lui permet pas d'effectuer cette opèration" ;
        if (item.etats.errorCode=='-4')
          return "Le beneficiaire a atteint le montant maximum autorisé par mois" ;
        if (item.etats.errorCode=='-5')
          return "Le montant maximum cumulé de transactions par semaine en tant que beneficiaire a ete atteint par le client" ;
        if (item.etats.errorCode=='-6')
          return "Le destinataire n'est pas un client orangemoney" ;
        if (item.etats.errorCode=='-7')
          return "Probléme de connexion ou code IHM invalide. Veuillez réessayer!" ;
        if (item.etats.errorCode=='-8')
          return "Le client a atteint le nombre maximum de transactions par semaine en tant que beneficiaire" ;
        if (item.etats.errorCode=='-9')
          return "Le client a atteint le nombre maximum de transactions par mois en tant que beneficiaire" ;

//        if (item.etats.errorCode=='-10')
 //         return "Votre requête n'a pas pu être traitée. Vérifiez la conformité des informations saisies!" ;

        if (item.etats.errorCode=='-12')
          return "Service actuellement indisponible. Veuillez réessayer plus tard." ;

        if (item.etats.errorCode=='-13')
          return "Le code de retrait saisi est incorrect. Veuillez recommencer!" ;
    }

/* TC */
     if(item.data.operateur==3 ){

        if (item.etats.errorCode=='r')
          return "Vous venez d'effectuer la même opèration sur le même numéro." ;

        if (item.etats.errorCode=='c')
          return "Opèration annulée. La requête n'est pas parvenue au serveur. Veuillez recommencer." ;

        if (item.etats.errorCode=='0')
          return "Vous n'êtes pas autorisé à effectuer cette opèration." ;

        if (item.etats.errorCode=='-2')
          return "Numéro Invalide." ;
        if (item.etats.errorCode=='-3')
          return "Le compte de l'utilisateur ne dispose pas de permissions suffisantes pour recevoir un dépot." ;
        if (item.etats.errorCode=='-4')
          return "Le beneficiaire a atteint le montant maximum autorisé par mois" ;
        if (item.etats.errorCode=='-5')
          return "Le montant maximum cumulé de transactions par semaine en tant que beneficiaire a ete atteint par le client" ;
        if (item.etats.errorCode=='-6')
          return "Le destinataire n'est pas un client orangemoney" ;
        if (item.etats.errorCode=='-7')
          return "Probléme de connexion ou code IHM invalide. Veuillez réessayer!" ;
        if (item.etats.errorCode=='-8')
          return "Le client a atteint le nombre maximum de transactions par semaine en tant que beneficiaire" ;
        if (item.etats.errorCode=='-9')
          return "Le client a atteint le nombre maximum de transactions par mois en tant que beneficiaire" ;

//        if (item.etats.errorCode=='-10')
 //         return "Votre requête n'a pas pu être traitée. Vérifiez la conformité des informations saisies!" ;

        if (item.etats.errorCode=='-12')
          return "Service actuellement indisponible. Veuillez réessayer plus tard." ;

        if (item.etats.errorCode=='-13')
          return "Le code de retrait saisi est incorrect. Veuillez recommencer!" ;

    }


     if(item.data.operateur==4 ){

        if (item.etats.errorCode=='0')
          return "Vous n'êtes pas autorisé à effectuer cette opèration." ;
    }

     if(item.data.operateur==6 ){

        if (item.etats.errorCode=='500')
          return "Une erreur a empêché le traitement de votre requête. Réessayez plus tard ou contactez le service client." ;

        if (item.etats.errorCode=='400')
          return "Facture dèja payée." ;

    }


  }

/**********************************
  TIGO CASH

**********************************/

  deposertc(objet:any){

    let requete = "1/"+objet.data.num+"/"+objet.data.montant ;

    if (this.repeatedInLastFifteen('tc-depot', requete)==1){
      objet.etats.etat=true;
      objet.etats.load='terminated';
      objet.etats.color='red';
      objet.etats.errorCode='r';
      return 0 ;
    }


    this._tcService.requerirControllerTC(requete).then( resp => {
      if (resp.status==200){
           console.log("For this 'depot', we just say : "+resp._body) ;
            if(resp._body.trim()=='0'){
               objet.etats.etat=true;
               objet.etats.load='terminated';
               objet.etats.color='red';
               objet.etats.errorCode='0';
            }else
            if(resp._body.match('-12')){
               objet.etats.etat=true;
               objet.etats.load='terminated';
               objet.etats.color='red';
               objet.etats.errorCode='-12';
            }
            else

           setTimeout(()=>{
              this._tcService.verifierReponseTC(resp._body.trim().toString()).then(rep =>{
                var donnee=rep._body.trim().toString();
                console.log("Inside verifier depot : "+donnee) ;
                if(donnee=='1'){
                   objet.etats.etat=true;
                   objet.etats.load='terminated';
                   objet.etats.color='green';
                }
                else{
                  if(donnee!='-1'){
                     objet.etats.etat=true;
                     objet.etats.load='terminated';
                     objet.etats.color='red';
                     objet.etats.errorCode=donnee;
                   }else{
                        var periodicVerifier = setInterval(()=>{
                        objet.etats.nbtour = objet.etats.nbtour + 1 ;
                        this._tcService.verifierReponseTC(resp._body.trim().toString()).then(rep =>{
                          var donnee=rep._body.trim().toString();
                          console.log("Inside verifier depot : "+donnee) ;
                          if(donnee=='1'){
                             objet.etats.etat=true;
                             objet.etats.load='terminated';
                             objet.etats.color='green';
                             clearInterval(periodicVerifier) ;
                          }
                          else{
                            if(donnee!='-1'){
                             objet.etats.etat=true;
                             objet.etats.load='terminated';
                             objet.etats.color='red';
                             objet.etats.errorCode=donnee;
                             clearInterval(periodicVerifier) ;
                            }
                            if(donnee=='-1' && objet.etats.nbtour>=10){
                              this._tcService.demanderAnnulationTC(resp._body.trim().toString()).then(rep =>{
                                var donnee=rep._body.trim().toString();
                                 if(donnee=="c"){
                                   objet.etats.etat=true;
                                   objet.etats.load='terminated';
                                   objet.etats.color='red';
                                   objet.etats.errorCode="c";
                                   clearInterval(periodicVerifier) ;
                                   }
                              }) ;
                            }
                          }
                        });
                        },2000);
                   }
                }
              });

           },5000);
      }
      else{
        console.log("error") ;

        }
    });

  }


/******************************************************************************************************/

   retirertc(objet:any){
    let requete = "2/"+objet.data.numclient+"/"+objet.data.montant ;

    if (this.repeatedInLastFifteen('tc-retrait', requete)==1){
      objet.etats.etat=true;
      objet.etats.load='terminated';
      objet.etats.color='red';
      objet.etats.errorCode='r';
      return 0 ;
    }

    this._tcService.requerirControllerTC(requete).then( resp => {
      if (resp.status==200){

        console.log("For this 'retrait', we just say : "+resp._body) ;

        if(resp._body.trim()=='0'){
           objet.etats.etat=true;
           objet.etats.load='terminated';
           objet.etats.color='red';
           objet.etats.errorCode='0';
        }else
            if(resp._body.match('-12')){
               objet.etats.etat=true;
               objet.etats.load='terminated';
               objet.etats.color='red';
               objet.etats.errorCode='-12';
            }
            else

           setTimeout(()=>{

              this._tcService.verifierReponseTC(resp._body.trim().toString()).then(rep =>{
                var donnee=rep._body.trim().toString();
                console.log("Inside verifier retrait: "+donnee) ;
                if(donnee=='1'){
                   objet.etats.etat=true;
                   objet.etats.load='terminated';
                   objet.etats.color='green';
                   clearInterval(periodicVerifier) ;
                }
                else{
                  if(donnee!='-1'){
                   objet.etats.etat=true;
                   objet.etats.load='terminated';
                   objet.etats.color='red';
                   objet.etats.errorCode=donnee;
                   clearInterval(periodicVerifier) ;
                  }else{
                      var periodicVerifier = setInterval(()=>{
                      this._tcService.verifierReponseTC(resp._body.trim().toString()).then(rep =>{
                        var donnee=rep._body.trim().toString();
                        console.log("Inside verifier retrait: "+donnee) ;
                        if(donnee=='1'){
                           objet.etats.etat=true;
                           objet.etats.load='terminated';
                           objet.etats.color='green';
                           clearInterval(periodicVerifier) ;
                        }
                        else{
                          if(donnee!='-1'){
                           objet.etats.etat=true;
                           objet.etats.load='terminated';
                           objet.etats.color='red';
                           objet.etats.errorCode=donnee;
                           clearInterval(periodicVerifier) ;
                          }
                        }
                      });
                      },2000);
                  }
                }
              });

           },20000);
      }
      else{
        console.log("error") ;

        }
    });

  }


/*********************************/
/*********************************/



  annulerOperation(){
    console.log("Opèration annulée ...") ;
  }
  color(i:number):string{
     if(i%2==0){
       return "border-left:2px solid green";
     }
     else{
       return "border-left:2px solid blue";
     }
  }
  getFormatted( designation) : string {
    if(designation.length>16)
      return designation.substring(0, 13)+'...' ;

    return designation ;
  }
  currency(prix:number){
   return Number(prix).toLocaleString();
  }
public pdvaccueilpage:number = 1;


public pdvaccueilsousmenumobilemoney:number = 0
public pdvaccueilsousmenumobilemoneyClick:number = 0




public accueilmenuMOBILEMONEY(){
  this.pdvaccueilpage = 2;
}
public accueilmenuFACTURIER(){
  this.pdvaccueilpage = 3;
}
public accueilmenuGESTION(){
  this.pdvaccueilpage = 4;
}


public pdvaccueilsousmenuMobilemoney(){
  console.log(this.pdvaccueilsousmenumobilemoneyClick+"oooo")
  if(this.pdvaccueilsousmenumobilemoneyClick!=0){
    this.pdvaccueilsousmenumobilemoney = this.pdvaccueilsousmenumobilemoneyClick;

    if ( this.displayedPage === "accueil-mm-pc" ){
      this.router.navigate(['/accueil/POSTECASH']);
    } else if ( this.displayedPage === "accueil-mm-om" ){
      this.router.navigate(['/accueil/ORANGEMONEY']);
    } else if ( this.displayedPage === "accueil-mm-tc" ){
      this.router.navigate(['/accueil/TIGOCASH']);
    } else if ( this.displayedPage === "accueil-mm-wz" ){
      this.router.navigate(['/accueil/WIZALL']);
    } else if ( this.displayedPage === "accueil-mm-em" ){
      this.router.navigate(['/accueil/E-MONEY']);
    }else if ( this.displayedPage === "accueil-mm-ec" ){
      this.router.navigate(['/accueil/E-COMMERCE']);
    } else{
      this.router.navigate(['/accueil/E-COMMERCE']);
    }

    console.log(this.displayedPage) ;
  }
}

public pdvacueilretour(){
  this.displayedPage = this.displayedPage.substring(0, this.displayedPage.lastIndexOf("-")) ;
}

public roadTo(choosedRoad){
 // this.displayedPage = this.displayedPage + "-" + choosedRoad ;
  if(choosedRoad==='mm'){
        this.displayedPage='accueil-mm-om';
  }

 // if ( (this.displayedPage.match(/-/g) || []).length == 2 )
   //   this.router.navigate( ['/accueil/' + this.displayedPage.substr(this.displayedPage.lastIndexOf("-")+1)] ); 


}

public pdvacueilmenumobilemoneyretour(){
  this.pdvaccueilpage=1;
  this.pdvaccueilsousmenumobilemoney=0;
}

  deconnexion(){
    this._authService.deconnexion();
  }
  cheminretour(){
     let chemin=this.displayedPage.split('-');
     let newchemin='accueil';
     for(let i=1;i<chemin.length-1;i++){
        newchemin+='-'+chemin[i];
     }
     this.displayedPage=newchemin; 
  }
  depotmobile(){
     this.displayedPage='accueil-mm-om-d';
  }
  retraitmobile(){
     this.displayedPage='accueil-mm-om-r';
  }
  retraitcodemobile(){
     this.displayedPage='accueil-mm-om-rc';
  }


}
