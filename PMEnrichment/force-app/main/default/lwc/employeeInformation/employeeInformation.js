import { LightningElement, wire, track, api } from 'lwc';
import { getObjectInfo, getPicklistValues } from "lightning/uiObjectInfoApi";
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import PHONE_NUMBER_OBJECT from '@salesforce/schema/Phone_Number__c';
import USER_ADMIN_FIELD from '@salesforce/schema/Phone_Number__c.User_Admin__c';
import DIAL_PLAN_FIELD from '@salesforce/schema/Phone_Number__c.Dial_Plan__c';
import COLLABORATION_FIELD from '@salesforce/schema/Phone_Number__c.Collaboration__c';
import WEBINAR_FIELD from '@salesforce/schema/Phone_Number__c.Webinar__c';
import CALLING_RECORDING_FIELD from '@salesforce/schema/Phone_Number__c.Call_Recording__c';
import AUDIO_MINING_FIELD from '@salesforce/schema/Phone_Number__c.Audio_Mining__c';
import SCREEN_RECORDING_FIELD from '@salesforce/schema/Phone_Number__c.Screen_Recording__c';
import STORAGE_FIELD from '@salesforce/schema/Phone_Number__c.Storage__c';
import DEVICE_TYPE_FIELD from '@salesforce/schema/Phone_Number__c.Device_Type__c';
import DEVICE_ACCESSORIES_FIELD from '@salesforce/schema/Phone_Number__c.Device_Accessories__c';

import getRecords from '@salesforce/apex/EmployeeInformationController.getRecords';

export default class EmployeeInformation extends LightningElement {

    connectedCallback(){
        console.log("Connected callback chala");
        this.loadData();
    }

    @track data = [];
    @track callerOutbound;
    loadData(){
        getRecords().then((data,error) =>{
            if(data){
                console.log('Inside getrcords');
                this.data = data;
                this.callerOutbound = this.data.map(record => {
                    return {
                        label: record.Phone_Number__c,
                        value: record.Phone_Number__c
                    }
                });
            }
        });
    }

    @api recordId;

    eiRecordTypeId;
    @wire(getObjectInfo, { objectApiName: PHONE_NUMBER_OBJECT })
        results({ error, data }) {
            if (data) {
            this.eiRecordTypeId = data.defaultRecordTypeId;
            this.error = undefined;
            } else if (error) {
            console.error(`Unable to fetch record type id ${error}`);
            }
        }

    userAdmin;
    @wire(getPicklistValues, {recordTypeId: "$eiRecordTypeId", fieldApiName: USER_ADMIN_FIELD})
    userAdminOptions({error, data}){
        if (data) {
            this.userAdmin = data.values.map(plValue => {
                return {
                    label: plValue.label,
                    value: plValue.value
                };
            });
        } else if (error) {
            console.error('Error loading user admin options', error);
        }
    }
    
    dialPlan;
    @wire(getPicklistValues, {recordTypeId: "$eiRecordTypeId", fieldApiName: DIAL_PLAN_FIELD})
    dialPlanOptions({error, data}){
        if (data) {
            this.dialPlan = data.values.map(plValue => {
                return {
                    label: plValue.label,
                    value: plValue.value
                };
            });
        } else if (error) {
            console.error('Error loading dial plan options', error);
        }
    }

    collaboration;
    @wire(getPicklistValues, {recordTypeId: "$eiRecordTypeId", fieldApiName: COLLABORATION_FIELD})
    collaborationOptions({error, data}){
        if (data) {
            this.collaboration = data.values.map(plValue => {
                return {
                    label: plValue.label,
                    value: plValue.value
                };
            });
        } else if (error) {
            console.error('Error loadingcollaboration options', error);
        }
    }

    @track value = "Employee Info";
    tableOptions = [
        {label:"Employee Info", value:"Employee Info"},
        {label:"License Info", value:"License Info"},
        {label:"Device Info", value:"Device Info"},
        {label:"911 Info", value:"911 Info"},
        {label:"Full Table", value:"Full Table"},
    ];

    handleOptions(event){
        console.log('handle options clicked');
        this.value = event.target.value;
    }

    get checkEmployee(){
        return this.value == "Employee Info" || this.value == "Full Table"? true : false;
    }

    get checkLicense(){
        return this.value == "License Info" || this.value == "Full Table"? true : false;
    }

    get checkDevice(){
        return this.value == "Device Info" || this.value == "Full Table"? true : false;
    }

    get check911(){
        return this.value == "911 Info" || this.value == "Full Table"? true : false;
    }

    checkDuplicate(event){

        this.data.forEach(record => {
            if(record.Id != event.target.dataset.id && record.Extension__c == event.target.value){
                const event = ShowToastEvent({
                    title: "Duplicate Username",
                    message: "Please enter a unique username",
                    varaint: ""
                });
            }
        })
    }

    handleInput(event){
        if(event.target.name == 'Extension'){
            this.extension = event.target.value;
            this.data = this.data.map(record =>{
                if(record.Id == event.target.dataset.id){
                    return {...record, Extension__c: event.target.value};
                }
                return record;
            })
        }else if(event.target.name == 'User Name'){
            console.log('User Name');
            this.data = this.data.map(record =>{
                if(record.Id == event.target.dataset.id){
                    return {...record, User_Name__c: event.target.value};
                }
                return record;
            });
        }
        this.data.forEach(record => {
            if(record.Id == event.target.dataset.id){
                console.log(`Extension ${record.Extension__c} \nUser Name ${record.User_Name__c}`);
            }
        });
    }

    handleInput2(event){
        console.log('Handle input 2 name ', event.target.name);
    }

}