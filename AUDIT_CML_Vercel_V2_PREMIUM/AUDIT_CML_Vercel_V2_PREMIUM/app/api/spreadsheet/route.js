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

      {
        name: "ALEX",
        gid: "0"
      },

      {
        name: "LEO",
        gid: "1441670750"
      },

      {
        name: "FEMAS",
        gid: "377635019"
      },

      {
        name: "MARSHA",
        gid: "226541219"
      },

      {
        name: "BAGAS",
        gid: "1681223704"
      },

      {
        name: "MARTIN",
        gid: "634424372"
      },

      {
        name: "ALVIN",
        gid: "221114496"
      },

      {
        name: "SANDY",
        gid: "2081640526"
      },

      {
        name: "ANDRE",
        gid: "2051849740"
      }

    ];



    let hasil = [];



    // =========================
    // KONVERSI TANGGAL INPUT
    // =========================

    let hariInput = "";
    let bulanInput = "";
    let tahunInput = "";


    if (tanggal) {


      const pecah =
      tanggal.split("/");


      hariInput =
      pecah[0];


      tahunInput =
      pecah[2];


      const namaBulan = [

        "",
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


      bulanInput =
      namaBulan[
        Number(pecah[1])
      ];


    }





    // =========================
    // LOOP SEMUA TAB
    // =========================

    for (const sheet of sheets) {



      const csvUrl =
      `https://docs.google.com/spreadsheets/d/${spreadsheetId}/export?format=csv&gid=${sheet.gid}`;



      const response =
      await fetch(csvUrl);



      const csv =
      await response.text();





      // =========================
      // CSV PARSER
      // =========================

      const rows =
      csv
      .split("\n")
      .map(line => {


        let data = [];

        let current = "";

        let quote = false;



        for (
          let i = 0;
          i < line.length;
          i++
        ) {


          const char =
          line[i];



          if (char === '"') {

            quote = !quote;

          }

          else if (
            char === "," &&
            !quote
          ) {

            data.push(current);

            current = "";

          }

          else {

            current += char;

          }


        }


        data.push(current);



        return data.map(item =>

          item
          .replace(/^"|"$/g,"")
          .trim()

        );


      });






      // =========================
      // DATA MULAI A5
      // =========================

      rows.forEach((row,index)=>{



        if(index < 4)

        return;




        if(row.length >= 6){



          const tanggalSheet =
          row[1] || "";



          const tanggalCek =
          tanggalSheet.toLowerCase();




          const targetTanggal =
          `${hariInput} ${bulanInput} ${tahunInput}`
          .toLowerCase();





          if(

            tanggalCek.includes(
              targetTanggal
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

      success: true,

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
