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
        error: "Link spreadsheet tidak valid"
      });

    }


    const spreadsheetId = idMatch[1];


    const sheets = [

      { name:"ALEX", gid:"0" },
      { name:"LEO", gid:"1441670750" },
      { name:"FEMAS", gid:"377635019" },
      { name:"MARSHA", gid:"226541219" },
      { name:"BAGAS", gid:"1681223704" },
      { name:"MARTIN", gid:"634424372" },
      { name:"ALVIN", gid:"221114496" },
      { name:"SANDY", gid:"2081640526" },
      { name:"ANDRE", gid:"2051849740" }

    ];


    let hasil = [];



    // ambil tanggal hari saja
    let tanggalInput = "";

    if(tanggal){

      tanggalInput =
      tanggal.split("/")[0];

    }





    for(const sheet of sheets){



      const csvUrl =
      `https://docs.google.com/spreadsheets/d/${spreadsheetId}/export?format=csv&gid=${sheet.gid}`;



      const response =
      await fetch(csvUrl);



      const csv =
      await response.text();





      // CSV parser
      const rows =
      csv
      .split("\n")
      .map(line=>{


        let result = [];

        let current = "";

        let quote = false;



        for(
          let i = 0;
          i < line.length;
          i++
        ){

          const char = line[i];


          if(char === '"'){

            quote = !quote;

          }

          else if(
            char === "," &&
            !quote
          ){

            result.push(current);

            current = "";

          }

          else {

            current += char;

          }


        }


        result.push(current);



        return result.map(item=>

          item
          .replace(/^"|"$/g,"")
          .trim()

        );


      });





      // data mulai A5

      rows.forEach((row,index)=>{


        if(index < 4)
        return;



        if(row.length >= 6){



          const tanggalSheet =
          row[1] || "";



          console.log(
            "CEK:",
            sheet.name,
            tanggalSheet
          );



          // FILTER TANGGAL
          const cocok =
          tanggalSheet.includes(
            tanggalInput + " "
          );



          if(cocok){


            hasil.push({


              no:
              hasil.length + 1,


              tanggal:
              tanggalSheet,


              tele:
              sheet.name,


              member:
              row[3] || "",


              nominal:
              row[4] || "",


              keterangan:
              row[5] || ""


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
