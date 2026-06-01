import React, { useState } from "react";
import { View, TextInput, TouchableOpacity, Text, StyleSheet, Alert } from "react-native";
import { addUpdate } from "../data/store";

export default function AddUpdateScreen({ route, navigation }) {
  const { patientId } = route.params;

  const [usuario, setUsuario] = useState("");
  const [nota, setNota] = useState("");
  const [guardando, setGuardando] = useState(false); // Estado para evitar doble clic

  const guardarNota = async () => { // 🚨 CAMBIO: Agregamos async
    if (!usuario.trim() || !nota.trim()) {
      Alert.alert("⚠️ Error", "Por favor ingresa el nombre del usuario y la nota médica.");
      return;
    }

    setGuardando(true);

    const nueva = {
      patientId,
      usuario,
      nota,
    };

    try {
      // 🚨 CAMBIO: Esperamos a que Firebase confirme el guardado
      await addUpdate(nueva);
      
      Alert.alert("✅ Éxito", "Nota guardada correctamente");
      
      // Regresamos al detalle (el useFocusEffect de esa pantalla recargará los datos automáticamente)
      navigation.goBack(); 
    } catch (error) {
      console.error(error);
      Alert.alert("❌ Error", "No se pudo guardar la nota.");
    } finally {
      setGuardando(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📝 Nueva Evolución Médica</Text>
      
      <View style={styles.card}>
        <Text style={styles.label}>Médico / Usuario</Text>
        <TextInput 
          style={styles.input}
          placeholder="Ej. Dr. Navarro, Enfermera" 
          value={usuario}
          onChangeText={setUsuario} 
        />

        <Text style={styles.label}>Nota de Evolución</Text>
        <TextInput 
          style={styles.textArea}
          placeholder="Escribe la evolución del paciente..." 
          value={nota}
          onChangeText={setNota} 
          multiline={true}
        />

        <TouchableOpacity 
          style={[styles.button, guardando && { opacity: 0.6 }]} 
          onPress={guardarNota}
          disabled={guardando}
        >
          <Text style={styles.buttonText}>
            {guardando ? "Guardando..." : "💾 Guardar Nota"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.cancelButton} 
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.cancelButtonText}>Cancelar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// Los estilos se mantienen igual a los que tenías
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8F9FA", padding: 20 },
  title: { fontSize: 20, fontWeight: "bold", color: "#2C3E50", marginBottom: 20 },
  card: { backgroundColor: "#FFF", padding: 20, borderRadius: 15, borderWidth: 1, borderColor: "#EAEAEA" },
  label: { fontSize: 14, fontWeight: "600", color: "#555", marginBottom: 6 },
  input: { borderWidth: 1, borderColor: "#E0E0E0", padding: 12, borderRadius: 10, marginBottom: 20, backgroundColor: "#FCFCFC", fontSize: 15 },
  textArea: { borderWidth: 1, borderColor: "#E0E0E0", padding: 12, borderRadius: 10, marginBottom: 20, backgroundColor: "#FCFCFC", fontSize: 15, height: 120, textAlignVertical: "top" },
  button: { backgroundColor: "#1976D2", padding: 15, borderRadius: 12, alignItems: "center" },
  buttonText: { color: "#FFF", fontWeight: "bold", fontSize: 16 },
  cancelButton: { padding: 12, alignItems: "center", marginTop: 10 },
  cancelButtonText: { color: "#7F8C8D", fontSize: 14, fontWeight: "600" },
});