export async function POST(request) {

try {

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


const gidMatch=url.match(
/gid=([0-9]+)/
);


const gid=gidMatch ? gidMatch[1] : "0";


const csvUrl =
`https://docs.google.com/spreadsheets/d/${spreadsheetId}/export?format=csv&gid=${gid}`;


const response =
await fetch(csvUrl);


const csv =
await response.text();



// parser CSV dengan tanda kutip
const rows = csv.match(
/(?:\"(?:[^\"]|\"\")*\"|[^,\n]*)(?:,(?:\"(?:[^\"]|\"\")*\"|[^,\n]*))*/g
);



let hasil=[];



function normalTanggal(input){

if(!input)
return "";


// ambil angka tanggal
const match=input.match(
/(\d{1,2})\s+\w+\s+(\d{4})/
);


if(!match)
return "";


return match[1];

}



const tanggalPilih =
tanggal.split("/")[0];



rows.forEach((line,index)=>{


if(index===0)
return;



const col=line
.split(",")
.map(x=>x.replace(/"/g,"").trim());



if(col.length>=6){



const tanggalSheet=col[1];


if(
tanggalSheet.includes(
tanggalPilih
)

){


hasil.push({

no:hasil.length+1,

tanggal:tanggalSheet,

tele:col[2],

member:col[3],

nominal:col[4],

keterangan:col[5] || ""

});


}


}


});



return Response.json({

success:true,

total:hasil.length,

data:hasil

});


}

catch(error){

return Response.json({

error:error.message

});

}

}
