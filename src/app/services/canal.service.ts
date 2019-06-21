import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';

@Injectable()
export class CanalService {

  private url = "https://sentool.bbstvnet.com/index.php";

  private headers=new Headers();
  private token : string = JSON.parse(sessionStorage.getItem('currentUser')).baseToken ;
  public datas:any;

  public abonnement(requete:any,nom,prenom,tel,NumAbonner,NumDecoudeur,numCarte,Formule,prix,nombreMois,charme,pvr,deuxiemeEcran): Promise<any>{
    let params="requestParam="+JSON.stringify({requete : requete,nom:nom,prenom:prenom,tel:tel,NumAbonner:NumAbonner,NumDecoudeur:NumDecoudeur,numCarte:numCarte,Formule:Formule,prix:prix,nombreMois:nombreMois,charme:charme,pvr:pvr,deuxiemeEcran:deuxiemeEcran});
    let link=this.url+"handleAlert.php";
    console.log(params);
    return this.http.post(link,params,{headers:this.headers}).toPromise().then( res => {console.log(res);return res} ).catch(error => {console.log(error);return 'bad' });
  }
  public Recrutement(requete:any,titre,nom,prenom,cni,ville,adresse,email,tel,NumDecoudeur,Formule,prix,nombreMois,charme,pvr,deuxiemeEcran): Promise<any>{
    let params="requestParam="+JSON.stringify({requete : requete,titre:titre,nom:nom,prenom:prenom,cni:cni,ville:ville,adresse:adresse,email:email,tel:tel,NumDecoudeur:NumDecoudeur,Formule:Formule,prix:prix,nombreMois:nombreMois,charme:charme,pvr:pvr,deuxiemeEcran:deuxiemeEcran});
    let link=this.url+"handleAlert.php";
    console.log(params);
    return this.http.post(link,params,{headers:this.headers}).toPromise().then( res => {console.log(res);return res} ).catch(error => {console.log(error);return 'bad' });
  }
  public Recherhe(requete:any): Promise<any>{
    let params="requestParam="+JSON.stringify({requete : requete});
    let link=this.url+"/canal/rechercher";
    //console.log(params);
    return this.http.post(link,params,{headers:this.headers}).toPromise().then( res => {console.log(res);return res} ).catch(error => {console.log(error);return error });
  }
  public ResultRecherhe(requete:any): Promise<any>{
    let params="requestParam="+JSON.stringify({filename : requete, tokenParam:this.token});
    let link=this.url+"/canal/resultRecherche";
    console.log(params);
    return this.http.post(link,params,{headers:this.headers}).toPromise().then( res => {console.log(res);return res} ).catch(error => {console.log('error');return error });
  }
  constructor(private http:Http) {
    this.headers.append('Content-Type', 'application/x-www-form-urlencoded');
  }

}
