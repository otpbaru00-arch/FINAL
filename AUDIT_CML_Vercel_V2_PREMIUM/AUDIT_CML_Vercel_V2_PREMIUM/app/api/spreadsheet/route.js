export async function POST(request) {

  try {


    const {
      url,
      tanggal
    } = await request.json();



    if (!url) {

      return Response.json({

        error: "Link spreadsheet kosong"

      });

    }



    const idMatch = url.match(
      /\/d\/(.*?)\//
    );



    if (!idMatch) {

      return Response.json({

        error: "Link spreadsheet tidak valid"

      });

    }



    const spreadsheetId = idMatch[1];



    const gidMatch = url.match(
      /gid=([0-9]+)/
    );



    const gid = gidMatch
      ? gidMatch[1]
      : "0";





    const csvUrl =
    `https://docs.google.com/spreadsheets/d/${spreadsheetId}/export?format=csv&gid=${gid}`;





    const response = await fetch(csvUrl);



    if (!response.ok) {

      return Response.json({

        error: "Spreadsheet tidak bisa dibaca"

      });

    }





    const csv = await response.text();





   const rows = csv
.split("\n")
.map(row => row.split(","));


console.log("TOTAL ROW:", rows.length);

console.log(
"DATA AWAL:",
rows.slice(0,10)
);





    let hasil = [];





    const tanggalPilih =
      tanggal
      ? tanggal.split("/")[0]
      : "";





    rows.forEach((row,index)=>{





      // Lewati judul dan header (A1-A4)
      if(index < 4)
      return;





      if(row.length >= 6){





        const no =
          row[0]
          ?.replace(/"/g,"")
          .trim();





        const tanggalSheet =
          row[1]
          ?.replace(/"/g,"")
          .trim();





        const tele =
          row[2]
          ?.replace(/"/g,"")
          .trim();





        const member =
          row[3]
          ?.replace(/"/g,"")
          .trim();





        const nominal =
          row[4]
          ?.replace(/"/g,"")
          .trim();





        const keterangan =
          row[5]
          ?.replace(/"/g,"")
          .trim();





        console.log(
          "CHECK TANGGAL:",
          tanggalSheet
        );





        if(tanggalSheet){





          hasil.push({


            no:
            hasil.length + 1,


            tanggal:
            tanggalSheet,


            tele:
            tele,


            member:
            member,


            nominal:
            nominal,


            keterangan:
            keterangan


          });





        }



      }





    });





    return Response.json({


      success:true,


      total:
      hasil.length,


      data:
      hasil



    });





  }

  catch(error){


    return Response.json({

      error:
      error.message

    });


  }


}
