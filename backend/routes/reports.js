// backend/routes/reports.js
const express = require('express');
const router = express.Router();
const Lead = require('../models/Lead');
const Technician = require('../models/Technician');

router.get('/technician/:techId', async (req, res) => {
  try {
    const { techId } = req.params;
    const { startDate, endDate } = req.query;

    const tech = await Technician.findById(techId);
    if (!tech) return res.status(404).json({ error: 'Technician not found' });

    const filter = { status: 'completed', assignedTechnician: techId };
    if (startDate && endDate) {
      filter.completedAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    const leads = await Lead.find(filter)
      .populate('assignedTechnician')
      .populate('payments.method')
      .populate('jobType');

    let totalCollected = 0;
    let totalParts = 0;
    let totalFee = 0;
    let totalTechProfit = 0;
    let totalCash = 0;
    let totalCredit = 0;
    let index = 1;

    const leadsData = leads.map(lead => {
      const jobId = lead.jobRef;
      const dateOnly = lead.completedAt ? new Date(lead.completedAt).toLocaleDateString() : '';

      // סכום כל התשלומים בעבודה
      const sumPayments = lead.payments.reduce((sum, p) => sum + (p.amount || 0), 0);

      // חשב את סכום התשלומים בשיטת "cash" או "מזומן"
      const cashPayments = lead.payments
        .filter(p => {
          if (!p.method || !p.method.name) return false;
          const nameLower = p.method.name.toLowerCase();
          return nameLower === 'cash' || nameLower === 'מזומן';
        })
        .reduce((acc, p) => acc + (p.amount || 0), 0);
      
      // Credit = כל התשלום פחות המזומן
      const nonCashPayments = sumPayments - cashPayments;

      // Fee מחושב רק עבור תשלומים שאינם מזומן
      let feeForLead = 0;
      for (const p of lead.payments) {
        if (!p.method || !p.method.name) continue;
        const nameLower = p.method.name.toLowerCase();
        if (nameLower !== 'cash' && nameLower !== 'מזומן') {
          const baseFee = (p.overrideFee !== null && p.overrideFee !== undefined)
            ? p.overrideFee
            : p.method.feePercentage || 0;
          feeForLead += (p.amount || 0) * (baseFee / 100);
        }
      }

      // usedPercentage – אחוז שהטכנאי קיבל, אם לא הוגדר משתמשים באחוז הבסיס של הטכנאי
      const usedPercentage = (lead.technicianPercentage && lead.technicianPercentage !== 0)
        ? lead.technicianPercentage
        : tech.basePercentage;

      // baseForProfit = TotalCollected - Fee - Parts
      const baseForProfit = sumPayments - feeForLead - (lead.parts || 0);
      let techProfit = 0;
      if (baseForProfit > 0) {
        techProfit = baseForProfit * (usedPercentage / 100);
      }

      // נוודא: Cash = cashPayments, Credit = nonCashPayments
      const cash = cashPayments;
      const credit = nonCashPayments;

      totalCollected += sumPayments;
      totalParts += (lead.parts || 0);
      totalFee += feeForLead;
      totalTechProfit += techProfit;
      totalCash += cash;
      totalCredit += credit;

      return {
        index: index++,
        jobId,
        dateOnly,
        address: lead.address,
        jobType: lead.jobType ? lead.jobType.name : '',
        totalPaid: sumPayments,
        parts: lead.parts || 0,
        cash: cash,
        credit: credit,
        fee: feeForLead,
        usedPercentage: usedPercentage,
        techProfit: techProfit,
        balance: sumPayments - techProfit // מה שנשאר מהעסקה לאחר תשלום טכנאי – רווח החברה
      };
    });

    // עיגול לערכים לשתי ספרות
    function fix2(num) {
      return Number(num.toFixed(2));
    }

    const leadsDataFixed = leadsData.map(ld => ({
      ...ld,
      totalPaid: fix2(ld.totalPaid),
      parts: fix2(ld.parts),
      cash: fix2(ld.cash),
      credit: fix2(ld.credit),
      fee: fix2(ld.fee),
      usedPercentage: fix2(ld.usedPercentage),
      techProfit: fix2(ld.techProfit),
      balance: fix2(ld.balance),
    }));

    res.json({
      technician: tech,
      totalCollected: fix2(totalCollected),
      totalParts: fix2(totalParts),
      totalFee: fix2(totalFee),
      totalTechProfit: fix2(totalTechProfit),
      totalCash: fix2(totalCash),
      totalCredit: fix2(totalCredit),
      leadsData: leadsDataFixed,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
