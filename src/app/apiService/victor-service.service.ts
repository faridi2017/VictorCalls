import { Injectable } from '@angular/core';

import { HttpClientModule, HttpClient, HttpHeaders} from '@angular/common/http';
import { Http, Headers } from '@angular/http';
import { User } from '../modal/User';
import { map } from 'rxjs/operators';
import { Observable, Subject } from "rxjs";
import { MyLead } from '../modal/MyLead';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import { Project } from '../modal/project';
import { Document } from '../modal/document';
import { Company } from '../modal/company';
import { BehaviorSubject } from 'rxjs';
import { ResourceURI } from '../apilist/ResourceURI';
import { Registration } from '../modal/Registration';
import { ResourceLoader } from '@angular/compiler';
const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';
//import 'rxjs/add/observable/merge';
//import 'rxjs/add/operator/map';



const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json'})
};

const httpOptions1 = {
  headers: new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' })
};
@Injectable({
  providedIn: 'root'
})
export class VictorServiceService {
   httpOptionsAuth = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json',
                               'Authorization': 'Bearer ' +sessionStorage.getItem('vctoken')})
  };
 
  getAssigneeListUrl = 'http://api.victorcalls.com/api/account/Users?userName=@userNameMobile';
//http://api.victorcalls.com/token?username=vedagya19&password=Modinagar&grant_type=password
  getCount ='http://api.victorcalls.com/api/Leads/leadStatusCounts?username=vedagya19';
 

public postLeadUrl = 'http://192.168.1.10:5000/api/victor/post/Lead';


addProjectUrlP ='http://192.168.1.10:5000/api/victor/addProject';
postProjectDocUrl = 'http://api.victorcalls.com/api/Account/Project/projectid/Document';
postAddDocUrl ='http://192.168.1.10:5000/api/victor/addDocument';
getDocumentsUrl = 'http://api.victorcalls.com/api/Account/Projects?userName=vedagya19';
getDocumentsUrlP = 'http://192.168.1.10:5000/api/victor/getDocument';
postAddCompUrlP ='http://192.168.1.10:5000/api/victor/addCompany';
getDocumentByProjectID ='http://api.victorcalls.com/api/Account/Project/';
// ex: "http://api.victorcalls.com/api/Account/Project/1/documents"
  constructor(private http: HttpClient) { 
   
  }

 //login
 public sendPost(userData: User):Observable<any> {
            console.log('Login API called');
            return this.http.post(ResourceURI.pLogin,
              "username="+userData.username+"&password="+userData.password+
              "&grant_type="+userData.grant_type,httpOptions1);
       } // end of login


  // uploads excel file
  public uploadsLeadsExcelFile(formdata: FormData):Observable<any> {
      
        return this.http.post(ResourceURI.pUploadLeads, formdata);
   } // end of login
 // get raw leads, ie all leads
 public getRawLeads(userName) {
            return this.http.get(ResourceURI.gRawLeads + userName, httpOptions);
       }// end of getUrlLeads


public getTenRawLeads(pageNumber) {
        // console.log('at raw ten leads service');
              pageNumber = String(pageNumber);
              return this.http.get(ResourceURI.gTenRawLeadsPno+pageNumber, httpOptions);
         }// end of geTentUrlLeads 


  // get count of all type of leads
public getDetails(userName) {
    //console.log('at service');
               return this.http.get(ResourceURI.gLeadCount + userName,httpOptions);
        }

//  get leads by statusid
public getUserLeads(statusId,userName) {
                return this.http.get(ResourceURI.gLeadsByStatusId+userName+'&statusid='+statusId, httpOptions);
 
      }// end of get leads by status id

 // get list of assignee
public getAssigneeList() {
                 return this.http.get(ResourceURI.gUser, httpOptions);
         }// end of get Assignee 
  public getAssigneeListA(id) {
          return this.http.get(ResourceURI.gUsers+id + '/Users', httpOptions);
  }// end of get Assignee 

 public getAllProjects(userName){
          return this.http.get(ResourceURI.gAllProjects+userName, httpOptions);
        }   
        public getAllProjectsA(id){
          return this.http.get(ResourceURI.gAllProjects + id, httpOptions);
        }  

public getAllDocuments(){
          return this.http.get(ResourceURI.gAllDocuments, httpOptions);
        }        

// get all documents of a particular project
public getDocumentsOfProject(projectID){
  console.log('get doc of projId:', projectID);        
  return this.http.get(ResourceURI.gDocumentByProjectID+projectID+'/documents', httpOptions);
        }

// post project
public postProject(project: Project):Observable<any>{
          return this.http.post(ResourceURI.pProject,project, this.httpOptionsAuth);
        } // end of post project


// post Lead





public postLead(selectedLead: MyLead[]):Observable<any> {
    console.log('Lead API called');
    return this.http.post(this.postLeadUrl,selectedLead,httpOptions);
  }


                    public exportAsExcelFile(json: any[], excelFileName: string): void {
                      const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
                      const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
                      const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
                      this.saveAsExcelFile(excelBuffer, excelFileName);
                    }
                    private saveAsExcelFile(buffer: any, fileName: string): void {
                       const data: Blob = new Blob([buffer], {type: EXCEL_TYPE});
                       FileSaver.saveAs(data, fileName + '_export_' + new  Date().getTime() + EXCEL_EXTENSION);
                    }


                    getIpAddress() {
                      return this.http.get('https://ipinfo.io/json',httpOptions);
                            
                  }
       
     
        
          postProjectDoc(doc: Document):Observable<any>{
            return this.http.post( this.postAddDocUrl,doc, httpOptions);
          // return  this.http.post(this.postAddDocUrl, formData, options)
          }
         
          postAddCompany(cmp: Company ):Observable<any>{
            return this.http.post( ResourceURI.pCompany,cmp, httpOptions);
          // return  this.http.post(this.postAddDocUrl, formData, options)
          }
          postAddUser(usr: Registration ):Observable<any>{
            return this.http.post(ResourceURI.pAddUser,usr, httpOptions);
          // return  this.http.post(this.postAddDocUrl, formData, options)
          }
          getUserRoles(){
            return this.http.get(ResourceURI.gUserRole, httpOptions);
          }
          getUserProject(userName: any){
            return this.http.get(ResourceURI.gUserProject+userName, httpOptions);
          }
          updateUser(usr: Registration ):Observable<any>{
            return this.http.put(ResourceURI.uUser,usr, httpOptions);
          // return  this.http.post(this.postAddDocUrl, formData, options)
          }

          deleteUser(usr: Registration ):Observable<any>{
            return this.http.delete(ResourceURI.dUser, httpOptions);
          // return  this.http.post(this.postAddDocUrl, formData, options)
          }

          getAllUser(userName){
            return this.http.get(ResourceURI.gUser+userName, httpOptions);
          }
          getAllCompanies(){
           const httpOptionsAuthG = {
              headers: new HttpHeaders({ 'Content-Type': 'application/json',
                                         'Authorization': 'Bearer ' +sessionStorage.getItem('vctoken')})
            };
            //this.vcheaders.append('Authorization', sessionStorage.getItem('vctoken'));
            return this.http.get(ResourceURI.gCompanies, httpOptionsAuthG);
          }
         
          addCompany(id){
            return this.http.get(ResourceURI.pCompany, httpOptions);
          }
          deleteCompany(id){
            return this.http.get(ResourceURI.dCompany, httpOptions);
          }
//1/Integrations
          public getIntegrations(compId){
            return this.http.get(ResourceURI.gIntegrataions + compId+ '/Integrations', httpOptions);
          }  
          public postIntegrations(cid){
            return this.http.get(ResourceURI.pIntegration + cid + '/Integrations', httpOptions);
          }  
          public getCompany(id){
          
            return this.http.get(ResourceURI.gCompany,httpOptions);
          }

          public postLeads(lead: MyLead, LeadId:any):Observable<any>{
            return this.http.put(ResourceURI.pLeads + LeadId, lead,httpOptions);
          }
          public getLocations(userName){
            return this.http.get(ResourceURI.gLocations + userName ,httpOptions);
            //return this.http.get(ResourceURI.gLocations + userName ,httpOptions);
          }
}

//https://angular.io/guide/form-validation
//https://loiane.com/2017/08/angular-reactive-forms-trigger-validation-on-submit/
