'use client';

import { useState } from "react";


export default function Home(){

const [url,setUrl] = useState("");
const [tanggal,setTanggal] = useState("");
const [data,setData] = useState([]);
const [loading,setLoading] = useState(false);



async function tarikData(){

try{

setLoading(true);


const response = await fetch(
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

}
);


const result = await response.json();


console.log(result);


if(result.data){

setData(result.data);

}
else{

alert(result.error || "Data tidak ditemukan");

}


}

catch(error){

console.log(error);

alert("Gagal mengambil data");

}

finally{

setLoading(false);

}


}



return (

<main className="page">


<header>

<h1>AUDIT CML</h1>

<p>
Control Monitoring Ledger System
</p>

</header>



<div className="grid">


<div className="stat">

Total Tele

<br/>

<b>
{data.length}
</b>

</div>



<div className="stat">

Total Member

<br/>

<b>
{data.length}
</b>

</div>



<div className="stat">

Total Nominal

<br/>

<b>
Rp {data.reduce(
(total,item)=>total + Number(item.nominal || 0),
0
)}
</b>

</div>



<div className="stat">

Status Arsip

<br/>

<b>
OPEN
</b>

</div>



</div>





<section className="card">


<h2>
Tarik Laporan Harian
</h2>



<label>
Link Google Spreadsheet
</label>


<input

placeholder="Masukkan URL Google Spreadsheet"

value={url}

onChange={(e)=>setUrl(e.target.value)}

/>



<label>
Tanggal Audit
</label>


<input

type="date"

value={tanggal}

onChange={(e)=>setTanggal(e.target.value)}

/>



<button

onClick={tarikData}

>

{
loading ?

"MENGAMBIL DATA..."

:

"TARIK DATA"

}

</button>



</section>







<section className="card">


<h2>
Laporan Harian Gabungan
</h2>



<table>


<thead>

<tr>

<th>No</th>

<th>Tanggal</th>

<th>Nama Tele</th>

<th>ID Member</th>

<th>Nominal</th>

<th>Keterangan</th>


</tr>

</thead>




<tbody>



{

data.length === 0 ?


<tr>

<td colSpan="6">

Belum ada data

</td>

</tr>



:


data.map((item,index)=>(


<tr key={index}>


<td>

{item.no || index+1}

</td>


<td>

{item.tanggal}

</td>


<td>

{item.tele}

</td>


<td>

{item.member}

</td>


<td>

{item.nominal}

</td>


<td>

{item.keterangan}

</td>



</tr>


))


}



</tbody>



</table>


</section>







<div className="actions">


<button>

EXPORT PDF

</button>



<button>

DOWNLOAD EXCEL

</button>



<button className="danger">

LOCK ARSIP

</button>



</div>




</main>


)


}
