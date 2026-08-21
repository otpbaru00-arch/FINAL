export async function POST(request) {

try {

const {
url,
tanggal
} = await request.json();


const idMatch = url.match(
/\/d\/(.*?)\//
);


if(!idMatch){

return Response.json({
error:"ID Spreadsheet tidak ditemukan"
});

}


const spreadsheetId = idMatch[1];


// ambil gid dari link
const gidMatch = url.match(
/gid=([0-9]+)/
);


const gid = gidMatch ? gidMatch[1] : "0";



const csvUrl =
`https://docs.google.com/spreadsheets/d/${spreadsheetId}/export?format=csv&gid=${gid}`;



const response = await fetch(csvUrl);



const csv = await response.text();



console.log("CSV DATA:", csv.substring(0,500));



const rows = csv
.split("\n")
.map(row=>row.split(","));



let hasil=[];



rows.forEach((row,index)=>{


if(index===0)
return;



if(row.length >= 6){


hasil.push({

no: row[0]?.trim(),

tanggal: row[1]?.trim(),

tele: row[2]?.trim(),

member: row[3]?.trim(),

nominal: row[4]?.trim(),

keterangan: row[5]?.trim() || ""

});


}


});



return Response.json({

success:true,

jumlahData:hasil.length,

data:hasil

});


}

catch(error){

return Response.json({

error:error.message

});

}

}
