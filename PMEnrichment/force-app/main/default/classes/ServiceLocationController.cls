public with sharing class ServiceLocationController {

    @AuraEnabled(cacheable=true)
    public static List<Service_Location__c> getRecords(String orderId)
    {
        return [SELECT Id,Name, Location_Address__Street__s,Location_Address__City__s, Location_Address__CountryCode__s, Location_Address__PostalCode__s, Shipping_Location__c, Time_Zone__c, 
                New_Construction__c, Contact_Name__c, Contact_Email__c, Contact_Phone__c, Caller_ID_Name__c,
               Custom_Music__c FROM Service_Location__c WHERE Order__r.Id =: orderId];
    }
}