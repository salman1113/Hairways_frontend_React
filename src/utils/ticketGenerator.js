import jsPDF from "jspdf";
import autoTable from "jspdf-autotable"; // 🔥 Fix: Import Default

export const generateTicketPDF = (booking) => {
  const doc = new jsPDF();

  // --- 1. HEADER ---
  doc.setFillColor(63, 13, 18);
  doc.rect(0, 0, 210, 40, "F");
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(22);
  doc.setFont("helvetica", "bold");
  doc.text("HairWays", 105, 20, null, null, "center");
  
  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");
  doc.text("Booking Confirmation Ticket", 105, 30, null, null, "center");

  // --- 2. TOKEN ---
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(10);
  doc.text("TOKEN NUMBER", 105, 55, null, null, "center");
  
  doc.setFontSize(30);
  doc.setTextColor(215, 38, 56);
  doc.setFont("helvetica", "bold");
  doc.text(booking.token_number, 105, 68, null, null, "center");

  // --- 3. DETAILS ---
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");

  const startY = 85;
  doc.text("Date:", 20, startY);
  doc.setFont("helvetica", "bold");
  doc.text(booking.booking_date, 50, startY);
  
  doc.setFont("helvetica", "normal");
  doc.text("Time:", 120, startY);
  doc.setFont("helvetica", "bold");
  doc.text(booking.booking_time, 150, startY);

  const row2Y = startY + 10;
  doc.setFont("helvetica", "normal");
  doc.text("Stylist:", 20, row2Y);
  doc.setFont("helvetica", "bold");
  doc.text(booking.employee_details?.user_details?.username || "Stylist", 50, row2Y);

  // --- 4. SERVICES TABLE (Fix applied here) ---
  const tableColumn = ["Service Name", "Duration", "Price (Rs)"];
  const tableRows = [];

  booking.items.forEach(item => {
    tableRows.push([
      item.service_name,
      `${item.service_duration} mins`,
      item.price,
    ]);
  });

  // 🔥 Fix: Using imported autoTable function
  autoTable(doc, {
    head: [tableColumn],
    body: tableRows,
    startY: 110,
    theme: 'grid',
    headStyles: { fillColor: [63, 13, 18], textColor: [255, 255, 255] },
    styles: { fontSize: 10, cellPadding: 3 },
  });

  // --- 5. TOTAL & FOOTER ---
  // doc.lastAutoTable.finalY might not work directly with function call, so we estimate or use hook
  const finalY = (doc.lastAutoTable?.finalY || 150) + 10; 
  
  doc.setFontSize(14);
  doc.setTextColor(63, 13, 18);
  doc.setFont("helvetica", "bold");
  doc.text(`Total Paid: Rs. ${booking.total_price}`, 190, finalY, null, null, "right");

  doc.setFontSize(9);
  doc.setTextColor(150, 150, 150);
  doc.setFont("helvetica", "normal");
  doc.text("Thank you for choosing HairWays.", 105, finalY + 20, null, null, "center");

  doc.save(`HairWays_Ticket_${booking.token_number}.pdf`);
};