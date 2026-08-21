export async function POST(request) {

  try {

    const body = await request.json();

    const {
      url,
      tanggal
    } = body;


    if (!url) {

      return Response.json({
        error: "Link spreadsheet kosong"
      });

    }


    const id = url.match(
      /\/d\/(.*?)\//
    );


    if (!id) {

      return Response.json({
        error: "Format link spreadsheet salah"
      });

    }


    const spreadsheetId = id[1];


    return Response.json({

      success: true,

      spreadsheetId,

      tanggal,

      data: [

        {
          no: 1,
          tanggal: tanggal,
          tele: "MARSHA",
          member: "TEST001",
          nominal: 50,
          keterangan: "API berhasil aktif"
        }

      ]

    });


  } catch(error) {


    return Response.json({

      error: error.message

    });


  }

}
