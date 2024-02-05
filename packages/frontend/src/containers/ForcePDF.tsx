import { PDFViewer, Document, Page, View, Text, Font, StyleSheet } from '@react-pdf/renderer'
import {useSearchParams} from "react-router-dom";

export default function ForcePDF() {

    //@ts-ignore
    const [searchParams, setSearchParams] = useSearchParams()

    //@ts-ignore
    const data = JSON.parse(searchParams.get('f'))

    const styles = StyleSheet.create({
        body: {
            paddingTop: 35,
            paddingBottom: 65,
            paddingHorizontal: 35,
            orientation: 'landscape',
            width: '100%',
        },
        title: {
            fontSize: 20,
            textAlign: 'center',
            fontFamily: 'Oswald'
        },
        table: {
            width: '100%',
        },
        row: {
            display: 'flex',
            flexDirection: 'row',
            borderTop: '1px solid #EEE',
            paddingTop: 8,
            paddingBottom: 8,
        },
        header: {
            borderTop: 'none',
        },
        footer: {
            borderTop: 1,
            borderBottom: 1,
        },
        bold: {
            fontWeight: 'bold',
        },
        // So Declarative and unDRY 👌
        row1: {
            width: '40%',
        },
        row2: {
            width: '15%',
        },
        row3: {
            width: '15%',
        },
        row4: {
            width: '15%',
        },
        row5: {
            width: '15%',
        },
    })

    let bvTotal = 0
    let tonTotal = 0

    //@ts-ignore
    data.forEach( (unit) => {
        bvTotal += parseInt(unit.BV || '0')
        tonTotal += parseInt( unit.tons || '0')
    })

    return (
        <PDFViewer style={{ width: '100%', height: 500}}>
        <Document style={{ width: '100%', height: 500}}>
            <Page style={styles.body}>
                <Text style={styles.title}>Force List</Text>
                <View style={styles.table}>
                    <View style={[styles.row, styles.bold,styles.header]}>
                        <Text style={styles.row1}>Unit</Text>
                        <Text style={styles.row2}>Type</Text>
                        <Text style={styles.row3}>P/G</Text>
                        <Text style={styles.row4}>BV</Text>
                        <Text style={styles.row5}>Tonnage</Text>
                    </View>
                    {
                        //@ts-ignore
                        data.map((row, i) => (
                        <View key={i} style={styles.row} wrap={false}>
                            <Text style={styles.row1}>
                                <Text style={styles.bold}>{row.name}</Text>
                            </Text>
                            <Text style={styles.row2}>{row.type}</Text>
                            <Text style={styles.row3}>{row.skill}</Text>
                            <Text style={styles.row4}>{row.BV}</Text>
                            <Text style={styles.row5}>{row.tons}</Text>
                        </View>
                    ))}
                    <View style={[styles.row, styles.bold, styles.footer]}>
                        <Text style={styles.row1}>{data.length} units</Text>
                        <Text style={styles.row2}></Text>
                        <Text style={styles.row3}></Text>
                        <Text style={styles.row4}>{bvTotal}</Text>
                        <Text style={styles.row5}>{tonTotal}</Text>
                    </View>
                </View>
            </Page>
        </Document>
        </PDFViewer>
    )
}

Font.register({
    family: 'Oswald',
    src: 'https://fonts.gstatic.com/s/oswald/v13/Y_TKV6o8WovbUd3m_X9aAA.ttf'
});

