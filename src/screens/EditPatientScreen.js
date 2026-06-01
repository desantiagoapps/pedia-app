import React, { useState, useCallback } from "react";
import { View, TextInput, Text, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator, Alert } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { getPatientById, updatePatient } from "../data/store";

export default function EditPatientScreen({ route, navigation }) {
  const { patientId } = route.params;
  const [loading, setLoading] = useState(true);

  // Estados
  const [pseudonimo, setPseudonimo] = useState("");
  const [cama, setCama] = useState("");
  const [servicio, setServicio] = useState("Pediatría General");
  const [estado, setEstado] = useState("Activo");
  const [diagnostico, setDiagnostico] = useState("");
  const [antecedentes, setAntecedentes] = useState("");
  const [padecimientoActual, setPadecimientoActual] = useState("");
  const [tratamientoActual, setTratamientoActual] = useState("");
  const [laboratorios, setLaboratorios] = useState("");
  const [estudiosImagen, setEstudiosImagen] = useState("");
  const [pendientes, setPendientes] = useState("");

  useFocusEffect(
    useCallback(() => {
      const cargarDatos = async () => {
        setLoading(true);
        // 🚨 AGREGA ESTO:
      console.log("🧐 BUSCANDO EN FIREBASE EL ID:", patientId);
        try {
          const p = await getPatientById(patientId);
          if (p) {
            // Llenamos los estados con los datos de Firebase
            setPseudonimo(p.pseudonimo || "");
            setCama(p.cama || "");
            setServicio(p.servicio || "Pediatría General");
            setEstado(p.estado || "Activo");
            setDiagnostico(p.diagnostico || "");
            setAntecedentes(p.antecedentes || "");
            setPadecimientoActual(p.padecimientoActual || "");
            setTratamientoActual(p.tratamientoActual || "");
            setLaboratorios(p.laboratorios || "");
            setEstudiosImagen(p.estudiosImagen || "");
            setPendientes(p.pendientes || "");
          }
        } catch (error) {
          console.error("Error al cargar:", error);
        } finally {
          setLoading(false);
        }
      };
      cargarDatos();
    }, [patientId])
  );

  const handleGuardar = async () => {
    try {
      await updatePatient(patientId, {
        pseudonimo, cama, servicio, estado, diagnostico,
        antecedentes, padecimientoActual, tratamientoActual,
        laboratorios, estudiosImagen, pendientes
      });
      Alert.alert("✅ Éxito", "Paciente actualizado correctamente");
      navigation.goBack();
    } catch (error) {
      Alert.alert("Error", "No se pudo actualizar el paciente");
    }
  };

  if (loading) return <ActivityIndicator size="large" style={{ marginTop: 50 }} />;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      <Text style={styles.title}>✏️ Editando: {pseudonimo}</Text>

      <View style={styles.formCard}>
        <Text style={styles.label}>Pseudónimo *</Text>
        <TextInput style={styles.input} value={pseudonimo} onChangeText={setPseudonimo} />

        <View style={styles.row}>
          <View style={{ flex: 1, marginRight: 10 }}>
            <Text style={styles.label}>Cama *</Text>
            <TextInput style={styles.input} value={cama} onChangeText={setCama} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.label}>Servicio</Text>
            <select value={servicio} onChange={(e) => setServicio(e.target.value)} style={styles.webSelect}>
              <option value="Pediatría General">Pediatría General</option>
              <option value="UTIP (Terapia Intensiva)">UTIP</option>
              <option value="Urgencias Pediátricas">Urgencias</option>
              <option value="Neonatología">Neonatología</option>
            </select>
          </View>
        </View>

        <Text style={styles.label}>Estado Actual</Text>
        <select value={estado} onChange={(e) => setEstado(e.target.value)} style={styles.webSelect}>
          <option value="Activo">🟢 Activo</option>
          <option value="Prealta">🟡 Prealta</option>
          <option value="Alta">🔴 Alta</option>
          <option value="Traslado">🔵 Traslado</option>
        </select>
      </View>

      <View style={styles.formCard}>
        <Text style={styles.label}>Diagnósticos *</Text>
        <TextInput style={styles.input} value={diagnostico} onChangeText={setDiagnostico} />
        <Text style={styles.label}>Antecedentes</Text>
        <TextInput style={styles.textArea} value={antecedentes} onChangeText={setAntecedentes} multiline />
        <Text style={styles.label}>Padecimiento Actual</Text>
        <TextInput style={styles.textArea} value={padecimientoActual} onChangeText={setPadecimientoActual} multiline />
        <Text style={styles.label}>Tratamiento</Text>
        <TextInput style={styles.textArea} value={tratamientoActual} onChangeText={setTratamientoActual} multiline />
      </View>

      <View style={styles.formCard}>
        <Text style={styles.label}>Laboratorios</Text>
        <TextInput style={styles.textArea} value={laboratorios} onChangeText={setLaboratorios} multiline />
        <Text style={styles.label}>Estudios de Imagen</Text>
        <TextInput style={styles.textArea} value={estudiosImagen} onChangeText={setEstudiosImagen} multiline />
        <Text style={styles.label}>Pendientes</Text>
        <TextInput style={styles.textArea} value={pendientes} onChangeText={setPendientes} multiline />
      </View>

      <TouchableOpacity style={styles.button} onPress={handleGuardar}>
        <Text style={styles.buttonText}>💾 Guardar Cambios</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8F9FA" },
  scrollContent: { padding: 20, paddingBottom: 60 },
  title: { fontSize: 20, fontWeight: "bold", marginBottom: 20 },
  formCard: { backgroundColor: "#FFF", padding: 20, borderRadius: 15, marginBottom: 20, borderWidth: 1, borderColor: "#EAEAEA" },
  label: { fontSize: 14, fontWeight: "600", color: "#555", marginTop: 5 },
  input: { borderWidth: 1, borderColor: "#E0E0E0", padding: 12, borderRadius: 10, backgroundColor: "#FCFCFC", marginTop: 5 },
  textArea: { borderWidth: 1, borderColor: "#E0E0E0", padding: 12, borderRadius: 10, backgroundColor: "#FCFCFC", marginTop: 5, minHeight: 70 },
  webSelect: { height: 45, borderWidth: 1, borderColor: "#E0E0E0", borderRadius: 10, backgroundColor: "#FCFCFC", marginTop: 5 },
  button: { backgroundColor: "#1976D2", padding: 16, borderRadius: 12, marginTop: 10 },
  buttonText: { color: "#FFF", textAlign: "center", fontWeight: "bold" },
  row: { flexDirection: "row", justifyContent: "space-between" }
});