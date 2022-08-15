public with sharing class TaskSelectedController {

   @AuraEnabled(cacheable = true)
    public static List<Training_Task__c> getRelatedTask(Id programId){
        try {
            Program__c prog = [
                                SELECT Id, Team_Category__c
                                FROM Program__c
                                WHERE Id = :programId];
                        return [
                                SELECT Id, Name, Team_Category__c
                                FROM Training_Task__c
                                WHERE Team_Category__c  includes(:prog.Team_Category__c)];
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    @AuraEnabled
    public static List<Task_Assignment__c> assignSelectedTaskToProgram(List<Id> taskIn, Id programId ){

     // List<Task_Assignment__c> listOfTasks = [SELECT Id, Name 
     //                                       FROM Task_Assignment__c 
     //                                       WHERE Id =:programId];
                        
        try {
            List<Task_Assignment__c> taskInProgram = new List<Task_Assignment__c>();
                for(Id tlist : taskIn) {
                    Task_Assignment__c taskInpro = new Task_Assignment__c();
                    taskInpro.Program__c  = programId;
                    taskInpro.Training_Task__c = tlist;
                    taskInProgram.add(taskInpro);
                }
            insert taskInProgram;
            return taskInProgram;
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    @AuraEnabled(Cacheable = true)
    public static list<Training_Task__c> retriveTasks(String taskName) {
        taskName = '%' + taskName + '%';
        list<Training_Task__c> lstTask = [SELECT  Id, Name, Team_Category__c 
                                            FROM Training_Task__c
                                            WHERE Name LIKE :taskName];

        if(lstTask.isEmpty()) {
            throw new AuraHandledException('No Record Found..');
        }
        return lstTask; 
        
    }
} 

