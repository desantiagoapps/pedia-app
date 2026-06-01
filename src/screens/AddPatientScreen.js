import React, { useState } from "react";
import { View, TextInput, Text, TouchableOpacity, StyleSheet, ScrollView, Alert } from "react-native";
import { addPatient } from "../data/store";

export default function AddPatientScreen({ navigation }) {
  const [pseudonimo, setPseudonimo] = useState("");
  const [cama, setCama] = useState("");
  const [servicio, setServicio] = useState("Pediatría General");
  const [estado, setEstado] = useState("Activo");
  const [diagnostico, setDiagnostico] = useState("");
  
  // Fechas
  const [dia, setDia] = useState("");
  const [mes, setMes] = useState("");
  const [anio, setAnio] = useState("");

  const [antecedentes, setAntecedentes] = useState("");
  const [padecimientoActual, setPadecimientoActual] = useState("");
  const [tratamientoActual, setTratamientoActual] = useState("");
  const [laboratorios, setLaboratorios] = useState("");
  const [estudiosImagen, setEstudiosImagen] = useState("");
  const [pendientes, setPendientes] = useState("");

  const guardar = async () => {
    if (!pseudonimo || !cama || !dia || !mes || !anio || !diagnostico) {
      Alert.alert("⚠️ Error", "Por favor llena los campos obligatorios (*)");
      return;
    }

    try {
      // ENVIAMOS LOS DATOS SIN EL "ID" MANUAL. 
      // Firebase creará el ID único automáticamente al guardar.
      await addPatient({
        pseudonimo,
        cama,
        servicio,
        estado,
        fechaNacimiento: `${anio}-${mes}-${dia}`,
        diagnostico,
        antecedentes: antecedentes || "Sin antecedentes.",
        padecimientoActual: padecimientoActual || "Sin registrar.",
        tratamientoActual: tratamientoActual || "Sin registrar.",
        laboratorios: laboratorios || "Sin reportar.",
        estudiosImagen: estudiosImagen || "Sin reportar.",
        pendientes: pendientes || "Ninguno.",
      });

      Alert.alert("✅ Éxito", "Paciente registrado correctamente");
      navigation.goBack(); // O navigation.navigate("Patients")
    } catch (error) {
      Alert.alert("Error", "No se pudo guardar en la base de datos");
      console.error(error);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      <Text style={styles.title}>👶 Nuevo Ingreso</Text>

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
              <option value="UTIP">UTIP</option>
              <option value="Urgencias">Urgencias</option>
            </select>
          </View>
        </View>

        <Text style={styles.label}>Fecha de Nacimiento *</Text>
        <View style={styles.row}>
          <TextInput style={[styles.input, {flex: 1}]} placeholder="Día" keyboardType="numeric" value={dia} onChangeText={setDia} />
          <TextInput style={[styles.input, {flex: 1, marginHorizontal: 5}]} placeholder="Mes" keyboardType="numeric" value={mes} onChangeText={setMes} />
          <TextInput style={[styles.input, {flex: 1}]} placeholder="Año" keyboardType="numeric" value={anio} onChangeText={setAnio} />
        </View>
      </View>

      <View style={styles.formCard}>
        <Text style={styles.label}>Diagnóstico *</Text>
        <TextInput style={styles.input} value={diagnostico} onChangeText={setDiagnostico} />
        
        <Text style={styles.label}>Antecedentes</Text>
        <TextInput style={styles.textArea} value={antecedentes} onChangeText={setAntecedentes} multiline />
        
        <Text style={styles.label}>Padecimiento Actual</Text>
        <TextInput style={styles.textArea} value={padecimientoActual} onChangeText={setPadecimientoActual} multiline />
      </View>

      <TouchableOpacity style={styles.button} onPress={guardar}>
        <Text style={styles.buttonText}>💾 Guardar Paciente</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8F9FA" },
  scrollContent: { padding: 20 },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 20 },
  formCard: { backgroundColor: "#FFF", padding: 20, borderRadius: 15, marginBottom: 20, borderWidth: 1, borderColor: "#EAEAEA" },
  label: { fontSize: 14, fontWeight: "600", color: "#555", marginTop: 5 },
  input: { borderWidth: 1, borderColor: "#E0E0E0", padding: 12, borderRadius: 10, backgroundColor: "#FCFCFC", marginTop: 5 },
  textArea: { borderWidth: 1, borderColor: "#E0E0E0", padding: 12, borderRadius: 10, backgroundColor: "#FCFCFC", marginTop: 5, minHeight: 80 },
  webSelect: { height: 45, borderWidth: 1, borderColor: "#E0E0E0", borderRadius: 10, backgroundColor: "#FCFCFC", marginTop: 5 },
  button: { backgroundColor: "#1976D2", padding: 16, borderRadius: 12, marginBottom: 40 },
  buttonText: { color: "#FFF", textAlign: "center", fontWeight: "bold" },
  row: { flexDirection: "row", justifyContent: "space-between" }
});