import { DocumentService } from "@app/document/document.service";
import { User } from "@app/user/entity/user.entity";
import * as fs from "fs";
import * as PdfPrinter from "pdfmake";
var converter = require('number-to-words');

export function generatePDF(user: User, document: any): { file_name: string; } {

    const fonts = {
        Times: {
            normal: 'Times-Roman',
            bold: 'Times-Bold',
            italics: 'Times-Italic',
            bolditalics: 'Times-BoldItalic'
          }
    };
    const printer = new PdfPrinter(fonts);

    const doc = document.content

    // const firstName = "Joe"
    // const lastName = "Sample"

    // const street = "One Main Street"
    // const apartment = ""
    // const city = "Raleigh"
    // const state = "North Carolina"
    // const zip = "02754"

    // let isMarried = "yes"
    // const spouse = "Mary Sample"
    // const spouseBeneficiary = "Residual Estate"

    // let haveChildren = "yes"
    // const numberOfChildren = "3"
    // let childInfo = [
    //     {
    //         childLastName: "Prezime",
    //         childFirstName: "Ime"
    //     }
    // ]

    // let haveExclusions = "yes"
    // let exclusions = [
    //     {
    //         exclusionFirstName: "John",
    //         exclusionLastName: "Doe"
    //     }
    // ]

    // let executorName = "Jane Doe"

    let docDefinition = {
      content: [
        { text: 'Last Will and Testament', fontSize: 18, alignment: 'center', margin: [0, 3], bold: false},
        { text: 'of', fontSize: 18, alignment: 'center', margin: [0, 3]},
        { text: `${user.firstName}  ${user.lastName}`, fontSize: 18, alignment: 'center', margin: [0, 8]},
        { text: `I, ${user.firstName}  ${user.lastName}, with a place of residence at ${user.street}, ${user.city}, ${user.state}, ${user.zip}, being of sound mind and not acting under duress or undue influence while fully understanding the nature and extent of all my property and of this disposition thereof, do hereby make, publish, and declare this document to be my Last Will and Testament, and hereby revoke any and all other wills and codicils heretofore made by me, Hereinafter known as the "Testator".`, alignment: 'justify'},
      ],
      defaultStyle: {
        font: 'Times',
        fontSize: 12,
        alignment: 'left',
        lineHeight: 1.5,
      }
    };

    if (doc.marriedStatus == "yes" || doc.haveChildren == "yes") {
        docDefinition.content.push(
            { text: '1. FAMILY IDENTIFICATION', margin: [0, 10], fontSize: 12, alignment:'left', bold:true},
        )

        if (doc.marriedStatus === "yes") {
            docDefinition.content.push(
                { text:`I am married to ${doc.spouseInfo.spouseFirstName}  ${doc.spouseInfo.spouseLastName}.`, alignment: 'left', margin: [0, 5], fontSize: 12},
                { text: `${doc.spouseInfo.spouseFirstName}  ${doc.spouseInfo.spouseLastName} will be a beneficiary as described in Section 7.`, alignment: 'left', margin: [0, 5], fontSize: 12},
            )
        }
    
        if (doc.haveChildren === "yes") {
            const numberOfChildrenString = converter.toWords(doc.numberOfChildren)
            docDefinition.content.push(
                { text: `I have ${numberOfChildrenString} (${doc.numberOfChildren}) children known as:`, alignment: 'left', margin: [0, 5], fontSize: 12},
            )
            if (doc.childInfo) {
                doc.childInfo.forEach(element => {
    
                    docDefinition.content.push(
                        { text: element.childFirstName + " " + element.childLastName, alignment: 'left', margin: [0, 5], fontSize: 12},
                    )
                });
            }

            docDefinition.content.push(
                { text: `My child(ren) will be included as Heir(s) in this Last Will and Testament.`, alignment: 'left', margin: [0, 5], fontSize: 12},
            )
        }
    }

    if (doc.haveExclusions === "yes") {

        let stringExclusions = ""
        doc.exclusionsNames.forEach(element => {
            stringExclusions = stringExclusions + " " + element.exclusionFirstName + " " + element.exclusionLastName
        })
        docDefinition.content.push(
            { text: '2. EXCLUSIONS', margin: [0, 10], fontSize: 12, alignment:'left', bold:true},
            { text: `It is my intention to exclude the following person(s) from receiving any distributions in association
            with this Last Will and Testament: ${stringExclusions}`, margin: [0, 0], fontSize: 12, alignment:'left', bold:false},
        )
    }

    docDefinition.content.push(
        { text: '3. EXPENSES & TAXES', margin: [0, 10], fontSize: 12, alignment:'left', bold:true},
        { text: `I direct that all my debts, and expenses of my last illness, funeral, and burial, be paid as soon after my death as may be reasonably convenient, and I hereby authorize my Personal Representative, hereinafter appointed, to settle and discharge, in his or her absolute discretion, any claims made against my estate to be first paid.`, margin: [0, 0], fontSize: 12, alignment:'left', bold:false},
        { text: `I further direct that my Personal Representative shall pay out of my estate any and all estate and inheritance taxes payable by reason of my death in respect of all items included in the computation of such taxes, whether passing under this Will or otherwise. Said taxes shall be paid by my Personal Representative as if such taxes were my debts without recovery of any part of such tax payments from anyone who receives any item included in such computation.`, margin: [0, 10], fontSize: 12, alignment:'left', bold:false},
    )




 
    const options = { }
    let file_name = 'PDF_test' + '.pdf';
    const pdfDoc = printer.createPdfKitDocument(docDefinition, options);
    pdfDoc.pipe(fs.createWriteStream(file_name));
    pdfDoc.end();
    return pdfDoc;
}
