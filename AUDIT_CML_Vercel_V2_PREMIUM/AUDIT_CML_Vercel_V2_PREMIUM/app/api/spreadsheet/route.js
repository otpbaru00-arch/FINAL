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
error:"ID Spreadsheet tidak ditemukan"
});

}


const spreadsheetId=idMatch[1];



const urlSheet =
`https://docs.google.com/spreadsheets/d/${spreadsheetId}/gviz/tq?tqx=out:json`;



const response =
await fetch(urlSheet);



const text =
await response.text();



console.log(text.substring(0,500));



return Response.json({

success:true,

message:"Spreadsheet terbaca",

raw:text.substring(0,500)

});


}

catch(error){

return Response.json({

error:error.message

});

}


}
