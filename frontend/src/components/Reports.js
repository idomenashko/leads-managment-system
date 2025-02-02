// frontend/src/components/Reports.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

function Reports() {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [allLeads, setAllLeads] = useState([]);

  const [techId, setTechId] = useState('');
  const [techReport, setTechReport] = useState(null);
  const [technicians, setTechnicians] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5001/api/technicians')
      .then(res => setTechnicians(res.data))
      .catch(err => console.log(err));
  }, []);

  // דוח כללי – לפי טווח תאריכים
  const handleAllReport = async () => {
    try {
      const res = await axios.get('http://localhost:5001/api/reports/all', {
        params: { startDate, endDate }
      });
      setAllLeads(res.data);
    } catch (error) {
      console.error('Error fetching all report:', error);
    }
  };

  // דוח לטכנאי – לפי טווח תאריכים
  const handleTechReport = async () => {
    if (!techId) return alert('Select a technician');
    try {
      const res = await axios.get(`http://localhost:5001/api/reports/technician/${techId}`, {
        params: { startDate, endDate }
      });
      setTechReport(res.data);
    } catch (error) {
      console.error('Error fetching tech report:', error);
    }
  };

  const exportTechPDF = () => {
    if (!techReport) return;
    const doc = new jsPDF();
    doc.text(`Technician Report: ${techReport.technician.name}`, 14, 10);

    const head = [[
      '#', 'Job ID', 'Date', 'Address', 'Total Paid', 'Parts', 'Cash', 'Credit', 'Fee', 'Pct', 'Tech Profit', 'Balance'
    ]];
    const rows = techReport.leadsData.map(ld => ([
      ld.index,
      ld.jobId,
      ld.dateOnly,
      ld.address,
      ld.totalPaid,
      ld.parts,
      ld.cash,
      ld.credit,
      ld.fee,
      ld.usedPercentage,
      ld.techProfit,
      ld.balance,
    ]));

    doc.autoTable({
      startY: 20,
      head,
      body: rows
    });

    const finalY = doc.lastAutoTable.finalY + 10;
    doc.text(`Total Collected: ${techReport.totalCollected}`, 14, finalY);
    doc.text(`Total Parts: ${techReport.totalParts}`, 14, finalY + 10);
    doc.text(`Total Fee: ${techReport.totalFee}`, 14, finalY + 20);
    doc.text(`Total Tech Profit: ${techReport.totalTechProfit}`, 14, finalY + 30);
    doc.text(`Total Cash: ${techReport.totalCash}`, 14, finalY + 40);
    doc.text(`Total Credit: ${techReport.totalCredit}`, 14, finalY + 50);
    doc.text(`Balance: ${techReport.totalCollected - techReport.totalTechProfit}`, 14, finalY + 60);

    doc.save('technician_report.pdf');
  };

  // עזר לעיגול לשתי ספרות
  const fix2 = (num) => Number(num).toFixed(2);

  // שורת סיכום לדוח הטכנאי
  const renderTechTotalRow = () => {
    if (!techReport) return null;
    return (
      <tr style={{ fontWeight: 'bold' }}>
        <td colSpan={4} style={{ textAlign: 'right' }}>Totals:</td>
        <td>{fix2(techReport.totalCollected)}</td>
        <td>{fix2(techReport.totalParts)}</td>
        <td>{fix2(techReport.totalCash)}</td>
        <td>{fix2(techReport.totalCredit)}</td>
        <td>{fix2(techReport.totalFee)}</td>
        <td>{fix2(techReport.totalTechProfit)}</td>
        <td>{fix2(techReport.totalCollected - techReport.totalTechProfit)}</td>
      </tr>
    );
  };

  return (
    <div>
      <h2 className="mb-4">Reports</h2>

      <div className="row g-3 mb-4">
        <div className="col-md-3">
          <label>Start Date</label>
          <input type="date" className="form-control" value={startDate} onChange={e => setStartDate(e.target.value)} />
        </div>
        <div className="col-md-3">
          <label>End Date</label>
          <input type="date" className="form-control" value={endDate} onChange={e => setEndDate(e.target.value)} />
        </div>
        <div className="col-md-3 d-flex align-items-end">
          <button onClick={handleAllReport} className="btn btn-primary w-100">
            All Jobs Report
          </button>
        </div>
      </div>

      {allLeads.length > 0 && (
        <div className="mb-5">
          <h4>All Completed Leads</h4>
          <table className="table table-bordered">
            <thead>
              <tr>
                <th>JobRef</th>
                <th>Lead Name</th>
                <th>Collected</th>
                <th>Completed At</th>
              </tr>
            </thead>
            <tbody>
              {allLeads.map(lead => {
                const sumPayments = lead.payments.reduce((acc, p) => acc + (p.amount || 0), 0);
                return (
                  <tr key={lead._id}>
                    <td>{lead.jobRef}</td>
                    <td>{lead.name}</td>
                    <td>{fix2(sumPayments)}</td>
                    <td>{lead.completedAt ? new Date(lead.completedAt).toLocaleDateString() : ''}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <div className="row g-3 mb-4">
        <div className="col-md-3">
          <label>Technician</label>
          <select className="form-select" value={techId} onChange={e => setTechId(e.target.value)}>
            <option value="">-- select --</option>
            {technicians.map(t => (
              <option key={t._id} value={t._id}>{t.name}</option>
            ))}
          </select>
        </div>
        <div className="col-md-3 d-flex align-items-end">
          <button onClick={handleTechReport} className="btn btn-success w-100">
            Tech Report
          </button>
        </div>
        {techReport && (
          <div className="col-md-3 d-flex align-items-end">
            <button onClick={exportTechPDF} className="btn btn-danger w-100">
              Export PDF
            </button>
          </div>
        )}
      </div>

      {techReport && (
        <div>
          <h4>Technician: {techReport.technician.name}</h4>
          <p>Total Collected: {fix2(techReport.totalCollected)}</p>
          <p>Total Parts: {fix2(techReport.totalParts)}</p>
          <p>Total Fee: {fix2(techReport.totalFee)}</p>
          <p>Total Tech Profit: {fix2(techReport.totalTechProfit)}</p>
          <p>Total Cash: {fix2(techReport.totalCash)}</p>
          <p>Total Credit: {fix2(techReport.totalCredit)}</p>
          <p>Balance (Company Profit): {fix2(techReport.totalCollected - techReport.totalTechProfit)}</p>

          <table className="table table-bordered">
            <thead>
              <tr>
                <th>#</th>
                <th>Job ID</th>
                <th>Date</th>
                <th>Address</th>
                <th>Total Paid</th>
                <th>Parts</th>
                <th>Cash</th>
                <th>Credit</th>
                <th>Fee</th>
                <th>Pct</th>
                <th>Tech Profit</th>
                <th>Balance</th>
              </tr>
            </thead>
            <tbody>
              {techReport.leadsData.map(ld => (
                <tr key={ld.index}>
                  <td>{ld.index}</td>
                  <td>{ld.jobId}</td>
                  <td>{ld.dateOnly}</td>
                  <td>{ld.address}</td>
                  <td>{fix2(ld.totalPaid)}</td>
                  <td>{fix2(ld.parts)}</td>
                  <td>{fix2(ld.cash)}</td>
                  <td>{fix2(ld.credit)}</td>
                  <td>{fix2(ld.fee)}</td>
                  <td>{fix2(ld.usedPercentage)}</td>
                  <td>{fix2(ld.techProfit)}</td>
                  <td>{fix2(ld.balance)}</td>
                </tr>
              ))}
              {renderTechTotalRow()}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default Reports;
