/*-----------------*/
/*      Modules     */
/*-----------------*/

import { NgModule }      from '@angular/core' ;
import { BrowserModule } from '@angular/platform-browser' ;
import  { FormsModule} from '@angular/forms' ;
import { HttpModule }    from '@angular/http';


import { LoadersCssModule } from 'angular2-loaders-css';

import {DataTableModule} from "angular2-datatable";
import { AlertModule, TabsModule, CollapseModule, ProgressbarModule, ModalModule, TypeaheadModule, PaginationModule, AccordionModule} from 'ng2-bootstrap';

import { AgmCoreModule } from '@agm/core';
import { ChartsModule } from 'ng2-charts';

import {NgxPaginationModule} from 'ngx-pagination';


/*-----------------*/
/*      Services   */
/*-----------------*/

import { SoldeService} from './soldecompte/soldeservice';
import { CashInService} from './expresso/expressoservices';
import { CashOutService} from './expresso/expressoservices';
import { AgentTopUpService} from './expresso/expressoservices';
import { MyAccountService} from './expresso/expressoservices';

import {TigocashService} from './services/tigocash.service';

import { NAbonnementService} from './services/tntservices';
import { LAbonnementService} from './services/tntservices';
import { EFinancierService} from './services/tntservices';

/*-----------------*/
/*      Routes     */
/*-----------------*/

import { Routing }        from './app.routing';
import { AuthGuard } from './_guards/auth.guard';
import { AuthGuardcais } from './_guards/authcais.guard';
import { AuthGuardsup } from './_guards/authsup.guard';



/*-----------------*/
/*      Components  */
/*-----------------*/

import { AppComponent } from './app.component';
import { AuthComponentComponent } from './auth-component/auth-component.component';

import { AccueilComponent } from './accueil/accueil.component';
import { AccueiladminpdvComponent } from './accueiladminpdv/accueiladminpdv.component';
import { AccueilAdminMultiPdvComponent } from './accueil-admin-multi-pdv/accueil-admin-multi-pdv.component';

import { NavbarTopComponent } from './navbars/navbar-top/navbar-top.component';

import { AdminpdvAidedecisionComponent } from './adminpdv/adminpdv-aidedecision/adminpdv-aidedecision.component';
import { AdminpdvDashboardComponent } from './adminpdv/adminpdv-dashboard/adminpdv-dashboard.component';
import { AdminpdvMonitoringComponent } from './adminpdv/adminpdv-monitoring/adminpdv-monitoring.component';
import { AdminpdvStatusReclamationComponent } from './adminpdv/adminpdv-status-reclamation/adminpdv-status-reclamation.component';
import { AdminpdvparametrecompteComponent } from './adminpdv/adminpdv-parametre-compte/adminpdv-parametre-compte.component';

import { AdminmultipdvDashboardComponent } from './admin-multi-pdv/admin-multi-pdv-dashboard/admin-multi-pdv-dashboard.component';
import { AdminmultipdvDemandeRetraitComponent } from './admin-multi-pdv/admin-multi-pdv-demande-retrait/admin-multi-pdv-demande-retrait.component';
import { AdminmultipdvMonitoringComponent } from './admin-multi-pdv/admin-multi-pdv-monitoring/admin-multi-pdv-monitoring.component';
import { AdminmultipdvStatusPdvComponent } from './admin-multi-pdv/admin-multi-pdv-status-pdv/admin-multi-pdv-status-pdv.component';
import { AdminmultipdvStatusReclamationComponent } from './admin-multi-pdv/admin-multi-pdv-status-reclamation/admin-multi-pdv-status-reclamation.component';
import { AdminmultipdvUpdateCautionComponent } from './admin-multi-pdv/admin-multi-pdv-update-caution/admin-multi-pdv-update-caution.component';

import { CrmComponent } from './crm/crm.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { DemandepretComponent } from './demandepret/demandepret.component';
import { SoldecompteComponent } from './soldecompte/soldecompte.component';
import { ImpressionComponent } from './impression/impression.component';
import { LoaderComponent } from './loader/loader.component';
import { ExpressoComponent } from './expresso/expresso.component';
import { EspacePersoComponent } from './espace-perso/espace-perso.component';
import { ComptabiliteComponent } from './comptabilite/comptabilite.component';
import { GestionnaireComponent } from './gestionnaire/gestionnaire.component';
import { panierComponent } from './panier/panier.component';


import { GeomapComponentComponent } from './geomap-component/geomap-component.component';


/*-----------------*/
/*      Pipes      */
/*-----------------*/
import { DatafilterPipe } from './pipes/datafilter.pipe';
import { DecodatafilterPipe } from './pipes/decodatafilter.pipe';
import { CarddatafilterPipe } from './pipes/carddatafilter.pipe';
import { FiltrerecouvrementPipe } from './pipes/filtrerecouvrement.pipe';
import { FiltrerecommandearecupPipe } from './pipes/filtrerecommandearecup.pipe';
import { FiltrerecommandealivrerPipe } from './pipes/filtrerecommandealivrer.pipe';
import { PipeCommandePipe } from './pipes/pipe-commande.pipe';
import { FiltreoperateursPipe } from './pipes/filtreoperateurs.pipe';
import { FiltrervoperateursPipe } from './pipes/filtrervoperateurs.pipe';
import { AdminpdvgestionnaireservicePipe } from './gestionnaire/gestionnaire.pipe';


import { AdminpdvparametrecomptePipe } from './adminpdv/adminpdv-parametre-compte/adminpdv-parametre-compte.pipe';
import { AdminpdvStatusReclamationPipe } from './adminpdv/adminpdv-status-reclamation/adminpdv-status-reclamation.pipe';

import { AdminmultipdvStatusReclamationPipe } from './admin-multi-pdv/admin-multi-pdv-status-reclamation/admin-multi-pdv-status-reclamation.pipe';
import { AdminmultipdvUpdateCautionPipe } from './admin-multi-pdv/admin-multi-pdv-update-caution/admin-multi-pdv-update-caution.pipe';
import { AdminmultipdvDemandeRetraitPipe } from './admin-multi-pdv/admin-multi-pdv-demande-retrait/admin-multi-pdv-demande-retrait.pipe';

import { FilterAdminmultperformancePipe } from './pipes/filterAdminmultperformance.pipe';
import { FiltredateintervallePipe } from './pipes/filtredateintervalle.pipe';
import { FiltredateparanneePipe } from './pipes/filtredateparannee.pipe';
import { FiltredateparjourPipe } from './pipes/filtredateparjour.pipe';
import { FiltrefichierPipe } from './pipes/filtrefichier.pipe';
import { FiltrervPipe } from './pipes/filtrerv.pipe';
import { FiltrechargesPipe } from './pipes/filtrecharges.pipe';
import { FiltrerevenusPipe } from './pipes/filtrerevenus.pipe';
import { FiltreexploitationPipe } from './pipes/filtreexploitation.pipe';
import { FiltresupservicePipe } from './pipes/filtresupservice.pipe';
import { FiltreportefeuillePipe } from './pipes/filtreportefeuille.pipe';
import { FiltrerelancePipe } from './pipes/filtrerelance.pipe';
import { FiltrepromotionPipe } from './pipes/filtrepromotion.pipe';
import { FiltreprospectionPipe } from './pipes/filtreprospection.pipe';
import { FiltresuivicommandePipe } from './pipes/filtresuivicommande.pipe';
import { FiltregestionreportingPipe } from './pipes/filtregestionreporting.pipe';
import { SelfprovidedfilterPipe } from './pipes/selfprovidedfilter.pipe';
import { ConsulterpretComponent } from './consulterpret/consulterpret.component';
import { SuppliedarticlesPipe } from './pipes/suppliedarticles.pipe';
import { FiltrezonepdrPipe } from './pipes/filtrezonepdr.pipe';
import { FiltresouszonepdrPipe } from './pipes/filtresouszonepdr.pipe';
import { FiltresouszonesupplierPipe } from './pipes/filtresouszonesupplier.pipe';
import { FiltrezonesupplierPipe } from './pipes/filtrezonesupplier.pipe';
import { FiltrecataloguecommandePipe } from './pipes/filtrecataloguecommande.pipe';
import { FirstlogComponent } from './firstlog/firstlog.component';
import {FiltreexploitationaveccommissionPipe} from "./pipes/filtreexploitationaveccommission.pipe";
import {GuideUserCaisseComponent} from "./guideusercaisse/guideusercaisse.component";
import {GuideUserSuperviseurComponent} from "./guideusersuperviseur/guideusersuperviseur.component";
import {UtilsService} from "./services/utils.service";
import {CrmService} from "./services/crm.service";
import {AdminpdvService} from "./services/adminpdv.service";
import {ImpressionadminpdvComponent} from "./impressionadminpdv/impressionadminpdv.component";
import {CommissionnementComponent } from './commissionnement/commissionnement.component';
import {ChallengeresultsComponent } from './challengeresults/challengeresults.component';
import {AdminmultipdvCreditationCCComponent} from "./admin-multi-pdv/admin-multi-pdv-creditation-cc/admin-multi-pdv-creditation-cc.component";

import { ZoningComponent } from './zoning/zoning.component';
import { AnnoncesComponent } from './annonces/annonces.component';
import { AnnoncesuperviseurComponent } from './annoncesuperviseur/annoncesuperviseur.component';

import {AdminmultipdvSuivipointComponent} from "./admin-multi-pdv/admin-multi-pdv-suivipoint/admin-multi-pdv-suivipoint.component";
import {AuthService} from "./services/auth.service";
import {ComptabiliteService} from "./services/comptabilite.service";
import {AdminmultipdvService} from "./services/adminmultipdv.service";
import {TntService} from "./services/tnt.service";
import {AuthenticationService} from "./services/authentification.service";
import {GestionreportingService} from "./services/gestionreporting.service";
import {DemandepretService} from "./services/demandepret.service";
import {EcomService} from "./services/ecom.service";
import {WizallService} from "./services/wizall.service";
import {FacturierService} from "./services/facturier.service";
import {OrangemoneyService} from "./services/orangemoney.service";
import {ExpressocashService} from "./services/expressocash.service";
import {MapsService} from "./services/maps.service";
import { PostCashService } from 'app/services/postCash.service';

import { PopoverModule } from 'ngx-bootstrap/popover';
import { CarouselModule } from 'ngx-bootstrap/carousel';
/*--------------------------------------------------------------------------------------------------------*/
/*                                            END OF IMPORTS                                              */
/*--------------------------------------------------------------------------------------------------------*/


@NgModule({
  declarations: [
    AppComponent,
    AuthComponentComponent,
    AccueilComponent,
    CrmComponent,
    DashboardComponent,
    AccueiladminpdvComponent,
    AccueilAdminMultiPdvComponent,
    DemandepretComponent,
    SoldecompteComponent,
    panierComponent,

    ImpressionComponent,
    ImpressionadminpdvComponent,

    AdminmultipdvDashboardComponent,
    AdminmultipdvDemandeRetraitComponent,
    AdminmultipdvMonitoringComponent,
    AdminmultipdvStatusPdvComponent,
    AdminmultipdvStatusReclamationComponent,
    AdminmultipdvUpdateCautionComponent,
    AdminmultipdvCreditationCCComponent,

    AdminpdvAidedecisionComponent,
    AdminpdvDashboardComponent,
    AdminpdvMonitoringComponent,
    AdminpdvStatusReclamationComponent,
    AdminpdvparametrecompteComponent,

    GeomapComponentComponent,
    LoaderComponent,
    NavbarTopComponent,
    ExpressoComponent,
    EspacePersoComponent,
    LoaderComponent,
    ComptabiliteComponent,
    DatafilterPipe,
    DecodatafilterPipe,
    CarddatafilterPipe,
    FiltrerecouvrementPipe,
    FiltrerecommandearecupPipe,
    FiltrerecommandealivrerPipe,
    PipeCommandePipe,
    FiltreoperateursPipe,
    FiltrervoperateursPipe,
    FiltredateintervallePipe,
    FiltredateparjourPipe,
    FiltredateparanneePipe,
    FilterAdminmultperformancePipe,
    FiltrecataloguecommandePipe,

    AdminmultipdvStatusReclamationPipe,
    AdminmultipdvUpdateCautionPipe,
    AdminmultipdvDemandeRetraitPipe,
    AdminmultipdvSuivipointComponent,
    AdminpdvparametrecomptePipe,
    AdminpdvStatusReclamationPipe,
    AdminpdvgestionnaireservicePipe,

    FiltrefichierPipe,
    FiltrervPipe,
    FiltrechargesPipe,
    FiltrerevenusPipe,
    FiltreexploitationPipe,
    FiltreexploitationaveccommissionPipe,
    FiltresupservicePipe,
    FiltreportefeuillePipe,
    FiltrerelancePipe,
    FiltrepromotionPipe,
    FiltreprospectionPipe,
    FiltresuivicommandePipe,
    FiltregestionreportingPipe,
    SelfprovidedfilterPipe,
    ConsulterpretComponent,
    SuppliedarticlesPipe,
    FiltrezonepdrPipe,
    FiltresouszonepdrPipe,
    FiltresouszonesupplierPipe,
    FiltrezonesupplierPipe,
    FirstlogComponent,
    GestionnaireComponent,
    GuideUserCaisseComponent,
    GuideUserSuperviseurComponent,
    CommissionnementComponent,
    ChallengeresultsComponent,
    ZoningComponent,
    AnnoncesComponent,
    AnnoncesuperviseurComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    Routing,
    DataTableModule,
    ChartsModule,
    LoadersCssModule,
    PaginationModule.forRoot(),
    TabsModule.forRoot(),
    CarouselModule.forRoot(),
    ModalModule.forRoot(),
    CollapseModule.forRoot(),
    ProgressbarModule.forRoot(),
    TypeaheadModule.forRoot(),
    PopoverModule.forRoot(),
    AccordionModule.forRoot(),
    AlertModule.forRoot(),
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyC-2WxSYvBmnQ0HgUYU7fWxCyY_itypwn8'
    }),
    NgxPaginationModule
  ],
  providers: [
    EFinancierService,
    LAbonnementService,
    NAbonnementService,
      MyAccountService,
      AgentTopUpService,
      CashOutService,
      CashInService,
      SoldeService,
      AuthGuard,
      AuthGuardcais,
      AuthGuardsup,

    AuthenticationService,
    AdminpdvService,
    AdminmultipdvService,
    UtilsService,
    TntService,
    PostCashService,
    AuthService,
    ComptabiliteService,
    CrmService,
    GestionreportingService,
    EcomService,
    DemandepretService,
    WizallService,
    FacturierService,
    OrangemoneyService,
    TigocashService,
    ExpressocashService,
    MapsService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
