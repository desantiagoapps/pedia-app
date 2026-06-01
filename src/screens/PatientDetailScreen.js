import React, { useState, useCallback } from "react";
import { 
  ScrollView, Text, StyleSheet, TouchableOpacity, View, 
  ActivityIndicator, Alert 
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { getPatientById, getUpdatesByPatient, deletePatient } from "../data/store";
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";
import { Linking } from "react-native";
import { Platform } from "react-native";
export default function PatientDetailScreen({ route, navigation }) {
  const { patientId } = route.params;
  const [patient, setPatient] = useState(null);
  const [updates, setUpdates] = useState([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      const load = async () => {
        setLoading(true);
        try {
          const p = await getPatientById(patientId);
          const u = await getUpdatesByPatient(patientId);
          setPatient(p);
          setUpdates(u);
        } catch (error) {
          console.error("Error cargando:", error);
        } finally {
          setLoading(false);
        }
      };
      load();
    }, [patientId])
  );

const generarPDF = async () => {
  try {
    if (!patient) return;

    const hoy = new Date().toLocaleString("es-MX");
    const folio = `EXP-${Date.now()}`;

    const html = `
      <html>
        <head>
          <meta charset="utf-8" />
        </head>

        <body style="font-family: Arial; padding: 20px; color:#000;">

          <!-- ENCABEZADO -->
          <div style="text-align:center; margin-bottom:20px;">
            <h1 style="margin:0;">🏥 EXPEDIENTE CLÍNICO</h1>
            <p style="margin:5px 0;"><b>Folio:</b> ${folio}</p>
            <p style="margin:5px 0;"><b>Fecha de impresión:</b> ${hoy}</p>
          </div>

          <hr/>

          <!-- DATOS PACIENTE -->
          <h3 style="border-bottom:1px solid #000; padding-bottom:5px;">
            DATOS DEL PACIENTE
          </h3>

          <div style="padding:10px; border:1px solid #000; border-radius:6px;">
            <p><b>Paciente:</b> ${patient.pseudonimo || ""}</p>
            <p><b>Cama:</b> ${patient.cama || ""}</p>
            <p><b>Diagnóstico:</b> ${patient.diagnostico || ""}</p>
            <p><b>Antecedentes:</b> ${patient.antecedentes || ""}</p>
            <p><b>Padecimiento:</b> ${patient.padecimientoActual || ""}</p>
            <p><b>Tratamiento:</b> ${patient.tratamientoActual || ""}</p>
          </div>

          <!-- EVOLUCIONES -->
          <h3 style="margin-top:20px; border-bottom:1px solid #000; padding-bottom:5px;">
            EVOLUCIONES MÉDICAS
          </h3>

          ${
            updates && updates.length > 0
              ? updates
                  .map(
                    (u) => `
                      <div style="margin-bottom:12px; border-bottom:1px dashed #ccc; padding-bottom:8px;">
                        <p style="margin:0;"><b>👨‍⚕️ ${u.usuario || ""}</b></p>
                        <p style="margin:0; font-size:12px; color:#555;">
                          ${u.fecha ? new Date(u.fecha).toLocaleString("es-MX") : ""}
                        </p>
                        <p style="margin:5px 0;">${u.nota || ""}</p>
                      </div>
                    `
                  )
                  .join("")
              : "<p>Sin evoluciones registradas</p>"
          }

          <hr/>

          <p style="text-align:center; font-size:10px; color:#666;">
            Sistema Pediátrico Digital - Documento generado automáticamente
          </p>

        </body>
      </html>
    `;

    const { uri } = await Print.printToFileAsync({ html });

    await Sharing.shareAsync(uri);

  } catch (error) {
    console.log("PDF ERROR:", error);
    alert("Error al generar PDF");
  }
};
  const compartirWhatsApp = () => {
    const texto = `📋 EXPEDIENTE: ${patient.pseudonimo}\nDx: ${patient.diagnostico}\n\nEvoluciones:\n${updates.map(u => `- ${u.nota}`).join("\n")}`;
    Linking.openURL(`https://wa.me/?text=${encodeURIComponent(texto)}`);
  };

  if (loading) return <ActivityIndicator size="large" style={{ marginTop: 50 }} />;
  if (!patient) return <View style={{ padding: 20 }}><Text>Paciente no encontrado</Text></View>;

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 50 }}>
      <Text style={styles.title}>{patient.pseudonimo}</Text>
      <Text style={styles.subtitle}>Cama: {patient.cama}</Text>

      <View style={styles.card}>
        <Text>📋 Dx: {patient.diagnostico}</Text>
        <Text>🧬 Antecedentes: {patient.antecedentes}</Text>
        <Text>🤒 Padecimiento: {patient.padecimientoActual}</Text>
        <Text>💊 Tratamiento: {patient.tratamientoActual}</Text>
      </View>

      <Text style={styles.sectionTitle}>📄 Evoluciones</Text>
      {updates.map((u) => (
        <View key={u.id} style={styles.updateCard}>
          <Text style={{ fontWeight: "bold" }}>👨‍⚕️ {u.usuario}</Text>
          <Text>{new Date(u.fecha).toLocaleString()}</Text>
          <Text>{u.nota}</Text>
        </View>
      ))}

      {/* --- BOTONES --- */}
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("AddUpdate", { patientId })}>
        <Text style={styles.buttonText}>➕ Agregar Evolución</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.button, { backgroundColor: "#25D366" }]} onPress={compartirWhatsApp}>
        <Text style={styles.buttonText}>📲 WhatsApp</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={[styles.button, { backgroundColor: "#FFA000" }]} 
        onPress={() => navigation.navigate("EditPatient", { patientId })}
      >
        <Text style={styles.buttonText}>✏️ Modificar Datos</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.button, { backgroundColor: "#1976D2" }]} onPress={generarPDF}>
        <Text style={styles.buttonText}>🖨 Generar PDF</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.deleteButton} onPress={() => deletePatient(patientId).then(() => navigation.goBack())}>
        <Text style={styles.buttonText}>🗑 Eliminar Paciente</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 15, backgroundColor: "#F8F9FA" },
  title: { fontSize: 24, fontWeight: "bold" },
  subtitle: { fontSize: 18, color: "#666" },
  card: { backgroundColor: "#FFF", padding: 15, borderRadius: 10, marginVertical: 10 },
  sectionTitle: { fontSize: 20, fontWeight: "bold" },
  updateCard: { backgroundColor: "#E3F2FD", padding: 10, borderRadius: 8, marginVertical: 5 },
  button: { padding: 15, borderRadius: 10, marginTop: 10, alignItems: "center", backgroundColor: "#34495E" },
  deleteButton: { padding: 15, borderRadius: 10, marginTop: 10, backgroundColor: "#D32F2F", alignItems: "center" },
  buttonText: { color: "white", fontWeight: "bold" }
});