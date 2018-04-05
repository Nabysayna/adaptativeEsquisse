import { Component, OnInit , ViewChild ,ElementRef} from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import {TntService, TntResponse} from "../services/tnt.service";
import {WizallService} from "../services/wizall.service";
import {OrangemoneyService} from "../services/orangemoney.service";
import {TigocashService} from "../services/tigocash.service";
import {AuthService} from "../services/auth.service";
import {PostCashService } from 'app/services/postCash.service';
import {ModalDirective,ModalModule } from 'ng2-bootstrap/ng2-bootstrap';
import { ExpressocashService } from "../services/expressocash.service";
import {GestionreportingService, Gestionreporting, Servicepoint} from "../services/gestionreporting.service";
import { ComptabiliteService } from 'app/services/comptabilite.service';
import {ActivatedRoute, Params} from '@angular/router';
import { UtilsService } from 'app/services/utils.service';
import { NAbonnementService, LAbonnementService, EFinancierService } from 'app/tnt/tntservices';
import { NAbonnement, EFinancier, LAbonnement } from 'app/tnt/tntmodels';
import { Location }  from '@angular/common';
import { FacturierService } from 'app/services/facturier.service';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import { TypeaheadMatch } from 'ng2-bootstrap/typeahead';

import {EcomService} from "../services/ecom.service";



class Article {
  public id:number;
  public nomImg:string;
  public designation:string;
  public description:string;
  public prix:number;
  public quantite:number;
}
//E-commerce
class OrderedArticle{
  public id:number;
  public qte:number;
  public prix:number;
  public montant:number;
  public designation:string;
  public description:string;
  public nomImg:string;
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
  mnt:string;
  numclient:any;
  cni:any;
  date:number;
  prenom:string;
  nom:string;
  coderetrait:number;
  servicevente:string;
  telephoneen:string;
  prenomen:string;
  prenomben:string;
  nomben:string;
  nomen:string;


  isselectretraitespeceaveccarte:boolean=true
  typerecherchegestion:string = "parmotif";
  public servicepoint:Servicepoint[];

  public montant:any;
  public telephone:any;
  public codevalidation:any;
  public odevalidation:any;
  public nb_carte:any;
  public mt_carte:any;
  public service:any;
  public libelle:any;
  public designation:any;
  public libelleCharge : string ;
  public montantCharge : number ;
  public prenoma:string;
  public telephonea:string;
  public datedebut:any;
  public datefin:any;
  public quantite;any;
  public sujet:string;
  public nomservice:string;

  verifierNumInput:string ;
  verifierNumValide:boolean = false;
  verifierNumInputValide:boolean = true;
  erreur = false ;
  token : string = JSON.parse(sessionStorage.getItem('currentUser')).baseToken ;
  private singleTntWS: TntResponse ;

  prenomNewClient : string ;
  nomNewClient: string ;
  telNewClient: number ;
  adresseNewClient: string ;
  regionNewClient: string ;
  cniNewClient: string ;
  nchipNewClient: number ;
  ncarteNewClient: number ;
  nbmNewClient: number;
  tbouquetNewClient : string = 'Sans Abonnement';
  nbm:number;
  public retourTntWS: {}[] ;

  nAbonnement:NAbonnement;
	lAbonnement:LAbonnement;
	eFinancier:EFinancier;

  badge:string;
  messagesucce:boolean=false;

  tbouquet:string;
  
  caisseEtat: any;

  compte:string;
  etatsuccess:boolean=false;
  etaterror:boolean=false;

  noma="";
  asc="";
  filtre:"";

  message:any=false;
  mntsde:number;
  echeance:any;
  refclientsde:number;
  refFactureSDE:number;
  nomclient:string;
  statuspayment:boolean;

  etat:boolean=true;
  api:number=5;
  compteur:any;


  etat1:boolean=false;
  etat2:boolean=false;
  
  detailfacturesenelec:any={errorCode:0,police:12545555,numeroFacture:156665,nom_client:'nom du client',montant:50000,dateEcheance:"12/3/2018"};
  facture_deja_paye:boolean = false;
  police:string;
  num_facture:string;

  public infoRetraitaveccode:any;
  
  constructor(
        private _ecomService:EcomService,
        private _facturierService : FacturierService,
        private eFinancierService:EFinancierService,
        private lAbonnementService: LAbonnementService,
        private nAbonnementService: NAbonnementService,
        private location: Location,
        private _utilsService:UtilsService,
        private route:ActivatedRoute,
        private _comptabiliteService:ComptabiliteService,
        private _authService:AuthService,
        private _postCashService: PostCashService,
        private _tntService:TntService,
        private router: Router,
        private _wizallService : WizallService,
        private _omService:OrangemoneyService,
        private _tcService: TigocashService,
        private _gestionreportingService:GestionreportingService){
          if ( window.screen.width <= 768 )
              this.isMobile = true ;
          else
              this.isMobile = false ;

            this.dataSource = Observable
      .create((observer: any) => {
        observer.next(this.asyncSelected);
      })
      .mergeMap((token: string) => this.getStatesAsObservable(token));
  }

  @ViewChild('modaldepotTigoCash') modaldepotTigoCash: ModalDirective;
  @ViewChild('modalvendreizi') modalvendreizi: ModalDirective;
  @ViewChild('modalPostCash') modalPostCash: ModalDirective;
  @ViewChild('modalTnt') modalTnt: ModalDirective;
  @ViewChild('modalGestionReporting') modalGestionReporting: ModalDirective;
  @ViewChild('modalsde') public modalsde:ModalDirective;
  @ViewChild('modalrapido') public modalrapido:ModalDirective;
  @ViewChild('modalwoyofal') public modalwoyofal:ModalDirective;
  @ViewChild('modaloolu') public modaloolu:ModalDirective;
  @ViewChild('modalsenelec') public modalsenelec:ModalDirective;
  @ViewChild('viewMore') public addChildModalecomme:ModalDirective;

/******************************************************************************************************/


  ngOnInit() { 
          //E-Commerce
          this.loading = true ;
          this._ecomService.listeArticles(this.token, 'catalogue').then( response => {
            this.listarticles = response.reverse();
            this.loading = false ;
          });
         
          localStorage.removeItem('om-depot') ;
          localStorage.removeItem('om-retrait') ;

          localStorage.removeItem('tc-depot') ;
          localStorage.removeItem('tc-retrait') ;

          if (!sessionStorage.getItem('currentUser'))
             this.router.navigate(['']);

            if ( window.screen.width > 768 )
                this.processus();

       /* --------------ngOnInit TNT----------------*/
          this.retrieveAlerteMessage() ;
                this.route.params.subscribe( (params : Params) => {
                this.nAbonnement = this.nAbonnementService.getNAbonnement(5);
          });

          this.route.params.subscribe( (params : Params) => {
                this.lAbonnement = this.lAbonnementService.getLAbonnement(5);
          });

          this.route.params.subscribe( (params : Params) => {
                this.eFinancier = this.eFinancierService.getEFinancier(5);
          });
          /* --------------ngOnInit gestion reporting----------------*/
          this._gestionreportingService.servicepoint()
                  .subscribe(
                    data => {
                      this.servicepoint = data;
                      console.log(data)
                    },
                    error => console.log(error),
                    () => {
                      this.histop();
                    }
           )
           /* --------------Autes parties----------------*/

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
                       // this.validateachatcodewoyofal(sesion);
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
                       this.retirerOM(sesion);
                       break;
                }
                case 3:{
                       this.retraitAC(sesion);
                       break;
                }
                case 4:{
                       this.retraitCpteRecep(sesion);
                       break;
                }
                case 5:{
                       this.acheterCreditOM(sesion);
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
             console.log("session tnt");
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

    retirer(){
        let Info = {'nom':'Orange money','operateur':2,'operation':2,'montant':this.mnt,'numclient':this.numclient};
        this.mobileProcessing(JSON.stringify(Info));
        this.hideAddChildModal();
    }

    retirerOM(objet:any){
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

 retraitAvecCode(){

    let info = {'nom':'Orange money retrait','operateur':2,'operation':3,'coderetrait':this.coderetrait,'prenom':this.prenom,'nomclient':this.nom,'num':this.numclient,'date':this.date,'cni':this.cni,'montant':this.mnt};
    this.mobileProcessing(JSON.stringify(info));
  //    let requete = "3/"+this.coderetrait+"/"+this.prenom+"/"+this.nom+"/"+this.date+"/"+this.cni+"/"+this.numclient;
    this.reinitialiser();
    this.hideAddChildModal();

  }

   retraitAC(objet:any){
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



  acheterCredit(){ 
    let info = {'nom':'OrangeMoney Vente Crédit','operateur':2,'operation':5,'numclient':this.numclient,'montant':this.mnt};
    this.mobileProcessing(JSON.stringify(info));
    this.hideAddChildModal();
  }

  acheterCreditOM(objet:any){

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
    let index = this.process.findIndex(
      item => (item.data.telephone === objet.data.telephone && item.data.montant === objet.data.montant && item.data.nom === objet.data.nom
    ));

    this.process[index].etats.pourcentage = Math.floor(Math.random() * 3) + 1  ;

    this._postCashService.rechargementespece('00221'+objet.data.telephone+'',''+objet.data.montant).then(postcashwebserviceList => {
          alert(postcashwebserviceList);

          if( (typeof postcashwebserviceList.errorCode != "undefined") && postcashwebserviceList.errorCode == "0" && postcashwebserviceList.errorMessage == ""){

          
          console.log(this.process[index]);

            this.process[index].etats.pourcentage = 4;

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
            this.process[index].etats.pourcentage = 5;
      }
    });

  }


/******************************************************************************************************/


  validateachatjula(objet:any){
    let index = this.process.findIndex(
      item => (item.data.telephone === objet.data.telephone && item.data.montant === objet.data.montant && item.data.nom === objet.data.nom
    ));

    this.process[index].etats.pourcentage = Math.floor(Math.random() * 3) + 1  ;

     this._postCashService.achatjula(objet.data.montant+'',objet.data.nbcarte+'').then(postcashwebserviceList => {
        this.process[index].etats.pourcentage = 0;

        if( (typeof postcashwebserviceList.errorCode != "undefined") && postcashwebserviceList.errorCode == "0" && postcashwebserviceList.errorMessage == ""){
        
         this.process[index].etats.pourcentage = 4;
          
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

             this.process[index].etats.pourcentage = 5;
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

      let index = this.process.findIndex(
        item => (item.data.telephone === objet.data.telephone && item.data.montant === objet.data.montant && item.data.nom === objet.data.nom
      ));

      this.process[index].etats.pourcentage = Math.floor(Math.random() * 3) + 1  ;

      this._postCashService.achatcodewoyofal(objet.data.montant+'',objet.data.compteur+'').then(postcashwebserviceList => {
        this.process[index].etats.pourcentage = Math.floor(Math.random() * 3) + 1  ;

        if( (typeof postcashwebserviceList.errorCode != "undefined") && postcashwebserviceList.errorCode == "0" && postcashwebserviceList.errorMessage == ""){
          this.process[index].etats.pourcentage = 4 ;
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
          this.process[index].etats.pourcentage = 5;
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

    let index = this.process.findIndex(
      item => (item.data.telephone === objet.data.telephone && item.data.montant === objet.data.montant && item.data.nom === objet.data.nom
    ));

    this.process[index].etats.pourcentage = Math.floor(Math.random() * 3) + 1  ;

    this._tntService.abonner(objet.data.token, objet.data.prenom,objet.data.nomclient, objet.data.tel,objet.data.cni, objet.data.chip, objet.data.carte, objet.data.duree, objet.data.typedebouquet).then( response =>
      {

        this.process[index].etats.pourcentage = 4;

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
           this.process[index].etats.pourcentage = 5;
      }

      });

  }

/******************************************************************************************************/


   vendreDecodeur(objet:any){

    let index = this.process.findIndex(
      item => (item.data.telephone === objet.data.telephone && item.data.montant === objet.data.montant && item.data.nom === objet.data.nom
    ));

    this.process[index].etats.pourcentage = Math.floor(Math.random() * 3) + 1  ;
    
    this._tntService.vendreDecodeur(objet.data.token, objet.data.prenom,objet.data.nomclient,objet.data.tel, objet.data.adresse, objet.data.region, objet.data.cni,objet.data.chip,objet.data.carte, objet.data.duree, objet.data.typedebouquet, objet.data.montant).then( response =>
      {
        this.process[index].etats.pourcentage = 4;
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
           this.process[index].etats.pourcentage = 5;
        }

      });
  }


/******************************************************************************************************/


   vendreCarte(objet:any){
    let index = this.process.findIndex(
      item => (item.data.telephone === objet.data.telephone && item.data.montant === objet.data.montant && item.data.nom === objet.data.nom
    ));

    this.process[index].etats.pourcentage = Math.floor(Math.random() * 3) + 1  ;
    
    this._tntService.vendreCarte('55555', objet.data.prenom, objet.data.nomclient,objet.data.tel,objet.data.tel, objet.data.region,objet.data.cni,objet.data.carte, 5000).then( response =>{
         this.process[index].etats.pourcentage = 4;
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
           this.process[index].etats.pourcentage = 5;
        }
    });
  }

/******************************************************************************************************/
/******************************************************************************************************/

    cashInWizall(objet : any){
      let index = this.process.findIndex(
        item => (item.data.telephone === objet.data.telephone && item.data.montant === objet.data.montant && item.data.nom === objet.data.nom
      ));
  
      this.process[index].etats.pourcentage = Math.floor(Math.random() * 3) + 1  ;

      console.log('cashInWizall');
      this._wizallService.intouchCashin("test 1", objet.data.num, objet.data.montant).then( response =>{
              this.process[index].etats.pourcentage = 4;
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
                 this.process[index].etats.pourcentage = 5;
              }
        });
    }

    cashOutWizall(objet : any){
      console.log('cashOutWizall');

      let index = this.process.findIndex(
        item => (item.data.telephone === objet.data.telephone && item.data.montant === objet.data.montant && item.data.nom === objet.data.nom
      ));
  
      this.process[index].etats.pourcentage = Math.floor(Math.random() * 3) + 1  ;

      this._wizallService.intouchCashout("test 1", objet.data.num, objet.data.montant).then( response =>{
              this.process[index].etats.pourcentage = 4;
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
                 this.process[index].etats.pourcentage = 5;
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

 this.displayedPage = this.displayedPage + "-" + choosedRoad ;
 console.log(this.displayedPage);
 this.reinitialiser();
/*  if(choosedRoad==='mm'){
        this.displayedPage='accueil-mm';
  }*/

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
     this.reinitialiser();
     this.displayedPage='accueil-mm-om-d';
  }
  retraitmobile(){
     this.reinitialiser();
     this.displayedPage='accueil-mm-om-r';
  }
  retraitcodemobile(){
     this.reinitialiser();
     this.displayedPage='accueil-mm-om-rc';
  }
  ventecredit(){
      this.reinitialiser();
      this.displayedPage='accueil-mm-om-vc';
   }


 mobileProcessing(objet){

      let infoOperation={'etat':false,'id':this.process.length,'load':'loader','color':'white', 'errorCode':'*', nbtour:0};

//       let sesion={'data':objet,'etats':infoOperation,'dataI':''};


      let sesion={'data':JSON.parse(objet),'etats':infoOperation,'dataI':''};

      this.process.push(sesion);
     console.log(JSON.parse(objet));
     // sessionStorage.removeItem('curentProcess');
      var operateur=sesion.data.operateur;
      switch(operateur){
        case 1:{
                var operation=sesion.data.operation;
                switch(operation){
                  case 1:{
                        console.log("PosteCash operation 1");

                        this.validrechargementespece(sesion);
                        break;
                  }
                  case 2:{
                    console.log("PosteCash operation 2");
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
                      
                      // this.deposer(sesion);
                       break;
                       }
                case 2:{
                      // this.retirerOM(sesion);
                       break;
                }
                case 3:{
                     // this.retraitAC(sesion);
                       break;
                }
                case 4:{
                     // this.retraitCpteRecep(sesion);
                       break;
                }
                case 5:{
                     //  this.acheterCreditOM(sesion);
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
                       //this.deposertc(sesion);
                       break;
                       }
                case 2:{
                       //this.retirertc(sesion);
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
                  // this.validnabon(sesion);
                   break;
              }
              case 2:{
                 // this.vendreDecodeur(sesion);
                  break;
              }
              case 3:{
                  //this.vendreCarte(sesion);
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
                  // this.cashInWizall(sesion);
                   break;
              }
              case 2:{
                  //this.cashOutWizall(sesion);
                  break;
              }
              case 3:{
                 // this.payerSDEWizall(sesion);
                  break;
              }
              case 4:{
                 // this.payerSenelecWizall(sesion);
                  break;
              }
              
              default : break;
             }
       }

       case 7 :{
             var operation=sesion.data.operation;
             console.log(sesion);
             console.log('EMONEY');
             switch(operation){
              case 1:{
                  // this.cashInWizall(sesion);
                   break;
              }
              case 2:{
                  //this.cashOutWizall(sesion);
                  break;
              }
              case 3:{
                 // this.payerSDEWizall(sesion);
                  break;
              }

              default : break;
             }
       }

        case 8 :{
              var operation=sesion.data.operation;
              console.log(sesion);
              console.log('Facturier');
              switch(operation){
                    case 1:{
                          console.log('SDE');
                          //this.paimantsdeFacturier(sesion);
                          break;
                    }

                    case 2:{
                        console.log('Rapido');
                       // this. rechargeRapido(sesion);
                        break;
                    }

                    case 3:{
                          console.log('Woyofal');
                         // this.payerSDEWizall(sesion);
                          break;
                    }

                    case 4:{
                        console.log('Senelect');
                       // this.paimentsenelec(sesion);
                        break;
                    }

                    case 5:{
                        console.log('Oolu solar');
                       // this.payeroolusolarFacturier(sesion);
                        break;
                    }

                    default : break;
              }
        }

        default:break;
      }
  }

  testMultiArg(...args){
    console.log("Longueur : "+args.length) ;
    for (let i=0 ; i<args.length ; i++)
      console.log(" "+args[i]) ;
  }

   @ViewChild('addChildModal') public addChildModal:ModalDirective;
   @ViewChild('modalretrait') public modalretrait:ModalDirective;
   @ViewChild('modalventecredit') public modalventecredit:ModalDirective;
   @ViewChild('modalretraitcode') public modalretraitcode:ModalDirective;


  Deposer(){
         // sessionStorage.setItem('curentProcess',JSON.stringify({'nom':'Orange money depot','operateur':2,'operation':1,'montant':this.mnt,'num':this.numclient}));
          let data=JSON.stringify({'nom':'OrangeMoney','operateur':2,'operation':1,'montant':this.mnt,'num':this.numclient});
          this.mobileProcessing(data);
          this.addChildModal.hide();
         // this.depotreussi=true;
          //this.numclient = undefined ;
          //this.mnt = undefined;

  }
  public showAddChildModal():void {
    this.addChildModal.show();
    //this.verifnumber();
  }

  public hideAddChildModal():void {
    this.addChildModal.hide();
  }
  public showmodalretrait(){
    this.modalretrait.show();
  }
  public hidemodalretrait(){
    this.modalretrait.hide();
  }
  public Retirer(){
    this.modalretrait.hide();
  }
  public showmodalventecredit(){
    this.modalventecredit.show();
  }
  public hidemodalventecredit(){
    this.modalventecredit.hide();
  }
  public showmodalretraitcode(){
    this.modalretraitcode.show();
  }
  public hidemodalretraitcode(){
    this.modalretraitcode.hide();
  }
  public reinitialiser(){
    this.mnt=undefined;
    this.prenom=undefined;
    this.nom=undefined;
    this.date=undefined;
    this.cni=undefined;
    this.numclient=undefined;
    this.coderetrait=undefined;
    this.telephone = undefined ;
    this.montant = undefined ;
    // this.compteur = undefined ;
    this.nb_carte = undefined ;
    this.mt_carte = undefined ;
    this.designation = undefined;
    this.libelle  = undefined;
    this.service   = undefined;
    this.erreur = false ;
    this.verifierNumValide = false ;
    this.prenomNewClient =undefined ;
    this.nomNewClient=undefined ;
    this.telNewClient=undefined ;
    this.adresseNewClient=undefined ;
    this.regionNewClient=undefined ;
    this.cniNewClient=undefined ;
    this.nchipNewClient=undefined ;
    this.ncarteNewClient=undefined ;
    this.nbmNewClient=undefined;
    this.tbouquetNewClient=undefined ;
    this.numclient = undefined ;
    this.mnt = undefined;
    this.coderetrait=undefined;
    this.nom=undefined;
    this.prenom=undefined;
    this.date=undefined;
    this.cni=undefined;
    this.mnt=undefined;
  }
  public number=['0','1','2','3','4','5','6','7','8','9'];
  verifnumber(event){
   let numero=this.numclient.split('');
   let montant=this.mnt.split('');
   /* for(let i=0;i<montant.length;i++){
       for(let j=0;j<number.length;j++){

       }

    }*/
    console.log(numero);
    console.log(montant);
  }

 /*-------------- --------TNT -------------------------------*/

                  /* ----------- Traitement  -----------*/




  /**********************************************les modals***************************************/


    showmodaldepotTigoCash(){
     this.modaldepotTigoCash.show();
    }
    hidemodaldepotTigoCash(){
     this.modaldepotTigoCash.hide()
    }
    showmodalvendreizi(){
     this.modalvendreizi.show();
    }
    hidemodalvendreizi(){
     this.modalvendreizi.hide();
    }


    /********** PostCash-modals ***************/
    showmodalPostCash(){
      this.modalPostCash.show();
    }
    hidemodalPostCash(){
      this.modalPostCash.hide()
    }
    /********** PostCash-transactions *********/

    achatJula(){
      let depotInfo = {'nom':'PostCash','operateur':1,'operation':2,'nb_carte':this.nb_carte,'mt_carte':this.mt_carte};
      this.mobileProcessing(JSON.stringify(depotInfo));
      this.reinitialiser();
      this.hidemodalPostCash();
    }

    rechargementEspecePostCash(){
       let depotInfo = {'nom':'PostCash','operateur':1,'operation':1,'num':this.telephone,'montant':this.montant};
       this.mobileProcessing(JSON.stringify(depotInfo));
       this.reinitialiser();
       this.hidemodalPostCash();
    }

    retraitEspeceAvecCartePostCash(){
       let depotInfo = {'nom':'PostCash','operateur':1,'operation':3,'num':this.telephone,'montant':this.montant};
       this.mobileProcessing(JSON.stringify(depotInfo));
       this.reinitialiser();
       this.hidemodalPostCash();
    }

    retraitEspeceSansCartePostCash(){
      let depotInfo = {'nom':'PostCash','operateur':1,'operation':3,'num':this.telephone,'montant':this.montant,'codevalidation': this.codevalidation};
       this.mobileProcessing(JSON.stringify(depotInfo));
       this.reinitialiser();
       this.hidemodalPostCash();
    }

    /*-------------- -------- Facturier -------------------------------*/

          /********** TNT-modals ***************/
          showmodalTnt(){
            this.modalTnt.show();
          }
          hidemodalTnt(){
            this.modalTnt.hide()
          }

        /********** TNT-Traitements ***************/
          validVerifierNum(){
            this.loading = true ;
            this.erreur = false ;
            this._tntService.checkNumber(this.token, this.verifierNumInput.toString()).then( response => {
                this.singleTntWS = response ;
                this.noma = this.singleTntWS.nom ;
                this.prenoma = this.singleTntWS.prenom ;
                this.telNewClient = Number(this.singleTntWS.tel);
                this.nchipNewClient = Number(this.singleTntWS.n_chip) ;
                this.ncarteNewClient = Number(this.singleTntWS.n_carte) ;
                this.cni = this.singleTntWS.cni;

                if (this.singleTntWS.id_typeabonnement=="1")
                  this.tbouquet = "Maanaa";
                if (this.singleTntWS.id_typeabonnement=="2")
                  this.tbouquet = "Boul Khool";
                if (this.singleTntWS.id_typeabonnement=="3")
                  this.tbouquet = "Maanaa + Boul Khool";

                this.verifierNumValide = true;
                this.verifierNumInputValide = false;

                this.loading = false ;
            });
            sessionStorage.removeItem('dataImpression');
            this.roadTo('nv');
          }

        validnabonTNT(){
        
            let typedebouquet : number ;
            if(this.tbouquet == "Maanaa") typedebouquet=1;
            if(this.tbouquet == "Boul khool") typedebouquet=2;
            if(this.tbouquet == "Maanaa + Boul khool") typedebouquet=3;
            
            let depotInfo = {'token':this.token,'nom':'Tnt','operateur':4,'operation':1,'typedebouquet':typedebouquet,'tel':this.telNewClient,'chip':this.nchipNewClient,'carte':this.ncarteNewClient,'prenom':this.prenoma,'nomclient':this.noma,'duree':this.nbm,'cni':''};
            this.mobileProcessing(JSON.stringify(depotInfo));
            //sessionStorage.setItem('curentProcess',JSON.stringify({'token':this.token,'nom':'Tnt nouvel abonnement','operateur':4,'operation':1,'typedebouquet':typedebouquet,'tel':this.telNewClient,'chip':this.nchipNewClient,'carte':this.ncarteNewClient,'prenom':this.prenoma,'nomclient':this.noma,'duree':this.nbm,'cni':''}));
            
            this.modalTnt.hide();
            this.reinitialiser();
        }

        vendreDecodeurTNT(){
          var typedebouquet : number ;
          var prix:number ;

          this.modalTnt.hide();
          console.log("operation en cour");

          if(this.tbouquetNewClient == "Sans Abonnement"){
            typedebouquet=0;
            prix = 15000 ;
          }
          if(this.tbouquetNewClient == "+ 1 Mois"){
            typedebouquet=1;
            prix = 19500 ;
          }
          if(this.tbouquetNewClient == "+ 3 Mois"){
            typedebouquet=3;
            prix = 28000 ;
          }

         let depotInfo = {'token':this.token,'nom':'Tnt vente decodeur','operateur':4,'operation':2,'prenom':this.prenomNewClient,'tel':this.telNewClient,adresse:this.adresseNewClient, region:this.regionNewClient, cni:this.cniNewClient,'chip':this.nchipNewClient,'carte':this.ncarteNewClient,'nomclient':this.nomNewClient,'typedebouquet':typedebouquet,'montant':prix};
         this.mobileProcessing(JSON.stringify(depotInfo));

         //sessionStorage.setItem('curentProcess',JSON.stringify({'token':this.token,'nom':'Tnt vente decodeur','operateur':4,'operation':2,'prenom':this.prenomNewClient,'tel':this.telNewClient,adresse:this.adresseNewClient, region:this.regionNewClient, cni:this.cniNewClient,'chip':this.nchipNewClient,'carte':this.ncarteNewClient,'nomclient':this.nomNewClient,'typedebouquet':typedebouquet,'montant':prix}));
        
         this.reinitialiser() ;
     
       }
     
       vendreCarteTNT(){
        console.log('En cour de traitement');
        this.modalTnt.hide();
        let depotInfo = {'nom':'Tnt vente carte','operateur':4,'operation':3,'prenom':this.prenomNewClient,'tel':this.telNewClient,adresse:this.adresseNewClient, region:this.regionNewClient, cni:this.cniNewClient,'chip':this.nchipNewClient,'carte':this.ncarteNewClient,'nomclient':this.nomNewClient};
        this.mobileProcessing(JSON.stringify(depotInfo));
        //sessionStorage.setItem('curentProcess',JSON.stringify({'nom':'Tnt vente carte','operateur':4,'operation':3,'prenom':this.prenomNewClient,'tel':this.telNewClient,adresse:this.adresseNewClient, region:this.regionNewClient, cni:this.cniNewClient,'chip':this.nchipNewClient,'carte':this.ncarteNewClient,'nomclient':this.nomNewClient}));
        this.reinitialiser();
 
       }

      listerAbonnements(){
          this.loading = true ;
          this.erreur = false ;
    
          this._tntService.listAbonnement(this.token).then( response => {
            this.retourTntWS = response ;
            this.loading = false ;
          });
      }
    
      listerVenteDeco(){
          this.loading = true ;
          this.erreur = false ;
    
          this._tntService.listeVenteDecods(this.token).then( response => {
            this.retourTntWS = response.reverse() ;
            this.loading = false ;
          });
      }
    
      listerVenteCarte(){
          this.loading = true ;
          this.erreur = false ;
          console.log("*****************listerVenteCarte************")
          this._tntService.listerVenteCartes(this.token).then( response => {
            this.retourTntWS = response.reverse() ;
            this.loading = false ;
          });
      }

      retrieveAlerteMessage(){
        let periodicVerifier = setInterval(()=>{
          this._utilsService.consulterLanceurDalerte().subscribe(
            data => {
              this.message=data.message;
            },
            error => alert(error),
            () => {
              console.log(3)
            }
          )
        },10000);
      }
    /*-------------- --------GESTIONREPORTING-------------------------------*/

        /********** gestionreporting-variables ***************/

        public gestionreporting:Gestionreporting[];
        selectionjour:string;
        selectionintervalledateinit:string;
        selectionintervalleddatefinal:string;

        loading = false ;

        /********** gestionreporting-modals ***************/
        showGestionReporting(){
          this.modalGestionReporting.show();
        }
        hideGestionReporting(){
          this.modalGestionReporting.hide()
        }

        /***********gestionreporting-traitement****************************/
            currencyFormat(somme) : String{
              return Number(somme).toLocaleString() ;
            }
            histop(){
              console.log('reportingdate init');
              this.loading = true ;
              let datenow = ((new Date()).toJSON()).split("T",2)[0];
              this.selectionjour = datenow;
              this._gestionreportingService.reportingdate({idpdv:10, type:'jour', infotype:this.selectionjour})
                .subscribe(
                  data => {
                    this.gestionreporting = data;
                  },
                  error => console.log(error),
                  () => {
                    this.loading = false ;
                  }
                )
            }
            historiquejour(){
              this.loading = true ;
              this.selectionintervalledateinit = undefined;
              this.selectionintervalleddatefinal = undefined;
              this._gestionreportingService.reportingdate({idpdv:10, type:'jour', infotype:this.selectionjour})
                .subscribe(
                  data => {
                    console.log("resultats recherche");
                    console.log(data);
                    this.gestionreporting = data;
                  },
                  error => console.log(error),
                  () => {
                    this.loading = false ;
                  }
                )
              console.log(JSON.stringify({idpdv:10, type:'jour', infotype: this.selectionjour}));
            }

            historiqueintervalle(){
              console.log('reportingdate intervalle');
              this.loading = true ;
              this.selectionjour = undefined;
              this._gestionreportingService.reportingdate({idpdv:10, type:'intervalle', infotype:this.selectionintervalledateinit+" "+this.selectionintervalleddatefinal})
                .subscribe(
                  data => {
                    console.log("resultats recherche");
                    console.log(data);
                    this.gestionreporting = data;
                  },
                  error => console.log(error),
                  () => {
                    this.loading = false ;
                  }
                )
            }
          reimprimerhistop(operation){
            this._gestionreportingService.reimpression({idpdv:10, operation:JSON.stringify(operation), infooperation:operation.operateur})
              .subscribe(
                gestreportserviceList => {
                  console.log('reimpression');
                  let getdataimpression = gestreportserviceList;
                  console.log(getdataimpression)
                  let dataImpression = null;
                  let infos = JSON.parse(getdataimpression.infosoperation);
                  if(operation.operateur=="TNT"){
                    if(getdataimpression.typeoperation=="abonnement"){
                      let typebouquet = "";
                      if (infos.id_typeabonnement==1){
                        typebouquet = "Maanaa";
                      }
                      if (infos.id_typeabonnement==2){
                        typebouquet = "Boul Khool";
                      }
                      if (infos.id_typeabonnement==3){
                        typebouquet = "Maanaa + Boul Khool";
                      }
                      dataImpression = {
                        apiservice:'tntreimpression',
                        service:'abonnement',
                        infotransaction:{
                          dateoperation:getdataimpression.dateOperation.date.split('.')[0],
                          echeance:getdataimpression.echeance.date.split('.')[0],
                          transactionBBS: getdataimpression.idoperation,
                          client:{
                            prenom:infos.prenom,
                            nom:infos.nom,
                            telephone:infos.tel,
                            carte: infos.n_carte,
                            chip:infos.n_chip,
                            typebouquet:typebouquet,
                            montant: infos.montant,
                            duree:infos.duree,
                          },
                        },
                      }
                      sessionStorage.setItem('dataImpression', JSON.stringify(dataImpression));
                      this.router.navigate(['accueil/impression']);
                    }
                    if(getdataimpression.typeoperation=="decodeur"){
                      let infos = JSON.parse(getdataimpression.infosoperation);
                      console.log(infos);
                    }
                    if(getdataimpression.typeoperation=="carte"){
                      let infos = JSON.parse(getdataimpression.infosoperation);
                      console.log(infos);
                    }
                  }
                  if(operation.operateur=="POSTCASH"){
                    if(operation.traitement=="RETRAIT CASH"){
                      console.log('RETRAIT CASH');
                      dataImpression = {
                        apiservice:'postecashreimpression',
                        service:'retraitespece',
                        infotransaction:{
                          dateoperation:getdataimpression.dateOperation.date.split('.')[0],
                          transactionBBS: getdataimpression.idoperation,
                          transactionPostCash: infos.transactionId,
                          client:{
                            montant: infos.montant_reel,
                            telephone:'00221??',
                          },
                        },
                      }
                      sessionStorage.setItem('dataImpression', JSON.stringify(dataImpression));
                      this.router.navigate(['accueil/impression']);
                    }
                    if(operation.traitement=="ACHAT DE CODE WOYOFAL"){
                      console.log("ACHAT DE CODE WOYOFAL");
                      dataImpression = {
                        apiservice:'postecashreimpression',
                        service:'achatcodewayafal',
                        infotransaction:{
                          dateoperation:getdataimpression.dateOperation.date.split('.')[0],
                          transactionBBS: getdataimpression.idoperation,
                          transactionPostCash: infos.transactionId,
                          client:{
                            montant: infos.montant_reel,
                            codewoyafal: infos.code,
                            compteur: '??',
                          },
                        },
                      }
                      sessionStorage.setItem('dataImpression', JSON.stringify(dataImpression));
                      this.router.navigate(['accueil/impression']);
                    }
                  }
                },
                error => console.log(error),
                () => {
                  this.loading = false ;
                }
              )
          }

          validCharge(){
            this.loading = true ;
            console.log(JSON.stringify({libelle:this.libelleCharge, service:this.service, montant:this.montantCharge}));
            this._gestionreportingService.ajoutdepense({libelle:this.libelleCharge, service:this.service, montant:this.montantCharge})
              .subscribe(
                data => {
                  console.log(data)
                  this.libelleCharge = "" ;
                  this.service = "" ;
                  this.montantCharge = 0 ;
                },
                error => console.log(error),
                () => {
                  this.loading = false ;
                }
              )
          }

          validvente(){
              this.loading = true ;
              if(this.servicevente.toLowerCase()=='assurance'.toLowerCase()){
                let tempdesignation=this.designation;
                this.designation=JSON.stringify({desig:tempdesignation, nom:this.noma, prenom:this.prenoma, telephone:this.telephonea, datedebut:this.datedebut.toString(), datefin:this.datefin.toString()})
                console.log("Obj designé "+this.designation);
              }
          
              console.log(JSON.stringify({servicevente:this.servicevente, designation:this.designation, quantite:this.quantite}));
              this._gestionreportingService.vente({servicevente:this.servicevente, designation:this.designation, quantite:this.quantite})
                .subscribe(
                  data => {
                    console.log("------ vente -----------")
                    console.log(data)
                    this.designation = "" ;
                    this.servicevente = "" ;
                    this.quantite=0;
                    this.datedebut="";
                    this.datefin="";
                    this.noma="";
                    this.telephonea="";
                    this.prenoma="";
                  },
                  error => console.log(error),
                  () => {
                    this.loading = false ;
                  }
                )
        
          }

          validreclamation(){
            console.log("-------------------------------------------")
            this.loading = true ;
            console.log({sujet:this.sujet, nomservice:this.nomservice, message:this.message});
            this._gestionreportingService.reclamation({sujet:this.sujet, nomservice:this.nomservice, message:this.message})
              .subscribe(
                data => {
                  console.log(data)
                  this.sujet = "" ;
                  this.nomservice = "" ;
                  this.message = "" ;
                },
                error => console.log(error),
                () => {
                  this.loading = false ;
                }
              )
          }

          validerapprovision(idcaisse){
            this.loading = true;
            this._comptabiliteService.validerapprovisionn({idcaisse:idcaisse})
              .subscribe(
                data => {
                  this.caisseEtat.etat =1;
                  this.caisseEtat.soldeFermet = this.caisseEtat.soldeOuvert;
                },
                error => alert(error),
                () => {
                  this.loading = false ;
                }
              )
          }

/*-------------- --------SDE------------------------------*/
        
     /***********  SDE-Modal  *********** */
          showmodalsde(){
            this.modalsde.show();
            this.detailfactursde();
          }

          hidemodalsde(){
            this.modalsde.hide();
          }

  /***********  SDE-Traitement   *********** */
          detailfactursde(){
            this._facturierService.detailreglementsde(this.refclientsde).then(response =>{
              if(response.response==null){
                 this.message=true;
        
              }else{
                 this.etat=true;
                 this.refFactureSDE=response.response.reference_facture;
                 this.nomclient=response.reponse.nom;
                 this.echeance=response.response.date_echeance;
                 this.statuspayment=response.response.statuspayment;
                 this.mntsde=response.response.montant;
              }
              console.log(response);
            });
          }

          paimantsdeFacturier(object){
            this._facturierService.paimentsde(object.data.mntsde,object.data.refclientsde,object.data.refFactureSDE,object.data.mom).then( response =>{
                this.hidemodalsde();
                this.dataImpression = {
                  apiservice:'postecash',
                  service:'achatcodewayafal',
                  infotransaction:{
                    client:{
                      transactionPostCash: response.transactionId,
                      transactionBBS: 'Id BBS',
                       referenceclient: object.data.refclientsde,
                       montant: object.data.mntsde,
                       refFacture: object.data.refFactureSDE,
                    },
        
                  },
                }
                sessionStorage.setItem('dataImpression', JSON.stringify(this.dataImpression));
                this.router.navigate(['accueil/impression']);
            });
          }

          paimantsde(){
            let info = {'nom':'sde','operateur':8,'operation':1,'mntsde':this.mntsde,'refclientsde':this.refclientsde,'refFactureSDE':this.refFactureSDE};
            this.mobileProcessing(JSON.stringify(info));
          }

  /*--------------------    Rapido  ----------------------------------- */
        /************* Rapido-Modal *********/
        showmodalrapido(){
            this.modalrapido.show();
        }
        
        hidemodalrapido(){
           this.modalrapido.hide();
           this.montant=undefined;
           this.badge=undefined;
           this.numclient=undefined;
        }
        
        /************* Rapido-Traitement *********/

        validerrapido(){
              let info = {'nom':'rapido','operateur':8,'operation':2,'numclient':this.numclient,'montant':this.montant,'badge':this.badge};
              this.mobileProcessing(JSON.stringify(info));
              this.hidemodalrapido();
        }

        rechargeRapido(object:any){
          this._facturierService.validerrapido(object.data.numclient,object.data.montant,object.data.badge).then(response =>{
              console.log(response);
              this.messagesucce=true;
          });
        }

  
  /*--------------------    Woyofal  ----------------------------------- */
        /************* Woyofal- Modal *********/

        showmodalwoyofal(){
          this.modalwoyofal.show();
        }
       
        hidemodalwoyofal(){
          this.modalwoyofal.hide();
        }

         /************* Woyofal- Traitement *********/

                
         rechargeWoyofal(object:any){
          this._facturierService.validerwoyofal(object.data.api,object.data.montant,object.data.compteur).then(response =>{
            console.log(response);
            this.modalwoyofal.hide();
            this.dataImpression = {
                apiservice:'postecash',
                service:'achatcodewayafal',
                infotransaction:{
                  client:{
                    transactionPostCash: response.transactionId,
                    transactionBBS: 'Id BBS',
                     codewoyafal: response.code,
                     montant: object.data.montant,
                     compteur: object.data.compteur,
                  },
      
                },
              }
              sessionStorage.setItem('dataImpression', JSON.stringify(this.dataImpression));
              this.router.navigate(['accueil/impression']);
          });
        }        
        
        validerwoyofal(){
          let info = {'nom':'woyofal','operateur':8,'operation': 3,'api':this.api,'montant':this.montant,'compteur':this.compteur};
          this.mobileProcessing(JSON.stringify(info));
          this.hidemodalwoyofal();
        }

    /*--------------------    Oolusolar  ----------------------------------- */
        /************* oolusolar- Modal *********/

        hidemodaloolu(){
           this.modaloolu.hide();
        }

        showmodaloolu(){
           this.modaloolu.show();
        }
         /************* oolusolar- Traitement *********/
          payeroolusolar(){
              let info = {'nom':'oolu solar','operateur':8,'operation': 5,'telephone':this.telephone,'compte':this.compte,'montant':this.montant};
              this.mobileProcessing(JSON.stringify(info));
          }

          payeroolusolarFacturier(object){

              this._facturierService.payeroolusolar("00221"+(object.data.telephone).toString(),object.data.compte,object.data.montant).then(response =>{
                console.log(response);
                this.hidemodaloolu();
                this.montant=undefined;
                this.compte=undefined;
                this.telephone=undefined;
              });
          }


    /*--------------------   Senelec ----------------------------------- */
        /************* Senelec- Modal *********/
          showmodalsenelec(){
            this.detailfactsenelec();
          }
          hidemodalsenelec(){
            this.modalsenelec.hide();
          }
        /************* Senelec- Traitement *********/

          detailfactsenelec(){
            this._facturierService.detailfacturesenelec(this.police,this.num_facture).then(response =>{
               if(response.errorCode==0){
                 this.etat2=true;
                 this.detailfacturesenelec.police=response.police;
                 this.detailfacturesenelec.numeroFacture=response.num_facture;
                 this.detailfacturesenelec.nomclient=response.nom_client;
                 this.detailfacturesenelec.montant=response.montant;
                 this.detailfacturesenelec.dateEcheance=response.dateEcheance;
       
                 this.modalsenelec.show();
               }else{
                 console.log(response);
                 this.etat1=true;
                 this.detailfacturesenelec.errorCode=response.errorCode;
                 this.modalsenelec.show();
               }
       
            });
          }

          validerpaimentsenelec(){
              let info = {'nom':'rapido','operateur':8,'operation':4,'montant':this.montant,'police':this.police,'num_facture':this.num_facture,'service':this.service};
              this.mobileProcessing(JSON.stringify(info));
              this.hidemodalsenelec();
          }

          paimentsenelec(object:any){
              this._facturierService.validerpaimentsenelec(object.data.montant,object.data.police,object.data.num_facture,object.data.service).then(response =>{
                if(response.errorCode==0){
                    this.modalsenelec.hide();
                    this.dataImpression = {
                      apiservice:'postecash',
                      service:'reglementsenelec',
                      infotransaction:{
                        client:{
                          transactionPostCash: response.transactionId,
                          transactionBBS: 'Id BBS',
                          police: object.data.police,
                          facture: object.data.num_facture,
                          montant: response.montant_reel,
          
                        },
          
                      },
                    }
                    sessionStorage.setItem('dataImpression', JSON.stringify(this.dataImpression));
                    this.router.navigate(['accueil/impression']);
                    console.log(response);
                }else{
                  console.log(response);
                  this.modalsenelec.hide();
                }
          
              });
          
          }


  //depotTigoCash
      depotTigoCash(){
         let depotInfo = {'nom':'TigoCash depot','operateur':3,'operation':1,'num':this.telephone,'montant':this.montant};
         this.mobileProcessing(JSON.stringify(depotInfo));
         this.hidemodaldepotTigoCash();

      }
  //izi
      izi(){
       let iziInfo ={'nom':'tigoCash izi','operateur':3,'operation':5,'telephone':this.telephone,'montant':this.montant};
       this.mobileProcessing(JSON.stringify(iziInfo));
       this.hidemodalvendreizi();
       console.log(iziInfo);
     }
  /**************************************************WIZALL****************************************/

   @ViewChild('modaldepotWIZALL') public modaldepotWIZALL:ModalDirective;
   @ViewChild('modalretraitWIZALL') public modalretraitWIZALL:ModalDirective;
   @ViewChild('modalBonDachat') public modalBonDachat:ModalDirective;

  //Depot
  depotmodalWIZALL(){
     this.modaldepotWIZALL.show();
    }
    fermermodaldepotWIZALL(){
     this.modaldepotWIZALL.hide()
    }


deposerWIZALL(){
         let depotInfo = {'nom':'wizall depot','operateur':6,'operation':1,'num':this.telephone,'montant':this.montant};
         this.mobileProcessing(JSON.stringify(depotInfo));
         this.fermermodalretraitWIZALL();
      }
//retrait
retirerWIZALL(){
         let retraitInfo = {'nom':'wizall retrait','operateur':6,'operation':1,'num':this.telephone,'montant':this.montant};
         this.mobileProcessing(JSON.stringify(retraitInfo));
         this.fermermodalretraitWIZALL();
      }

  retirermodalWIZALL(){
     this.modalretraitWIZALL.show();
    }
    fermermodalretraitWIZALL(){
     this.modalretraitWIZALL.hide()
    }


    /*****************************************EMONEY*****************************************/
  @ViewChild('modaldepotEMONEY') public modaldepotEMONEY:ModalDirective;
  @ViewChild('modalretraitEMONEY') public modalretraitEMONEY:ModalDirective;
  @ViewChild('modalretraitcodeEMONEY') public modalretraitcodeEMONEY:ModalDirective;
  @ViewChild('modalbonCash') public modalbonCash:ModalDirective;
  @ViewChild('modalretraitConfirmEMONEY') public modalretraitConfirmEMONEY:ModalDirective;

  //Depot
  showmodaldepotEMONEY(){
     this.modaldepotEMONEY.show();
    }
    hidemodaldepotEMONEY(){
     this.modaldepotEMONEY.hide()
    }

fairedepotEMONEY(){
         let depotInfo = {'nom':'EMONEY ','operateur':7,'operation':1,'num':this.telephone,'montant':this.montant};
         this.mobileProcessing(JSON.stringify(depotInfo));
         this.hidemodaldepotEMONEY();
      }
  //retrait
  showmodalretraitEMONEY(){
     this.modalretraitConfirmEMONEY.show();
    }
    hidemodalretraitConfirmEMONEY(){
     this.modalretraitConfirmEMONEY.hide()
    }
    faireretraitsimpleConfirmEMONEY(){
         let depotInfo = {'nom':'EMONEY ','operateur':7,'operation':1,'num':this.telephone,'montant':this.montant};
         this.mobileProcessing(JSON.stringify(depotInfo));
         this.hidemodalretraitConfirmEMONEY();
      }
      //retraitconfirm
  showmodalretraitConfirmEMONEY(){
     this.modalretraitEMONEY.show();
    }
    hidemodalretraitEMONEY(){
     this.modalretraitEMONEY.hide()
    }
  faireretraitsimpleEMONEY(){
         let depotInfo = {'nom':'EMONEY ','operateur':7,'operation':1,'num':this.telephone,'montant':this.montant};
         this.mobileProcessing(JSON.stringify(depotInfo));
         this.hidemodalretraitEMONEY();
      }

//bon cash
 showmodalBonCash(){
     this.modalbonCash.show();
    }
    hidemodalBonCash(){
     this.modalbonCash.hide()
    }
faireBonCash(){
         let depotInfo = {'nom':'WIZALL ','operateur':6,'operation':1};
         this.mobileProcessing(JSON.stringify(depotInfo));
         this.hidemodalBonCash();
      }
      //bon achat
 showmodalBonDachat(){
     this.modalBonDachat.show();
    }
    hidebondachatmodal(){
     this.modalBonDachat.hide()
    }
fairebondachat(){
         let depotInfo = {'nom':'WIZALL ','operateur':6,'operation':1};
         this.mobileProcessing(JSON.stringify(depotInfo));
         this.hidebondachatmodal();
      }
      //finretraiconfirm

      //confirm retrait avec code
  /*showmodalretraitcodeEMONEY(){
     this.modalretraitcodeConfirmEMONEY.show();
    }
    hidemodalretraitcodeConfirm(){
     this.modalretraitcodeConfirmEMONEY.hide()
    }
  faireretraitaveccodeConfirm(){
         let depotInfo = {'nom':'EMONEY ','operateur':7,'operation':1,'num':this.telephone,'montant':this.montant};
         this.mobileProcessing(JSON.stringify(depotInfo));
         this.hidemodalretraitcodeConfirm();
      }
      //confirm fin retrait avec code

      //retrait avec code
  showmodalretraitConfirmEMONEY(){
     this.modalretraitcodeEMONEY.show();
    }
    hidemodalretraitcodeEMONEY(){
     this.modalretraitcodeEMONEY.hide()
    }
  faireretraitaveccodeConfirm(){
         let depotInfo = {'nom':'EMONEY ','operateur':7,'operation':1,'num':this.telephone,'montant':this.montant};
         this.mobileProcessing(JSON.stringify(depotInfo));
         this.hidemodalretraitcodeEMONEY();
      }*/

      //fin retrait avec code

  public selectretraitespeceaveccarte(){
    this.telephone = undefined ;
    this.montant = undefined ;
  }


  public validateretraitespece(){
      let data = {telephone:this.telephone,montant: this.montant};
      //
  }

  attentecodevalidationretraitespeceaveccarte(){
      let data = {telephone:this.telephone,montant: this.montant};
      //
  }
  //E-commerce
  
  currentArticle : any ;
  p : any ;
  listarticles : any[] ;
  panier:Article[];

  public asyncSelected: string;
  public typeaheadLoading: boolean;
  public typeaheadNoResults: boolean;
  public dataSource: Observable<any>;
  public filterQuery = "";

 
  orderedarticles:OrderedArticle [] = [];
  alert: boolean = false;
  
 public getStatesAsObservable(token: string): Observable<any> {
    let query = new RegExp(token, 'ig');

    return Observable.of(
      this.listarticles.filter((state: any) => {
        return query.test(state.designation);
      })
    );
  }
 public showAddChildModalecomme(article):void {
    this.currentArticle=article ;
    this.addChildModal.show();
  }

  public hideAddChildModalecomme():void {
    this.addChildModal.hide();
  }

  public ajouter_au_panier(article){
    let articl=new Article();
    articl.prix=article.prix;
    articl.designation=article.designation;
    articl.description=article.description;
    articl.nomImg=article.nomImg;
    sessionStorage.setItem('curentProcess',JSON.stringify({'nom':'Mon Panier','operateur':5,'prix':articl.prix,'quantite':1,'nomImg':articl.nomImg,'designation':articl.designation,'description':articl.description}));
    this.addChildModal.hide();
  }
 

   



}