package com.medic.report;

import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.*;
import com.itextpdf.layout.properties.TextAlignment;
import com.itextpdf.layout.properties.UnitValue;
import com.medic.medication.DosageDTO;
import com.medic.result.DiagnosisDTO;

import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.time.format.DateTimeFormatter;

@Service
public class PdfReportService {

    public byte[] generatePdfReport(Report report) {
        try (ByteArrayOutputStream baos = new ByteArrayOutputStream()) {
            PdfWriter writer = new PdfWriter(baos);
            PdfDocument pdfDoc = new PdfDocument(writer);
            Document document = new Document(pdfDoc);

            // Title
            document.add(new Paragraph("MEDICAL REPORT")
                .setTextAlignment(TextAlignment.CENTER)
                .setBold()
                .setFontSize(18));
            document.add(new Paragraph("\n"));

            // Patient Information
            addSectionHeader(document, "PATIENT INFORMATION");
            Table patientTable = createTable(2);
            addTableRow(patientTable, "Patient Name:", report.getPatientName());
            addTableRow(patientTable, "Patient ID:", String.valueOf(report.getId()));
            addTableRow(patientTable, "Gender:", report.getGender());
            addTableRow(patientTable, "Age:", report.getAge() + " years");
            addTableRow(patientTable, "Report Date:", 
                report.getReportDate().toLocalDateTime().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm")));
            document.add(patientTable);
            document.add(new Paragraph("\n"));

            // Vitals Section
            if (report.getVitals() != null) {
                addSectionHeader(document, "VITAL SIGNS");
                Table vitalsTable = createTable(2);
                addTableRow(vitalsTable, "Temperature:", report.getVitals().getTemperature() + " °C");
                addTableRow(vitalsTable, "Heart Rate:", report.getVitals().getHeartRate() + " bpm");
                addTableRow(vitalsTable, "Blood Pressure:", 
                    report.getVitals().getBloodPressureSystolic() + "/" + 
                    report.getVitals().getBloodPressureDiastolic() + " mmHg");
                addTableRow(vitalsTable, "Respiratory Rate:", report.getVitals().getRespiratoryRate() + " breaths/min");
                addTableRow(vitalsTable, "Oxygen Saturation:", report.getVitals().getOxygenSaturation() + " %");
                document.add(vitalsTable);
                document.add(new Paragraph("\n"));
            }

            // Biometrics Section
            if (report.getBiometrics() != null) {
                addSectionHeader(document, "BIOMETRICS");
                Table biometricsTable = createTable(2);
                addTableRow(biometricsTable, "Weight:", report.getBiometrics().getMass() + " kg");
                addTableRow(biometricsTable, "Height:", report.getBiometrics().getHeight() + " cm");
                addTableRow(biometricsTable, "Waist Circumference:", report.getBiometrics().getWaistCircumference() + " cm");
                addTableRow(biometricsTable, "BMI:", String.format("%.1f (%s)", report.getBmi(), report.getBmiCategory()));
                document.add(biometricsTable);
                document.add(new Paragraph("\n"));
            }

            // Diagnosis Section
            if (report.getDiagnosis() != null && !report.getDiagnosis().isEmpty()) {
                addSectionHeader(document, "DIAGNOSIS");
                for (DiagnosisDTO diagnosis : report.getDiagnosis()) {
                    document.add(new Paragraph("• " + diagnosis.getDiagnosed()).setBold());
                    if (diagnosis.getSymptoms() != null) {
                        document.add(new Paragraph("  Symptoms: " + diagnosis.getSymptoms()));
                    }
                    if (diagnosis.getTreatment() != null) {
                        document.add(new Paragraph("  Treatment: " + diagnosis.getTreatment()));
                    }
                    document.add(new Paragraph(""));
                }
            }

            // Medications Section
            if (report.getDosage() != null && !report.getDosage().isEmpty()) {
                addSectionHeader(document, "MEDICATIONS");
                for (DosageDTO dosage : report.getDosage()) {
                    document.add(new Paragraph("• " + dosage.getDrugName() + " - " + dosage.getAmount()).setBold());
                    if (dosage.getPrescription() != null) {
                        document.add(new Paragraph("  Prescription: " + dosage.getPrescription()));
                    }
                    if (dosage.getCaution() != null) {
                        document.add(new Paragraph("  Caution: " + dosage.getCaution()));
                    }
                    document.add(new Paragraph(""));
                }
            }

            // Status Section
            addSectionHeader(document, "STATUS");
            if (report.isHasCriticalVitals()) {
                document.add(new Paragraph("⚠️ CRITICAL: Patient has critical vitals that require immediate attention")
                    .setBold());
            } else {
                document.add(new Paragraph("✅ Stable: All vitals are within normal ranges"));
            }

            document.close();
            return baos.toByteArray();

        } catch (Exception e) {
            throw new RuntimeException("Failed to generate PDF report", e);
        }
    }

    private void addSectionHeader(Document document, String title) {
        document.add(new Paragraph(title)
            .setBold()
            .setFontSize(14)
            .setMarginBottom(10f));
    }

    private Table createTable(int numColumns) {
        Table table = new Table(numColumns);
        table.setWidth(UnitValue.createPercentValue(100));
        return table;
    }

    private void addTableRow(Table table, String label, String value) {
        table.addCell(new Cell().add(new Paragraph(label).setBold()));
        table.addCell(new Cell().add(new Paragraph(value != null ? value : "N/A")));
    }
}