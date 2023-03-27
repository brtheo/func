import { InvocationEvent, Context, Logger, RecordQueryResult, ReferenceId } from "@heroku/sf-fx-runtime-nodejs";
/**
 * Describe Makeprecontractdoc here.
 *
 * The exported method is the entry point for your code when the function is invoked.
 *
 * Following parameters are pre-configured and provided to your function on execution:
 * @param event: representative of the data associated with the occurrence of an event,
 * and supporting metadata about the source of that occurrence.
 * @param context: represents the connection to the the execution environment and the Customer 360 instance that
 * the function is associated with.
 * @param logger: represents the logging functionality to log given messages at various levels
 */

type Id = string

 export default async function execute(event: InvocationEvent<any>, context: Context, logger: Logger): Promise<RecordQueryResult> {
    logger.info(`Invoking Makeprecontractdoc with payload ${JSON.stringify(event.data || {})}`);

    const offerID__c = event.data.offerId
    const referenceTable = new Map<string,ReferenceId>();
    const uow = context.org.dataApi.newUnitOfWork();

    const quote ={
        type:'quote__c',
        fields: {
            offerID__c: 'test',
            Origin__c : 'Web',
        }
    }
    try {
        const { id: recordId} = await context.org.dataApi.create(quote);
        const soql = `SELECT offerID__c from quote__c WHERE Id = '${recordId}'`;
        const res = await context.org.dataApi.query(soql);
        return res;
    } catch (error) {
        logger.error(error.message);
        throw new Error(error.message);
    }


}
