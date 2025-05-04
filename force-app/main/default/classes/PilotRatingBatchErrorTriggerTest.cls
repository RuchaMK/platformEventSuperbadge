@isTest
public class PilotRatingBatchErrorTriggerTest {
	@testSetup
    static void initdata(){
        
    }
    
    @isTest
    static void testPilotRatingBatchErrorTrigger(){
        Test.startTest();
        Database.SaveResult sr = EventBus.publish(new BatchApexErrorEvent());
        List< Error_Log__c > errorLogList = [Select Id, Name from Error_Log__c ];
        system.debug(errorLogList);
        Test.stopTest();
    }
}