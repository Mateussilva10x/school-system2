import { Injectable } from '@angular/core';
import { Student, Grades, Subject, Class } from '../../../shared/interfaces/models';
import { GradeService } from '../../grades/services/grade.service';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

interface ReportData {
  student: Student;
  grades: Grades[];
  class: Class;
  subjects: Subject[];
}

interface StudentReport {
  // Add properties for the StudentReport interface
}

@Injectable({
  providedIn: 'root'
})
export class ReportService {
  constructor(private gradeService: GradeService) {}

  generateStudentReport(student: Student, grades: Grades[], subjects: Subject[], class: Class): StudentReport {
    const doc = new jsPDF();
    const organizedGrades = this.organizeGradesBySubject(grades, subjects);

    // Cabeçalho
    doc.setFontSize(16);
    doc.text(`BOLETIM ESCOLAR: ${student.schoolYear}`, 105, 20, { align: 'center' });
    
    doc.setFontSize(12);
    doc.text(`Escola: Nome da Escola`, 20, 40);
    doc.text(`Nome: ${student.name}`, 20, 50);
    doc.text(`Turma: ${class.name}`, 20, 60);
    doc.text(`Nº ano: ${student.schoolYear}`, 150, 60);

    // Tabela de notas
    const tableData = [];
    subjects.forEach(subject => {
      const subjectGrades = organizedGrades[subject.name];
      tableData.push([
        subject.name,
        // 1º Bimestre
        subjectGrades.bimester1.p1,
        subjectGrades.bimester1.p2,
        subjectGrades.bimester1.average,
        subjectGrades.bimester1.rec,
        // 2º Bimestre
        subjectGrades.bimester2.p1,
        subjectGrades.bimester2.p2,
        subjectGrades.bimester2.average,
        subjectGrades.bimester2.rec,
        // 3º Bimestre
        subjectGrades.bimester3.p1,
        subjectGrades.bimester3.p2,
        subjectGrades.bimester3.average,
        subjectGrades.bimester3.rec,
        // 4º Bimestre
        subjectGrades.bimester4.p1,
        subjectGrades.bimester4.p2,
        subjectGrades.bimester4.average,
        subjectGrades.bimester4.rec,
      ]);
    });

    // Configuração da tabela
    (doc as any).autoTable({
      startY: 70,
      head: [[
        'Componentes\nCurriculares',
        'P1', 'P2', 'M', 'R',  // 1º Bim
        'P1', 'P2', 'M', 'R',  // 2º Bim
        'P1', 'P2', 'M', 'R',  // 3º Bim
        'P1', 'P2', 'M', 'R',  // 4º Bim
      ]],
      body: tableData,
      theme: 'grid',
      headStyles: { fillColor: [200, 200, 200], textColor: [0, 0, 0], fontStyle: 'bold' },
      columnStyles: {
        0: { cellWidth: 40 },
      },
      didDrawPage: (data: any) => {
        // Adicionar observações dos bimestres no rodapé
        const finalY = data.cursor.y + 20;
        doc.text(`1º Bim: ____________________`, 20, finalY);
        doc.text(`2º Bim: ____________________`, 20, finalY + 10);
        doc.text(`3º Bim: ____________________`, 20, finalY + 20);
        doc.text(`4º Bim: ____________________`, 20, finalY + 30);
      }
    });

    // Salvar o PDF
    doc.save(`boletim_${student.name.replace(' ', '_')}_${student.schoolYear}.pdf`);
    return {} as StudentReport;
  }

  private organizeGradesBySubject(grades: Grades[], subjects: Subject[]) {
    const organizedGrades = {};
    
    subjects.forEach(subject => {
      const subjectGrades = grades.filter(g => g.refSubject === subject.uniqueId);
      organizedGrades[subject.name] = {
        bimester1: this.getBimesterGrades(subjectGrades, '1'),
        bimester2: this.getBimesterGrades(subjectGrades, '2'),
        bimester3: this.getBimesterGrades(subjectGrades, '3'),
        bimester4: this.getBimesterGrades(subjectGrades, '4')
      };
    });

    return organizedGrades;
  }

  private getBimesterGrades(grades: Grades[], bimester: string) {
    const bimesterGrade = grades.find(g => g.refBimester === bimester);
    if (!bimesterGrade) return { p1: '-', p2: '-', average: '-', rec: '-' };

    return {
      p1: bimesterGrade.p1,
      p2: bimesterGrade.p2,
      average: this.gradeService.calculateAverage(bimesterGrade.p1, bimesterGrade.p2),
      rec: bimesterGrade.rec
    };
  }
}
