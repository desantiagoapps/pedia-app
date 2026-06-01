import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { getPatients } from "../data/store";

export default function PatientsScreen({ navigation }) {
  const [patients, setPatients] = useState([]);

  useFocusEffect(
    useCallback(() => {
      const cargarDatos = async () => {
        try {
          const lista = await getPatients();

          console.log("PACIENTES CARGADOS:");
          console.log(lista);

          setPatients(lista);
        } catch (error) {
          console.error(error);
        }
      };

      cargarDatos();
    }, [])
  );

  return (
    <View style={styles.container}>
      {/* BOTÓN NUEVO PACIENTE */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("AddPatient")}
      >
        <Text style={styles.buttonText}>
          ➕ Nuevo Paciente
        </Text>
      </TouchableOpacity>

      <FlatList
        data={patients}
        keyExtractor={(item) => item.firestoreId}
        ListEmptyComponent={
          <Text style={styles.empty}>
            No hay pacientes registrados en la nube
          </Text>
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => {
              console.log("FIRESTORE ID:");
              console.log(item.firestoreId);

              navigation.navigate("PatientDetail", {
                patientId: item.firestoreId
              });
            }}
          >
            <View style={styles.cardHeader}>
              <Text style={styles.name}>
                {item.pseudonimo || "Sin nombre"}
              </Text>

              <View style={styles.bedBadge}>
                <Text style={styles.bedBadgeText}>
                  🛏️ Cama {item.cama || "N/A"}
                </Text>
              </View>
            </View>

            <Text style={styles.ageText}>
              Edad:{" "}
              <Text style={styles.boldText}>
                {item.edad || "No registrada"}
              </Text>
            </Text>

            <View style={styles.dxContainer}>
              <Text style={styles.dxLabel}>
                Dx:
              </Text>

              <Text
                style={styles.dxText}
                numberOfLines={2}
              >
                {item.diagnostico ||
                  "Sin diagnóstico registrado"}
              </Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: "#F4F6F8"
  },

  button: {
    backgroundColor: "#1976D2",
    padding: 15,
    borderRadius: 12,
    marginBottom: 15
  },

  buttonText: {
    color: "#FFF",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 16
  },

  card: {
    backgroundColor: "#FFF",
    padding: 16,
    marginBottom: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E0E6ED"
  },

  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8
  },

  name: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2C3E50",
    flex: 1,
    marginRight: 10
  },

  bedBadge: {
    backgroundColor: "#E3F2FD",
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#90CAF9"
  },

  bedBadgeText: {
    color: "#1565C0",
    fontWeight: "bold",
    fontSize: 13
  },

  ageText: {
    fontSize: 14,
    color: "#555",
    marginBottom: 6
  },

  boldText: {
    fontWeight: "600",
    color: "#333"
  },

  dxContainer: {
    flexDirection: "row",
    marginTop: 4
  },

  dxLabel: {
    fontWeight: "bold",
    color: "#1976D2",
    marginRight: 5,
    fontSize: 14
  },

  dxText: {
    color: "#555",
    fontSize: 14,
    flex: 1
  },

  empty: {
    textAlign: "center",
    marginTop: 30,
    color: "#7F8C8D",
    fontStyle: "italic",
    fontSize: 15
  }
});