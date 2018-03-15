import {Injectable} from '@angular/core';
import {Http,Headers} from "@angular/http";
import 'rxjs/add/operator/map';



@Injectable()
export class FacturierService {

  //private link = "https://abonnement.bbstvnet.com/crmbbs/backend-SB-Admin-BS4-Angular-4/index.php";
  //private link = "http://abonnement.bbstvnet.com/crmbbs/backend-SB-Admin-BS4-Angular-4/index.php";
  //private link = "http://localhost/backup-sb-admin/backend-SB-Admin-BS4-Angular-4/index.php";
  //private link = "http://localhost/backup-sb-admin/new-backend-esquise/index.php";
  private link = "https://sentool.bbstvnet.com/sslayer/index.php";


  private headers = new Headers();
  private token : string = JSON.parse(sessionStorage.getItem('currentUser')).baseToken ;



  constructor(private http:Http) {
    this.headers.append('Content-Type', 'application/x-www-form-urlencoded');
  }

  public paimentsde(montant : number, reference_client : number,reference_facture :number ,service :string) : Promise<any> {
    let reEspParams = {token:this.token, reference_client:reference_client,reference_facture:reference_facture, service:service} ;
    let url=this.link+"/facturier-sen/reglementsde";
    let params="params="+JSON.stringify(reEspParams);
    return new Promise( (resolve, reject) => {
      this.http.post(url,params,{headers:this.headers}).map(res =>res.json()).subscribe(data =>{
        resolve(data);
      });
    });
  }

  public detailreglementsde(reference_client:number):Promise<any>{
    let reEspParams={token:this.token,reference_client:reference_client};
    let url=this.link+"/facturier-sen/detailreglementsde";
    let params="params="+JSON.stringify(reEspParams);
    return new Promise( (resolve, reject) => {
      this.http.post(url,params,{headers:this.headers}).map(res =>res.json()).subscribe(data =>{
        resolve(JSON.parse(data));
      });
    });
  }

  public validerrapido(telephone:string,montant:string,badge:string):Promise<any>{
    let reEspParams={token:this.token,telephone:telephone,montant:montant,badge:badge};
    let url=this.link+"/facturier-sen/achatrapido";
    let params="params="+JSON.stringify(reEspParams);
    return new Promise( (resolve, reject) => {
      this.http.post(url,params,{headers:this.headers}).map(res =>res.json()).subscribe(data =>{
        resolve(JSON.parse(data));
      });
    });
  }

  public validerwoyofal(api:number,montant:number,compteur:string):Promise<any>{
    let reEspParams={api:api,token:this.token,montant:montant,compteur:compteur};
    let url=this.link+"/facturier-sen/achatcodewoyofal";
    let params="params="+JSON.stringify(reEspParams);
    return new Promise( (resolve, reject) => {
      this.http.post(url,params,{headers:this.headers}).map(res =>res.json()).subscribe(data =>{
        resolve(JSON.parse(data));
      });
    });
  }

  public detailfacturesenelec(police:string,numfacture:string):Promise<any>{
    let reEspParams={token:this.token,police:police,num_facture:numfacture};
    let url=this.link+"/facturier-sen/detailreglementsenelec";
    let params="params="+JSON.stringify(reEspParams);
    return new Promise( (resolve, reject) => {
      this.http.post(url,params,{headers:this.headers}).map(res =>res.json()).subscribe(data =>{
        resolve(JSON.parse(data));
      });
    });
  }

  public validerpaimentsenelec(montant:number,police:string,num_facture:string,service:string):Promise<any>{
    let reEspParams={token:this.token,police:police,num_facture:num_facture,service:service};
    let url=this.link+"/facturier-sen/reglementsenelec";
    let params="params="+JSON.stringify(reEspParams);
    return new Promise( (resolve, reject) => {
      this.http.post(url,params,{headers:this.headers}).map(res =>res.json()).subscribe(data =>{
        resolve(JSON.parse(data));
      });
    });
  }

  public payeroolusolar(tel:string,numcompte:string,mtt:string):Promise<string>{
    let reEspParams={token:this.token,tel:tel,numcompte:numcompte,mtt:mtt};
    let url=this.link+"/facturier-sen/paiementoolusolar";
    let params="params="+JSON.stringify(reEspParams);
    return new Promise( (resolve, reject) => {
      this.http.post(url,params,{headers:this.headers}).map(res =>res.json()).subscribe(data =>{
        resolve(JSON.parse(data));
      });
    });
  }


}
