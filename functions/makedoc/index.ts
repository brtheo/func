import { InvocationEvent, Context, Logger, RecordQueryResult } from "@heroku/sf-fx-runtime-nodejs";
import {PDFDocument} from 'pdf-lib';
import fs from 'fs';
import { PDFTextField } from "pdf-lib/cjs/api";

type ValWithPDFTextField = [string, PDFTextField]
type MakeDocPayload = {
    quoteId: string,
    vars: string[]
}

 export default async function execute(event: InvocationEvent<MakeDocPayload>, context: Context, logger: Logger): Promise<RecordQueryResult> {
    logger.info(`Invoking Makeprecontractdoc with payload ${JSON.stringify(event.data || {})}`);

    const FILE_PATH = 'templates/Template_Contrat_LLD_VCG.pdf';

    const uint8Array = fs.readFileSync(FILE_PATH);
    const pdfDoc = await PDFDocument.load(uint8Array);

    const form = pdfDoc.getForm();
    const fields = form.getFields();
    const textFields = fields.map(field => form.getTextField(field.getName()));

    // const vars = new Map<string, string>(Object.entries(event.data.vars));

    const varsMap = await makeVarsMap(event.data, context)
    const templatedResults = new Map<string, ValWithPDFTextField>();
    for( const [varname,val] of varsMap) {
        const field = textFields.find(field => field.getName() === varname);
        field.setText(val);
        templatedResults.set(varname, [val, field]);
    }

    const pdfBytes = await pdfDoc.saveAsBase64();
     
    
    
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
                'dCAxIDAgUgo+PgpzdGFydHhyZWYKNDkyCiUlRU9G'

    const {quoteId} = event.data

    let ret;
    let docId: string;
    const doc = {
        type: 'ContentVersion', 
        fields: {
            VersionData: pdfBytes,
			PathOnClient: 'test3.PDF',
			Title: 'test'
        }
    }
    try {
        docId = (await context.org.dataApi.create(doc)).id;
        const soql = `SELECT ContentDocumentId from ContentVersion WHERE id = '${docId}'`; 
        const res = await context.org.dataApi.query(soql);
        const {ContentDocumentId} = res.records[0].fields;
        const DocLink = {
            type: 'ContentDocumentLink',
            fields: {
                ContentDocumentId,
				LinkedEntityId: quoteId,
				ShareType: 'V'
            }
        }
        const docLinkId = (await context.org.dataApi.create(DocLink)).id;
        ret = await context.org.dataApi.query(
            `SELECT id, LinkedEntityId FROM ContentDocumentLink WHERE Id = '${docLinkId}'`
        );
    } catch(err) {
        logger.error(err)
    }
    
    return ret;


}

async function makeVarsMap({vars, quoteId}: MakeDocPayload, context: Context) {
    const mapping =  {
        "SLF_PAR_MADAT": "noContrat__c",
        "SLF_PAR_BIRTHDATE":  "birthdate__c",
        "SLF_PAR_BIRTHPLACE": "birthplace__c",
        "SLF_PAR_ADDR":  "address__c",
        "SLF_PAR_MAIL": "emailaddress__c",
        "SLF_PAR_TEL":  "phonenumber__c",
        "SLF_FUG_NAME": "fundedgoodname__c",
        "SLF_FUG_NUM":  "fundedgoodnumber__c"
    }
    const m = new Map<string,string>(Object.entries(mapping))
    const reversedMap = new Map<string,string>()
    for( const [k,v] of m) {
        reversedMap.set(v,k)
    }
    const soql = `SELECT ${vars.map(varName => m.get(varName)).join(',')} from Quote__c WHERE id = '${quoteId}'`; 
    const res = await context.org.dataApi.query(soql);
    const {fields} = res.records[0];
    
    return new Map<string, unknown>(
        Object.values(mapping).map(v => [
            reversedMap.get(v),
            fields[v]
         ])
    );
}
