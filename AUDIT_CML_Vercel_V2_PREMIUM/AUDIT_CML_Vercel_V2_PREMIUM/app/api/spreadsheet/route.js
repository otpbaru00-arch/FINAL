export async function POST(request) {

  try {

    const body = await request.json();

    const {
      url,
      tanggal
    } = body;



    if (!url) {

      return Response.json({

        error: "Link spreadsheet belum dimasukkan"

      });

    }



    const match = url.match(
      /\/d\/(.*?)\//
    );



    if (!match) {

      return Response.json({

        error:"Format link spreadsheet tidak valid"

      });

    }



    const spreadsheetId = match[1];



    /*
      Membaca spreadsheet public
      format CSV
    */

    const sheetUrl =

    `https://docs.google.com/spreadsheets/d/${spreadsheetId}/export?format=csv`;



    const response = await fetch(sheetUrl);



    if(!response.ok){

      return Response.json({

        error:"Spreadsheet tidak dapat dibaca"

      });

    }



    const csv = await response.text();



    const rows = csv
    .split("\n")
    .map(row =>
      row.split(",")
    );



    let hasil = [];



    rows.forEach((row,index)=>{



      if(index===0)
      return;



      if(row.length >= 5){



        const data = {

          no: hasil.length + 1,

          tanggal: row[0]?.trim(),

          tele: row[1]?.trim(),

          member: row[2]?.trim(),

          nominal: row[3]?.trim(),

          keterangan: row[4]?.trim() || ""

        };



        if(!tanggal){

  hasil.push(data);

}
else{


const pilihTanggal = tanggal.split("-");


const hari = pilihTanggal[2];
const bulan = pilihTanggal[1];
const tahun = pilihTanggal[0];


const namaBulan = [
"Januari",
"Februari",
"Maret",
"April",
"Mei",
"Juni",
"Juli",
"Agustus",
"September",
"Oktober",
"November",
"Desember"
];


const formatTanggal = 
`${hari} ${namaBulan[Number(bulan)-1]} ${tahun}`;



if(
data.tanggal.includes(formatTanggal)
){

hasil.push(data);

}


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
