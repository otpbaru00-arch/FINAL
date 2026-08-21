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



    const csv = await response.text();





    // Parser CSV agar koma dalam tanggal tidak pecah
    const rows = csv
      .split("\n")
      .map(line => {


        let result = [];

        let current = "";

        let quote = false;



        for(let i=0;i<line.length;i++){


          const char=line[i];



          if(char === '"'){

            quote = !quote;

          }

          else if(
            char === "," &&
            !quote
          ){

            result.push(current);

            current="";

          }

          else{

            current += char;

          }


        }


        result.push(current);


        return result.map(
          item =>
          item
          .replace(/^"|"$/g,"")
          .trim()
        );


      });





    let hasil=[];





    /*
       Input tanggal:
       20/08/2026

       Ambil:
       20
    */

    const tanggalPilih =
    tanggal
    ? tanggal.split("/")[0]
    : "";





    rows.forEach((row,index)=>{



      // Data mulai A5
      if(index < 4)
      return;




      if(row.length >= 6){



        const no =
        row[0];



        const tanggalSheet =
        row[1];



        const tele =
        row[2];



        const member =
        row[3];



        const nominal =
        row[4];



        const keterangan =
        row[5];





        console.log(
          "DATA:",
          tanggalSheet,
          tele,
          member
        );





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
