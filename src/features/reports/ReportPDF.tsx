import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer';
import { format } from 'date-fns';

// Create styles
const styles = StyleSheet.create({
    page: {
        padding: 30,
        fontSize: 10,
        fontFamily: 'Helvetica',
        color: '#333',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#EEE',
        paddingBottom: 10,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#2563EB',
    },
    businessInfo: {
        textAlign: 'right',
    },
    reportMeta: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
        backgroundColor: '#F3F4F6',
        padding: 10,
        borderRadius: 4,
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: 10,
        marginTop: 10,
        color: '#1E40AF',
    },
    table: {
        display: 'flex',
        width: 'auto',
        borderStyle: 'solid',
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderRightWidth: 0,
        borderBottomWidth: 0,
    },
    tableRow: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
    },
    tableHeader: {
        backgroundColor: '#F9FAFB',
        fontWeight: 'bold',
    },
    tableCol: {
        flex: 1,
        borderRightWidth: 1,
        borderRightColor: '#E5E7EB',
        padding: 5,
    },
    tableCell: {
        margin: 'auto',
        marginTop: 5,
        fontSize: 8,
    },
    totalsSection: {
        marginTop: 20,
        padding: 10,
        backgroundColor: '#EFF6FF',
        borderRadius: 4,
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
    totalItem: {
        marginLeft: 20,
        textAlign: 'right',
    },
    totalLabel: {
        fontSize: 8,
        color: '#6B7280',
    },
    totalValue: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#1E40AF',
    },
    footer: {
        position: 'absolute',
        bottom: 30,
        left: 30,
        right: 30,
        textAlign: 'center',
        color: '#9CA3AF',
        fontSize: 8,
        borderTopWidth: 1,
        borderTopColor: '#EEE',
        paddingTop: 10,
    },
});

interface ReportPDFProps {
    title: string;
    businessName: string;
    dateRange: string;
    data: any[];
    columns: { label: string; key: string; format?: (val: any) => string }[];
    totals: { label: string; value: string }[];
}

export const ReportPDF = ({ title, businessName, dateRange, data, columns, totals }: ReportPDFProps) => (
    <Document>
        <Page size="A4" style={styles.page}>
            {/* Header */}
            <View style={styles.header}>
                <View>
                    <Text style={styles.title}>{title}</Text>
                    <Text>{dateRange}</Text>
                </View>
                <View style={styles.businessInfo}>
                    <Text style={{ fontWeight: 'bold' }}>{businessName}</Text>
                    <Text>Generated on {format(new Date(), 'PPP')}</Text>
                </View>
            </View>

            {/* Table */}
            <View style={styles.table}>
                {/* Header Row */}
                <View style={[styles.tableRow, styles.tableHeader]}>
                    {columns.map((col, idx) => (
                        <View key={idx} style={styles.tableCol}>
                            <Text style={styles.tableCell}>{col.label}</Text>
                        </View>
                    ))}
                </View>

                {/* Data Rows */}
                {data.map((row, rowIdx) => (
                    <View key={rowIdx} style={styles.tableRow}>
                        {columns.map((col, colIdx) => (
                            <View key={colIdx} style={styles.tableCol}>
                                <Text style={styles.tableCell}>
                                    {col.format ? col.format(row[col.key]) : row[col.key]}
                                </Text>
                            </View>
                        ))}
                    </View>
                ))}
            </View>

            {/* Totals */}
            <View style={styles.totalsSection}>
                {totals.map((total, idx) => (
                    <View key={idx} style={styles.totalItem}>
                        <Text style={styles.totalLabel}>{total.label}</Text>
                        <Text style={styles.totalValue}>{total.value}</Text>
                    </View>
                ))}
            </View>

            {/* Footer */}
            <Text
                style={styles.footer}
                render={({ pageNumber, totalPages }) => `Page ${pageNumber} of ${totalPages} - ${businessName} Business Report`}
            />
        </Page>
    </Document>
);
