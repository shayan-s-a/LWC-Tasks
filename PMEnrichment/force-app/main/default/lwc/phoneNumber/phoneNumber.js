import { LightningElement, api, track, wire } from 'lwc';
import { getObjectInfo, getPicklistValues } from "lightning/uiObjectInfoApi";
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import getRecord from '@salesforce/apex/PhoneNumberController.getRecords';
import saveRecord from '@salesforce/apex/PhoneNumberController.saveRecord';
import deleteRecord from '@salesforce/apex/PhoneNumberController.deleteRecord';
import updateRecord from '@salesforce/apex/PhoneNumberController.updateRecord';
import PHONE_NUMBER_OBJECT from '@salesforce/schema/Phone_Number__c';
import CUSTOMIZED_EXTENSION_FIELD from '@salesforce/schema/Phone_Number__c.Do_you_need_customized_extension__c';
import EXTENSION_LENGTH_FIELD from '@salesforce/schema/Phone_Number__c.Select_Extension_Length__c';
import NUMBER_USE_FIELD from '@salesforce/schema/Phone_Number__c.Number_Use__c';

export default class PhoneNumber extends LightningElement {

    data = [];
    connectedCallback(){
        console.log('connected callback');
        this.loadData();
    }

    loadData(){
        getRecord().then((data,error) =>{
            this.data = data;
            this.data = this.data.map(record =>{
                return {...record, Checked: false};
            })
            console.log(`Data IN PHONE NUMBER ${JSON.stringify(this.data)}`)
        })
    }

    @api recordId; // The record Id passed from the Lightning Record Page

    pnRecordTypeId;
    @wire(getObjectInfo, { objectApiName: PHONE_NUMBER_OBJECT })
        results({ error, data }) {
            if (data) {
            this.pnRecordTypeId = data.defaultRecordTypeId;
            this.error = undefined;
            } else if (error) {
            console.error(`Unable to fetch record type id ${error}`);
            }
        }
    
    //get picklist values for customized extension picklist
    customizedExtenstionOptions;
    @wire(getPicklistValues, { recordTypeId: "$pnRecordTypeId", fieldApiName: CUSTOMIZED_EXTENSION_FIELD })
    customizedExtenstion({ error, data }){
        if (data) {
            this.customizedExtenstionOptions = data.values.map(plValue => {
                return {
                    label: plValue.label,
                    value: plValue.value
                };
            });
        } else if (error) {
            console.error('Error loading customized extension options', error);
        }

    };

    //get picklist values for extension length picklist
    extenstionLengthOptions;
    @wire(getPicklistValues, { recordTypeId: "$pnRecordTypeId", fieldApiName: EXTENSION_LENGTH_FIELD })
    extenstionLength({ error, data }){
        if (data) {
            this.extenstionLengthOptions = data.values.map(plValue => {
                return {
                    label: plValue.label,
                    value: plValue.value
                };
            });
        } else if (error) {
            console.error('Error loading extension length options', error);
        }

    };

    //get picklist values for extension length picklist
    numberUseOptions;
    @wire(getPicklistValues, { recordTypeId: "$pnRecordTypeId", fieldApiName: NUMBER_USE_FIELD })
    numberUse({ error, data }){
        if (data) {
            this.numberUseOptions = data.values.map(plValue => {
                return {
                    label: plValue.label,
                    value: plValue.value
                };
            });
        } else if (error) {
            console.error('Error loading number use options', error);
        }

    };

    showError = false;

    validatePhoneNumber(){
        const regex = "/^[0]{1}[3]{1}[0-9]{2}-[0-9]{7}$/";
        this.showError = !regex.test(this.phoneNumber);
    }

    handleInput(event){
        
        console.log('record id ', event.target.dataset.id);
        this.data = this.data.map(record => {
            if(record.Id == event.target.dataset.id)
            {
                if(event.target.name == 'current carrier'){
                    console.log(`reocrdsafaf ${record.Id}`);
                    return {...record, Current_Carrier__c: event.target.value};
                }
                else if(event.target.name == 'voip qualification'){
                    console.log(`reocrdsafaf ${record.Id}`);
                    return {...record, Voip_Qualification__c: event.target.value};
                }
            }
            return record;
        })
    }

    handleNumberUse(event){
        console.log('handle number use ', event.target.dataset.id);

        this.data = this.data.map(record =>{
            if(record.Id == event.target.dataset.id)
            {
                return {...record, Number_Use__c: event.detail.value};
            }
            return record;
            
        });

        this.data.forEach(record =>{
            console.log(`Record ${record.Number_Use__c}`);
        })
    }

    @track customExtension;
    @track extensionLen;
    handleExtension(event){
        if(event.target.name == 'customized extension'){
            this.customExtension = event.target.value;
            console.log('Customized extension: ', this.customExtension);
        }else if(event.target.name == 'extension length'){
            this.extensionLen = event.target.value;
            console.log('extension length: ', this.extensionLen);
        }
    }


    @track selectedRecord = [];
    @track allChecked = false;
    
    get delCheck(){
        return this.selectedRecord.length != 0 ? true: false;
    }

    handleSelectAll(event){
        console.log('hanlde select all checked ', event.target.checked);
        this.allChecked = event.target.checked;

        if(this.allChecked){
            this.selectedRecord = this.data.map(record => record.Id);
            
        } else{
            this.selectedRecord = [];
        }
        this.data.forEach(record => {
            record.Checked = this.allChecked;
            console.log('Checked status for record ', record.Checked);
        })
    }

    handleCheckBox(event){
        this.allChecked = false;
        console.log('handle check box ',event.target.checked);
        const value = event.target.value;
        if(event.target.checked){
            this.selectedRecord.push(value);
        } else{
            this.selectedRecord = this.selectedRecord.filter(id => id !== value)
        }

        this.selectedRecord.forEach(record =>{
            console.log('Single selected record: ', record);
        })
    }

    handleDelete(){
        console.log('handleDelete clicked');
        deleteRecord({selectedrecord: this.selectedRecord}).then((data1,error) =>{
            if(data1){
                console.log('Apex result: ', data1);
                
                const event = new ShowToastEvent({
                    title: 'Success',
                    message: 'Record deleted successfully',
                    variant: 'success'
                });
                this.dispatchEvent(event);

                this.data = [];
                this.selectedRecord = [];
                this.loadData();
            }
            else if(error){
                const event = new ShowToastEvent({
                    title: 'Error',
                    message: 'An error occured when deleting record',
                    variant: 'error'
                });
                this.dispatchEvent(event);
            }
        })
    }

    @track phoneNumber;
    @track currentCarrier;
    @track voipQual;
    @track numUse;
    newRecord = [];

    handleAddNumber(event){
        if(event.target.name == 'phone number'){
            if(!this.showError){
                this.phoneNumber = event.target.value;
                this.newRecord['Phone_Number__c'] = this.phoneNumber;
                console.log('Phone Number: ', this.phoneNumber);
            }
        }
        else if(event.target.name == 'current carrier'){
            this.currentCarrier = event.target.value;
            this.newRecord['Current_Carrier__c'] = this.currentCarrier;
            console.log('Current Carrier: ', this.currentCarrier);
        }
        else if(event.target.name == 'voip qualification'){
            this.voipQual = event.target.value;
            this.newRecord['Voip_Qualification__c'] = this.voipQual;
            console.log('VOIP Qualification: ', this.voipQual);
        }
        else if(event.target.name == 'number use'){
            this.numUse = event.target.value;
            this.newRecord['Number_Use__c'] = this.numUse;
            console.log('Number use: ', this.numUse);
        }
    }

    handleAdd(){
        console.log('handleAdd clicked');

        if(this.phoneNumber != null && this.currentCarrier != null && this.voipQual != null && this.numUse != null && this.customExtension != null && this.extensionLen != null &&
            this.phoneNumber != '' && this.currentCarrier != '' && this.voipQual != '' && this.numUse != ''){
            this.newRecord['Do_you_need_customized_extension__c'] = this.customExtension;
            this.newRecord['Select_Extension_Length__c'] = this.extensionLen;

            console.log('newrecord type: ', typeof this.newRecord);

            console.log(`Final record ${this.newRecord['Phone_Number__c']} ${this.newRecord['Current_Carrier__c']} ${this.newRecord['Voip_Qualification__c']} ${this.newRecord['Number_Use__c']} ${this.newRecord['Do_you_need_customized_extension__c']} ${this.newRecord['Select_Extension_Length__c']}`);
            // saveRecord({newrecord: this.newRecord}).then((data1,error) => {
            //     if(data1){
            //         console.log('Apex result: ', data1);
                    
            //         const event = new ShowToastEvent({
            //             title: 'Success',
            //             message: 'New record added',
            //             variant: 'success'
            //         });
            //         this.dispatchEvent(event);

            //         this.data = [];
            //         this.loadData();
            //     }
            //     else if(error){
            //         const event = new ShowToastEvent({
            //             title: 'Error',
            //             message: 'An error occured when saving data',
            //             variant: 'error'
            //         });
            //         this.dispatchEvent(event);
            //     }
            // });

            saveRecord({phonenumber: this.phoneNumber, currentcarrier: this.currentCarrier, voipqual: this.voipQual, numberuse: this.numUse,
                customext: this.customExtension, extensionlen: this.extensionLen}).then((data1,error) => {
                if(data1){
                    console.log('Apex result: ', data1);
                    
                    const event = new ShowToastEvent({
                        title: 'Success',
                        message: 'New record added',
                        variant: 'success'
                    });
                    this.dispatchEvent(event);

                    this.data = [];
                    this.phoneNumber = null;
                    this.currentCarrier = null;
                    this.voipQual = null;
                    this.numUse = null;

                    this.customExtension = null;
                    this.extensionLen = null;

                    this.loadData();
                }
                else if(error){
                    const event = new ShowToastEvent({
                        title: 'Error',
                        message: 'An error occured when saving data',
                        variant: 'error'
                    });
                    this.dispatchEvent(event);
                }
            });
            

        }
        else if(this.customExtension == null || this.extensionLen == null){
            const event = new ShowToastEvent({
                title: 'Custom Extension & Extension Length missing',
                message: 'Please enter custom extension & extension length',
                variant: 'error'
            });
            this.dispatchEvent(event);
        }
        else{
            const event = new ShowToastEvent({
                title: 'Field value(s) missing',
                message: 'Please enter all values in the fields',
                variant: 'error'
            });
            this.dispatchEvent(event);
        }
    }

    handleSave(){
        console.log('handle save clicked');
        if(this.customExtension != null || this.extensionLen != null){
            this.data = this.data.map(record =>{
                return {...record,Do_you_need_customized_extension__c: this.customExtension, Select_Extension_Length__c: this.extensionLen}
            });

            updateRecord({modifiedrecord: this.data}).then((data1,error) => {
                if(data1){
                    const event = new ShowToastEvent({
                        title: 'Success',
                        message: 'New record added',
                        variant: 'success'
                    });
                    this.dispatchEvent(event);

                    this.data = [];
                    this.phoneNumber = '';
                    this.currentCarrier = '';
                    this.voipQual = '';
                    this.numUse = '';

                    this.customExtension = null;
                    this.extensionLen = null;

                    this.loadData();
                }
            })
        }
        else{
            const event = new ShowToastEvent({
                title: 'Custom Extension & Extension Length missing',
                message: 'Please enter custom extension & extension length',
                variant: 'error'
            });
            this.dispatchEvent(event);
        }
    }

    handleCancel(){
        console.log('handle cancel clicked');

        this.data = [];
        this.customExtension = null;
        this.extensionLen = null;

        this.loadData();

    }
}