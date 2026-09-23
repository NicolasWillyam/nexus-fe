import React from 'react';

export default function DataSummary() {
  return (
    <div style={{ background: '#ffffff', padding: '24px', borderRadius: '8px', maxWidth: '450px', border: '1px solid #e9ecef', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
      <div style={{ color: '#6c757d', marginBottom: '8px', fontSize: '14px' }}>None</div>
      <h3 style={{ margin: '0 0 20px 0', color: '#212529', fontSize: '18px', fontWeight: 'bold' }}>Nexus Data</h3>
      
      <div style={{ marginBottom: '16px' }}>
        <div style={{ color: '#6c757d', fontSize: '14px', marginBottom: '4px' }}>Stocks</div>
        <div style={{ color: '#212529', fontSize: '16px', fontWeight: 'bold' }}>20</div>
      </div>
      
      <div style={{ marginBottom: '16px' }}>
        <div style={{ color: '#6c757d', fontSize: '14px', marginBottom: '4px' }}>Trading Days</div>
        <div style={{ color: '#212529', fontSize: '16px', fontWeight: 'bold' }}>250</div>
      </div>
      
      <div style={{ marginBottom: '16px' }}>
        <div style={{ color: '#6c757d', fontSize: '14px', marginBottom: '4px' }}>Latest Data</div>
        <div style={{ color: '#212529', fontSize: '16px', fontWeight: 'bold' }}>06/09/2026</div>
      </div>
      
      <div style={{ marginBottom: '8px' }}>
        <div style={{ color: '#6c757d', fontSize: '14px', marginBottom: '4px' }}>Status</div>
        <div style={{ color: '#212529', fontSize: '16px', fontWeight: 'bold' }}>Healthy</div>
      </div>
    </div>
  );
}