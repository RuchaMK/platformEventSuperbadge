trigger PilotRatingBatchErrorTrigger on BatchApexErrorEvent (after insert) {
    List< Error_Log__c > errorLogList = new List< Error_Log__c >();
    
    for(BatchApexErrorEvent evt: Trigger.new){
        Error_Log__c errorLog = new Error_Log__c();
        errorLog.Async_Apex_Job_Id__c = evt.AsyncApexJobId;
        errorLog.Message__c = evt.Message;
        errorLog.Job_Scope__c = evt.JobScope;
        errorLog.Name = 'PilotRatingBatchError';
        errorLogList.add(errorLog);
        
    }
    
    if(!errorLogList.isEmpty()){
        insert errorLogList;
    }
    

}