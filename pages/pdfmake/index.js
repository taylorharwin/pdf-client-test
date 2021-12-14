import pdfMake from 'pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

import * as vercelSVG from '../../public/vercel.svg';

const dd = (title, subTitle, accountRows) => ({
  content: [
    {
      text: title,
      style: 'header'
    },
    {
      text: subTitle,
      style: 'subheader'
    },
    {
      layout: {
        hLineWidth(i, node) {
          if (i === 0 || i === node.table.body.length) {
            return 0;
          }
          return i === node.table.headerRows ? 2 : 0;
        },
        vLineWidth(i) {
          return 0;
        },
        paddingLeft(i) {
          return i === 0 ? 0 : 8;
        },
        paddingRight(i, node) {
          return i === node.table.widths.length - 1 ? 0 : 8;
        }
      },
      table: {
        headerRows: 1,
        widths: ['*', 'auto'],
        body: [
          [
            { text: 'Account', bold: true },
            { text: 'Total', bold: true }
          ],
          ...accountRows
        ]
      }
    }
  ],
  styles: {
    header: {
      fontSize: 18,
      bold: true
    },
    subheader: {
      fontSize: 15,
      bold: true
    }
  }
});

const basicReport = {
  company: 'San Francisco Produce Distribution, LLC',
  reportType: 'Profit & Loss',
  startDate: '11/01/2021',
  endDate: '10/04/2021',
  accountGroups: [
    {
      groupTitle: 'Income',
      totalName: 'Total Income',
      totalAmount: '500.00',
      accounts: [
        {
          accountName: '40000 Food Sales',
          totalAmount: '500.00'
        }
      ]
    },
    {
      groupTitle: 'Cost of Goods Sold',
      totalName: 'Total Cost of Goods Sold',
      totalAmount: '500.00',
      accounts: [
        {
          accountName: '50001 Cost of Goods Sold',
          totalAmount: '500.00'
        }
      ]
    },
    {
      groupTitle: 'Gross Profit',
      totalAmount: '300.00'
    },
    {
      groupTitle: 'Expenses',
      totalName: 'Total expenses',
      totalAmount: '100.00',
      accounts: [
        {
          accountName: '50400 Freight',
          totalAmount: '50.00'
        },
        {
          accountName: '50700 Rent',
          totalAmount: '50.00'
        }
      ]
    },
    {
      groupTitle: 'Net Operating Incoming',
      totalAmount: '200.00'
    },
    {
      groupTitle: 'Net Income',
      totalAmount: '200.00'
    }
  ]
};

const makeAccountRows = accounts => {
  const rows = [];
  accounts.forEach(account => {
    rows.push([
      {
        text: [{ text: account.groupTitle }],
        fillColor: '#eeeeee',
        bold: true
      },

      {
        text: account.totalAmount,
        fillColor: '#eeeeee',
        bold: true
      }
    ]);

    if (account.accounts) {
      account.accounts.forEach(acc => {
        rows.push([
          {
            text: acc.accountName,
            margin: [24, 0, 0, 0]
          },
          {
            text: acc.totalAmount
          }
        ]);
      });
    }
  });
  return rows;
};

const arrowSVG = `<svg viewBox="0 0 300 300">
    <path
      id="XMLID_225_"
      d="M325.607,79.393c-5.857-5.857-15.355-5.858-21.213,0.001l-139.39,139.393L25.607,79.393
c-5.857-5.857-15.355-5.858-21.213,0.001c-5.858,5.858-5.858,15.355,0,21.213l150.004,150c2.813,2.813,6.628,4.393,10.606,4.393
s7.794-1.581,10.606-4.394l149.996-150C331.465,94.749,331.465,85.251,325.607,79.393z"
    />
  </svg>`;

const openDoc = () => {
  const rows = makeAccountRows(basicReport.accountGroups);
  const context = dd(basicReport.company, basicReport.reportType, rows);
  pdfMake.createPdf(context).open();
};

const downloadDoc = () => {
  const rows = makeAccountRows(basicReport.accountGroups);
  const context = dd(basicReport.company, basicReport.reportType, rows);
  pdfMake.createPdf(context).download('basicDoc.pdf');
};

const printDoc = () => {
  const rows = makeAccountRows(basicReport.accountGroups);
  const context = dd(basicReport.company, basicReport.reportType, rows);
  pdfMake.createPdf(context).print();
};
const MyDoc = ({ data }) => {
  return (
    <div>
      <div>
        <div>
          <div>
            <div>{data.company}</div>
            <div>
              <div>{data.reportType}</div>
              <div>
                {data.startDate} - {data.endDate}
              </div>
            </div>
          </div>
        </div>
        <div>
          <div>Account</div>
          <div>Total</div>
        </div>
        <div />
        {data.accountGroups.map((group, index) => {
          if (!group.accounts) {
            return (
              <>
                <div key={index}>
                  <div>{group.groupTitle}</div>
                  <div>{group.totalAmount}</div>
                </div>
              </>
            );
          }
          return (
            <>
              <div key={index}>
                <div>{group.groupTitle}</div>
              </div>
              {group.accounts &&
                group.accounts.map((acct, idx) => {
                  return (
                    <div key={idx}>
                      <div>{acct.accountName}</div>
                      <div>{acct.totalAmount}</div>
                    </div>
                  );
                })}
            </>
          );
        })}
      </div>
    </div>
  );
};

export default function PDFMake() {
  return (
    <div>
      <div style={{ marginBottom: '30px' }}>
        <button
          onClick={() => {
            openDoc();
          }}
        >
          Open
        </button>

        <button type="button" onClick={printDoc}>
          Print
        </button>
        <button type="button" onClick={downloadDoc}>
          Download
        </button>
        <MyDoc data={basicReport}></MyDoc>
      </div>
    </div>
  );
}
