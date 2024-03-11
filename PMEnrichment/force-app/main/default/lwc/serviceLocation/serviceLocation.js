import { LightningElement, track,wire,api } from 'lwc';
import getRecords from '@salesforce/apex/ServiceLocationController.getRecords';
import { getObjectInfo, getPicklistValues } from "lightning/uiObjectInfoApi";
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import SERVICE_LOCATION_OBJECT from "@salesforce/schema/Service_Location__c";
import SHIPPING_LOCATION_FIELD from "@salesforce/schema/Service_Location__c.Shipping_Location__c";
import TIME_ZONE_FIELD from "@salesforce/schema/Service_Location__c.Time_Zone__c";
import NEW_CONSTRUCTION_FIELD from "@salesforce/schema/Service_Location__c.New_Construction__c";
import CUSTOM_MUSIC_FIELD from "@salesforce/schema/Service_Location__c.Custom_Music__c";
import updateRecords from '@salesforce/apex/ServiceLocationController.updateRecords';

export default class ServiceLocation extends LightningElement {
    
    @track data = [];
    @track recordsMap = {};
    @track draftValues = [];

    connectedCallback() {
        // Call your Apex method or perform any other initialization logic here
        console.log(`record id in order : ${this.recordId}`);
        this.loadData();
    }

    loadData(){
        getRecords({orderId: this.recordId}).then((result) => {
            this.data = [];
            this.data = result;
            //this.initializeMap(result);

            this.data = this.data.map(record => {
                return {...record, Expand: false, iconClass: 'icon-disable'};
            })

            this.data.forEach(record =>{
                
                this.value4 = record.Custom_Music__c;

                if(record.Shipping_Location__c === 'Different Address' || record.New_Construction__c === 'Yes')
                {
                    this.value1 = record.Shipping_Location__c;
                    this.value3 = record.New_Construction__c;
                    record.Expand = false;
                    record.iconClass = 'icon-enable';
                }
                else{
                    record.Expand = true;
                    record.iconClass = 'icon-disable';
                }
            })
            console.log('Inside loadData');
        }).catch((error) =>{
            console.error(`Error ${error}`);
        })
    }

    @api recordId; // The record Id passed from the Lightning Record Page

    initializeMap(data) {
        // Create a map using record Id as the key
        this.recordsMap = {};
        data.forEach(record => {
            this.recordsMap[record.Id] = { ...record };
        });
        // console.log(`Record map: ${JSON.stringify(this.recordsMap)}`);
    }

    //get record type id
    slRecordTypeId;
    @wire(getObjectInfo, { objectApiName: SERVICE_LOCATION_OBJECT })
        results({ error, data }) {
            if (data) {
            this.slRecordTypeId = data.defaultRecordTypeId;
            this.error = undefined;
            } else if (error) {
            console.error(`Unable to fetch record type id ${error}`);
            }
        }

    //get picklist values for shipping location picklist
    shippingOptions;
    @wire(getPicklistValues, { recordTypeId: "$slRecordTypeId", fieldApiName: SHIPPING_LOCATION_FIELD })
    shippingLocations({ error, data }){
        if (data) {
            this.shippingOptions = data.values.map(plValue => {
                return {
                    label: plValue.label,
                    value: plValue.value
                };
            });
        } else if (error) {
            console.error('Error loading shipping locations options', error);
        }

    };

    //get picklist values for time zone picklist
    constructionOptions;
    @wire(getPicklistValues, { recordTypeId: "$slRecordTypeId", fieldApiName: NEW_CONSTRUCTION_FIELD })
    newConstruction({ error, data }){
        if (data) {
            this.constructionOptions = data.values.map(plValue => {
                return {
                    label: plValue.label,
                    value: plValue.value
                };
            });
        } else if (error) {
            console.error('Error loading time zone options', error);
        }

    };

    //get picklist values for new construction picklist
    timezoneOptions;
    @wire(getPicklistValues, { recordTypeId: "$slRecordTypeId", fieldApiName: TIME_ZONE_FIELD })
    timeZones({ error, data }){
        if (data) {
            this.timezoneOptions = data.values.map(plValue => {
                return {
                    label: plValue.label,
                    value: plValue.value
                };
            });
        } else if (error) {
            console.error('Error loading time zone options', error);
        }

    };

    //get picklist values for new construction picklist
    customMusicOptions;
    @wire(getPicklistValues, { recordTypeId: "$slRecordTypeId", fieldApiName: CUSTOM_MUSIC_FIELD })
    customMusic({ error, data }){
        if (data) {
            this.customMusicOptions = data.values.map(plValue => {
                return {
                    label: plValue.label,
                    value: plValue.value
                };
            });
        } else if (error) {
            console.error('Error loading time zone options', error);
        }

    };

    value1 = 'inProgress';
    value2 = 'inProgress';
    value3 = 'inProgress';
    value4 = 'inProgress';

    handleChange(event) {
        // this.value1 = '';
        // this.value3 = '';
        console.log(`Picklist: ${event.target.name}`);
        if(event.target.name == 'shipping location'){
            this.value1 = event.detail.value;
            //const recId =event.target.data.id;
            //console.log('recId '+ recId);
            //alert('recId '+ recId);
            console.log(this.value1);
           // console.log(`Record id inside shipping location: ${event.target.data.id}`);

            // Fetch the div element by tag name (assuming there is only one div in your component)
            // var divElement = this.template.querySelector('lightning-combobox');

            // // Get the value of the 'data-custom-attribute' attribute
            // var customAttributeValue = divElement.getAttribute('data-record-id');

            // // Log the value to the console
            // console.log('Custom Attribute Value:', customAttributeValue);

            console.log('Event details:', event.target.dataset.id);

            this.data = this.data.map(record => {
                if(record.Id == event.target.dataset.id)
                {
                    return {...record, Shipping_Location__c: this.value1};
                }
                return record;
            });
            this.data.forEach(record => {
                console.log(`Data shipping location: ${record.Shipping_Location__c}`)
            })
            


        }else if(event.target.name == 'time zone'){
            this.value2 = event.detail.value;
            console.log(this.value2);

            console.log('Event details:', event.target.dataset.id);

            this.data = this.data.map(record => {
                if(record.Id == event.target.dataset.id)
                {
                    return {...record, Time_Zone__c: this.value2};
                }
                return record;
            });
            this.data.forEach(record => {
                console.log(`Data time zone: ${record.Time_Zone__c}`)
            })

        }else if(event.target.name == 'new construction'){
            this.value3 = event.detail.value;
            console.log(this.value3);

            this.data = this.data.map(record => {
                if(record.Id == event.target.dataset.id)
                {
                    return {...record, New_Construction__c: this.value3};
                }
                return record;
            });
            this.data.forEach(record => {
                console.log(`Data new construction: ${record.New_Construction__c}`)
            })
        }else if(event.target.name == 'Custom Music'){
            this.value4 = event.detail.value;
            console.log(this.value4);

            this.data = this.data.map(record => {
                if(record.Id == event.target.dataset.id)
                {
                    return {...record, Custom_Music__c: this.value4};
                }
                return record;
            });
            this.data.forEach(record => {
                console.log(`Data custom music: ${record.Custom_Music__c}`)
            })
        }

        this.data.forEach(record =>{
            if(record.Shipping_Location__c === 'Different Address' || record.New_Construction__c === 'Yes')
                {
                    record.Expand = false;
                    record.iconClass = 'icon-enable';
                }
                else{
                    record.Expand = true;
                    record.iconClass = 'icon-disable';
                }
            
            if(record.Id == event.target.dataset.id)
            {
                this.value1 = record.Shipping_Location__c;
                this.value3 = record.New_Construction__c;
            }
        })

        // if(this.value1 === 'Different Address' || this.value3 === 'Yes')
        // {
        //     this.disableExpand = false;
        // }
        // else{
        //     this.disableExpand = true;
        // }
    }

    //control expand modal
    @track disableExpand = true;
    @track openModal = false;
    modalRecordId;

    handleExpand(event){
        if(this.openModal == false)
        {
            this.openModal = true;
            console.log(`Open modal status ${this.openModal}`);

            this.modalRecordId = event.currentTarget.dataset.value;
            this.data.forEach(record => {
                if(record.Id == this.modalRecordId){
                    this.constructValue = record.Construction_Details__c;
                    this.street = record.Shipping_Address_Street__c;
                    this.city = record.Shipping_Address_City__c;
                    this.province = record.Shipping_Address_Province__c;
                    this.country = record.Shipping_Address_Country__c;
                    this.postalcode = record.Shipping_Address_Postal_Code__c;
                }
            })
        }else if(this.openModal == true)
        {
            this.openModal = false;
        }
    }

    @track constructValue;
    handleTextChange(event){
        console.log(`Record id: ${this.modalRecordId}`);
        console.log(`Record id: ${event.target.value}`);

        this.constructValue = event.target.value;
        
    }

    @track street;
    @track city;
    @track province;
    @track postalcode;
    @track country;
    handleAddress(event){
        this.street = event.target.street;
        this.city = event.target.city;
        this.country = event.target.country;
        this.province = event.target.province;
        this.postalcode = event.target.postalCode;
        console.log(`Address ${this.street} ${this.city} ${this.province} ${this.country} ${this.postalcode}`);
    }

    handleSaveExpand(){
        this.data = this.data.map(record => {
            if(record.Id == this.modalRecordId)
            {
                return {...record, Construction_Details__c: this.constructValue,
                    Shipping_Address_Street__c: this.street, Shipping_Address_City__c: this.city,
                    Shipping_Address_Province__c: this.province, Shipping_Address_Country__c: this.country,
                    Shipping_Address_Postal_Code__c: this.postalcode};
            }
            return record;
        });
        this.data.forEach(record => {
            if(record.Id == this.modalRecordId)
            {
                console.log(`Data construction details: ${record.Construction_Details__c}`);
                console.log(`Data Address ${record.Shipping_Address_Street__c} 
                ${record.Shipping_Address_City__c} ${record.Shipping_Address_Province__c} 
                ${record.Shipping_Address_Country__c} ${record.Shipping_Address_Postal_Code__c}`);
            }
        })
        this.openModal = false;
    }

    
    get getShipping(){
        return this.value1 === 'Different Address'? true : false;
    }

    get getConstruction(){
        return this.value3 === 'Yes'? true : false;
    }

    get musicMessage(){
        return this.value4 === 'Yes'? true : false;
    }

    handleSave(){
        console.log('Handle Save called');
        updateRecords({slData: this.data}).then((result) => {
            console.log("success");
            //this.data = [];
            const tevent = new ShowToastEvent({
                title: 'Success',
                message: 'Record has been created successfully',
                variant: 'success'
            });
            this.dispatchEvent(tevent);
        }).catch((error) =>{
            console.error(`Error ${error}`);
            const tevent = new ShowToastEvent({
                title: 'Error',
                message: `An error occured when trying to save record. Error: ${error}`,
                variant: 'error'
            });
            this.dispatchEvent(tevent);
        })
        //this.loadData();
    }

    handleCancel(){
        this.data = [];
        this.loadData();
    }


    @track sortBy;
    @track sortDirection;
    get sortByName() {
        return this.sortBy === 'Name';
    }

    get sortIconName() {
        return this.sortDirection === 'asc' ? 'utility:arrowup' : 'utility:arrowdown';
    }

    handleSort(event){
        console.log('Sorting ', event.target.dataset.column);
        const column = event.target.dataset.column;

        if(column == this.sortBy){
            this.data.reverse();
            this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
        }else{
            this.data.sort((a,b) =>  (a[column] > b[column] ? 1 : -1));
            this.sortBy = column;
            this.sortDirection = 'asc';
        }
    }
}