import { LightningElement, track,api} from 'lwc';

export default class PmEnrichmentMain extends LightningElement {
    
    selectedTab = "tab1";
    dropdown = true;

    @api recordId;
    handleDropdown()
    {
        this.dropdown? this.dropdown = false : this.dropdown = true;
    }

    get dropdownClass(){
        return this.dropdown? "slds-dropdown-trigger slds-dropdown-trigger_click slds-is-close" : "slds-dropdown-trigger slds-dropdown-trigger_click slds-is-open"
    }

    get tab1Class(){
        return this.selectedTab === "tab1"? "slds-tabs_default__item slds-is-active" : "slds-tabs_default__item";
    }

    get tab2Class(){
        return this.selectedTab === "tab2"? "slds-tabs_default__item slds-is-active" : "slds-tabs_default__item";
    }

    get tab3Class(){
        return this.selectedTab === "tab3"? "slds-tabs_default__item slds-is-active" : "slds-tabs_default__item";
    }

    get tab4Class(){
        return this.selectedTab === "tab4"? "slds-tabs_default__item slds-is-active" : "slds-tabs_default__item";
    }

    get tab5Class(){
        return this.selectedTab === "tab5"? "slds-tabs_default__item slds-is-active" : "slds-tabs_default__item";
    }

    get tab6Class(){
        return this.selectedTab === "tab6"? "slds-tabs_default__item slds-is-active" : "slds-tabs_default__item";
    }

    // get tab7Class(){
    //     return this.selectedTab === "tab7"? "slds-tabs_default__item slds-is-active" : "slds-tabs_default__item";
    // }

    // get tab8Class(){
    //     return this.selectedTab === "tab8"? "slds-tabs_default__item slds-is-active" : "slds-tabs_default__item";
    // }


    get tab1Selected(){
        return this.selectedTab === "tab1";
    }

    get tab2Selected(){
        return this.selectedTab === "tab2";
    }

    get tab3Selected(){
        return this.selectedTab === "tab3";
    }

    get tab4Selected(){
        return this.selectedTab === "tab4";
    }

    get tab5Selected(){
        return this.selectedTab === "tab5";
    }

    get tab6Selected(){
        return this.selectedTab === "tab6";
    }

    get tab7Selected(){
        return this.selectedTab === "tab7";
    }

    get tab8Selected(){
        return this.selectedTab === "tab8";
    }

    handleSelectedTab(event){
        console.log(event.currentTarget.dataset.tab);
        if(event.currentTarget.dataset.tab == "tab7" ||event.currentTarget.dataset.tab == "tab8"){
            this.handleDropdown();
        }
        this.selectedTab = event.currentTarget.dataset.tab;
    }
}