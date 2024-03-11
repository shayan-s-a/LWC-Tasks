import { LightningElement,api,track } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import saveRecord from '@salesforce/apex/MultipleContactsController.saveRecord';
import { RefreshEvent } from 'lightning/refresh';

export default class AddMultipleContacts extends LightningElement {

    @api recordId;
    @track contactList = [];

    connectedCallback(){
        this.contactList.push({id: Math.floor(Math.random() * 1000000), AccountId: this.recordId});
    }

    checkBlank(){
        let isBlank = false;
        this.contactList.forEach(record => {
            if(!record.FirstName || !record.LastName || !record.Email || !record.Birthdate)
            {
                console.log('Blank field found in checkblank');
                isBlank = true;
            }
        });
        return isBlank;
    }

    handleSave(){
        console.log('Handle save clicked ', this.recordId);

        if(!this.checkBlank()){
            console.log('No Blank field found');
            this.contactList = this.contactList.map(record => {
                return {...record,AccountId: this.recordId};
            });

            this.contactList.forEach(record => {
                delete record['id'];
            });

            saveRecord({conList: this.contactList}).then((result) =>{
                console.log(`Final result ${result}`);
                    const event = new ShowToastEvent({
                        title: "Success",
                        message: "Contacts have been created successfully",
                        variant: "success"
                    });
                    this.dispatchEvent(event);
                
            }).catch((error) =>{
                console.error(`Error ${error}`);
                const tevent = new ShowToastEvent({
                    title: 'Error',
                    message: `An error occured when trying to save record. Error: ${error.value}`,
                    variant: 'error'
                });
                this.dispatchEvent(tevent);
            });
            this.dispatchEvent(new RefreshEvent());
        }
        else{
            console.log('Blank field found');
            const event = new ShowToastEvent({
                title: "Blank Field Found",
                message: "Please make sure all fields are populated",
                variant: "error"
            });
            this.dispatchEvent(event);
        }

        this.contactList.forEach(record => {
            console.log(`Record: ${record.FirstName} ${record.LastName} ${record.Email} ${record.Birthdate} ${record.AccountId}`);
        })
    }

    handleAdd(){
        console.log('Handle add clicked');
        this.contactList.push({id: Math.floor(Math.random() * 1000000), AccountId: this.recordId});
        
    }

    handleDelete(event){
        console.log('Handle delete clicked ', event.target.dataset.id);
        if(this.contactList.length > 1){
            this.contactList = this.contactList.filter(record => record.id !=  event.target.dataset.id);
        }
        
    }

    @track fName;
    @track lName;
    @track email;
    @track dob;
    handleInput(event){
        if(event.target.name == 'firstName'){
            this.fName =  event.target.value;
            console.log('First Name ', this.fName);
        }else if(event.target.name == 'lastName'){
            this.lName =  event.target.value;
            console.log('Last Name ', this.lName);
        }else if(event.target.name == 'email'){
            this.email =  event.target.value;
            console.log('Email ', this.email);
        }else if(event.target.name == 'date'){
            this.dob =  event.target.value;
            console.log('Date of Birth ', this.dob);
        }
    }

    handleValue(event){
        console.log('Data id: ', event.target.dataset.id);
        console.log('Handle value called ', event.target.value);

        this.contactList = this.contactList.map(record =>{
            if(event.target.dataset.id == record.id){
                if(event.target.name == 'firstName'){
                    return{...record, FirstName: this.fName};
                }else if(event.target.name == 'lastName'){
                    return{...record, LastName: this.lName};
                }else if(event.target.name == 'email'){
                    return{...record, Email: this.email};
                }else if(event.target.name == 'date'){
                    return{...record, Birthdate: this.dob};
                }
            }
            return record;
        });

        this.contactList.forEach(record => {
            if(event.target.dataset.id == record.id){
                console.log(`Record: ${record.FirstName} ${record.LastName} ${record.Email} ${record.Birthdate}`);
            }
        })
    }
}