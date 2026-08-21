export async function POST(request){

try{


const {
url,
tanggal
}=await request.json();



const idMatch=url.match(
/\/d\/(.*?)\//
);


if(!idMatch){

return Response.json({
error:"Link spreadsheet tidak valid"
});

}



const spreadsheetId=idMatch[1];



/*
Ambil daftar semua sheet
*/

const metaUrl =
`https://docs.google.com/spreadsheets/d/${spreadsheetId}/gviz/tq`;



const metaResponse =
await fetch(metaUrl);



const metaText =
await metaResponse.text();



const sheetRegex =
/"sheetId":"(.*?)","title":"(.*?)"/g;



let sheets=[];

let match;



while(
(match=sheetRegex.exec(metaText)) !== null
){

sheets.push({

gid:match[1],

name:match[2]

});


}



let hasil=[];



/*
Loop semua sheet
*/


for(const sheet of sheets){



const csvUrl =

`https://docs.google.com/spreadsheets/d/${spreadsheetId}/export?format=csv&gid=${sheet.gid}`;



const csvResponse =
await fetch(csvUrl);



const csv =
await csvResponse.text();



const rows =
csv
.split("\n")
.map(row=>row.split(","));



rows.forEach((row,index)=>{


if(index===0)
return;



if(row.length>=5){



const dataTanggal =
row[1]?.trim();



if(

dataTanggal &&
dataTanggal.includes(
tanggal
)

){


hasil.push({

no:hasil.length+1,

tanggal:dataTanggal,

tele:sheet.name,

member:row[3]?.trim(),

nominal:row[4]?.trim(),

keterangan:row[5]?.trim() || ""

});


}



}



});



}




return Response.json({

success:true,

jumlahSheet:sheets.length,

totalData:hasil.length,

data:hasil

});



}

catch(error){


return Response.json({

error:error.message

});


}


}
