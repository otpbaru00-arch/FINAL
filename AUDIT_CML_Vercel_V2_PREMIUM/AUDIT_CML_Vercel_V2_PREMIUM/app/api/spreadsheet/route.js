export async function POST(request) {

  try {

    const {
      url,
      tanggal
    } = await request.json();


    const idMatch = url.match(
      /\/d\/(.*?)\//
    );


    if (!idMatch) {

      return Response.json({
        error:"Link spreadsheet tidak valid"
      });

    }


    const spreadsheetId = idMatch[1];


    const csvUrl =
    `https://docs.google.com/spreadsheets/d/${spreadsheetId}/export?format=csv`;


    const response = await fetch(csvUrl);


    const csv = await response.text();



    const rows = csv
    .split("\n")
    .map(row =>
      row.split(",")
    );



    let hasil=[];



    rows.forEach((row,index)=>{


      // skip header
      if(index===0)
      return;



      if(row.length >= 6){



        const no = row[0]?.trim();

        const tanggalSheet = row[1]?.trim();

        const tele = row[2]?.trim();

        const member = row[3]?.trim();

        const nominal = row[4]?.trim();

        const keterangan = row[5]?.trim();



        if(
          tanggalSheet &&
          tanggalSheet.includes(
            tanggal
          )
        ){


          hasil.push({

            no,

            tanggal:tanggalSheet,

            tele,

            member,

            nominal,

            keterangan

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
