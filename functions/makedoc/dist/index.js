export default async function execute(event, context, logger) {
    logger.info(`Invoking Makeprecontractdoc with payload ${JSON.stringify(event.data || {})}`);
    const offerID__c = event.data.offerId;
    const referenceTable = new Map();
    const uow = context.org.dataApi.newUnitOfWork();
    const quote = {
        type: 'Quote__c',
        fields: {
            offerID__c: 'test',
            Origin__c: 'Web',
        }
    };
    try {
        const { id: recordId } = await context.org.dataApi.create(quote);
        const soql = /*sql*/ `SELECT offerID__c from Quote__c WHERE Id = ${recordId}`;
        const res = await context.org.dataApi.query(soql);
        return res;
    }
    catch (error) {
        logger.error(error.message);
        throw new Error(error.message);
    }
}
//# sourceMappingURL=index.js.map