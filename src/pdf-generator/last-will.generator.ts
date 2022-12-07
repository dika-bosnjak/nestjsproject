import { DocumentService } from '@app/document/document.service';
import { User } from '@app/user/entity/user.entity';
import * as fs from 'fs';
import * as PdfPrinter from 'pdfmake';
var converter = require('number-to-words');

export function generatePDF(user: User, document: any): Promise<string> {
  //define the default fonts
  const fonts = {
    Times: {
      normal: 'Times-Roman',
      bold: 'Times-Bold',
      italics: 'Times-Italic',
      bolditalics: 'Times-BoldItalic',
    },
  };

  //get the document content
  const doc = document.content;

  //creat the counter for paragraph numeration
  let counter = 0;

  let docDefinition = {
    content: [
      { text: 'Last Will and Testament', fontSize: 18, alignment: 'center', margin: [0, 3], bold: false },
      { text: 'of', fontSize: 18, alignment: 'center', margin: [0, 3] },
      { text: `${user.firstName}  ${user.lastName}`, fontSize: 18, alignment: 'center', margin: [0, 8] },
      {
        text: `I, ${user.firstName}  ${user.lastName}, with a place of residence at ${user.street}, ${user.city}, ${user.state}, ${user.zip}, being of sound mind and not acting under duress or undue influence while fully understanding the nature and extent of all my property and of this disposition thereof, do hereby make, publish, and declare this document to be my Last Will and Testament, and hereby revoke any and all other wills and codicils heretofore made by me, Hereinafter known as the "Testator".`,
        alignment: 'justify',
      },
    ],
    defaultStyle: {
      font: 'Times',
      fontSize: 12,
      alignment: 'left',
      lineHeight: 1.5,
    },
  };

  if (doc.marriedStatus == 'yes' || doc.haveChildren == 'yes') {
    counter = counter + 1;
    docDefinition.content.push({ text: counter + '. FAMILY IDENTIFICATION', margin: [0, 10], fontSize: 12, alignment: 'left', bold: true });

    if (doc.marriedStatus === 'yes') {
      docDefinition.content.push(
        {
          text: `I am married to ${doc.spouseInfo.spouseFirstName}  ${doc.spouseInfo.spouseLastName}.`,
          alignment: 'left',
          margin: [0, 5],
          fontSize: 12,
        },
        {
          text: `${doc.spouseInfo.spouseFirstName}  ${doc.spouseInfo.spouseLastName} will be a beneficiary as described in Section 7.`,
          alignment: 'left',
          margin: [0, 5],
          fontSize: 12,
        },
      );
    }

    if (doc.haveChildren === 'yes') {
      const numberOfChildrenString = converter.toWords(doc.numberOfChildren);
      docDefinition.content.push({
        text: `I have ${numberOfChildrenString} (${doc.numberOfChildren}) children known as:`,
        alignment: 'left',
        margin: [0, 5],
        fontSize: 12,
      });
      if (doc.childInfo) {
        doc.childInfo.forEach((element) => {
          docDefinition.content.push({ text: element.childFirstName + ' ' + element.childLastName, alignment: 'left', margin: [0, 5], fontSize: 12 });
        });
      }

      docDefinition.content.push({
        text: `My child(ren) will be included as Heir(s) in this Last Will and Testament.`,
        alignment: 'left',
        margin: [0, 5],
        fontSize: 12,
      });
    }
  }

  if (doc.haveExclusions === 'yes') {
    counter = counter + 1;
    let stringExclusions = '';
    doc.exclusionsNames.forEach((element) => {
      stringExclusions = stringExclusions + ' ' + element.exclusionFirstName + ' ' + element.exclusionLastName;
    });
    docDefinition.content.push(
      { text: counter + '. EXCLUSIONS', margin: [0, 10], fontSize: 12, alignment: 'left', bold: true },
      {
        text: `It is my intention to exclude the following person(s) from receiving any distributions in association with this Last Will and Testament: ${stringExclusions}`,
        margin: [0, 0],
        fontSize: 12,
        alignment: 'justify',
        bold: false,
      },
    );
  }

  counter = counter + 1;
  docDefinition.content.push(
    { text: counter + '. EXPENSES & TAXES', margin: [0, 10], fontSize: 12, alignment: 'left', bold: true },
    {
      text: `I direct that all my debts, and expenses of my last illness, funeral, and burial, be paid as soon after my death as may be reasonably convenient, and I hereby authorize my Personal Representative, hereinafter appointed, to settle and discharge, in his or her absolute discretion, any claims made against my estate to be first paid.`,
      margin: [0, 0],
      fontSize: 12,
      alignment: 'justify',
      bold: false,
    },
    {
      text: `I further direct that my Personal Representative shall pay out of my estate any and all estate and inheritance taxes payable by reason of my death in respect of all items included in the computation of such taxes, whether passing under this Will or otherwise. Said taxes shall be paid by my Personal Representative as if such taxes were my debts without recovery of any part of such tax payments from anyone who receives any item included in such computation.`,
      margin: [0, 10],
      fontSize: 12,
      alignment: 'justify',
      bold: false,
    },
  );

  //return the promise with the filename
  return new Promise<string>((resolve, reject) => {
    //there are two steps that must be done before the download process
    let pendingStepCount = 2;
    const stepFinished = (fileName: string) => {
      if (--pendingStepCount == 0) {
        resolve(fileName);
      }
    };

    const options = {};
    const date = new Date();
    let fileName =
      'LastWill_' +
      user.firstName +
      '_' +
      user.lastName +
      '_' +
      String(date.getDate()) +
      '-' +
      String(date.getMonth()) +
      '-' +
      String(date.getFullYear()) +
      '.pdf';
    const printer = new PdfPrinter(fonts);
    const pdfDoc = printer.createPdfKitDocument(docDefinition, options);
    const writeStream = fs.createWriteStream(fileName);
    writeStream.on('close', () => {
      stepFinished(fileName);
    });

    pdfDoc.pipe(writeStream);
    pdfDoc.end();
    stepFinished(fileName);
  });
}
