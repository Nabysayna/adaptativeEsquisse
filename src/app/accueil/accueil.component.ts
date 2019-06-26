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
import { NAbonnementService, LAbonnementService, EFinancierService } from '../services/tntservices';
import { NAbonnement, EFinancier, LAbonnement } from '../services/tntmodels';
import { Location }  from '@angular/common';
import { FacturierService } from 'app/services/facturier.service';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import { TypeaheadMatch } from 'ng2-bootstrap/typeahead';
import {Commande} from "../services/ecom.service";
import {EcomService} from "../services/ecom.service";
import { Http, RequestOptions, RequestMethod, Headers  } from '@angular/http';
import * as _ from "lodash";
import { PageChangedEvent } from 'ngx-bootstrap/pagination';
import { AirtimeService } from 'app/services/airtime.service';
import { CanalService } from 'app/services/canal.service';


class Article {
  public id:number;
  public nomImg:string;
  public designation:string;
  public description:string;
  public prix:number;
  public quantite:number;
}
export class Vente {
  public id:number;
  public quantite:number;
  public designation:string;
  public prixUnitaire:number ;
  public tel:number;
  public fullName:string;
  public dateVente:string;
}

export class newCommande{
  public idarticle:number ;
  public qte: number ;
  public prix: number ;
  public montant:number ;
  public designation: string ;
  public description: string ;
  public imagelink: string ;
  public pourvoyeur: number
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
  //
  codecmd = "" ;
  infosCommande : any ;
  inforecvd = false ;
  postcmd = false ;
  orderedArticles : string ;
  //

  //
  clients=[{'prenom':'magor','nom':'sy','telephone':779013878,'adress':'Mbour'}];
  adress:string="";
  estclient:boolean=false;
  //

  articles=[];
  process=[];
  quinzeMinutes = 900000;
  registredAPIs : string [] = ['POSTECASH', 'ORANGEMONEY', 'E-MONEY', 'TIGOCASH', 'WIZALL', 'TNT BY EXCAF'] ;


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
  //payer Transfert
  codeReatrait:number;
  prenomPT:string;
  nomPT:string;
  typepiece:string;
  numeroPiece:string;

  //le code que je veus ajouter
  coderecept : string ;
  listeVentes : any[] ;
  listeCommande : Commande[] ;
 
  newImage = "imagevide.jpg" ;
  articlemodif:any={};

  shownPrice : number ;
  partenairesParts : number ;
  customerReduct : number = 0 ;
  addtype = '' ;
  id : any ;

  mess:any;
  nomImage : string ;
  categoriea : string ;
  designationa: string;
  descriptiona: string ;
  prixa:number;
  stocka:number;
  Bcosmetique:boolean=false;
  Bvetement:boolean=false;
  Bchaussure:boolean=false;
  Belectronique:boolean=false;
  Bbureau:boolean=false;
  Belectromenager:boolean=false;
  Baccessoire:boolean=false;
  Bmaison:boolean=false;
  Bsac:boolean=false;
  Bautre:boolean=false;
  categoriepta : string ;
  designationpta: string;
  descriptionpta: string ;
  prixpta:number;
  stockpta:number;
  provenance:string;
  marque:string;
  couleur:string;
  origine:string;
  tendence:string;
  sexe:string;
  mode:string;
  utilisation:string;
  fonctions:string;
  modele:string;
  capacite:string;
  matiere:string;
  tendances:string;
  categorie:string;
  infosup:string;
  prix:string;

  modif:string="-";
  modifart:string;
  nbrePieds : number ;
  smart : string ;
  descriptionsvalues=[];

  //zone: NgZone;

  receivedArticles = "" ;
  articlesFournis = "" ;
  categories  : string[] = [] ;
  // fin du code


  isselectretraitespeceaveccarte:boolean=true
  typerecherchegestion:string = "parjour";
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
   email: string;
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
 // filtre : string = "" ;
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


  ventedecodeurpagination:number = 1;
  ventecatepagination:number = 1;
  retraitaveccodeom:number = 1;

  constructor(
        private _canalService:CanalService,
        private _airtimeService:AirtimeService,
        private _ecomService:EcomService,
        private http:Http,
        private ecomCaller:EcomService,
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
  @ViewChild('modalRetraitTigoCash') modalRetraitTigoCash: ModalDirective;
  @ViewChild('modalPTTigoCash') modalPTTigoCash: ModalDirective;
  @ViewChild('modalvendreizi') modalvendreizi: ModalDirective;
  @ViewChild('modalPostCash') modalPostCash: ModalDirective;
  @ViewChild('modalProcessing') modalProcessing: ModalDirective;
  @ViewChild('modalTnt') modalTnt: ModalDirective;
  @ViewChild('modalGestionReporting') modalGestionReporting: ModalDirective;
  @ViewChild('modalsde') public modalsde:ModalDirective;
  @ViewChild('modalrapido') public modalrapido:ModalDirective;
  @ViewChild('modalwoyofal') public modalwoyofal:ModalDirective;
  @ViewChild('modaloolu') public modaloolu:ModalDirective;
  @ViewChild('modalsenelec') public modalsenelec:ModalDirective;
  @ViewChild('viewMore') public viewMore:ModalDirective;
  @ViewChild('modalretraitcodeConfirmEMONEY') public modalretraitcodeConfirmEMONEY:ModalDirective;

/******************************************************************************************************/


  ngOnInit() {
    
          window.onbeforeunload = function(e) {
              let ee, message;

              ee = e = e || window.event;

              message = "Souhaitez-vous vraiment quiter la page";
              
              // For IE and Firefox 
              if (ee) {
                  ee.returnValue = message;
              }
              // For Safari
                return message;
          };
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
          this.getSolde();
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
           /* --------------ngOnInit Espace perso d'E-commerce----------------*/

  

  this.loading = true ;
    this.ecomCaller.listeArticles(this.token, 'perso').then( response =>
    {
      //this.articles = _.chunk(response, 3) ;
      this.listarticles = response;
      this.loading = false ;
    });

    this.ecomCaller.listerCategorie(this.token).then( response =>
    {
      this.categories = response;
    });

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
                        this.validrechargementespecePostCash(sesion);
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
			 total+=this.articles[i].prix*this.articles[i].quantite;
			 }
			return total;
      }
      ventereussi:boolean = false;
      echecVente:boolean = false;
      airtime(objet:any){
        let index = this.process.findIndex(
          item => (item.data.num === objet.data.num && item.data.montant === objet.data.montant && item.data.nom === objet.data.nom
        ));
    
        this.process[index].etats.pourcentage = Math.floor(Math.random() * 3) + 1;
                
        this._airtimeService.Airtime(objet.data.nom,objet.data.num,objet.data.montant).then( resp => {
          console.log(resp);
          
          if (resp.status==200){
               console.log("For this 'credit', we just say : "+resp._body) ;
                if(resp._body.trim()=='0'){
                   objet.etats.etat=true;
                   objet.etats.load='terminated';
                   objet.etats.color='red';
                   objet.etats.errorCode='0';
                   this.echecVente = true;
                   this.process[index].etats.pourcentage = 5;
                }else
                if(resp._body.match('-12')){
                   objet.etats.etat=true;
                   objet.etats.load='terminated';
                   objet.etats.color='red';
                   objet.etats.errorCode='-12';
                   this.echecVente = true;
                   this.process[index].etats.pourcentage = 5;
                }
                else
    
               setTimeout(()=>{
                  this._airtimeService.verifierReponse(resp._body.trim().toString()).then(rep =>{
                    var donnee=rep._body.trim().toString();
                    console.log("Inside verifier vente credit : "+donnee) ;
                    if(donnee=='1'){
                       objet.etats.etat=true;
                       objet.etats.load='terminated';
                       objet.etats.color='#36A9E0';
                       this.ventereussi = true;
                       this.process[index].etats.pourcentage = 5;
                    }
                    else{
                      if(donnee!='-1'){
                         objet.etats.etat=true;
                         objet.etats.load='terminated';
                         objet.etats.color='red';
                         objet.etats.errorCode=donnee;
                         this.echecVente = true;
                         this.process[index].etats.pourcentage = 5;
                        
                       }else{
                            var periodicVerifier = setInterval(()=>{
                            objet.etats.nbtour = objet.etats.nbtour + 1 ;
                            this._omService.verifierReponseOM(resp._body.trim().toString()).then(rep =>{
                              var donnee=rep._body.trim().toString();
                              console.log("Inside verifier vente credit : "+donnee) ;
                              if(donnee=='1'){
                                 objet.etats.etat=true;
                                 objet.etats.load='terminated';
                                 objet.etats.color='#36A9E0';
                                 this.ventereussi = true;
                                 this.process[index].etats.pourcentage = 5;
                                 clearInterval(periodicVerifier) ;
    
                              }
                              else{
                                if(donnee!='-1'){
                                 objet.etats.etat=true;
                                 objet.etats.load='terminated';
                                 objet.etats.color='red';
                                 objet.etats.errorCode=donnee;
                                 this.process[index].etats.pourcentage = 5;
                                 this.echecVente = true;
                                 clearInterval(periodicVerifier) ;
                                }
                                if(donnee=='-1' && objet.etats.nbtour>=45){
                                  this._airtimeService.demanderAnnulation(resp._body.trim().toString()).then(rep =>{
                                    var donnee=rep._body.trim().toString();
                                     if(donnee=="c"){
                                       objet.etats.etat=true;
                                       objet.etats.load='terminated';
                                       objet.etats.color='red';
                                       objet.etats.errorCode="c";
                                       this.echecVente = true;
                                       this.process[index].etats.pourcentage = 5;
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
            this.echecVente = true;
            this.process[index].etats.pourcentage = 5;
            }
        });
    
      }

  deposer(objet:any){
    let index = this.process.findIndex(
      item => (item.data.num === objet.data.num && item.data.montant === objet.data.montant && item.data.nom === objet.data.nom
    ));

    this.process[index].etats.pourcentage = Math.floor(Math.random() * 3) + 1;
    
    let requete = "1/"+objet.data.montant+"/"+objet.data.num ;
    if (this.repeatedInLastFifteen('om-depot', requete)==1){
      objet.etats.etat=true;
      objet.etats.load='terminated';
      objet.etats.color='red';
      objet.etats.errorCode='r';
      this.process[index].etats.pourcentage = 5;
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
               this.process[index].etats.pourcentage = 5;
            }else
            if(resp._body.match('-12')){
               objet.etats.etat=true;
               objet.etats.load='terminated';
               objet.etats.color='red';
               objet.etats.errorCode='-12';
               this.process[index].etats.pourcentage = 5;
            }
            else

           setTimeout(()=>{
              this._omService.verifierReponseOM(resp._body.trim().toString()).then(rep =>{
                var donnee=rep._body.trim().toString();
                console.log("Inside verifier depot : "+donnee) ;
                if(donnee=='1'){
                   objet.etats.etat=true;
                   objet.etats.load='terminated';
                   objet.etats.color='#36A9E0';
                   this.process[index].etats.pourcentage = 5;
                }
                else{
                  if(donnee!='-1'){
                     objet.etats.etat=true;
                     objet.etats.load='terminated';
                     objet.etats.color='red';
                     objet.etats.errorCode=donnee;
                     this.process[index].etats.pourcentage = 5;
                   }else{
                        var periodicVerifier = setInterval(()=>{
                        objet.etats.nbtour = objet.etats.nbtour + 1 ;
                        this._omService.verifierReponseOM(resp._body.trim().toString()).then(rep =>{
                          var donnee=rep._body.trim().toString();
                          console.log("Inside verifier depot : "+donnee) ;
                          if(donnee=='1'){
                             objet.etats.etat=true;
                             objet.etats.load='terminated';
                             objet.etats.color='#36A9E0';
                             this.process[index].etats.pourcentage = 5;
                             clearInterval(periodicVerifier) ;

                          }
                          else{
                            if(donnee!='-1'){
                             objet.etats.etat=true;
                             objet.etats.load='terminated';
                             objet.etats.color='red';
                             objet.etats.errorCode=donnee;
                             this.process[index].etats.pourcentage = 5;
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
                                   this.process[index].etats.pourcentage = 5;
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

  nombre=["0","1","2","3","4","5","6","7","8","9"];
  keycode=[{'code':97,'value':1},{'code':98,'value':2},{'code':99,'value':3},{'code':100,'value':4},{'code':101,'value':5},{'code':102,'value':6},{'code':103,'value':7},{'code':104,'value':8},{'code':105,'value':9},{'code':96,'value':0},{'code':48,'value':0},{'code':49,'value':1},{'code':50,'value':2},{'code':51,'value':3},{'code':52,'value':4},{'code':53,'value':5},{'code':54,'value':6},{'code':55,'value':7},{'code':56,'value':8},{'code':57,'value':9}];
  mag1=false;
  mag2=false;
  buttondepot1=false;
  buttondepot2=false;
  buttondepot3=false;

  verifNumber(event:any){
    if(event.keyCode!=16 && event.keyCode!=20 && event.keyCode!=9 && event.keyCode!=37 && event.keyCode!=38 && event.keyCode!=39 && event.keyCode!=40){
    //console.log(event);
     var nb=event.target.value.length;
     var val=event.target.value.split('');
     var j=0,k=0;
     for(j=0;j<this.nombre.length;j++){
       if(val[event.target.value.length-1]==this.nombre[j]){
         k=1;
       }
     }
    if(k==0 && event.target.value!=""){
        this.mag1=true;
        this.numclient=undefined;
    }
    // console.log(val);
     if(nb==2){
       if(event.target.value!=77 && event.target.value!=78){
           this.numclient=undefined;
       }

     }

     else{
        this.buttondepot1=false;
     }
     var i=0,v=0;
     for(i=0;i<this.keycode.length;i++){
        if(event.keyCode==this.keycode[i].code){
            this.mag1=false;
            v=1;
        }
     }
     if(v==0 && event.keyCode!=8 && event.keyCode!=16 && event.target.value!=""){
        this.mag1=true;
        this.numclient=undefined;
     }
     if(nb==9){
        this.buttondepot1=true;
     }
     else{
        this.buttondepot1=false;
        this.buttondepot2=false;
     }
    }

   }

  /*************verif montant**************************/
  verifMontant(event:any){

	  //console.log(event.target.value);
      if(event.keyCode!=16 && event.keyCode!=20 && event.keyCode!=9 && event.keyCode!=37 && event.keyCode!=38 && event.keyCode!=39 && event.keyCode!=40){

		 var nb=event.target.value.length;
		 var val=event.target.value.split('');
		 var j=0,k=0;
		 for(j=0;j<this.nombre.length;j++){
		   if(val[event.target.value.length-1]==this.nombre[j]){
			 k=1;
		   }
		 }
		if(k==0 && event.target.value!=""){
			this.mag2=true;
			this.mnt=undefined;
			return ;
		}
		 //console.log(val);
		 var i=0,v=0;
		 for(i=0;i<this.keycode.length;i++){
			if(event.keyCode==this.keycode[i].code){
				this.mag2=false;
				v=1;
			}
		 }
		 if(v==0 && event.keyCode!=8 && event.keyCode!=16 && event.target.value!=""){
			this.mag2=true;
			this.mnt=undefined;
			return  ;
		 }

		 if(this.buttondepot1==true && parseInt(val[0])>=1){
           this.buttondepot2=true;
           }
         else{
            this.buttondepot2=false;
         }
     }
   }
/******************************************************************************************************/

    retirer(){
        let Info = {'nom':'Orange money','operateur':2,'operation':2,'montant':this.mnt,'numclient':this.numclient};
        this.mobileProcessing(JSON.stringify(Info));
        this.hideAddChildModal();
    }

    retirerOM(objet:any){
      let index = this.process.findIndex(
        item => (item.data.num === objet.data.num && item.data.montant === objet.data.montant && item.data.nom === objet.data.nom
      ));
  
      this.process[index].etats.pourcentage = Math.floor(Math.random() * 3) + 1;
      let requete = "2/"+objet.data.numclient+"/"+objet.data.montant ;
  
      if (this.repeatedInLastFifteen('om-retrait', requete)==1){
        objet.etats.etat=true;
        objet.etats.load='terminated';
        objet.etats.color='red';
        objet.etats.errorCode='r';
        this.process[index].etats.pourcentage =5;
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
            this.process[index].etats.pourcentage =5;
          }else
              if(resp._body.match('-12')){
                objet.etats.etat=true;
                objet.etats.load='terminated';
                objet.etats.color='red';
                objet.etats.errorCode='-12';
                this.process[index].etats.pourcentage =5;
              }
              else

            setTimeout(()=>{

                this._omService.verifierReponseOM(resp._body.trim().toString()).then(rep =>{
                  var donnee=rep._body.trim().toString();
                  console.log("Inside verifier retrait: "+donnee) ;
                  if(donnee=='1'){
                    objet.etats.etat=true;
                    objet.etats.load='terminated';
                    objet.etats.color='#36A9E0';
                    this.process[index].etats.pourcentage = 5;
                    clearInterval(periodicVerifier) ;
                  }
                  else{
                    if(donnee!='-1'){
                    objet.etats.etat=true;
                    objet.etats.load='terminated';
                    objet.etats.color='red';
                    objet.etats.errorCode=donnee;
                    this.process[index].etats.pourcentage = 5;
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
                            objet.etats.color='#36A9E0';
                            this.process[index].etats.pourcentage = 5;
                            clearInterval(periodicVerifier) ;
                          }
                          else{
                            if(donnee!='-1'){
                            objet.etats.etat=true;
                            objet.etats.load='terminated';
                            objet.etats.color='red';
                            objet.etats.errorCode=donnee;
                            this.process[index].etats.pourcentage = 5;
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
                                    this.process[index].etats.pourcentage = 5;
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
          this.process[index].etats.pourcentage = 5;

          }
      });

  }

/******************************************************************************************************/

 retraitAvecCode(){

    let info = {'nom':'Orange money retrait','operateur':2,'operation':3,'coderetrait':this.coderetrait,'prenom':this.prenom,'nomclient':this.nom,'num':this.numclient,'date':this.date,'cni':this.cni,'montant':this.mnt};
    this.mobileProcessing(JSON.stringify(info));
    console.log(info);
  //    let requete = "3/"+this.coderetrait+"/"+this.prenom+"/"+this.nom+"/"+this.date+"/"+this.cni+"/"+this.numclient;
    this.reinitialiser();
    this.hideAddChildModal();

  }

   retraitAC(objet:any){
    let index = this.process.findIndex(
      item => (item.data.num === objet.data.num && item.data.montant === objet.data.montant && item.data.nom === objet.data.nom
    ));

    this.process[index].etats.pourcentage = Math.floor(Math.random() * 3) + 1;
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
           this.process[index].etats.pourcentage =5;
        }else
            if(resp._body.match('-12')){
               objet.etats.etat=true;
               objet.etats.load='terminated';
               objet.etats.color='red';
               objet.etats.errorCode='-12';
               this.process[index].etats.pourcentage =5;
            }
            else

           setTimeout(()=>{

              this._omService.verifierReponseOM(resp._body.trim().toString()).then(rep =>{
                var donnee=rep._body.trim().toString();
                console.log("Inside verifier retrait: "+donnee) ;
                if(donnee=='1'){
                   objet.etats.etat=true;
                   objet.etats.load='terminated';
                   objet.etats.color='#36A9E0';
                   this.process[index].etats.pourcentage =5;
                   clearInterval(periodicVerifier) ;
                }
                else
                  if(donnee!='-1'){
                   objet.etats.etat=true;
                   objet.etats.load='terminated';
                   objet.etats.color='red';
                   objet.etats.errorCode=donnee;
                   this.process[index].etats.pourcentage =5;
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
                     objet.etats.color='#36A9E0';
                     this.process[index].etats.pourcentage =5;
                     clearInterval(periodicVerifier) ;
                  }else
                    if(donnee!='-1'){
                       objet.etats.etat=true;
                       objet.etats.load='terminated';
                       objet.etats.color='red';
                       objet.etats.errorCode=donnee;
                       this.process[index].etats.pourcentage =5;
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
                           this.process[index].etats.pourcentage =5;
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
        this.process[index].etats.pourcentage =5;
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

    let index = this.process.findIndex(
      item => (item.data.num === objet.data.num && item.data.montant === objet.data.montant && item.data.nom === objet.data.nom
    ));

    this.process[index].etats.pourcentage = Math.floor(Math.random() * 3) + 1;

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
               this.process[index].etats.pourcentage = 5;
            }else
            if(resp._body.trim()=='-12'){
               objet.etats.etat=true;
               objet.etats.load='terminated';
               objet.etats.color='red';
               objet.etats.errorCode='-12';
               this.process[index].etats.pourcentage = 5;
            }
            else
           setTimeout(()=>{
              this._omService.verifierReponseOM(resp._body.trim().toString()).then(rep =>{
                var donnee=rep._body.trim().toString();
                console.log("Inside verifier depot : "+donnee) ;
                if(donnee=='1'){
                   objet.etats.etat=true;
                   objet.etats.load='terminated';
                   objet.etats.color='#36A9E0';
                   this.process[index].etats.pourcentage = 5;
                }
                else{
                  if(donnee!='-1'){
                     objet.etats.etat=true;
                     objet.etats.load='terminated';
                     objet.etats.color='red';
                     objet.etats.errorCode=donnee;
                     this.process[index].etats.pourcentage = 5;
                   }else{
                        var periodicVerifier = setInterval(()=>{
                        objet.etats.nbtour = objet.etats.nbtour + 1 ;
                        this._omService.verifierReponseOM(resp._body.trim().toString()).then(rep =>{
                          var donnee=rep._body.trim().toString();
                          console.log("Inside verifier depot : "+donnee) ;
                          if(donnee=='1'){
                             objet.etats.etat=true;
                             objet.etats.load='terminated';
                             objet.etats.color='#36A9E0';
                             this.process[index].etats.pourcentage = 5;
                             clearInterval(periodicVerifier) ;
                          }
                          else{
                            if(donnee!='-1'){
                             objet.etats.etat=true;
                             objet.etats.load='terminated';
                             objet.etats.color='red';
                             objet.etats.errorCode=donnee;
                             this.process[index].etats.pourcentage = 5;
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
                                   this.process[index].etats.pourcentage = 5;
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
        this.process[index].etats.pourcentage = 5;

        }
    });

  }


/******************************************************************************************************/

  validrechargementespece(){
    let depotInfo = {'nom':'PostCash','operateur':1,'operation':1,'num':this.telephone,'montant':this.montant};
    this.mobileProcessing(JSON.stringify(depotInfo));
    this.reinitialiser();
    this.hidemodalPostCash();
  }
  
  validrechargementespecePostCash(objet:any){

    let index = this.process.findIndex(
      item => (item.data.num === objet.data.num && item.data.montant === objet.data.montant && item.data.nom === objet.data.nom
    ));

    this.process[index].etats.pourcentage = Math.floor(Math.random() * 3) + 1;

    this._postCashService.rechargementespece('00221'+objet.data.telephone+'',''+objet.data.montant).then(postcashwebserviceList => {
          console.log(postcashwebserviceList);

          if( (typeof postcashwebserviceList.errorCode != "undefined") && postcashwebserviceList.errorCode == "0" && postcashwebserviceList.errorMessage == ""){

          
          console.log(this.process[index]);

            this.process[index].etats.pourcentage = 5;

            objet.etats.etat=true;
            objet.etats.load='terminated';
            objet.etats.color='#36A9E0';
            this.process[index].etats.pourcentage = 5;
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
      item => (item.data.mt_carte === objet.data.mt_carte && item.data.mt_carte === objet.data.mt_carte && item.data.nom === objet.data.nom
    ));

    this.process[index].etats.pourcentage = Math.floor(Math.random() * 3) + 1  ;

    
     this._postCashService.achatjula(objet.data.mt_carte+'',objet.data.nb_carte+'').then(postcashwebserviceList => {
      

        if( (typeof postcashwebserviceList.errorCode != "undefined") && postcashwebserviceList.errorCode == "0" && postcashwebserviceList.errorMessage == ""){
        
         this.process[index].etats.pourcentage = 5;
        
         let mt_carte = objet.data.nb_carte * objet.data.mt_carte ;
         objet.dataI = {
         

              apiservice:'postecash',
              service:'achatjula',
              infotransaction:{
                client:{
                  transactionPostCash: postcashwebserviceList.transactionId,
                  transactionBBS: 'id BBS',
                  typecarte:objet.data.mt_carte,
                  nbcarte:objet.data.nb_carte,
                  montant:mt_carte,
                },

              },
            }
         objet.etats.etat=true;
         objet.etats.load='terminated';
         objet.etats.color='red';
        }else{
             objet.etats.etat=true;
             objet.etats.load='terminated';
             objet.etats.color='#36A9E0';

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
          this.process[index].etats.pourcentage = 5 ;
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
          this.process[index].etats.pourcentage = 4;
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

       

        let typedebouquet = "" ;
        console.log(response);
        if(response.response=="ok"){
          this.process[index].etats.pourcentage = 4;

           objet.etats.etat=true;
           objet.etats.load='terminated';
           objet.etats.color='#36A9E0';

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
        
        if(response=="ok"){
          this.process[index].etats.pourcentage = 4;
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
         
        if(response=="ok"){
          this.process[index].etats.pourcentage = 4;
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
      console.log( "Telephone client: " + objet.data.num+ " Montant client: " + objet.data.montant );

      this._wizallService.intouchCashin("test 1", objet.data.num, objet.data.montant).then( response =>{
              
              console.log(response)
              if(response.commission!=undefined){
                this.process[index].etats.pourcentage = 4;
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
      console.log("Numero : " +objet.data.num + " Montant : "+objet.data.montant);
      this._wizallService.intouchCashout("test 1", objet.data.num, objet.data.montant).then( response =>{
              
              console.log(response) ;
              if(response.status=="PENDING"){
                this.process[index].etats.pourcentage = 4;
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

      let index = this.process.findIndex(
        item => (item.data.montant === objet.data.montant && item.data.refclient === objet.data.refclient && item.data.refFacture === objet.data.refFacture && item.data.nom === objet.data.nom
      ));
  
      this.process[index].etats.pourcentage = Math.floor(Math.random() * 3) + 1  ;

      this._wizallService.intouchPayerFactureSde(objet.data.montant, objet.data.refclient, objet.data.refFacture).then( response =>{
        if(response=="ok"){
          this.process[index].etats.pourcentage = 4;
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
           this.process[index].etats.pourcentage = 5;
        }
      });
    }

    payerSenelecWizall(objet : any){
      console.log('payerSenelecWizall');

      let index = this.process.findIndex(
        item => (item.data.montant === objet.data.montant && item.data.police === objet.data.police && item.data.numfacture === objet.data.numfacture
      ));
  
      this.process[index].etats.pourcentage = Math.floor(Math.random() * 3) + 1  ;

      this._wizallService.intouchPayerFactureSenelec(objet.data.montant, objet.data.police, objet.data.numfacture).then( response =>{
        if(response=="ok"){
          this.process[index].etats.pourcentage  = 4;
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
           this.process[index].etats.pourcentage = 5;
        }

      });
    }


/******************************************************************************************************/

  repeatedInLastFifteen(operation : any, incomingRequest : any) : number{

    let today = Number( Date.now() ) ;
    let omOps = [] ;
      console.log(localStorage.getItem(operation));

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
    let index = this.process.findIndex(
      item => (item.data.num === objet.data.num && item.data.montant === objet.data.montant && item.data.nom === objet.data.nom
    ));

    this.process[index].etats.pourcentage = Math.floor(Math.random() * 3) + 1;
    let requete = "1/"+objet.data.num+"/"+objet.data.montant ;

    if (this.repeatedInLastFifteen('tc-depot', requete)==1){
      objet.etats.etat=true;
      objet.etats.load='terminated';
      objet.etats.color='red';
      objet.etats.errorCode='r';
      this.process[index].etats.pourcentage = 5;
      return 0 ;
    }

    

    this._tcService.requerirControllerTC(requete).then( resp => {
      if (resp.status==200){
           this.process[index].etats.pourcentage = 4;
           console.log("For this 'depot', we just say : "+resp._body) ;
            if(resp._body.trim()=='0'){
               objet.etats.etat=true;
               objet.etats.load='terminated';
               objet.etats.color='red';
               objet.etats.errorCode='0';
               this.process[index].etats.pourcentage = 5;
            }else
            if(resp._body.match('-12')){
               objet.etats.etat=true;
               objet.etats.load='terminated';
               objet.etats.color='red';
               objet.etats.errorCode='-12';
               this.process[index].etats.pourcentage = 5;
            }
            else

           setTimeout(()=>{
              this._tcService.verifierReponseTC(resp._body.trim().toString()).then(rep =>{
                var donnee=rep._body.trim().toString();
                console.log("Inside verifier depot : "+donnee) ;
                if(donnee=='1'){
                   objet.etats.etat=true;
                   objet.etats.load='terminated';
                   objet.etats.color='#36A9E0';
                   this.process[index].etats.pourcentage = 5;
                }
                else{
                  if(donnee!='-1'){
                     objet.etats.etat=true;
                     objet.etats.load='terminated';
                     objet.etats.color='red';
                     objet.etats.errorCode=donnee;
                     this.process[index].etats.pourcentage = 5;
                   }else{
                        var periodicVerifier = setInterval(()=>{
                        objet.etats.nbtour = objet.etats.nbtour + 1 ;
                        this._tcService.verifierReponseTC(resp._body.trim().toString()).then(rep =>{
                          var donnee=rep._body.trim().toString();
                          console.log("Inside verifier depot : "+donnee) ;
                          if(donnee=='1'){
                             objet.etats.etat=true;
                             objet.etats.load='terminated';
                             objet.etats.color='#36A9E0';
                             this.process[index].etats.pourcentage = 5;
                             clearInterval(periodicVerifier) ;
                          }
                          else{
                            if(donnee!='-1'){
                             objet.etats.etat=true;
                             objet.etats.load='terminated';
                             objet.etats.color='red';
                             objet.etats.errorCode=donnee;
                             this.process[index].etats.pourcentage = 5;
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
                                   this.process[index].etats.pourcentage = 5;
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
        this.process[index].etats.pourcentage = 5;
        console.log("error") ;

        }
    });

  }


/******************************************************************************************************/

   payerTransfertTC(objet:any){
    let index = this.process.findIndex(
      item => (item.data.num === objet.data.num && item.data.montant === objet.data.montant && item.data.nom === objet.data.nom
    ));

    this.process[index].etats.pourcentage = Math.floor(Math.random() * 3) + 1;
    let requete = "4/"+objet.data.coderetrait+"/"+objet.data.typepiece+"/"+objet.data.cni+"/"+objet.data.montant+"/"+objet.data.num;
    console.log(requete);

    if (this.repeatedInLastFifteen('tc-retrait', requete)==1){
      objet.etats.etat=true;
      objet.etats.load='terminated';
      objet.etats.color='red';
      objet.etats.errorCode='r';
      this.process[index].etats.pourcentage = 5 ;
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
           this.process[index].etats.pourcentage = 5 ;
        }else
            if(resp._body.match('-12')){
               objet.etats.etat=true;
               objet.etats.load='terminated';
               objet.etats.color='red';
               objet.etats.errorCode='-12';
               this.process[index].etats.pourcentage = 5 ;
            }
            else

           setTimeout(()=>{

              this._tcService.verifierReponseTC(resp._body.trim().toString()).then(rep =>{
                var donnee=rep._body.trim().toString();
                console.log("Inside verifier retrait: "+donnee) ;
                if(donnee=='1'){
                   objet.etats.etat=true;
                   objet.etats.load='terminated';
                   objet.etats.color='#36A9E0';
                   this.process[index].etats.pourcentage = 5 ;
                   clearInterval(periodicVerifier) ;
                }
                else{
                  if(donnee!='-1'){
                   objet.etats.etat=true;
                   objet.etats.load='terminated';
                   objet.etats.color='red';
                   objet.etats.errorCode=donnee;
                   this.process[index].etats.pourcentage = 5 ;
                   clearInterval(periodicVerifier) ;
                  }else{
                      var periodicVerifier = setInterval(()=>{
                      this._tcService.verifierReponseTC(resp._body.trim().toString()).then(rep =>{
                        var donnee=rep._body.trim().toString();
                        console.log("Inside verifier retrait: "+donnee) ;
                        if(donnee=='1'){
                           objet.etats.etat=true;
                           objet.etats.load='terminated';
                           objet.etats.color='#36A9E0';
                           this.process[index].etats.pourcentage = 5 ;
                           clearInterval(periodicVerifier) ;
                        }
                        else{
                          if(donnee!='-1'){
                           objet.etats.etat=true;
                           objet.etats.load='terminated';
                           objet.etats.color='red';
                           objet.etats.errorCode=donnee;
                           this.process[index].etats.pourcentage = 5 ;
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
        this.process[index].etats.pourcentage = 5 ;

        }
    });

  }

  retirertc(objet:any){
    let index = this.process.findIndex(
      item => (item.data.num === objet.data.num && item.data.montant === objet.data.montant && item.data.nom === objet.data.nom
    ));

    this.process[index].etats.pourcentage = Math.floor(Math.random() * 3) + 1;
    let requete = "2/"+objet.data.numclient+"/"+objet.data.montant ;

    if (this.repeatedInLastFifteen('tc-retrait', requete)==1){
      objet.etats.etat=true;
      objet.etats.load='terminated';
      objet.etats.color='red';
      objet.etats.errorCode='r';
      this.process[index].etats.pourcentage = 5 ;
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
           this.process[index].etats.pourcentage = 5 ;
        }else
            if(resp._body.match('-12')){
               objet.etats.etat=true;
               objet.etats.load='terminated';
               objet.etats.color='red';
               objet.etats.errorCode='-12';
               this.process[index].etats.pourcentage = 5 ;
            }
            else

           setTimeout(()=>{

              this._tcService.verifierReponseTC(resp._body.trim().toString()).then(rep =>{
                var donnee=rep._body.trim().toString();
                console.log("Inside verifier retrait: "+donnee) ;
                if(donnee=='1'){
                   objet.etats.etat=true;
                   objet.etats.load='terminated';
                   objet.etats.color='#36A9E0';
                   this.process[index].etats.pourcentage = 5 ;
                   clearInterval(periodicVerifier) ;
                }
                else{
                  if(donnee!='-1'){
                   objet.etats.etat=true;
                   objet.etats.load='terminated';
                   objet.etats.color='red';
                   objet.etats.errorCode=donnee;
                   this.process[index].etats.pourcentage = 5 ;
                   clearInterval(periodicVerifier) ;
                  }else{
                      var periodicVerifier = setInterval(()=>{
                      this._tcService.verifierReponseTC(resp._body.trim().toString()).then(rep =>{
                        var donnee=rep._body.trim().toString();
                        console.log("Inside verifier retrait: "+donnee) ;
                        if(donnee=='1'){
                           objet.etats.etat=true;
                           objet.etats.load='terminated';
                           objet.etats.color='#36A9E0';
                           this.process[index].etats.pourcentage = 5 ;
                           clearInterval(periodicVerifier) ;
                        }
                        else{
                          if(donnee!='-1'){
                           objet.etats.etat=true;
                           objet.etats.load='terminated';
                           objet.etats.color='red';
                           objet.etats.errorCode=donnee;
                           this.process[index].etats.pourcentage = 5 ;
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
        this.process[index].etats.pourcentage = 5 ;

        }
    });

  }


/*********************************/
/*********************************/


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
  this.ventedecodeurpagination=1;
  this.ventecatepagination=1;
  this.retraitaveccodeom=1;
}

public returnHome(){
  this.displayedPage = 'accueil';
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
    console.log('Debut de la deconnexion');
    this._authService.deconnexion();
    sessionStorage.clear() ;
    this.router.navigate(['']);
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
      //let sesion={'data':objet,'etats':infoOperation,'dataI':''};
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

                        this.validrechargementespecePostCash(sesion);
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
                case 3:{
                  this.payerTransfertTC(sesion)
                }
                case 5:{
                      //VENTE IZI
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
                 // this.payerSDEWizall(sesion);
                  break;
              }
              case 4:{
                 // this.payerSenelecWizall(sesion);
                  break;
              }
              
              default : break;
             }
            break;
       }

       case 7 :{
             var operation=sesion.data.operation;
             console.log(sesion);
             console.log('EMONEY');
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

              default : break;
             }
              break;
       }

        case 8 :{
              var operation=sesion.data.operation;
              console.log(sesion);
              console.log('Facturier');
              switch(operation){
                    case 1:{
                          console.log('SDE');
                          this.paimantsdeFacturier(sesion);
                          break;
                    }

                    case 2:{
                          console.log('Rapido');
                          this. rechargeRapido(sesion);
                          break;
                    }
                    case 3:{
                          console.log('Woyofal');
                          this.rechargeWoyofal(sesion);
                          break;
                    }
                    case 4:{
                        console.log('Senelect');
                        this.paimentsenelec(sesion);
                        break;
                    }
                    case 5:{
                        console.log('Oolu solar');
                        this.payeroolusolarFacturier(sesion);
                        break;
                    }

                    default : break;
              }
               break;
        }
        case 9 :{
          var operation=sesion.data.operation;
          console.log(sesion);
          console.log('Gestion');
          switch(operation){
                case 1:{
                      console.log('Dépense');
                      this.validCharge(sesion);
                      break;
                }

                case 2:{
                      console.log('Recette');
                      this.validvente(sesion);
                      break;
                }

                case 3:{
                      console.log('Reclammation');
                      this.validreclamation(sesion);
                      break;
                }

                default : break;
          }
           break;
    }
    case 10:{
      this.airtime(sesion);
      break
    }
    case 11:{
      var operation=sesion.data.operation;
      console.log(sesion);
      console.log('Gestion');
      switch(operation){
        case 1:{
          this.payerCanalReab(sesion);
        break;
        }
        case 2:{
          this.payerCanalRec(sesion);
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
  @ViewChild('addChildModalAirtime') public addChildModalAirtime:ModalDirective;
  @ViewChild('modalcanalReabonnement') public modalcanalReabonnement:ModalDirective;
  @ViewChild('modalretrait') public modalretrait:ModalDirective;
   @ViewChild('modalventecredit') public modalventecredit:ModalDirective;
   @ViewChild('modalretraitcode') public modalretraitcode:ModalDirective;


  deposerOM(){
         // sessionStorage.setItem('curentProcess',JSON.stringify({'nom':'Orange money depot','operateur':2,'operation':1,'montant':this.mnt,'num':this.numclient}));
          let data=JSON.stringify({'nom':'OrangeMoney','operateur':2,'operation':1,'montant':this.mnt,'num':this.numclient});
          this.mobileProcessing(data);
          this.addChildModal.hide();
         // this.depotreussi=true;
          //this.numclient = undefined ;
          //this.mnt = undefined;
  }
  numab:any=0;
  numa:any;
  adresse:any;
  numCarte:any
  lastFormule:any="";
  reachCanal:any;
  rechercherCanal(){
   this.loading = true ;
    this.erreur = false ;
    this._canalService.recherche(this.reachCanal.toString()).then(res =>{
      let numFile = res['_body'].trim();
      console.log(res['_body']);
      this.loading=true;
     let intervalle1 = setInterval(()=>{ this._canalService.resultRecherche(numFile).then(res =>{ let result=res['_body'];
      console.log('ResultRecherhe');
      console.log(res['_body'].trim());
      if(result.includes("[")){
        console.log(res['_body'].split('['));
        
         this.numab = result.split('[')[0];
        this.numa = this.numab;
        this.noma = result.split('[')[2];
        this.prenoma = result.split('[')[3];
        this.adresse = result.split('[')[7];
        this.lastFormule = result.split('[')[8];
        this.numCarte = result.split('[')[11];
      this.loading=false;
      this.roadTo('nv');
      clearInterval(intervalle1);
      console.log(this.numab+" "+this.numa+"  "+this.lastFormule+"  "+this.adress+" "+this.numCarte);
      }else{
        console.log("pas encore de reponse");
        
      }
    });}, 10000);
    
  });
  
  }
  /*  canal  */
  /********** canal-modals ***************/
  showmodalcanal(){
    this.modalcanalReabonnement.show();
  }
  hidemodalcanal(){
    this.modalcanalReabonnement.hide()
  }
  /**************CANAL Traitement **********/
  charm:string ="";
  prixCharm:number=0;
  getCharme(){
    if(this.prixCharm == 0){
      this.prixCharm = 6000;
      this.charm = "charm";
    }else {
      this.prixCharm = 0;
      this.charm = "charm";
    }
    this.getMontant();
  }
  pvr:string ="";
  prixpvr:number=0;
  getPVR(){
    if(this.prixpvr == 0){
      this.prixpvr = 5000;
      this.pvr = "PVR";
    }else {
      this.prixpvr = 0;
      this.pvr = "PVR";
    }
    this.getMontant();
  }
  ecran2:string ="";
  prix2ecran:number=0;
  get2ecran(){
    if(this.prix2ecran == 0){
      this.prix2ecran = 6000;
      this.ecran2 = "Ecran2";
    }else {
      this.prix2ecran = 0;
      this.ecran2 = "Ecran2";
    }
    this.getMontant();
  }

  montantNet:any = 0;
  getMontant(){
    this.montantNet = 0;
    if(this.tbouquet == 'Date à date Access'){
      this.montantNet = this.montantNet +5000 + this.prixCharm
    }else if(this.tbouquet == 'Date à date Evasion')  {
      this.montantNet = this.montantNet + 10000 +this.prixCharm +this.prixpvr +this.prix2ecran;
    }else if(this.tbouquet == 'Date à date ESSENTIEL Plus')  {
      this.montantNet = this.montantNet + 12000  +this.prixCharm +this.prixpvr +this.prix2ecran;
    }else if(this.tbouquet == 'Date à date Les Chaines canal plus & Access')  {
      this.montantNet = this.montantNet + 15000  +this.prixCharm +this.prixpvr +this.prix2ecran;
    }else if(this.tbouquet == 'Date à date Les Chaines canal plus & Evasion')  {
      this.montantNet = this.montantNet + 20000  +this.prixCharm +this.prixpvr +this.prix2ecran;
    }else if(this.tbouquet == 'Date à date Tout Canal Plus')  {
      this.montantNet = this.montantNet + 40000  +this.prixCharm +this.prixpvr +this.prix2ecran;
    }else if(this.tbouquet == 'Date à date Prestige')  {
      this.montantNet = this.montantNet + 30000  +this.prixCharm +this.prixpvr +this.prix2ecran ;
    }
    this.montantNet = this.montantNet * this.nbm;
  }

  canalReab:number = 1;
  canalReabBack(){
    this.canalReab = 1;
  }
  canalReabNext(){
    this.canalReab = 2;
  }
  canalRec:number = 1;
  canalRecBack(){
    this.canalRec = 1;
  }
  canalRecNext(){
    this.canalRec = 2;
  }
  validnaboncanal(){
    let depotInfo = {'token':this.token,'nom':'canal plus','operateur':11,'operation':1, 'nomclient': this.noma, 'prenom' : this.prenoma, 'tel': '', 'numAbo': this.numab, 'numDec' : '', 'numCarte' : this.numCarte, 'formule': this.tbouquet, 'montant' : this.montantNet, 'nbreMois' : this.nbm, 'charme' : this.charm, 'pvd' : this.pvr, 'ecranII' : this.ecran2};
    this.mobileProcessing(JSON.stringify(depotInfo));
    //sessionStorage.setItem('curentProcess',JSON.stringify({'token':this.token,'nom':'Tnt nouvel abonnement','operateur':4,'operation':1,'typedebouquet':typedebouquet,'tel':this.telNewClient,'chip':this.nchipNewClient,'carte':this.ncarteNewClient,'prenom':this.prenoma,'nomclient':this.noma,'duree':this.nbm,'cni':''}));
    
    this.hidemodalcanal();
    this.reinitialiser();
    this.reachCanal = undefined;
    this.numab = undefined;
  }
  titre:string;
  nomrec:string;
  prenomrec:string;
  cnirec:string;
  villerec:string;
  adresserec:string;
  emailrec:string;
  telrec:string;
  numDecRec:string;
 
  
  vendreDecodeurcanal(){
    let depotInfo = {'token':this.token,'nom':'canal plus','operateur':11,'operation':2, 'nomclient': this.nomrec, 'prenom' : this.prenomrec, 'tel': this.telrec, 'numAbo': '', 'numDec' : this.numDecRec, 'numCarte' : '', 'formule': this.tbouquet, 'montant' : this.montantNet, 'nbreMois' : this.nbm, 'charme' : this.charm, 'pvd' : this.pvr, 'ecranII' : this.ecran2};
    this.mobileProcessing(JSON.stringify(depotInfo));
    //sessionStorage.setItem('curentProcess',JSON.stringify({'token':this.token,'nom':'Tnt nouvel abonnement','operateur':4,'operation':1,'typedebouquet':typedebouquet,'tel':this.telNewClient,'chip':this.nchipNewClient,'carte':this.ncarteNewClient,'prenom':this.prenoma,'nomclient':this.noma,'duree':this.nbm,'cni':''}));
    
    this.hidemodalcanal();
    this.reinitialiser();
  }
  payerCanalRec(objet){
    let index = this.process.findIndex(
      item => (item.data.num === objet.data.num && item.data.montant === objet.data.montant && item.data.nom === objet.data.nom
    ));

    this.process[index].etats.pourcentage = Math.floor(Math.random() * 3) + 1;

    let infosClient = {'operation':'CANAL Recrutement', 'nomclient': objet.data.nomclient, 'prenom' : objet.data.prenom, 'tel': objet.data.tel, 'numAbo': objet.data.numAbo, 'numDec' : objet.data.numDec, 'numCarte' : objet.data.numCarte, 'formule': objet.data.formule, 'montant' : objet.data.montant, 'nbreMois' : objet.data.nbreMois, 'charme' : objet.data.charme, 'pvd' : objet.data.pvd, 'ecranII' : objet.data.deuxiemeEcran} ;
    
    //console.log(infosClient) ;

    let infosToSend = JSON.stringify(infosClient) ;

    this._canalService.payer(infosToSend).then(response =>{
      console.log(response._body);
      if(response._body==1){
        objet.etats.etat=true;
        objet.etats.load='terminated';
        objet.etats.color='#36A9E0';
        this.process[index].etats.pourcentage = 5;

      }else{
          objet.etats.etat=true;
          objet.etats.load='terminated';
          objet.etats.color='red';
          objet.etats.errorCode=0;
      }
    });
  }
  payerCanalReab(objet){
    let index = this.process.findIndex(
      item => (item.data.num === objet.data.num && item.data.montant === objet.data.montant && item.data.nom === objet.data.nom
    ));

    this.process[index].etats.pourcentage = Math.floor(Math.random() * 3) + 1;

    let infosClient = {'operation':'CANAL Réabonnement', 'nomclient': objet.data.nomclient, 'prenom' : objet.data.prenom, 'tel': objet.data.tel, 'numAbo': objet.data.numAbo, 'numDec' : objet.data.numDec, 'numCarte' : objet.data.numCarte, 'formule': objet.data.formule, 'montant' : objet.data.montant, 'nbreMois' : objet.data.nbreMois, 'charme' : objet.data.charme, 'pvd' : objet.data.pvd, 'ecranII' : objet.data.deuxiemeEcran} ;
    
    //console.log(infosClient) ;

    let infosToSend = JSON.stringify(infosClient) ;

    this._canalService.payer(infosToSend).then(response =>{
      console.log(response._body);
      if(response._body==1){
        objet.etats.etat=true;
        objet.etats.load='terminated';
        objet.etats.color='#36A9E0';
        this.process[index].etats.pourcentage = 5;

      }else{
          objet.etats.etat=true;
          objet.etats.load='terminated';
          objet.etats.color='red';
          objet.etats.errorCode=0;
      }
    });
  }
   
solde:number;
getSolde(){
this._utilsService.checkCaution().subscribe(
  data => {
    this.solde = data ;
    console.log("Le solde vaut "+data) ;
  },
  error => alert(error),
  () => {
    console.log(3)
  }
)
}    
  /* airtime */
  venteAirtime(){
    let service=""
    if(this.numclient.split("")[0]== "7"){
      if(this.numclient.split("")[1]== "7" || this.numclient.split("")[1]== "8"){
        service = 'Seddo';
      }
      if(this.numclient.split("")[1]== "6"){
        service = 'izi';
      }
      if(this.numclient.split("")[1]== "0" ){
        service = 'yakalma';
      }
    }
    let data=JSON.stringify({'nom':service,'operateur':10,'operation':1,'montant':this.mnt,'num':this.numclient});
     this.mobileProcessing(data);
    
     this.hideAddChildModalAirtime();
     this.ventereussi= false;
      this.echecVente = false;
  }
  verif_montant(mnt:string):boolean{
    if(parseInt(mnt)>=1){
      return true;
    }else{
      return false;
    }
  }
  verif_phone_number(number:string):boolean{
    let numero=number.split("");
    console.log(numero.length);
    if(numero.length!=parseInt("9")){
      return false;
    }
    for(let i=0;i<numero.length;i++){
      if(!this.isNumber(numero[i])){
        return false;
      }
    }
    return true;
  }
  isNumber(num:string):boolean{
    let tab=["0","1","2","3","4","5","6","7","8","9"];
    for(let i=0;i<tab.length;i++){
      if(num===tab[i]){
        return true;
      }
    }
    return false;
  }
  numORmnterror:boolean =false;
  public showAddChildModalAirtime():void {
    this.numORmnterror=false;
    let tab=this.numclient.split("");
	  let verif_number_bool=(tab[0]=="7" && (tab[1]=="7" || tab[1]=="8" || tab[1]=="6" || tab[1]=="0"));
	  let verif_montant_bool=(this.verif_montant(this.mnt) && parseInt(this.mnt)>=100);
	  
	  if(this.verif_phone_number(this.numclient) && verif_montant_bool){
			this.addChildModalAirtime.show();
		}else{
			if(!verif_number_bool || !this.verif_phone_number(this.numclient)){
				this.numORmnterror=true;
			}
			if(!verif_montant_bool){
				this.numORmnterror=true;
			}
    }
    //this.verifnumber();
  }

  public hideAddChildModalAirtime():void {
    this.addChildModalAirtime.hide();
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
    this.typepiece =undefined
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
    this.provenance=undefined;
    this.marque=undefined;
    this.couleur=undefined;
    this.origine=undefined;
    this.tendence=undefined;
    this.sexe=undefined;
    this.mode=undefined;
    this.utilisation=undefined;
    this.fonctions=undefined;
    this.modele=undefined;
    this.capacite=undefined;
    this.matiere=undefined;
    this.tendances=undefined;
    this.mess =undefined;
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
    showmodalRetraitTigoCash(){
      this.modalRetraitTigoCash.show();
     }
     hidemodalRetraitTigoCash(){
      this.modalRetraitTigoCash.hide()
     }
     
    showmodalPayerTransfertTigoCash(){
      console.log(this.codeReatrait,this.prenomPT,this.nomPT,this.typepiece);
      
      this.modalPTTigoCash.show();
     }
     hidemodalPayerTransfertTigoCash(){
      this.modalPTTigoCash.hide()
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

            trimer(infosclient) : string{
              return infosclient.replace('R', '') ;
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

          validCharge(objet){
            this.loading = true ;

            let index = this.process.findIndex(
              item => (item.data.libelleCharge === objet.data.libelleCharge && item.data.service === objet.data.service && item.data.montantCharge === objet.data.montantCharge
            ));
        
            this.process[index].etats.pourcentage = Math.floor(Math.random() * 3) + 1  ;

            console.log(JSON.stringify({libelle:objet.data.libelleCharge, service:objet.data.service, montant:objet.data.montantCharge}));
            
            this._gestionreportingService.ajoutdepense({libelle:objet.data.libelleCharge, service:objet.data.service, montant:objet.data.montantCharge})
              .subscribe(
                data => {
                  console.log(data)
                  this.libelleCharge = "" ;
                  this.service = "" ;
                  this.montantCharge = 0 ;
                  this.process[index].etats.pourcentage = 4;
                },
                error => {
                  console.log(error)
                  this.process[index].etats.pourcentage = 5;
                },
                () => {
                  this.loading = false ;
                  this.process[index].etats.pourcentage = 5;
                }
              )
            }
          //  check point
          validChargeGestionRepoting(){
              let depotInfo = {'nom':'ajouter dépense','operateur':9,'operation':1,'libelleCharge':this.libelleCharge,'service':this.service,"montantCharge": this.montantCharge};
              this.hideGestionReporting();
              this.mobileProcessing(JSON.stringify(depotInfo));
              this.reinitialiser();
          }

          
          validventeGestionRepoting(){
              let depotInfo = {'nom':'Recettes','operateur':9,'operation':2,'quantite':this.quantite,'designation':this.designation,'servicevente':this.servicevente.toLowerCase(),"noma": this.noma,"prenoma": this.prenoma, "telephonea": this.telephonea, "datedebut": this.datedebut, "datefin": this.datefin};
              this.hideGestionReporting();
              this.mobileProcessing(JSON.stringify(depotInfo));
              this.reinitialiser();
          }

          validvente(objet){
              
              this.loading = true ;
              if( objet.data.servicevente == 'assurance'.toLowerCase()){
                let tempdesignation= objet.data.designation;
                objet.designation=JSON.stringify({desig:tempdesignation, nom:objet.data.noma, prenom:objet.data.prenoma, telephone:objet.data.telephonea, datedebut:(objet.data.datedebut).toString(), datefin: (objet.data.datefin).toString()})
                console.log("Obj designé "+objet.designation);
              }
          
              let index = this.process.findIndex(
                item => (item.data.servicevente === objet.data.servicevente && item.data.designation === objet.data.designation && item.data.quantite === objet.data.quantite
              ));
          
              this.process[index].etats.pourcentage = Math.floor(Math.random() * 3) + 1  ;

              console.log(JSON.stringify({servicevente:objet.data.servicevente, designation:objet.data.designation, quantite:objet.data.quantite}));
              this._gestionreportingService.vente({servicevente:objet.data.servicevente, designation:objet.data.designation, quantite:objet.data.quantite})
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
                    this.process[index].etats.pourcentage = 4;
                  },
                  error => {
                    console.log(error);
                    this.process[index].etats.pourcentage = 5;
                  },
                  () => {
                    this.loading = false ;
                    this.process[index].etats.pourcentage = 5;
                  }
                )
        
          }

          validreclamationGestionRepoting(){
            let depotInfo = {'nom':'Recettes','operateur':9,'operation':3,'sujet':this.sujet,'nomservice':this.nomservice,"mess": this.mess};
            this.hideGestionReporting();
            this.mobileProcessing(JSON.stringify(depotInfo));
            this.reinitialiser();
          }

          validreclamation(objet){
            console.log("-------------------------------------------")
            this.loading = true ;
            
            let index = this.process.findIndex(
              item => (item.data.sujet === objet.data.sujet && item.data.nomservice === objet.data.nomservice && item.data.mess === objet.data.mess
            ));
        
            this.process[index].etats.pourcentage = Math.floor(Math.random() * 3) + 1;

            console.log({sujet:objet.data.sujet, nomservice:objet.data.nomservice, mess:objet.data.mess});
            this._gestionreportingService.reclamation({sujet:objet.data.sujet, nomservice:objet.data.nomservice, mess:objet.data.mess})
              .subscribe(
                data => {
                  console.log(data)
                  this.sujet = "" ;
                  this.nomservice = "";
                  this.mess = "" ;
                  this.process[index].etats.pourcentage = 4;
                },
                error => {
                  console.log(error);
                  this.process[index].etats.pourcentage = 4;
                },
                () => {
                  this.loading = false ;
                  this.process[index].etats.pourcentage = 5;
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
            
            let index = this.process.findIndex(
              item => (item.data.num === object.data.num && item.data.montant === object.data.montant && item.data.nom === object.data.nom
            ));

            this.process[index].etats.pourcentage = Math.floor(Math.random() * 3) + 1;

            this._facturierService.paimentsde(object.data.mntsde,object.data.refclientsde,object.data.refFactureSDE,object.data.mom).then( response =>{
                this.hidemodalsde();
                this.process[index].etats.pourcentage = 4;
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
          console.log("numclient : "+ object.data.numclient, " montant : "+object.data.montant+ " badge: "+ object.data.badge);
          this._facturierService.validerrapido(object.data.numclient,object.data.montant,object.data.badge).then(response =>{
              console.log("mangui si bir");
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

          let index = this.process.findIndex(
            item => (item.data.api === object.data.api && item.data.compteur === object.data.compteur && item.data.nom === object.data.nom
          ));

          this.process[index].etats.pourcentage = Math.floor(Math.random() * 3) + 1;

          this._facturierService.validerwoyofal(object.data.api,object.data.montant,object.data.compteur).then(response =>{
            this.process[index].etats.pourcentage = 4;
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
            
              let index = this.process.findIndex(
                item => (item.data.telephone === object.data.telephone && item.data.compte === object.data.compte && item.data.montant === object.data.montant
              ));
    
              this.process[index].etats.pourcentage = Math.floor(Math.random() * 3) + 1;

              this._facturierService.payeroolusolar("00221"+(object.data.telephone).toString(),object.data.compte,object.data.montant).then(response =>{
                console.log(response);
                this.process[index].etats.pourcentage = 4;
                this.hidemodaloolu();
                this.montant=undefined;
                this.compte=undefined;
                this.telephone=undefined;
              });
          }

      /* **********************ProcessingMobile*******************/

      public showmodalProcessing(){
        this.modalProcessing.show();
      }
      public hidemodalProcessing(){
        this.modalProcessing.hide()
      }

      public closeTrasaction(objet:any){

        let index = this.process.findIndex(
          item => (item.data.telephone === objet.data.telephone && item.data.montant === objet.data.montant && item.data.nom === objet.data.nom
        ));

        this.process.splice(index,1);
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
                          
              let index = this.process.findIndex(
                item => (item.data.montant === object.data.montant && item.data.police === object.data.police && item.data.num_facture === object.data.num_facture && item.data.service === object.data.service
              ));
    
              this.process[index].etats.pourcentage = Math.floor(Math.random() * 3) + 1;

              this._facturierService.validerpaimentsenelec(object.data.montant,object.data.police,object.data.num_facture,object.data.service).then(response =>{
                if(response.errorCode==0){
                  this.process[index].etats.pourcentage = 4;
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
  //Retrait TigoCash
  retaitTigoCash(){
    let RetraitInfo = {'nom':'TigoCash retrait','operateur':3,'operation':2,'num':this.telephone,'montant':this.montant};
    this.mobileProcessing(JSON.stringify(RetraitInfo));
    this.hidemodalRetraitTigoCash();
    this.reinitialiser();

  }

  payerTransTigoCash(){
    let RetraitInfo = {'nom':'TigoCash payer transfert','operateur':3,'operation':3,'coderetarit':this.coderetrait,'prenom':this.prenom,'nomC':this.nom,'typepiece':this.typepiece,'cni':this.cni,'num':this.telephone,'montant':this.montant};
    this.mobileProcessing(JSON.stringify(RetraitInfo));
    this.hidemodalPayerTransfertTigoCash();
    //this.reinitialiser();
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
  deposerWIZALL(){
        let depotInfoWIZALL = {'nom':'wizall depot','operateur':6,'operation':1,'num':this.numclient,'montant':this.mnt};
        this.mobileProcessing(JSON.stringify(depotInfoWIZALL));
        this.fermermodalretraitWIZALL();
      }

    public depotmodalWIZALL(){
     this.modaldepotWIZALL.show();
    }

    public fermermodaldepotWIZALL(){
     this.modaldepotWIZALL.hide()
    }





//retrait
public retirerWIZALL(){
         let retraitInfoWIZALL = {'nom':'wizall retrait','operateur':6,'operation':1,'num':this.numclient,'montant':this.mnt};
         this.mobileProcessing(JSON.stringify(retraitInfoWIZALL));
         this.fermermodalretraitWIZALL();
      }

  public retirermodalWIZALL(){
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
  fairedepotEMONEY(){
     let depotInfoEMONEY = {'nom':'EMONEY ','operateur':7,'operation':1,'num':this.telephone,'montant':this.montant};
     this.mobileProcessing(JSON.stringify(depotInfoEMONEY));
     this.hidemodaldepotEMONEY();
      }

  showmodaldepotEMONEY(){
     this.modaldepotEMONEY.show();
    }
    hidemodaldepotEMONEY(){
     this.modaldepotEMONEY.hide()
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
         let depotInfo = {'nom':'WIZALL ','operateur':6,'operation':1,};
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
  showmodalretraitcodeEMONEY(){
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
  /*showmodalretraitConfirmEMONEY(){
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
@ViewChild('childModalCommandviewMore') public childModalCommandviewMore:ModalDirective;

  public showChildModalCommandviewMore():void {
    this.childModalCommandviewMore.show();
  }

  public hideChildModalCommandviewMore():void {  this.childModalCommandviewMore.hide();
    this.nom = null;
    this.prenom = null;
    this.telephone = null;
    this.email = null;
  }


  public showAddChildModalviewMore(article):void {
    this.currentArticle=article ;
    this.viewMore.show();
  }

  public hideAddChildModalviewMore():void {
    this.viewMore.hide();
  } 

  public ajouter_au_panier(article){
    let articl=new Article();
    articl.prix=article.prix;
    articl.designation=article.designation;
    articl.description=article.description;
    articl.nomImg=article.nomImg;
    this.articles.push(articl);
    sessionStorage.setItem('curentProcess',JSON.stringify({'nom':'Mon Panier','operateur':5,'prix':articl.prix,'quantite':1,'nomImg':articl.nomImg,'designation':articl.designation,'description':articl.description}));
    this.viewMore.hide();
  }

  selectionnerarticle(article: Article){
    let existe = this.orderedarticles.find(function(item){
      return article.id == item.id;
    })
    if(existe == undefined){
      let orderedarticle:OrderedArticle = {
        id:article.id,
        qte:1,
        prix:article.prix,
        montant:article.prix,
        designation:article.designation,
        description:article.description,
        nomImg:article.nomImg,
      };
      this.orderedarticles.push(orderedarticle);
      this.recalculmontant();
    }
    else{
      this.orderedarticles = this.orderedarticles.filter(item => item.id!==article.id);
      this.recalculmontant();

    }
  }

  supprimerarticle(article){
    this.orderedarticles = this.orderedarticles.filter(item => item.id!==article.id);
    this.recalculmontant();
  }
  augmenterqte(i){
    if(this.orderedarticles[i].qte) {
      this.orderedarticles[i].qte++;
      this.recalculmontant();
    }
    else {
      this.orderedarticles[i].qte++;
      this.recalculmontant();
    }
  }
  diminuerqte(i){
    if(this.orderedarticles[i].qte>1){
      this.orderedarticles[i].qte--;
      this.recalculmontant();
    }
  }
  recalculmontant(){
    this.montant = 0;
    for (var i = 0; i < this.orderedarticles.length; i++) {
      this.orderedarticles[i].montant = this.orderedarticles[i].qte * this.orderedarticles[i].prix;
      this.montant += this.orderedarticles[i].montant;
    }
  }


  @ViewChild('childModalCommand') public childModalCommand:ModalDirective;

  public showChildModalCommand():void {
    this.childModalCommand.show();
  }

  public hideChildModalCommand():void {  this.childModalCommand.hide();
    this.nom = null;
    this.prenom = null;
    this.telephone = null;
    this.email = null;
  }

  public commander():void {
    let params = {
      token: this.token ,
      orderedarticles:""+JSON.stringify(this.orderedarticles),
      montant: this.montant,
      prenomclient: this.prenom,
      nomclient: this.nom,
      telephoneclient: this.telephone,
      emailclient: this.email
    };
    this.loading = true ;
    this._ecomService.commander(params).then( response => {
      this.loading = false ;
    });
    this.hideChildModalCommand();
    this.orderedarticles = [];
  }

  public viderordered(){
    this.orderedarticles = [];
  }

  public initialiserreseach(){
    this.filterQuery = this.asyncSelected = "";
    this.typeaheadNoResults = this.typeaheadLoading = false;
  }
//Mon panier
/******************************************************************************************************/


//ngOnInit panier//


  

  @ViewChild('modalcommande') public modalcommande:ModalDirective;
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
 
  showmodalcommande(){
    this.prenom="";
    this.nom="";
    this.adress="";
    this.telephone=undefined;
    this.estclient=false;
    this.modalcommande.show();
  }
  hidemodalcommande(){
     this.prenom="";
     this.nom="";
     this.adress="";
     this.telephone=undefined;
     this.estclient=false;
     this.modalcommande.hide();
  }
  chercherclient(tel:number){

      for(let i=0;i<this.clients.length;i++){
         if(this.clients[i].telephone==tel){
            this.prenom=this.clients[i].prenom;
            this.nom=this.clients[i].nom;
            this.adress=this.clients[i].adress;
            this.telephone=this.clients[i].telephone;
         }
      }
      this.estclient=true;
  }
  validercommande(){
         let depotInfo = {};
         this.mobileProcessing(JSON.stringify(depotInfo));
         this.hidemodalcommande();
      }
//fin de mon panier
//detail commande
recupInfosCmd(){
    console.log("Récupèration des informations relatives à la présente commande...") ;
    this.loading = true ;
    let requiredInfo = "infocmd#"+this.codecmd ;
    let paramObj={token : this.token, article : requiredInfo} ;
    this._ecomService.prendreCommande(paramObj).then( response =>
      {

       this.infosCommande = JSON.parse(response)[0] ;
        this.prenom = this.infosCommande.prenomclient ;
        this.nom  = this.infosCommande.nomclient ;
        this.orderedArticles = this.infosCommande.orderedArticles ;
        this.montant = this.infosCommande.montant ;

        this.loading = false ;
        this.inforecvd = true ;
      });
  }

  prendreCommande(){
    console.log("Récupèration des informations relatives à la présente commande...") ;
    this.loading = true ;
    let requiredInfo = "takecmd#"+this.codecmd ;
    let paramObj={token : this.token, article : requiredInfo} ;
    this._ecomService.prendreCommande(paramObj).then( response =>
      {
        console.log("Reponse serveur :::: "+response) ;
        this.codecmd = "";
        this.loading = false ;
        this.postcmd = true ;
      });
  }

  @ViewChild('childModalCOMMANDE') public childModalCOMMANDE:ModalDirective;

  public showChildModalCOMMANDE():void {
    this.childModalCOMMANDE.show();
  }

  public hideChildModalCOMMANDE():void {
    this.childModalCOMMANDE.hide();
  }

  //espace perso
  chargerCommandes(typeListe : string){
    console.log('azertrytuyiuokyjtrgez chargerCommandes azertrytuyiuokyjtrgez')
    this.loading = true ;
    this.ecomCaller.listerCommandes(this.token, typeListe).then( response =>
    {
      console.log('azertrytuyiuokyjtrgez')
      console.log(response)
      this.listeCommande = null ;
      if(typeListe=='toDeliver'){
        this.smart =  response.borom;
        this.listeCommande = response.order;
      }
      else
        this.listeCommande =  response;
      this.loading = false ;
    });
  }
 receivedCmd(idCommande : number){
    return ( this.receivedArticles.indexOf("-"+idCommande.toString()+"-")>-1 ) ;
  }
   chargerVentes(){
    this.loading = true ;
    this.ecomCaller.listerVentes(this.token).then( response =>
    {
      this.listeVentes = [] ;
      this.listeVentes =  response ;
      this.loading = false ;
    });
  }

    receptionner(idCommande : number){
    let params = {token: this.token, idCommande: idCommande};
    this.loading = true ;
    this.ecomCaller.receptionnerCommandes(params).then( response =>
    {
      if(response=="ok")
        this.receivedArticles = this.receivedArticles + "-"+idCommande.toString()+"-" ;
      this.loading = false ;
    });
  }

  fournir(idCommande : number){
    let params = {token: this.token, idCommande: idCommande};
    this.loading = true ;
    this.ecomCaller.fournirCommandes(params).then( response =>
    {
      if(response=="ok")
        this.articlesFournis = this.articlesFournis + "-"+idCommande.toString()+"-" ;
      this.loading = false ;
    });
  }

  cmdFournis(idCommande : number){
    return ( this.articlesFournis.indexOf("-"+idCommande.toString()+"-")>-1 ) ;
  }

  modifArticle(article:Article){
    this.modif=article.nomImg;
    this.modifart="record"+article.nomImg;
  }

  enregArticle(article: Article){
    this.modif="";
    this.modifart="";

    this.loading = true ;

    for(var j=0; j<this.articles.length; j++){
      var ligne=this.articles[j];
      for (var i=0; i<ligne.length; i++)
        if (ligne[i].nomImg==article.nomImg)
        {
          if(!(this.uploadFile === undefined)){
            ligne[i].nomImg = this.uploadFile.generatedName ;
          }
          let artcle = JSON.stringify(ligne[i]) ;
          let params = { article: artcle ,token: this.token } ;
          this.ecomCaller.modifierArticle(params).then( response =>
          {
            this.loading = false ;
          });
          break;
        }
    }
  }

deleteArticle(article:Article) {
    for(var j=0; j<this.articles.length; j++){
      var ligne=this.articles[j];
      for (var i=0; i<ligne.length; i++)
        if (ligne[i].nomImg==article.nomImg)
        {
          this.loading = true ;
          let artcle = JSON.stringify(ligne[i]) ;
          let params = { article: artcle ,token: this.token } ;
          this.ecomCaller.supprimerArticle(params).then( response =>
          {
            ligne.splice(i,1);
            this.loading = false ;
          });
          break;
        }
    }
  }
  annulArticle(){
    this.loading = true ;
    this.ecomCaller.listeArticles(this.token, 'perso').then( response =>
    {
      this.articles = _.chunk(response, 5) ;
      this.listarticles = response;
      this.loading = false ;
    });
    this.modif="";
    this.modifart="";

  }

filtre : string = "" ;

  filtrerCatalogue() : Article[][] {

    let catalogueApresFiltre : Article[][] = [] ;
    if (this.filtre=="" || this.filtre==null)
      return this.articles ;
    else
      for(var j=0; j<this.articles.length; j++){
        var ligne=this.articles[j] ;
        let ligneCopy : Article[] = [] ;
        let k : number = 0 ;
        for (var i=0; i<ligne.length; i++)
          if (this.repondAuFiltre(ligne[i]))
          {
            ligneCopy[k]=ligne[i];
            k=k+1 ;
          }
        catalogueApresFiltre.push(ligneCopy) ;
      }
    return catalogueApresFiltre ;
  }

 repondAuFiltre(article : Article) : boolean {
    if (this.filtre=="" || this.filtre==null)
      return true ;
    else
    if ( (article.nomImg.toLowerCase().match( this.filtre.toLowerCase() )!=null) || (article.designation.toLowerCase().match( this.filtre.toLowerCase() )!=null) )
      return true ;
    else
      return false ;
  }


  detailsCurrentCommande() : newCommande[]{
    if(this.orderedArticles){
      let tabOrder : newCommande[] = JSON.parse(this.orderedArticles) ;
      return tabOrder ;
    }
    return [] ;
  }

  uploadFile: any = null;

 @ViewChild('addChildModalecommerce') public addChildModalecommerce:ModalDirective;
 @ViewChild('modalmodif') public modalmodif:ModalDirective;
  public showmodaldif(article){
    this.articlemodif=article;
    console.log(this.articlemodif);
    this.modalmodif.show();
    //modifArticle(article)
  }
  hidemodalmodif(){
    this.modalmodif.hide();
  }

  validermodif(article){
    // modifArticle(article);
    let data=(JSON.stringify({provenance:this.provenance,marque:this.marque,couleur:this.couleur,origine:this.origine,tendance:this.tendances,mode:this.mode,sexe:this.sexe})).toString();
    let params=JSON.stringify({'article':{description:data,prix:this.prix,designation:this.designation,id:article.id,nomImg:article.nomImg,token:this.token}});
    console.log(params);
    this.ecomCaller.modifierArticle(params).then( response =>
    {
      console.log(response);
      // this.loading = false ;
      this.hidemodalmodif();
      this.reinitialiser();
    });

  }


  


  public showAddChildModalecommerce():void {
    this.descriptionsvalues=[];
    this.addChildModalecommerce.show();
  }

  public hideAddChildModalecommerce():void {
    this.addChildModalecommerce.hide();
    this.categoriea = "--- Catégorie ---" ;
    this.addtype = '' ;
    this.prixa = 0 ;
  }

  annulerecommerce(){
    this.hideAddChildModalecommerce() ;
    this.newImage = "imagevide.jpg" ;
    this.categoriea = "--- Catégorie ---" ;
  }

 apiEndPoint = 'http://51.254.200.129/backendprod/EsquisseBackEnd/server-backend-upload/index.php' ;
 
    fileChange(event) {
    let fileList: FileList = event.target.files;
    if(fileList.length > 0) {
      let file: File = fileList[0];
      let formData:FormData = new FormData();
      formData.append('file', file, file.name);
      let headers = new Headers();

      /** No need to include Content-Type in Angular 4 */
      //Applying content-type in the current case leads to an impossible upload

      // headers.append('Content-Type', 'multipart/form-data');

      headers.append('Accept', 'application/json');
      let options = new RequestOptions({
        headers: headers
      });

      this.http.post(`${this.apiEndPoint}`, formData, options)
        .map(res => res.json())
        .catch(error => Observable.throw(error))
        .subscribe(
          data => {
            let newData = data;
            this.uploadFile = newData;
            this.newImage = this.uploadFile.generatedName ;
          },
          error => {}
        )
    }
  }

   ajouterecommerce(){
    if(this.uploadFile!=null){
          this.loading = true ;
          var data=(JSON.stringify({categorie:this.categorie,provenance:this.provenance,marque:this.marque,couleur:this.couleur,origine:this.origine,model:this.modele,capacite:this.capacite,fonctions:this.fonctions,matiere:this.matiere,tendance:this.tendances,mode:this.mode,sexe:this.sexe,infosup:this.infosup})).toString();
          //let params = { token: this.token , designation: this.designationa, description:this.descriptiona, prix: this.prixa, stock:this.stocka, img_link: this.uploadFile.generatedName, categorie:JSON.stringify({categorie : this.categoriea, type:'ecom'}) };
          let params = { token: this.token , designation: this.designationa, description:data, prix: this.prixa, stock:this.stocka, img_link: this.uploadFile.generatedName, categorie:JSON.stringify({categorie : this.categoriea, type:'ecom'}) };
          console.log(params);
          this.ecomCaller.ajouterArticle(params).then( response =>
          {
            console.log('fi la yamme');
            this.loading = false ;
            this.designationa=undefined;
            this.descriptiona=undefined;
            this.prixa=undefined ;
            this.stocka=undefined;
            this.uploadFile = null ;

            this.newImage = "imagevide.jpg" ;
            this.prixa = undefined ;
            this.categoriea = "--- Catégorie ---" ;
            this.hideAddChildModalecommerce();
          });
    }
  }

  ajouterpta(){
    this.loading = true ;

    let params = { token: this.token , designation: this.designationpta, description:this.descriptionpta, prix: this.prixpta, stock:this.stockpta, img_link: this.uploadFile.generatedName, categorie:JSON.stringify({categorie : this.categoriepta, type:'petiteannonce'}) }
    this.ecomCaller.ajouterArticle(params).then( response =>
    {
      console.log('ayy');
      this.designationpta=undefined;
      this.descriptionpta=undefined;
      this.prixpta=undefined ;
      this.stockpta=undefined;
      this.uploadFile.generatedName = null ;
      this.uploadFile.originalName = null ;
      this.newImage = "imagevide.jpg" ;
      this.prixpta = undefined ;
      this.loading = false ;
      this.categoriepta = "--- Catégorie ---" ;
    });
  }

   tauxreduc(basicPrice){
    if (basicPrice<=10000){
      return 0.1 ;
    }
    if (basicPrice>10000 && basicPrice<=50000){
      return 0.085 ;
    }
    if (basicPrice>50000 && basicPrice<=100000){
      return 0.095 ;
    }
    if (basicPrice>100000 && basicPrice<=250000){
      return 0.09 ;
    }
    if (basicPrice>250000 && basicPrice<=500000){
      return 0.07 ;
    }
    if (basicPrice>500000 && basicPrice<=750000){
      return 0.05 ;
    }
    if (basicPrice>750000 && basicPrice<=1000000){
      return 0.04 ;
    }
    else{
      return 0.035 ;
    }
  }


  reduirePrix(basicPrice){
    if (basicPrice<=10000){
      this.customerReduct = Math.round((basicPrice*0.1)*0.5) ;
    }
    if (basicPrice>10000 && basicPrice<=50000){
      this.customerReduct = Math.round((basicPrice*0.085)*0.5) ;
    }
    if (basicPrice>50000 && basicPrice<=100000){
      this.customerReduct = Math.round((basicPrice*0.095)*0.5) ;
    }
    if (basicPrice>100000 && basicPrice<=250000){
      this.customerReduct = Math.round((basicPrice*0.09)*0.5) ;
    }
    if (basicPrice>250000 && basicPrice<=500000){
      this.customerReduct = Math.round((basicPrice*0.07)*0.5) ;
    }
    if (basicPrice>500000 && basicPrice<=750000){
      this.customerReduct = Math.round((basicPrice*0.05)*0.5) ;
    }
    if (basicPrice>750000 && basicPrice<=1000000){
      this.customerReduct = Math.round((basicPrice*0.04)*0.5) ;
    }
    else{
      this.customerReduct = Math.round((basicPrice*0.035)*0.5) ;
    }

  }

  roundedValueOf(decimal){
    return Math.round(decimal) ;
  }

  descriptionarticle(categorie){
    if(categorie=="--- Catégorie ---"){
      this.descriptionsvalues=[];
    }
    //for(let i=0;i<this.descriptions.length;i++){
    //if(this.descriptions[i].description==categorie){
    // this.descriptionsvalues=this.descriptions[i].value;
    switch(categorie){
      case 'Cosmetiques':{
        this.categorie='cosmetiques';
        this.reinitialiser();
        this.Bcosmetique=true;
        this.Bvetement=false;
        this.Bchaussure=false;
        this.Belectronique=false;
        this.Bbureau=false;
        this.Belectromenager=false;
        this.Baccessoire=false;
        this.Bsac=false;
        break;
      }
      case 'Accessoires':{
        this.categorie='accessoires';
        this.reinitialiser();
        this.Bcosmetique=false;
        this.Bvetement=false;
        this.Bchaussure=false;
        this.Belectronique=false;
        this.Bbureau=false;
        this.Belectromenager=false;
        this.Bsac=false;
        this.Baccessoire=true;
        break;
      }
      case 'Vêtements':{
        this.categorie='vetements';
        this.reinitialiser();
        this.Bvetement=true;
        this.Bcosmetique=false;
        this.Belectronique=false;
        this.Bchaussure=false;
        this.Baccessoire=false;
        this.Bbureau=false;
        this.Belectromenager=false;
        this.Bsac=false;
        break;
      }
      case 'Chaussures':{
        this.categorie='chaussures';
        this.reinitialiser();
        this.Bvetement=false;
        this.Bcosmetique=false;
        this.Belectronique=false;
        this.Bchaussure=true;
        this.Baccessoire=false;
        this.Bbureau=false;
        this.Belectromenager=false;
        this.Bsac=false;
        break;
      }
      case 'Electronique':{
        this.categorie='electronique';
        this.reinitialiser();
        this.Bvetement=false;
        this.Bcosmetique=false;
        this.Bchaussure=false;
        this.Baccessoire=false;
        this.Belectronique=false;
        this.Bbureau=false;
        this.Belectromenager=false;
        this.Bsac=false;
        break;
      }
      case 'Outils de bureau':{
        this.categorie='bureau';
        this.reinitialiser();
        this.Bvetement=false;
        this.Bcosmetique=false;
        this.Bchaussure=false;
        this.Belectronique=false;
        this.Baccessoire=false;
        this.Bbureau=true;
        this.Belectromenager=false;
        this.Bsac=false;
        break;
      }
      case 'Electromenager':{
        this.categorie='electromenager';
        this.reinitialiser();
        this.Bvetement=false;
        this.Bcosmetique=false;
        this.Bchaussure=false;
        this.Belectronique=false;
        this.Bbureau=false;
        this.Belectromenager=true;
        this.Baccessoire=false;
        this.Bsac=false;
        break;
      }
      case 'Sacs':{
        this.categorie='sacs';
        this.reinitialiser();
        this.Bvetement=false;
        this.Bcosmetique=false;
        this.Bchaussure=false;
        this.Belectronique=false;
        this.Bbureau=false;
        this.Belectromenager=false;
        this.Baccessoire=false;
        this.Bsac=true;
        break;
      }
      default:break;
    }


}


//vente decodeur pagination

ventedecodeurpaginationNext(){
  if(this.ventedecodeurpagination < 3)
      this.ventedecodeurpagination = this.ventedecodeurpagination + 1 ;
}

ventedecodeurpaginationBack(){
  if(this.ventedecodeurpagination > 1)
      this.ventedecodeurpagination = this.ventedecodeurpagination - 1 ;
}

ventecatepaginationNext(){
  if(this.ventecatepagination < 3)
      this.ventecatepagination = this.ventecatepagination + 1 ;
}

ventecatepaginationBack(){
  if(this.ventecatepagination > 1)
      this.ventecatepagination = this.ventecatepagination - 1 ;
}

retraitaveccodeomNext(){
  if(this.retraitaveccodeom < 2)
      this.retraitaveccodeom = this.retraitaveccodeom + 1 ;
}

retraitaveccodeomBack(){
  if(this.retraitaveccodeom > 1)
      this.retraitaveccodeom = this.retraitaveccodeom - 1 ;
}

/************************************
 *  E-COMMERCE FUNCTIONS
 ***********************************/

 /* Catalogue */

 public changeTypeaheadLoading(e: boolean): void {
  this.filterQuery = this.asyncSelected;
  this.typeaheadLoading = e;
}

public changeTypeaheadNoResults(e: boolean): void {
  this.typeaheadNoResults = e;
}

    // Pagination 
/*      contentArray = new Array(90).fill('');
      returnedArray: string[];
*/
pageChanged(event: PageChangedEvent){
    const startItem = (event.page - 1) * event.itemsPerPage;
    const endItem = event.page * event.itemsPerPage;
    // this.returnedArray = this.contentArray.slice(startItem, endItem);
}




}