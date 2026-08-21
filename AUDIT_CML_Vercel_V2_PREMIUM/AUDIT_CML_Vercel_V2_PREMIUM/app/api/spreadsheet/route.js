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



    /*
      Ambil metadata semua sheet
    */

    const metaUrl =
    `https://docs.google.com/spreadsheets/d/${spreadsheetId}/gviz/tq?tqx=out:json`;



    const metaResponse =
    await fetch(metaUrl);



    const metaText =
    await metaResponse.text();



    const sheetRegex =
    /"sheetId":"(.*?)","title":"(.*?)"/g;



    let sheets=[];

    let match;



    while(
      (match = sheetRegex.exec(metaText))
    ){

      sheets.push({

        gid:match[1],

        name:match[2]

      });

    }



    if(sheets.length===0){

      return Response.json({

        error:"Tidak menemukan sheet"

      });

    }





    let hasil=[];



    const tanggalPilih =
    tanggal
    ? tanggal.split("/")[0]
    : "";





    /*
      Loop semua tab
    */


    for(const sheet of sheets){



      const csvUrl =
      `https://docs.google.com/spreadsheets/d/${spreadsheetId}/export?format=csv&gid=${sheet.gid}`;



      const response =
      await fetch(csvUrl);



      const csv =
      await response.text();





      /*
        CSV parser
      */


      const rows =
      csv
      .split("\n")
      .map(line=>{


        let data=[];

        let current="";

        let quote=false;



        for(let i=0;i<line.length;i++){


          let char=line[i];



          if(char === '"'){

            quote=!quote;

          }

          else if(
            char === "," &&
            !quote
          ){

            data.push(current);

            current="";

          }

          else{

            current+=char;

          }


        }


        data.push(current);



        return data.map(x=>

          x.replace(/^"|"$/g,"")
          .trim()

        );


      });





      /*
        Data mulai baris 5
        index 4
      */


      rows.forEach((row,index)=>{



        if(index < 4)
        return;



        if(row.length >= 6){



          const no =
          row[0];



          const tanggalSheet =
          row[1];



          const idMember =
          row[3];



          const nominal =
          row[4];



          const keterangan =
          row[5];





          if(

            tanggalSheet &&

            tanggalSheet.includes(
              tanggalPilih
            )

          ){



            hasil.push({

              no:
              hasil.length + 1,


              tanggal:
              tanggalSheet,


              tele:
              sheet.name,


              member:
              idMember,


              nominal:
              nominal,


              keterangan:
              keterangan


            });



          }


        }


      });



    }





    return Response.json({


      success:true,


      jumlahSheet:
      sheets.length,


      totalData:
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
