
"use client";
import { useState } from "react";
import ProtectedRoute from '@/components/ProtectedRoute';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

type SubItem = {
  name: string;
  score: string;
  max: string;
  obs: string;
};

type Item = {
  name: string;
  subItems: SubItem[];
};

export default function FeedbackPage() {
  const { logout } = useAuth();
  const router = useRouter();
  
  const [student, setStudent] = useState({ code: "", name: "", lastname: "" });
  const [reviewer, setReviewer] = useState({ name: "", email: "" });
  const [course, setCourse] = useState("");
  const [labNumber, setLabNumber] = useState("");
  const [items, setItems] = useState<Item[]>([
    { name: "", subItems: [{ name: "", score: "", max: "", obs: "" }] },
  ]);

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  // Validations
  const onlyNumbers = (v: string) => v.replace(/[^0-9.]/g, "");

  // Total calculation
  const total = items.reduce(
    (acc, item) =>
      acc +
      item.subItems.reduce(
        (a, s) => a + (parseFloat(s.score) || 0),
        0
      ),
    0
  );
  const totalMax = items.reduce(
    (acc, item) =>
      acc +
      item.subItems.reduce(
        (a, s) => a + (parseFloat(s.max) || 0),
        0
      ),
    0
  );

  // Handlers
  const handleStudent = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setStudent((s) => ({ ...s, [name]: name === "code" ? onlyNumbers(value) : value }));
  };
  const handleReviewer = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setReviewer((r) => ({ ...r, [name]: value }));
  };
  const handleItemName = (i: number, v: string) => {
    setItems((arr) => {
      const copy = [...arr];
      copy[i].name = v;
      return copy;
    });
  };
  const handleSubItem = (i: number, j: number, field: keyof SubItem, v: string) => {
    setItems((arr) => {
      const copy = [...arr];
      copy[i].subItems[j][field] =
        field === "score" || field === "max" ? onlyNumbers(v) : v;
      return copy;
    });
  };
  const addItem = () => setItems((arr) => [...arr, { name: "", subItems: [{ name: "", score: "", max: "", obs: "" }] }]);
  const removeItem = (i: number) => setItems((arr) => arr.length > 1 ? arr.filter((_, idx) => idx !== i) : arr);
  const addSubItem = (i: number) => setItems((arr) => {
    const copy = [...arr];
    copy[i].subItems.push({ name: "", score: "", max: "", obs: "" });
    return copy;
  });
  const removeSubItem = (i: number, j: number) => setItems((arr) => {
    const copy = [...arr];
    if (copy[i].subItems.length > 1) copy[i].subItems.splice(j, 1);
    return copy;
  });

  // Export handlers
  const exportToPDF = async () => {
    const jsPDF = (await import('jspdf')).default;
    
    try {
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 15; // Márgenes más pequeños para ocupar más espacio
      const usableWidth = pageWidth - (margin * 2);
      let currentY = margin;

      // Paleta de colores elegante - Solo azules y variantes
      const pucpBlue = [32, 74, 158]; // Azul principal PUCP del sitio web
      const pucpDarkBlue = [22, 47, 108]; // Azul oscuro PUCP
      const pucpLightBlue = [237, 246, 255]; // Azul muy claro
      const pucpAccentBlue = [59, 130, 246]; // Azul de acento
      const pucpNavyBlue = [15, 23, 42]; // Azul marino elegante
      const pucpSkyBlue = [125, 211, 252]; // Azul cielo
      const elegantGray = [71, 85, 105]; // Gris elegante
      const lightGray = [248, 250, 252];
      const mediumGray = [100, 116, 139];
      const successBlue = [37, 99, 235]; // Azul para éxito
      const warningBlue = [30, 64, 175]; // Azul para advertencia
      const white = [255, 255, 255];

      // Función para agregar nueva página si es necesario
      const checkPageBreak = (neededHeight: number) => {
        if (currentY + neededHeight > pageHeight - margin - 15) {
          pdf.addPage();
          currentY = margin;
          addHeader();
        }
      };

      // Función para agregar header elegante y moderno
      const addHeader = () => {
        // Header principal con gradiente PUCP auténtico
        pdf.setFillColor(pucpBlue[0], pucpBlue[1], pucpBlue[2]);
        pdf.rect(0, 0, pageWidth, 30, 'F');
        
        // Gradiente simulado con azul más claro
        pdf.setFillColor(pucpAccentBlue[0], pucpAccentBlue[1], pucpAccentBlue[2]);
        pdf.rect(0, 0, pageWidth, 8, 'F');
        
        // Franja decorativa azul elegante
        pdf.setFillColor(pucpSkyBlue[0], pucpSkyBlue[1], pucpSkyBlue[2]);
        pdf.rect(0, 0, pageWidth, 3, 'F');
        
        // Logo PUCP circular elegante
        pdf.setFillColor(white[0], white[1], white[2]);
        pdf.circle(margin + 12, 15, 10, 'F');
        
        // Borde del logo
        pdf.setDrawColor(pucpAccentBlue[0], pucpAccentBlue[1], pucpAccentBlue[2]);
        pdf.setLineWidth(0.8);
        pdf.circle(margin + 12, 15, 10, 'S');
        
        // Texto del logo
        pdf.setFillColor(pucpBlue[0], pucpBlue[1], pucpBlue[2]);
        pdf.setFontSize(14);
        pdf.setFont('helvetica', 'bold');
        pdf.setTextColor(pucpBlue[0], pucpBlue[1], pucpBlue[2]);
        pdf.text('PUCP', margin + 12, 18, { align: 'center' });
        
        // Título principal moderno - más abajo y elegante
        pdf.setTextColor(white[0], white[1], white[2]);
        pdf.setFontSize(16);
        pdf.setFont('helvetica', 'bold');
        pdf.text(`Retroalimentación ${course}`, margin + 30, 15);

        // Subtítulo elegante con más estilo
        pdf.setFontSize(11);
        pdf.setFont('helvetica', 'normal');
        pdf.setTextColor(240, 240, 240);
        pdf.text(`Laboratorio ${labNumber}`, margin + 30, 20);          
        // Línea decorativa horizontal bajo el título
        pdf.setDrawColor(255, 255, 255);
        pdf.setLineWidth(0.5);
        pdf.line(margin + 30, 22, pageWidth - margin - 60, 22);
        
        // Fecha con estilo moderno
        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'normal');
        pdf.setTextColor(white[0], white[1], white[2]);
        const fecha = new Date().toLocaleDateString('es-ES', { 
          weekday: 'long', 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        });
        pdf.text(fecha, pageWidth - margin, 17, { align: 'right' });
        
        currentY = 45;
      };

      // Header inicial
      addHeader();

      // INFORMACIÓN DEL ESTUDIANTE - Diseño compacto y bien espaciado
      const studentBoxHeight = 45;
      
      // Sombra suave para profundidad
      pdf.setFillColor(200, 200, 200);
      pdf.rect(margin + 1, currentY + 1, usableWidth, studentBoxHeight, 'F');
      
      // Caja principal elegante
      pdf.setFillColor(white[0], white[1], white[2]);
      pdf.setDrawColor(pucpAccentBlue[0], pucpAccentBlue[1], pucpAccentBlue[2]);
      pdf.setLineWidth(1);
      pdf.rect(margin, currentY, usableWidth, studentBoxHeight, 'FD');
      
      // Barra superior azul elegante
      pdf.setFillColor(pucpBlue[0], pucpBlue[1], pucpBlue[2]);
      pdf.rect(margin, currentY, usableWidth, 4, 'F');
      
      // Línea decorativa fina bajo la barra
      pdf.setDrawColor(pucpSkyBlue[0], pucpSkyBlue[1], pucpSkyBlue[2]);
      pdf.setLineWidth(0.3);
      pdf.line(margin, currentY + 4, pageWidth - margin, currentY + 4);
      
      currentY += 12;
      
      // Título de sección compacto pero visible
      pdf.setFontSize(15);
      pdf.setTextColor(pucpDarkBlue[0], pucpDarkBlue[1], pucpDarkBlue[2]);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Información del Estudiante', margin + 5, currentY);
      
      // Línea decorativa bajo el título
      pdf.setDrawColor(pucpBlue[0], pucpBlue[1], pucpBlue[2]);
      pdf.setLineWidth(1);
      pdf.line(margin+5, currentY + 2, margin + 90, currentY + 2);
      
      currentY += 10;
      
      // Grid de información bien separado y organizado
      const colWidth = usableWidth / 3;
      pdf.setFontSize(11);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(elegantGray[0], elegantGray[1], elegantGray[2]);
      
      // Primera fila - Etiquetas
      pdf.text('Código:', margin + 5, currentY);
      pdf.text('Nombre Completo:', margin + colWidth, currentY);
      pdf.text('Curso:', margin + colWidth * 2, currentY);
      
      currentY += 5;
      
      // Primera fila - Valores
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(pucpBlue[0], pucpBlue[1], pucpBlue[2]);
      pdf.setFontSize(11);
      pdf.text(student.code || 'N/A', margin + 5, currentY);
      const fullName = `${student.name || ''} ${student.lastname || ''}`.trim() || 'N/A';
      pdf.text(fullName, margin + colWidth, currentY);
      pdf.text(course || 'N/A', margin + colWidth * 2, currentY);
      
      currentY += 8;
      
      // Segunda fila - Etiquetas
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(elegantGray[0], elegantGray[1], elegantGray[2]);
      pdf.setFontSize(11);
      pdf.text('Laboratorio:', margin + 5, currentY);
      pdf.text('Jefe de Práctica:', margin + colWidth, currentY);
      pdf.text('Email:', margin + colWidth * 2, currentY);
      
      currentY += 5;
      
      // Segunda fila - Valores
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(pucpBlue[0], pucpBlue[1], pucpBlue[2]);
      pdf.setFontSize(11);
      pdf.text(`Lab ${labNumber}` || 'N/A', margin + 5, currentY);
      pdf.text(reviewer.name || 'N/A', margin + colWidth, currentY);
      pdf.text(reviewer.email || 'N/A', margin + colWidth * 2, currentY);
      
      currentY += 20;

      // EVALUACIÓN DETALLADA - Título protagonista bien separado
      pdf.setFontSize(15);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(pucpDarkBlue[0], pucpDarkBlue[1], pucpDarkBlue[2]);
      pdf.text('Detalle', margin, currentY);
      
      // Línea decorativa bajo el título más prominente
      pdf.setDrawColor(pucpBlue[0], pucpBlue[1], pucpBlue[2]);
      pdf.setLineWidth(1);
      pdf.line(margin, currentY + 2, margin + 90, currentY + 2);
      
      currentY += 10;

      let questionNumber = 1;
      let totalObtained = 0;
      let totalMaximum = 0;

      items.forEach((item) => {
        checkPageBreak(35);

        // Contenedor de pregunta ultra elegante
        const questionHeight = 10 + (item.subItems.length * 7) + 15;
        
        // Sombra con más profundidad
        pdf.setFillColor(180, 180, 180);
        pdf.rect(margin + 2, currentY + 2, usableWidth, questionHeight, 'F');
        
        // Fondo principal con borde elegante
        pdf.setFillColor(255, 255, 255);
        pdf.setDrawColor(pucpBlue[0], pucpBlue[1], pucpBlue[2]);
        pdf.setLineWidth(0.5);
        pdf.rect(margin, currentY, usableWidth, questionHeight, 'FD');
        
        // Header de pregunta con gradiente mejorado
        pdf.setFillColor(pucpLightBlue[0], pucpLightBlue[1], pucpLightBlue[2]);
        pdf.rect(margin, currentY, usableWidth, 10, 'F');
        
        // Número de pregunta ultra elegante con círculo más grande
        pdf.setFillColor(pucpBlue[0], pucpBlue[1], pucpBlue[2]);
        pdf.circle(margin + 10, currentY + 5, 4, 'F');
        
        // Borde del círculo
        pdf.setDrawColor(pucpDarkBlue[0], pucpDarkBlue[1], pucpDarkBlue[2]);
        pdf.setLineWidth(0.3);
        pdf.circle(margin + 10, currentY + 5, 4, 'S');
        
        pdf.setFontSize(11);
        pdf.setTextColor(255, 255, 255);
        pdf.setFont('helvetica', 'bold');
        pdf.text(questionNumber.toString(), margin + 10, currentY + 6.5, { align: 'center' });
        
        // Título de pregunta con mejor tipografía
        pdf.setTextColor(pucpDarkBlue[0], pucpDarkBlue[1], pucpDarkBlue[2]);
        pdf.setFontSize(12);
        pdf.setFont('helvetica', 'bold');
        const questionTitle = item.name || `Pregunta ${questionNumber}`;
        pdf.text(questionTitle, margin + 20, currentY + 6.5);
        
        currentY += 10;

        // Tabla elegante con header mejorado y más espaciado
        const colWidths = [usableWidth * 0.42, usableWidth * 0.15, usableWidth * 0.15, usableWidth * 0.28];
        const tableHeaders = ['CRITERIO DE EVALUACIÓN', 'OBTENIDO', 'MÁXIMO', 'OBSERVACIONES'];

        // Header de tabla con estilo premium
        pdf.setFillColor(pucpDarkBlue[0], pucpDarkBlue[1], pucpDarkBlue[2]);
        pdf.rect(margin, currentY, usableWidth, 7, 'F');
        
        // Línea decorativa en el header con azul elegante
        pdf.setDrawColor(pucpSkyBlue[0], pucpSkyBlue[1], pucpSkyBlue[2]);
        pdf.setLineWidth(0.5);
        pdf.line(margin, currentY, pageWidth - margin, currentY);
        
        pdf.setFontSize(8);
        pdf.setTextColor(255, 255, 255);
        pdf.setFont('helvetica', 'bold');
        
        let xPos = margin + 3;
        tableHeaders.forEach((header, i) => {
          if (i === 1 || i === 2) {
            // Centrar las columnas de puntajes
            pdf.text(header, xPos + (colWidths[i] / 2), currentY + 4.5, { align: 'center' });
          } else {
            // Alinear a la izquierda las otras columnas
            pdf.text(header, xPos, currentY + 4.5);
          }
          xPos += colWidths[i];
        });
        
        currentY += 7;

        // Filas de datos con observaciones completas y altura dinámica
        item.subItems.forEach((subItem, subIndex) => {
          const obs = subItem.obs || 'Ninguna';
          
          // Calcular altura dinámica basada en observaciones
          const obsMaxWidth = colWidths[3] - 8; // Ancho disponible para observaciones
          const obsLines = pdf.splitTextToSize(obs, obsMaxWidth);
          const itemName = subItem.name || `Ítem ${subIndex + 1}`;
          const itemLines = pdf.splitTextToSize(`• ${itemName}`, colWidths[0] - 8);
          
          const maxLines = Math.max(obsLines.length, itemLines.length, 1);
          const rowHeight = Math.max(7, maxLines * 3.5 + 4); // Altura dinámica
          
          // Fondo alternado elegante con altura dinámica
          if (subIndex % 2 === 0) {
            pdf.setFillColor(lightGray[0], lightGray[1], lightGray[2]);
            pdf.rect(margin, currentY, usableWidth, rowHeight, 'F');
          }
          
          // Bordes sutiles pero visibles
          pdf.setDrawColor(220, 226, 235);
          pdf.setLineWidth(0.2);
          pdf.rect(margin, currentY, usableWidth, rowHeight, 'S');
          
          pdf.setFontSize(8);
          pdf.setTextColor(elegantGray[0], elegantGray[1], elegantGray[2]);
          pdf.setFont('helvetica', 'normal');
          
          xPos = margin + 3;
          
          // Nombre del ítem con salto de línea automático
          let lineY = currentY + 3;
          itemLines.forEach((line: string, lineIndex: number) => {
            pdf.text(line, xPos, lineY + (lineIndex * 3.5));
          });
          xPos += colWidths[0];
          
          // Puntaje obtenido centrado perfectamente
          pdf.setFont('helvetica', 'bold');
          pdf.setTextColor(successBlue[0], successBlue[1], successBlue[2]);
          const obtainedScore = parseFloat(subItem.score || '0');
          const obtainedText = obtainedScore.toFixed(1);
          pdf.text(obtainedText, xPos + (colWidths[1] / 2), currentY + (rowHeight / 2), { align: 'center' });
          xPos += colWidths[1];
          
          // Puntaje máximo centrado perfectamente
          pdf.setTextColor(pucpBlue[0], pucpBlue[1], pucpBlue[2]);
          const maxScore = parseFloat(subItem.max || '0');
          const maxText = maxScore.toFixed(1);
          pdf.text(maxText, xPos + (colWidths[2] / 2), currentY + (rowHeight / 2), { align: 'center' });
          xPos += colWidths[2];
          
          // Observaciones completas con salto de línea automático
          pdf.setFont('helvetica', 'italic');
          pdf.setTextColor(mediumGray[0], mediumGray[1], mediumGray[2]);
          pdf.setFontSize(7);
          
          lineY = currentY + 3;
          obsLines.forEach((line: string, lineIndex: number) => {
            pdf.text(line, xPos, lineY + (lineIndex * 3.5));
          });
          
          // Sumar puntajes
          totalObtained += obtainedScore;
          totalMaximum += maxScore;
          
          currentY += rowHeight;
        });

        currentY += 8;
        questionNumber++;
      });

      // PUNTAJE TOTAL - Diseño espectacular al final
      checkPageBreak(35);
      
      currentY += 20;
      
      // Separador elegante con azul
      pdf.setDrawColor(pucpBlue[0], pucpBlue[1], pucpBlue[2]);
      pdf.setLineWidth(2);
      pdf.line(margin, currentY, pageWidth - margin, currentY);
      currentY += 10;

      // Título del resumen con estilo premium
      pdf.setFontSize(18);
      pdf.setTextColor(pucpBlue[0], pucpBlue[1], pucpBlue[2]);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Nota Final', pageWidth / 2, currentY, { align: 'center' });
      currentY += 5;

      // Caja del puntaje total ultra elegante
      const boxHeight = 30;
      const boxY = currentY;
      
      // Sombra profunda
      pdf.setFillColor(180, 180, 180);
      pdf.rect(margin + 3, boxY + 3, usableWidth, boxHeight, 'F');
      
      // Fondo principal con gradiente
      pdf.setFillColor(pucpLightBlue[0], pucpLightBlue[1], pucpLightBlue[2]);
      pdf.rect(margin, boxY, usableWidth, boxHeight, 'F');
      
      // Borde elegante doble
      pdf.setDrawColor(pucpBlue[0], pucpBlue[1], pucpBlue[2]);
      pdf.setLineWidth(1.5);
      pdf.rect(margin, boxY, usableWidth, boxHeight, 'S');
      
      // Barra superior azul elegante
      pdf.setFillColor(pucpBlue[0], pucpBlue[1], pucpBlue[2]);
      pdf.rect(margin, boxY, usableWidth, 4, 'F');

      // Puntaje principal ultra elegante
      pdf.setFontSize(18);
      pdf.setTextColor(pucpDarkBlue[0], pucpDarkBlue[1], pucpDarkBlue[2]);
      pdf.setFont('helvetica', 'bold');
      const scoreText = `${totalObtained.toFixed(1)} / ${totalMaximum.toFixed(1)}`;
      pdf.text(scoreText, margin + 30, boxY + 18);

      // Porcentaje con colores azules dinámicos
      const percentage = totalMaximum > 0 ? ((totalObtained / totalMaximum) * 100) : 0;
      pdf.setFontSize(18);
      
      if (percentage >= 90) pdf.setTextColor(successBlue[0], successBlue[1], successBlue[2]);
      else if (percentage >= 70) pdf.setTextColor(warningBlue[0], warningBlue[1], warningBlue[2]);
      else pdf.setTextColor(pucpNavyBlue[0], pucpNavyBlue[1], pucpNavyBlue[2]); // Azul marino para bajo rendimiento
      
      pdf.text(`${percentage.toFixed(1)}%`, pageWidth - margin - 40, boxY + 18);

      // Etiquetas descriptivas elegantes
      pdf.setFontSize(8);
      pdf.setTextColor(mediumGray[0], mediumGray[1], mediumGray[2]);
      pdf.setFont('helvetica', 'normal');
      pdf.text('PUNTAJE TOTAL OBTENIDO', margin + 30, boxY + 24);
      pdf.text('PORCENTAJE DE LOGRO', pageWidth - margin - 40, boxY + 24);
      
      // Barra de progreso ultra moderna
      const progressBarY = boxY + 27;
      const progressWidth = usableWidth * 0.75;
      const progressX = margin + (usableWidth - progressWidth) / 2;
      
      // Fondo de la barra con sombra
      pdf.setFillColor(220, 220, 220);
      pdf.rect(progressX + 1, progressBarY + 1, progressWidth, 3, 'F');
      pdf.setFillColor(240, 240, 240);
      pdf.rect(progressX, progressBarY, progressWidth, 3, 'F');
      
      // Progreso actual con azules
      const progressFill = (progressWidth * percentage) / 100;
      if (percentage >= 90) pdf.setFillColor(successBlue[0], successBlue[1], successBlue[2]);
      else if (percentage >= 70) pdf.setFillColor(warningBlue[0], warningBlue[1], warningBlue[2]);
      else pdf.setFillColor(pucpNavyBlue[0], pucpNavyBlue[1], pucpNavyBlue[2]);
      
      pdf.rect(progressX, progressBarY, progressFill, 3, 'F');

      // Footer ultra elegante con azules
      const addFooter = () => {
        // Línea decorativa azul elegante
        pdf.setDrawColor(pucpBlue[0], pucpBlue[1], pucpBlue[2]);
        pdf.setLineWidth(1.2);
        pdf.line(margin, pageHeight - 25, pageWidth - margin, pageHeight - 25);
        
        // Línea más fina debajo para elegancia
        pdf.setDrawColor(pucpSkyBlue[0], pucpSkyBlue[1], pucpSkyBlue[2]);
        pdf.setLineWidth(0.3);
        pdf.line(margin, pageHeight - 24, pageWidth - margin, pageHeight - 24);
        
        pdf.setFontSize(8);
        pdf.setTextColor(mediumGray[0], mediumGray[1], mediumGray[2]);
        pdf.setFont('helvetica', 'normal');
        
        // Información institucional con mejor formato
        pdf.setFont('helvetica', 'bold');
        pdf.text('PUCP', margin, pageHeight - 18);
        pdf.setFont('helvetica', 'normal');
        pdf.text(`${reviewer.email || 'evaluacion@pucp.edu.pe'}`, margin, pageHeight - 14);
        
        // Información del documento con mejor alineación
        pdf.text(`${student.code} - ${course} - Lab ${labNumber}`, pageWidth - margin, pageHeight - 18, { align: 'right' });
        pdf.text(`${new Date().toLocaleString('es-ES')}`, pageWidth - margin, pageHeight - 14, { align: 'right' });
        
        // Número de página centrado con estilo
        pdf.setFontSize(9);
        pdf.setTextColor(pucpBlue[0], pucpBlue[1], pucpBlue[2]);
        pdf.setFont('helvetica', 'bold');
        pdf.text('Página 1', pageWidth / 2, pageHeight - 10, { align: 'center' });
      };

      addFooter();

      const filename = `Retroalimentacion_${student.name || 'Estudiante'}_Lab${labNumber}_${new Date().toISOString().split('T')[0]}.pdf`;
      pdf.save(filename);

    } catch (error) {
      console.error('Error al generar PDF:', error);
      alert('Error al generar el PDF. Intente nuevamente.');
    }
  };

  const exportToExcel = async () => {
    const XLSX = await import('xlsx');
    
    const workbook = XLSX.utils.book_new();
    
    // Hoja 1: Información general
    const generalData = [
      ['RETROALIMENTACIÓN ACADÉMICA'],
      [''],
      ['Código del Estudiante', student.code],
      ['Nombre Completo', `${student.name} ${student.lastname}`],
      ['Curso', course],
      ['Laboratorio', labNumber],
      ['Revisor', reviewer.name],
      ['Correo del Revisor', reviewer.email],
      ['Fecha', new Date().toLocaleDateString('es-ES')],
      [''],
      ['EVALUACIÓN DETALLADA'],
      ['']
    ];
    
    // Agregar preguntas y subsecciones
    items.forEach((item) => {
      generalData.push([`${item.name}`, '', '', '']);
      generalData.push(['Ítem', 'Puntaje Obtenido', 'Puntaje Máximo', 'Observaciones']);
      
      item.subItems.forEach(sub => {
        generalData.push([sub.name, sub.score, sub.max, sub.obs]);
      });
      
      generalData.push(['']);
    });
    
    generalData.push(['TOTAL', total.toFixed(1), totalMax.toFixed(1), `${totalMax > 0 ? ((total / totalMax) * 100).toFixed(1) : '0'}%`]);
    
    const worksheet = XLSX.utils.aoa_to_sheet(generalData);
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Retroalimentación');
    
    // Filename format: codigo_curso_L1
    const filename = `${student.code}_${course.replace(/\s+/g, '_')}_L${labNumber}.xlsx`;
    XLSX.writeFile(workbook, filename);
  };

  // TODO: Export to PDF/Excel handlers

  return (
    <ProtectedRoute>
      <div className="min-h-screen" style={{ backgroundColor: '#f8fafc' }}>
      {/* Header simplificado y profesional */}
      <div className="border-b-2" style={{ backgroundColor: '#ffffff', borderColor: '#1e40af' }}>
        <div className="max-w-6xl mx-auto px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#1e40af' }}>
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold" style={{ color: '#1e40af' }}>Retroalimentación Académica</h1>
                <p className="text-sm" style={{ color: '#64748b' }}>Pontificia Universidad Católica del Perú</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-xs font-medium" style={{ color: '#64748b' }}>Fecha de Evaluación</div>
                <div className="text-sm font-semibold" style={{ color: '#1e40af' }}>{new Date().toLocaleDateString('es-ES')}</div>
              </div>
              <button
                onClick={handleLogout}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white hover:bg-red-700 transition-colors"
                style={{ backgroundColor: '#dc2626' }}
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Cerrar Sesión
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-8 py-8">
        <div id="feedback-content" className="rounded-lg border" style={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0' }}>
          
          {/* Marca de agua sutil */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-3 z-0">
            <div className="transform -rotate-45 text-6xl font-bold" style={{ color: '#f1f5f9' }}>
              PUCP
            </div>
          </div>
          
          {/* Información del estudiante - más clara */}
          <div className="relative z-10 px-8 py-6 border-b" style={{ backgroundColor: '#f8fafc', borderColor: '#e2e8f0' }}>
            <h2 className="text-lg font-bold mb-6" style={{ color: '#1f2937' }}>INFORMACIÓN DEL ESTUDIANTE</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div>
                <label className="block text-sm font-bold mb-2" style={{ color: '#374151' }}>Código:</label>
                <input 
                  name="code" 
                  value={student.code} 
                  onChange={handleStudent} 
                  maxLength={10} 
                  className="w-full px-3 py-2 border rounded-md text-sm font-semibold"
                  style={{ backgroundColor: '#ffffff', borderColor: '#d1d5db', color: '#1f2937' }}
                  placeholder="20220979" 
                  required 
                />
              </div>
              <div>
                <label className="block text-sm font-bold mb-2" style={{ color: '#374151' }}>Nombres:</label>
                <input 
                  name="name" 
                  value={student.name} 
                  onChange={handleStudent} 
                  className="w-full px-3 py-2 border rounded-md text-sm font-semibold"
                  style={{ backgroundColor: '#ffffff', borderColor: '#d1d5db', color: '#1f2937' }}
                  placeholder="Nombres del estudiante" 
                  required 
                />
              </div>
              <div>
                <label className="block text-sm font-bold mb-2" style={{ color: '#374151' }}>Apellidos:</label>
                <input 
                  name="lastname" 
                  value={student.lastname} 
                  onChange={handleStudent} 
                  className="w-full px-3 py-2 border rounded-md text-sm font-semibold"
                  style={{ backgroundColor: '#ffffff', borderColor: '#d1d5db', color: '#1f2937' }}
                  placeholder="Apellidos del estudiante" 
                  required 
                />
              </div>
              <div>
                <label className="block text-sm font-bold mb-2" style={{ color: '#374151' }}>Curso:</label>
                <input 
                  value={course} 
                  onChange={(e) => setCourse(e.target.value)} 
                  className="w-full px-3 py-2 border rounded-md text-sm font-semibold"
                  style={{ backgroundColor: '#ffffff', borderColor: '#d1d5db', color: '#1f2937' }}
                  placeholder="Nombre del curso" 
                  required 
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
              <div>
                <label className="block text-sm font-bold mb-2" style={{ color: '#374151' }}>Laboratorio Nº:</label>
                <input 
                  value={labNumber} 
                  onChange={(e) => setLabNumber(onlyNumbers(e.target.value))} 
                  className="w-full px-3 py-2 border rounded-md text-sm font-semibold"
                  style={{ backgroundColor: '#eff6ff', borderColor: '#3b82f6', color: '#1e40af' }}
                  placeholder="1" 
                  required 
                />
              </div>
              <div>
                <label className="block text-sm font-bold mb-2" style={{ color: '#374151' }}>Revisor:</label>
                <input 
                  name="name" 
                  value={reviewer.name} 
                  onChange={handleReviewer} 
                  className="w-full px-3 py-2 border rounded-md text-sm font-semibold"
                  style={{ backgroundColor: '#ffffff', borderColor: '#d1d5db', color: '#1f2937' }}
                  placeholder="Nombre del profesor" 
                  required 
                />
              </div>
              <div>
                <label className="block text-sm font-bold mb-2" style={{ color: '#374151' }}>Correo:</label>
                <input 
                  name="email" 
                  value={reviewer.email} 
                  onChange={handleReviewer} 
                  className="w-full px-3 py-2 border rounded-md text-sm font-semibold"
                  style={{ backgroundColor: '#ffffff', borderColor: '#d1d5db', color: '#1f2937' }}
                  placeholder="profesor@pucp.edu.pe" 
                  type="email" 
                  required 
                />
              </div>
            </div>
          </div>

          {/* Evaluación - diseño más claro y enfocado */}
          <div className="relative z-10 px-8 py-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold" style={{ color: '#1f2937' }}>EVALUACIÓN DETALLADA</h2>
              <button 
                type="button" 
                onClick={addItem} 
                className="inline-flex items-center px-4 py-2 border text-sm font-semibold rounded-md"
                style={{ backgroundColor: '#3b82f6', borderColor: '#3b82f6', color: '#ffffff' }}
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Agregar Pregunta
              </button>
            </div>

            <div className="space-y-8">
              {items.map((item, i) => (
                <div key={i} className="border rounded-lg p-6" style={{ backgroundColor: '#ffffff', borderColor: '#d1d5db' }}>
                  
                  {/* Número de pregunta MÁS NOTORIO */}
                  <div className="flex items-center gap-4 mb-6">
                    <div className="flex-shrink-0 w-14 h-14 rounded-lg flex items-center justify-center text-white text-xl font-bold" style={{ backgroundColor: '#1e40af' }}>
                      {i + 1}
                    </div>
                    <input
                      className="flex-1 px-4 py-3 border rounded-lg text-base font-bold"
                      style={{ backgroundColor: '#f8fafc', borderColor: '#d1d5db', color: '#1f2937' }}
                      placeholder={`PREGUNTA ${i + 1}`}
                      value={item.name}
                      onChange={e => handleItemName(i, e.target.value)}
                      required
                    />
                    <button 
                      type="button" 
                      onClick={() => removeItem(i)} 
                      className="p-2 rounded-md" 
                      style={{ backgroundColor: '#fee2e2', color: '#dc2626' }}
                      disabled={items.length === 1}
                      title="Eliminar pregunta"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                  
                  {/* Tabla más clara y legible */}
                  <div className="overflow-hidden rounded-md border" style={{ borderColor: '#d1d5db' }}>
                    <div className="px-4 py-3" style={{ backgroundColor: '#1f2937' }}>
                      <div className="grid grid-cols-12 gap-4 text-sm font-bold uppercase text-white">
                        <div className="col-span-5">ÍTEM / SUBSECCIÓN</div>
                        <div className="col-span-2 text-center">PUNTAJE OBTENIDO</div>
                        <div className="col-span-2 text-center">PUNTAJE MÁXIMO</div>
                        <div className="col-span-2 text-center">OBSERVACIONES</div>
                        <div className="col-span-1"></div>
                      </div>
                    </div>
                    
                    <div style={{ backgroundColor: '#ffffff' }}>
                      {item.subItems.map((sub, j) => (
                        <div key={j} className="grid grid-cols-12 gap-4 items-center px-4 py-3 border-b last:border-b-0" style={{ borderColor: '#f3f4f6' }}>
                          <input
                            className="col-span-5 px-3 py-2 border rounded text-sm font-medium"
                            style={{ backgroundColor: '#ffffff', borderColor: '#d1d5db', color: '#1f2937', minWidth: '200px' }}
                            placeholder="Nombre del ítem..."
                            value={sub.name}
                            onChange={e => handleSubItem(i, j, "name", e.target.value)}
                            required
                          />
                          <input
                            className="col-span-2 px-3 py-2 border rounded text-sm text-center font-bold"
                            style={{ backgroundColor: '#f0fdf4', borderColor: '#22c55e', color: '#166534' }}
                            placeholder="0.0"
                            value={sub.score}
                            onChange={e => handleSubItem(i, j, "score", e.target.value)}
                            inputMode="decimal"
                            required
                          />
                          <input
                            className="col-span-2 px-3 py-2 border rounded text-sm text-center font-bold"
                            style={{ backgroundColor: '#eff6ff', borderColor: '#3b82f6', color: '#1e40af' }}
                            placeholder="0.0"
                            value={sub.max}
                            onChange={e => handleSubItem(i, j, "max", e.target.value)}
                            inputMode="decimal"
                            required
                          />
                          <input
                            className="col-span-2 px-3 py-2 border rounded text-sm"
                            style={{ backgroundColor: '#fffbeb', borderColor: '#f59e0b', color: '#92400e', minWidth: '150px' }}
                            placeholder="Comentarios..."
                            value={sub.obs}
                            onChange={e => handleSubItem(i, j, "obs", e.target.value)}
                          />
                          <button 
                            type="button" 
                            onClick={() => removeSubItem(i, j)} 
                            className="col-span-1 p-2 rounded" 
                            style={{ backgroundColor: '#fee2e2', color: '#dc2626' }}
                            disabled={item.subItems.length === 1}
                            title="Eliminar ítem"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                            </svg>
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <button 
                    type="button" 
                    onClick={() => addSubItem(i)} 
                    className="mt-4 inline-flex items-center px-3 py-2 border text-sm font-medium rounded-md"
                    style={{ backgroundColor: '#f0f9ff', borderColor: '#3b82f6', color: '#1e40af' }}
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Agregar Ítem
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Puntaje total MÁS NOTORIO */}
          <div className="relative z-10 px-8 py-6 border-t-2" style={{ backgroundColor: '#f8fafc', borderColor: '#1e40af' }}>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold mb-2" style={{ color: '#1f2937' }}>PUNTAJE TOTAL</h3>
                <p className="text-sm" style={{ color: '#64748b' }}>Suma automática de todos los puntajes obtenidos</p>
              </div>
              <div className="text-right rounded-lg px-8 py-4 border-2" style={{ backgroundColor: '#ffffff', borderColor: '#1e40af' }}>
                <div className="text-3xl font-bold mb-1" style={{ color: '#1f2937' }}>
                  {total.toFixed(1)} <span className="text-xl" style={{ color: '#64748b' }}>/ {totalMax.toFixed(1)}</span>
                </div>
                <div className="text-lg font-bold" style={{ color: '#059669' }}>
                  {totalMax > 0 ? `${((total / totalMax) * 100).toFixed(1)}%` : '0%'}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Botones simplificados */}
        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <button 
            onClick={exportToPDF}
            className="inline-flex items-center px-6 py-3 border text-base font-bold rounded-md shadow-sm"
            style={{ backgroundColor: '#dc2626', borderColor: '#dc2626', color: '#ffffff' }}
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Exportar a PDF
          </button>
          <button 
            onClick={exportToExcel}
            className="inline-flex items-center px-6 py-3 border text-base font-bold rounded-md shadow-sm"
            style={{ backgroundColor: '#059669', borderColor: '#059669', color: '#ffffff' }}
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Exportar a Excel
          </button>
        </div>
      </div>
    </div>
    </ProtectedRoute>
  );
}
