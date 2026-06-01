import React from "react";
import { LogBox, View } from "react-native"; 
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import PatientsScreen from "./src/screens/PatientsScreen";
import AddPatientScreen from "./src/screens/AddPatientScreen";
import PatientDetailScreen from "./src/screens/PatientDetailScreen";
import AddUpdateScreen from "./src/screens/AddUpdateScreen"; 
// 🚨 IMPORTAMOS LA PANTALLA DE EDICIÓN
import EditPatientScreen from "./src/screens/EditPatientScreen"; 

LogBox.ignoreLogs(['props.pointerEvents is deprecated']);

const Stack = createStackNavigator();

export default function App() {
  return (
    <View style={{ flex: 1, backgroundColor: "#F4F6F8" }}>
      <NavigationContainer>
        <Stack.Navigator 
          initialRouteName="Patients"
          screenOptions={{
            cardStyle: { backgroundColor: "#F4F6F8" }
          }}
        >
          <Stack.Screen
            name="Patients"
            component={PatientsScreen}
            options={{ title: "Pacientes" }}
          />

          <Stack.Screen
            name="AddPatient"
            component={AddPatientScreen}
            options={{ title: "Nuevo Paciente" }}
          />

          <Stack.Screen
            name="PatientDetail"
            component={PatientDetailScreen}
            options={{ title: "Expediente" }}
          />

          <Stack.Screen
            name="AddUpdate"
            component={AddUpdateScreen}
            options={{ title: "Nueva Evolución" }}
          />

          {/* 🚨 REGISTRAMOS LA PANTALLA DE EDICIÓN */}
          <Stack.Screen
            name="EditPatient"
            component={EditPatientScreen}
            options={{ title: "Editar Paciente" }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </View>
  );
}