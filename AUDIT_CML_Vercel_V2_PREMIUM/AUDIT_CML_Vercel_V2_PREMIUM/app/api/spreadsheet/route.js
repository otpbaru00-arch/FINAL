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


// Ambil spreadsheet public CSV

const response = await fetch(
`https://docs.google.com/spreadsheets/d/${spreadsheetId}/export?format=csv`
);


const csv = await response.text();



const rows = csv
.split("\n")
.map(row=>row.split(","));



let hasil=[];


rows.forEach((row,index)=>{


if(index===0) return;


if(row.length>=5){


hasil.push({

no:hasil.length+1,

tanggal:row[1],

tele:row[2],

member:row[3],

nominal:row[4],

keterangan:row[5] || ""

});


}


});



return Response.json({

success:true,

total:hasil.length,

data:hasil.filter(
item=>{

if(!tanggal)
return true;


return item.tanggal.includes(tanggal);

}

)

});


}

catch(error){


return Response.json({

error:error.message

});


}


}
