import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
// @ts-ignore
import { Parser } from 'json2csv'
import fs from 'fs'

export async function GET(request: Request) {
    const cookieList = cookies()
    const token = cookieList.get('dist')

    if(!token) {
        return NextResponse.json({error: 'error getting token'})
    }

    async function runQuery(token: any, statement: string, table: string) {
        const query = await fetch(`https://mingle-ionapi.inforcloudsuite.com/D7NMH8MYY885DBPS_PRD/DATAFABRIC/compass/v2/jobs/?queryExecutor=datalake`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Authorization': `bearer ${token.value}`,
                'Charset': 'utf-8',
                'Content-Type': 'text/plain',   
            },
            body: statement
        }).then(data => data.json())
        
        if(!query.queryId) return 'query error'

        async function getStatus() {
            const status: any = await new Promise((resolve, reject) => {
                setTimeout(async () => {
                    const status = await fetch(`https://mingle-ionapi.inforcloudsuite.com/D7NMH8MYY885DBPS_PRD/DATAFABRIC/compass/v2/jobs/${query.queryId}/status/?timeout=0&queryExecutor=datalake`, {
                        method: 'GET',
                        headers: {
                            'Accept': 'application/json',
                            'Authorization': `bearer ${token.value}`,
                            'Charset': 'utf-8',
                        },
                    }).then( data => data.json())
                    console.log(table + ': status resolved')
                    console.log(status)
                    resolve(status)
                }, 10000)
            })

            return status
        }

        let status = await getStatus()
        while(status.status != 'FINISHED') {
            status = await getStatus()
        }

        const res = await fetch(`https://mingle-ionapi.inforcloudsuite.com/D7NMH8MYY885DBPS_PRD/DATAFABRIC/compass/v2/jobs/${query.queryId}/result/?offset=0&limit=100000&queryExecutor=datalake`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Authorization': `bearer ${token.value}`,
                'Charset': 'utf-8',
            },
        }).then( data => data.json())

        return res
    }
    
    const query = await runQuery(token, "SELECT icsp.prod, icsp.descrip_1, icsp.statustype, icsw.pricetype, icsw.qtyonhand, icsw.baseprice, icsw.avgcost, CASE WHEN dirtycoreprod = '' THEN 'FALSE' ELSE 'TRUE' END hasCore FROM icsp, icsw WHERE icsw.whse = 300 AND icsw.prod = icsp.prod AND (icsp.statustype = 'A' OR icsp.statustype = 'a' OR (icsp.statustype = 's' AND icsw.qtyonhand > 0) OR (icsp.statustype = 'S' AND icsw.qtyonhand > 0)) AND icsp.slgroup != 'CORE' AND (icsw.pricetype != 'core' AND icsw.pricetype != 'CORE') AND icsp.prodtype != 'C'", "merge")

    const lineCodes = [
        "ACD",
        "CHM",
        "CUM",
        "MOT",
        "RWR",
        "ALL",
        "AMB",
        "ARP",
        "BAL",
        "CLA",
        "BOR",
        "HRT",
        "REM",
        "BOS",
        "STD",
        "DEL",
        "DEN",
        "DOR",
        "FPD",
        "GAR",
        "GAT",
        "HOR",
        "IMB",
        "KYS",
        "LUB",
        "MAH",
        "MAX",
        "MSP",
        "NPD",
        "OTC",
        "PPT",
        "RAC",
        "RAY",
        "REA",
        "REM",
        "SUN",
        "YAN",
        "ZEX",
        'GPN',
        'GRZ',
        'HOL',
        'INT',
        'LUC',
        'PAI',
        'WOG',
        'DA2'
    ]

    const excludedPartNumbers = [
        "BOSEC3Z-9B246-C",
        "MSPEC3Z-9B246-C",
        "BOSFC3Z-9B246-F",
        "MSPFC3Z-9B246-F",
        "BOSHC3Z-9B246-B",
        "MSPHC3Z-9B246-B",
        "ALLAP60901N",
        "ALLAP60801",
        "BOSF00E200308",
        "BOSF00E200365",
        "MSP0986435505X",
        "MSPFORD6.7A",
        "BOS0896444022",
        "GRZCRIPVR15X",
        "MSPFORD6.7B",
        "MSPRX10R4761",
        "MSPPPT7002-PP",
        "DELEX63811BI", 
        "ALLAP52802",
        "STD06246",
        "BOS0986435045",
        "BOS0986435254K",
        "BOSEC-9B246C",
        "MSP5801633945C",
        "BOSF00E200431",
        'REB0986-435-564',
        'BOS0986435129BX',
        'BOS0986435633',
        'BOSF00E200423',
        'BOSF00E200431',
        'BOSF00E200392',
        'MSP0445120082P',
        'MSP0445020105',
        'BOS0928400673',
        'BOS0445120042P',
        'BOSF00E200523',
        'BOS0445120193P',
        'BOS0445120187P',
        'BOS0445120238P',
        'MSP0445218017',
        'MSP0445218015',
        'BOSRB5234785',
        'BOSRB5234795',
        'BOSRB5234865',
        'BOSRB5234870',
        'BOSRB5234935',
        'BOSRB5234940',
        'BOSRB5234945',
        'BOSRB5234970',
        'BOSRB5235550',
        'BOSRB5235580',
        'BOSRB5235600',
        'BOSRB5235605',
        'BOSRB5236347',
        'BOSRB5236980',
        'BOSRB5236981',
        'BOSRB5236995',
        'BOSRB5237014',
        'BOSRB5237042',
        'BOSRB5237099',
        'BOSRB5237334',
        'BOSRB5237473',
        'BOSRB5237578',
        'BOSRB5234770',
        'BOSRB5234775',
        'BOSRB5234960',
        'BOSRB5234965',
        'BOSRB5236015',
        'BOSRB5236035',
        'BOSRB5236138',
        'BOSRB5236672',
        'MSPLABLABOR',
        'MSPHEUI-INJ-TEST',
        'MSPFORD6.4-INJ-TEST',
        'DEL5222305',
        'MSPUNIT-INJ-TEST',
        'MSPG2.9-INJ-TEST',
        'MSPG2.8-INJ-TEST',
        'MSPCELECT-INJ-TEST',
        'MSPC9-INJ-TEST',
        'MSPC7-INJ-TEST',
        'MSP60SERIES-INJ-TEST',
        'MSP-IPVR16X',
        'BOS0986444024',
        'GRZCRIPVR16XPLUS',
        'BOSEC3Z-9B246A',
        'BOSEC3Z-9B246B',
        'BOSEC3Z-9B246D',
        'BOSEC3Z-9B246C',
        'MSPEC3Z-9B246A',
        'MSPEC3Z-9B246B',
        'MSPEC3Z-9B246D',
        'MSPEC3Z-9B246C',
        'NPDFEE',
        'STDFEE',
        "BOSIPVR11X",
        "BOSIPVR13X",
        "BOSIPVR14X",
        "BOSIPVR15X",
        "BOSIPVR16X",
        "BOSIPVR20X",
        "MSP-IPVR11X",
        "MSP-IPVR13X",
        "MSP-IPVR14X",
        "MSP-IPVR15X",
        "MSP-IPVR16X",
        "MSP-IPVR20X",
        'MSP0445020050XDC',
        'MSP0445110251XDC',
        'MSP0445110559XDC',
        'MSP0445120067XDC',
        'MSP095000-5353XDC',
        'MSP0986435410XDC',
        'MSP0986435508XDC',
        'MSP63800AAXDC',
        'MSPFOOE200469DC',
        'MSP0986437508DC',
        'MSP0445010525XDC',
        'MSP0445020507XDC',
        'MSP294050-0138XDC',
        'MSP0445020508DC',
        'MSP0445020128XDC',
        'MSP0445110455XDC',
        'MSP0445115060XDC',
        'MSP0986437421XDC',
        'MSP0986444509XDC',
        'MSP294050-0011XDC',
        'MSP0445020580DC',
        'MSP0445020526XDC',
        'MSP0445120187XDC',
        'MSP095000-9690XDC',
        'MSPCRI0986435521XRDC',
        'MSPSHOP SUPPLY',
        'LUCHARTWORK',
        'MSPSMALLER',
        'MSPCDUNCAN',
        'MSPMYANOV',
        'LUCLABOR',
        'MSPJDCM WORK ORDER 2190',
        'BOSCRIBENCHAUDIT',
        'MSPBOSC/R-INJ-TEST',
        'MSPDELC/R-INJ-TEST',
        'MSPPT PUMP REPAIR',
        'MSPR A-SIZE PUMP REPAIR',
        'MSPR CR INJ REPAIR',
        'MSPR DB PUMP REPAIR',
        'MSPR DM PUMP REPAIR',
        'MSPR DP200 PUMP REPAIR',
        'MSPR DP210 REPAIR',
        'MSPR HP3 PUMP REPAIR',
        'MSPR MP PUMP REPAIR',
        'MSPR PFR PUMP REPAIR',
        'MSPR SUPPLY PUMP REP',
        'MSPR TICS PUMP REPAIR',
        'MSPR UNIT PUMP REPAIR',
        'MSPR VP44 PUMP REPAIR',
        'MSPSERVICE',
        'MSPTEST STAND AUDIT',
        'MSPR INLINE PUMP REPAIR',
        'MSPACMACHINEREPAIR',
        'MSPLIFT PUMP REPAIR',
        'MSPDENC/R-INJ-TEST',
        'MSPEPA',
        'MSPHEAD PRESSURE CHECK',
        'MSPLIFT PUMP REPAIR',
        'MSPOIL/FUEL ANALYSIS',
        'MSPR CELECT PUMP REP',
        'MSPR CELECT PUMP REPAIR',
        'MSPR DP200 PUMP REPA',
        'MSPR DP310 PUMP REPA',
        'MSPR DPA PUMP REPAIR',
        'MSPR DP310 PUMP REPAIR',
        'MSPR DS PUMP REPAIR',
        'MSPR MECH. INJ REPAIR',
        'MSPR PTPUMP REPAIR',
        'MSPR RD PUMP REPAIR',
        'MSPR VA PUMP REPAIR',
        'MSPR VP30 PUMP REPAI',
        'MSP LIFT PUMP REPAIR',
        'MSP- AMBAC PUMP REP',
        'MSPDPA PUMP REPAIR',
        'MSPPAD2',
        'MSPR CBC PUMP REPAIR',
        'MSPR CP3 PUMP REPAIR',
        'MSPR DE PUMP REPAIR',
        'MSPR DELPHI  PUMP RE',
        'MSPR DPC PUMP REPAIR',
        'MSPR DPS PUMP REPAIR',
        'MSPR MODEL 100 PUMP REP',
        'MSPR SUPPLY PUMP REPAIR',
        'MSPR TICS PUMP REPAI',
        'MSPCP3 PUMP REPAIR',
        'MSPR A-SIZE PUMP REP',
        'MSPR CP1 PUMP REPAIR',
        'MSPR DELPHI  PUMP REPAIR',
        'MSPR HP0 PUMP REPAIR',
        'MSPR HP4 PUMP REPAIR',
        'MSPR MECH. INJ REPAI',
        'MSPR SIMMS PUMP REPAIR',
        'MSPR VE PUMP REPAIR',
        'MSPR VP30 PUMP REPAIR',
        'MSPBOM WORK ORDER',
        'MSPCALIBRATE',
        'MSP - AMBAC PUMP REPAIR',
        'AMBREPAIR',
        'STDTEST',
        'AMBBC76437-3ARDC'
    ]

    const dataForOpticat = [
        {id: "BBRH", code: "MOT", desc: "Motorcraft"},
        {id: "BCVC", code: "ACD", desc: "ACDELCO"},
        {id: "CLVL", code: "ALL", desc: "Alliant Power"},
        {id: "BNJK", code: "AMB", desc: "AMBAC International"},
        {id: "GGGV", code: "ARP", desc: "ARP Headstuds"},
        {id: "BFDG", code: "BAL", desc: "Baldwin Filters"},
        {id: "BGDG", code: "CLA", desc: "Stanadyne"},
        {id: "BBHK", code: "BOS", desc: "Bosch"},
        {id: "BCVQ", code: "BOR", desc: "Borg Warner"},
        {id: "BBMZ", code: "HRT", desc: "Hartridge Test Equipment"},
        {id: "BBBN", code: "REM", desc: "Delco Remy"},
        {id: "CBXQ", code: "CUM", desc: "Cummins"},
        {id: "CBDD", code: "CON", desc: "Contennial Batteries"},
        {id: "BGDG", code: "STD", desc: "Stanadyne"},
        {id: "BBMX", code: "DEL", desc: "Delphi"},
        {id: "BBNF", code: "DEN", desc: "Denso"},
        {id: "DWRT", code: "DOR", desc: "Dorman"},
        {id: "BDZH", code: "FPD", desc: "FP Diesel - Felpro"},
        {id: "BDZW", code: "GAR", desc: "Garret"},
        {id: "BBSC", code: "GAT", desc: "Gates"},
        {id: "DWBX", code: "HOR", desc: "Horton"},
        {id: "JKMF", code: "IMB", desc: "Interstate McBee"},
        {id: "DGBV", code: "KYS", desc: "KYSOR-AC"},
        {id: "BFKC", code: "LUB", desc: "Luber-Finer"},
        {id: "FLHQ", code: "MAH", desc: "Mahle"},
        {id: "JPKB", code: "MAX", desc: "Maxiforce"},
        {id: "JWTR", code: "MSP", desc: "MSP Diesel Solutions"},
        {id: "FHHC", code: "NPD", desc: "Nippon Diesel"},
        {id: "BCFM", code: "OTC", desc: "OTC"},
        {id: "HNZR", code: "PPT", desc: "Pure Power Tech"},
        {id: "BCKG", code: "RAC", desc: "Racor"},
        {id: "BDBL", code: "RAY", desc: "Raybestos"},
        {id: "DWKF", code: "REA", desc: "Reach"},
        {id: "GXTN", code: "SUN", desc: "Sunair"},
        {id: "BGMW", code: "YAN", desc: "Yanmar"},
        {id: "BCVB", code: "ZEX", desc: "Zexel"},
        {id: "JWJS", code: "GPN", desc: "Global Parts Network"},
        {id: "BFCM", code: "GRZ", desc: "Grizzly"},
        {id: "JGHG", code: "HOL", desc: "Holset"},
        {id: "CGGR", code: "INT", desc: "Volunteer International"},
        {id: "JGNS", code: "LUC", desc: "LUCAS"},
        {id: "BFQT", code: "PAI", desc: "PAI"},
        {id: "CGGR", code: "CHM", desc: "Chemicals and fluids"},
        {id: "CGGR", code: "WOG", desc: "Peaker Services"},
        {id: "HLKH", code: "RWR", desc: "Roadwarrior"},
        // {id: "JWTR", code: "DA2", desc: "Diamond Advantage"},
    ]

    const process = query.map((obj: any) => {
        return {
            ["PartNo"]: obj["prod"].toUpperCase().slice(3),
            ["Part Desc1"]: obj["descrip_1"],
            ["Line Code"]: obj["prod"].toUpperCase().slice(0, 3),
            ["Brand ID"]: null,
            ["LineDesc"]: null,
            ["hasCore"]: obj["hasCore"]
            // ["Base Price"]: obj["baseprice"],
            // ["Avg Cost"]: obj["avgcost"]
        }
        // return {
        //     ["fullPartNo"]: obj["prod"].toUpperCase(),
        //     ["crossBrand"]: 'JWTR',
        //     ["PartNo"]: obj["prod"].toUpperCase().slice(3),
        //     ["Brand ID"]: null,
        //     ["Line Code"]: obj["prod"].toUpperCase().slice(0, 3),
        // }
    })
    .filter((obj: any) => lineCodes.includes(obj["Line Code"]) ? 1 : 0)
    .filter((obj: any) => !excludedPartNumbers.includes(obj["Line Code"] + obj["PartNo"]))
    .map((obj: any) => {
        dataForOpticat.map(x => {
            if(x.code == obj["Line Code"].toUpperCase()) {
                obj["Brand ID"] = x.id;
                obj["LineDesc"] = x.desc
            }
        })
        return obj;
    })

    const fields = ['Brand ID', "Line Code", "PartNo", "LineDesc", "Part Desc1", "hasCore"];
    // const fields = ['Brand ID', "Line Code", "PartNo", "LineDesc", "Part Desc1", "hasCore", "Base Price", "Avg Cost"];
    // const fields = ["fullPartNo", "crossBrand","PartNo",'Brand ID', "Line Code" ];
    const parser = new Parser({fields});
    const csv = parser.parse(process);

    // fs.writeFileSync(`website-inventory-11-15-23-with-core-base-price-avg-cost.txt`, csv)
    fs.writeFileSync(`website-inventory-11-30-23-with-core.txt`, csv)
    
    return NextResponse.json({message: 'CSV file send to directory'})
}