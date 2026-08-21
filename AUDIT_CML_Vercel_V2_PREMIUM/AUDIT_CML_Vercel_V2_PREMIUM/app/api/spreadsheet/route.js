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



    // =====================
    // KONVERSI TANGGAL INPUT
    // =====================

    let filterHari = "";
    let filterBulan = "";
    let filterTahun = "";


    if(tanggal){

      const pecah =
      tanggal.split("/");


      filterHari =
      String(Number(pecah[0]));



      const bulanNama = [

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



      filterBulan =
      bulanNama[
        Number(pecah[1])
      ];



      filterTahun =
      pecah[2];

    }





    // =====================
    // LOOP SEMUA TAB
    // =====================

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


        let result=[];
        let current="";
        let quote=false;



        for(let i=0;i<line.length;i++){


          const char=line[i];


          if(char === '"'){

            quote=!quote;

          }

          else if(
            char === "," &&
            !quote
          ){

            result.push(current);
            current="";

          }

          else{

            current+=char;

          }

        }


        result.push(current);



        return result.map(item=>

          item
          .replace(/^"|"$/g,"")
          .trim()

        );


      });






      // Data mulai A5

      rows.forEach((row,index)=>{


        if(index < 4)
        return;



        if(row.length >= 6){



          const tanggalSheet =
          row[1] || "";



          const matchTanggal =
          tanggalSheet.match(
            /(\d{1,2})\s+([A-Za-z]+)\s+(\d{4})/
          );



          let cocok = false;



          if(matchTanggal){



            const hariSheet =
            String(Number(matchTanggal[1]));



            const bulanSheet =
            matchTanggal[2];



            const tahunSheet =
            matchTanggal[3];



            if(

              hariSheet === filterHari &&

              bulanSheet.toLowerCase()
              ===
              filterBulan.toLowerCase()

              &&

              tahunSheet === filterTahun

            ){

              cocok = true;

            }


          }




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
