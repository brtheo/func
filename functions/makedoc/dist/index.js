export default async function execute(event, context, logger) {
    logger.info(`Invoking Makeprecontractdoc with payload ${JSON.stringify(event.data || {})}`);
    const data = 'JVBERi0xLjcKCjEgMCBvYmogICUgZW50cnkgcG9pbnQKPDwKICAvVHlwZSAvQ2F0YWxvZwog' +
        'IC9QYWdlcyAyIDAgUgo+PgplbmRvYmoKCjIgMCBvYmoKPDwKICAvVHlwZSAvUGFnZXMKICAv' +
        'TWVkaWFCb3ggWyAwIDAgMjAwIDIwMCBdCiAgL0NvdW50IDEKICAvS2lkcyBbIDMgMCBSIF0K' +
        'Pj4KZW5kb2JqCgozIDAgb2JqCjw8CiAgL1R5cGUgL1BhZ2UKICAvUGFyZW50IDIgMCBSCiAg' +
        'L1Jlc291cmNlcyA8PAogICAgL0ZvbnQgPDwKICAgICAgL0YxIDQgMCBSIAogICAgPj4KICA+' +
        'PgogIC9Db250ZW50cyA1IDAgUgo+PgplbmRvYmoKCjQgMCBvYmoKPDwKICAvVHlwZSAvRm9u' +
        'dAogIC9TdWJ0eXBlIC9UeXBlMQogIC9CYXNlRm9udCAvVGltZXMtUm9tYW4KPj4KZW5kb2Jq' +
        'Cgo1IDAgb2JqICAlIHBhZ2UgY29udGVudAo8PAogIC9MZW5ndGggNDQKPj4Kc3RyZWFtCkJU' +
        'CjcwIDUwIFRECi9GMSAxMiBUZgooSGVsbG8sIHdvcmxkISkgVGoKRVQKZW5kc3RyZWFtCmVu' +
        'ZG9iagoKeHJlZgowIDYKMDAwMDAwMDAwMCA2NTUzNSBmIAowMDAwMDAwMDEwIDAwMDAwIG4g' +
        'CjAwMDAwMDAwNzkgMDAwMDAgbiAKMDAwMDAwMDE3MyAwMDAwMCBuIAowMDAwMDAwMzAxIDAw' +
        'MDAwIG4gCjAwMDAwMDAzODAgMDAwMDAgbiAKdHJhaWxlcgo8PAogIC9TaXplIDYKICAvUm9v' +
        'dCAxIDAgUgo+PgpzdGFydHhyZWYKNDkyCiUlRU9G';
    const { quoteId } = event.data;
    let ret;
    let docId;
    const doc = {
        type: 'ContentVersion',
        fields: {
            VersionData: data,
            PathOnClient: 'test2.PDF',
            Title: 'test'
        }
    };
    try {
        docId = (await context.org.dataApi.create(doc)).id;
        const soql = `SELECT ContentDocumentId from ContentVersion WHERE id = '${docId}'`;
        const res = await context.org.dataApi.query(soql);
        const { ContentDocumentId } = res.records[0].fields;
        const DocLink = {
            type: 'ContentDocumentLink',
            fields: {
                ContentDocumentId,
                LinkedEntityId: quoteId,
                ShareType: 'V'
            }
        };
        const docLinkId = (await context.org.dataApi.create(DocLink)).id;
        ret = await context.org.dataApi.query(`SELECT id, LinkedEntityId FROM ContentDocumentLink WHERE Id = '${docLinkId}'`);
    }
    catch (err) {
        logger.error(err);
    }
    return ret;
}
//# sourceMappingURL=index.js.map