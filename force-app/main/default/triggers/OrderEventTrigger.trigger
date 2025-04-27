trigger OrderEventTrigger on Order_Event__e (after insert) {
    List<Task> taskList = new List<Task>();
    for(Order_Event__e event : Trigger.new){
        if(event.Has_Shipped__c == true){
            Task task = new Task(Priority = 'Medium',
            Status = 'New',
            Subject = 'Follow up on shipped order ' + event.Order_Number__c, 
            OwnerId = event.CreatedById);
            taskList.add(task);
        }
    }

    if(taskList.size() > 0){
        insert taskList;
    }


}