import { Injectable } from '@angular/core';
import { Student, Grades, Subject, Class } from '../../../shared/interfaces/models';
import { GradeService } from '../../grades/services/grade.service';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

interface StudentReport {
  pdfGenerated: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ReportService {
  constructor(private gradeService: GradeService) {}

  generateMockReport(): StudentReport {
    // 🔹 Mock de aluno
    const student: Student = {
      uniqueId: '1',
      name: 'João Silva',
      birthDate: new Date('2010-05-15'),
      refClass: '1',
      schoolYear: '2024'
    };

    // 🔹 Mock de turma
    const classObj: Class = {
      uniqueId: '1',
      name: 'Turma A',
      schoolYear: '2024'
    };

    // 🔹 Mock de matérias
    const subjects: Subject[] = [
      { uniqueId: 'math', name: 'Matemática' },
      { uniqueId: 'portuguese', name: 'Português' },
      { uniqueId: 'science', name: 'Ciências' }
    ];

    // 🔹 Mock de notas por bimestre
    const grades: Grades[] = [
      {
        refSubject: 'math', refBimester: '1', p1: 8.5, p2: 7.5, rec: 0,
        uniqueId: '',
        average: 0,
        refStudent: ''
      },
      {
        refSubject: 'portuguese', refBimester: '1', p1: 6.0, p2: 7.0, rec: 8.0,
        uniqueId: '',
        average: 0,
        refStudent: ''
      },
      {
        refSubject: 'science', refBimester: '2', p1: 9.0, p2: 8.5, rec: 0,
        uniqueId: '',
        average: 0,
        refStudent: ''
      },
      {
        refSubject: 'math', refBimester: '3', p1: 7.0, p2: 6.5, rec: 7.5,
        uniqueId: '',
        average: 0,
        refStudent: ''
      },
      {
        refSubject: 'portuguese', refBimester: '4', p1: 6.5, p2: 7.5, rec: 0,
        uniqueId: '',
        average: 0,
        refStudent: ''
      }
    ];

    return this.generateStudentReport(student, grades, subjects, classObj);
  }

  generateStudentReport(student: Student, grades: Grades[], subjects: Subject[], classObj: Class): StudentReport {
    const doc = new jsPDF();
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.text(`Boletim Escolar`, 105, 15, { align: 'center' });

    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text(`Aluno: ${student.name}`, 20, 30);
    doc.text(`Turma: ${classObj.name}`, 20, 40);
    doc.text(`Ano Letivo: ${student.schoolYear}`, 150, 40);

    let startY = 50;

    const organizedGrades = this.organizeGradesBySubject(grades, subjects);

    Object.keys(organizedGrades).forEach(bimester => {
      const bimesterGrades = organizedGrades[bimester];

      if (bimesterGrades.length > 0) {
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text(`${bimester}º Bimestre`, 20, startY);
        startY += 10;

        const tableData = bimesterGrades.map(g => [
          g.subject,
          g.p1 ?? '-',
          g.p2 ?? '-',
          g.average ?? '-',
          g.rec ?? '-'
        ]);

        (doc as any).autoTable({
          startY,
          head: [['Matéria', 'P1', 'P2', 'Média', 'Recuperação']],
          body: tableData,
          theme: 'striped',
          headStyles: { fillColor: [41, 128, 185], textColor: [255, 255, 255], fontStyle: 'bold' },
          columnStyles: { 0: { cellWidth: 50 } },
        });

        startY = (doc as any).lastAutoTable.finalY + 10;
      }
    });

    doc.save(`boletim_${student.name.replace(' ', '_')}_${student.schoolYear}.pdf`);
    return { pdfGenerated: true };
  }

  private organizeGradesBySubject(grades: Grades[], subjects: Subject[]): Record<string, any[]> {
    const organizedGrades: Record<string, any[]> = {
      '1': [],
      '2': [],
      '3': [],
      '4': []
    };

    subjects.forEach(subject => {
      const subjectGrades = grades.filter(g => g.refSubject === subject.uniqueId);

      subjectGrades.forEach(g => {
        if (organizedGrades[g.refBimester]) {
          organizedGrades[g.refBimester].push({
            subject: subject.name,
            p1: g.p1,
            p2: g.p2,
            average: this.gradeService.calculateAverage(g.p1, g.p2),
            rec: g.rec
          });
        }
      });
    });

    return organizedGrades;
  }
}
