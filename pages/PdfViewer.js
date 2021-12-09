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
  const [numPages, setNumPages] = useState(null);

  const styles = StyleSheet.create({
    page: {
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: 'white',
      padding: 24
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
      fontSize: 12
    }
  });

  function getNewData(event) {}

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

  const [instance, updateInstance] = usePDF({ document: <MyDoc /> }, [true]);
  return (
    <div>
      <div style={{ marginBottom: '30px' }}>
        <button onClick={getNewData}>Load New Data</button>
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
        {/* <MyDoc /> */}
        <Document>
          <Page style={styles.page} size="A4">
            <Svg width="190" height="160">
              <Path
                d="M 10 80 C 40 10, 65 10, 95 80 S 150 150, 180 80"
                stroke="rgb(128, 255, 0)"
                strokeWidth={3}
              />
            </Svg>
          </Page>
        </Document>
      </div>
    </div>
  );
}
