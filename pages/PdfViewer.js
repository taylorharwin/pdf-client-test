import { useState } from 'react';
// import default react-pdf entry
import { Document, Page, StyleSheet, View, Text, usePDF, Svg, Path } from '@react-pdf/renderer';
import { pdfjs } from 'react-pdf';
// import pdf worker as a url, see `next.config.js` and `pdf-worker.js`
import workerSrc from './pdf-worker';

import printJS from 'print-js';

pdfjs.GlobalWorkerOptions.workerSrc = workerSrc;

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

export default function PdfViewer() {
  const [data, setData] = useState(basicReport);
  const [extra, setExtra] = useState(false);
  const [numPages, setNumPages] = useState(null);

  if (extra) {
    for (var i = 0; i <= 100; i++) {
      data.accountGroups.push({
        groupTitle: 'Extra Account',
        totalAmount: '200.00'
      });
    }
  }

  const styles = StyleSheet.create({
    page: {
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: 'white',
      padding: 24,
      textAlign: 'center'
    },
    row: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginVertical: 8
    },
    highlightedRow: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginVertical: 8,
      fontWeight: 'bold',
      backgroundColor: '#E5E5E5'
    },
    column: {
      display: 'flex',
      flexDirection: 'column'
    },

    border: {
      borderBottom: '1px solid black',
      width: '100%'
    },
    h1: {
      fontSize: 18,
      marginBottom: 12
    },
    h2: {
      fontSize: 13,
      marginBottom: 16,
      display: 'flex',
      flexDirection: 'row'
    },
    p: {
      fontWeight: 'normal',
      fontSize: 12,
      textAlign: 'center'
    }
  });

  function onDocumentLoadSuccess({ numPages: nextNumPages }) {
    setNumPages(nextNumPages);
  }

  const MyDoc = () => {
    return (
      <Document>
        <Page size="A4" style={styles.page}>
          <View style={styles.row}>
            <View style={styles.column}>
              <Text style={styles.h1}>{data.company}</Text>
              <View style={styles.row}>
                <Text style={styles.h2}>{data.reportType}</Text>
                <Text style={styles.h2}>
                  {data.startDate} - {data.endDate}
                </Text>
              </View>
            </View>
          </View>
          <View style={styles.row}>
            <Text style={{ fontWeight: 'bold' }}>Account</Text>
            <Text style={{ fontWeight: 'bold' }}>Total</Text>
          </View>
          <View style={styles.border} />
          {data.accountGroups.map((group, index) => {
            if (!group.accounts) {
              return (
                <>
                  <View key={index} style={styles.highlightedRow}>
                    <Text style={styles.h2}>{group.groupTitle}</Text>
                    <Text style={styles.h2}>{group.totalAmount}</Text>
                  </View>
                </>
              );
            }
            return (
              <>
                <View key={index} style={styles.row}>
                  <Text style={styles.h2}>{group.groupTitle}</Text>
                </View>
                {group.accounts &&
                  group.accounts.map((acct, idx) => {
                    return (
                      <View key={idx} style={styles.row}>
                        <Text style={styles.p}>{acct.accountName}</Text>
                        <Text style={styles.p}>{acct.totalAmount}</Text>
                      </View>
                    );
                  })}
              </>
            );
          })}
        </Page>
      </Document>
    );
  };

  const [instance, updateInstance] = usePDF({ document: <MyDoc /> }, [extra, data]);
  console.log(instance);
  return (
    <div>
      <div style={{ marginBottom: '30px' }}>
        <button onClick={() => setExtra(!extra)}>Set Extra</button>
        {instance.blob && (
          <>
            <a download="test.pdf" href={instance.url}>
              <button>Download</button>
            </a>
            <button
              type="button"
              onClick={() => {
                printJS({
                  printable: instance.url
                });
              }}
            >
              Print
            </button>
          </>
        )}
      </div>

      <div>
        <MyDoc />
      </div>
    </div>
  );
}
