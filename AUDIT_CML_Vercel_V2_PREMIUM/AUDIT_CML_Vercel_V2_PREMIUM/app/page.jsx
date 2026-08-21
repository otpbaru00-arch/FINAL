'use client';

import { useState } from "react";

export default function Home(){

const [url,setUrl] = useState("");
const [tanggal,setTanggal] = useState("");
const [data,setData] = useState([]);

async function tarikData(){

const res = await fetch(
"/api/spreadsheet",
{
method:"POST",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify({

url:url,

tanggal:tanggal

})

});


const result=await res.json();


setData(result.data);


}

alert("Tombol TARIK DATA sudah aktif");

}

return (

<main className="page">

<header>
<h1>AUDIT CML</h1>
<p>Control Monitoring Ledger System</p>
</header>


<div className="grid">

<div className="stat">
Total Tele
<br/>
<b>0</b>
</div>

<div className="stat">
Total Member
<br/>
<b>0</b>
</div>

<div className="stat">
Total Nominal
<br/>
<b>Rp 0</b>
</div>

<div className="stat">
Status Arsip
<br/>
<b>OPEN</b>
</div>

</div>


<section className="card">

<h2>Tarik Laporan Harian</h2>


<input
placeholder="Masukkan URL Google Spreadsheet"
value={url}
onChange={(e)=>setUrl(e.target.value)}
/>


<input
type="date"
value={tanggal}
onChange={(e)=>setTanggal(e.target.value)}
/>


<button onClick={tarikData}>
TARIK DATA
</button>


</section>


<section className="card">

<h2>Laporan Harian Gabungan</h2>


<table>

<tbody>

<tr>
<td>
Belum ada data
</td>
</tr>

</tbody>

</table>


</section>


<button>
EXPORT PDF
</button>


<button>
DOWNLOAD EXCEL
</button>


<button className="danger">
LOCK ARSIP
</button>


</main>

)

}
