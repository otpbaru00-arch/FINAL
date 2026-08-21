'use client';
export default function Home(){
return <main className="page">
<header><h1>AUDIT CML</h1><p>Control Monitoring Ledger System</p></header>
<div className="grid">
<div className="stat">Total Tele<br/><b>0</b></div>
<div className="stat">Total Member<br/><b>0</b></div>
<div className="stat">Total Nominal<br/><b>Rp 0</b></div>
<div className="stat">Status Arsip<br/><b>OPEN</b></div>
</div>
<section className="card">
<h2>Tarik Laporan Harian</h2>
<input placeholder="Masukkan URL Google Spreadsheet"/>
<input type="date"/>
<button>TARIK DATA</button>
</section>
<section className="card">
<h2>Laporan Harian Gabungan</h2>
<table><tbody><tr><td>Belum ada data</td></tr></tbody></table>
</section>
<button>EXPORT PDF</button>
<button>DOWNLOAD EXCEL</button>
<button className="danger">LOCK ARSIP</button>
</main>
}