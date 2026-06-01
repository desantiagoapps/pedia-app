import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  where,
  doc,
  deleteDoc,
  getDoc,
  updateDoc,
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAUumS5dL7BHnMfrVIxIJx-WKu4-L6dxko",
  authDomain: "pedia-app-c8ef9.firebaseapp.com",
  projectId: "pedia-app-c8ef9",
  storageBucket: "pedia-app-c8ef9.firebasestorage.app",
  messagingSenderId: "406041678954",
  appId: "1:406041678954:web:1901f5f38fc6d5927d6613"
};

// Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

//
// ===============================
// PACIENTES
// ===============================
//

// Obtener todos los pacientes
export const getPatients = async () => {
  const q = query(
    collection(db, "patients"),
    orderBy("fechaIngreso", "desc")
  );

  const snapshot = await getDocs(q);

  const pacientes = snapshot.docs.map((documento) => ({
    firestoreId: documento.id,
    ...documento.data()
  }));

  console.log("PACIENTES FIREBASE:");
  console.log(pacientes);

  return pacientes;
};

/// Versión optimizada (más rápida y profesional)
export const getPatientById = async (idBuscado) => {
  try {
    const docRef = doc(db, "patients", idBuscado);
    const snap = await getDoc(docRef);

    if (snap.exists()) {
      return { firestoreId: snap.id, ...snap.data() };
    } else {
      console.log("No se encontró el documento con ID:", idBuscado);
      return null;
    }
  } catch (error) {
    console.error("Error al obtener paciente:", error);
    return null;
  }
};
// Agregar paciente
// En tu store.js
export const addPatient = async (data) => {
  // Ya no incluyas { id: Date.now()... } aquí
  return await addDoc(collection(db, "patients"), {
    ...data, // Asegúrate de que 'data' no traiga un ID manual
    fechaIngreso: new Date().toISOString()
  });
};

//
// ===============================
// EVOLUCIONES
// ===============================

///ELIMINAR PASCIENTE//////////
//
export const deletePatient = async (patientId) => {
  try {
    await deleteDoc(doc(db, "patients", patientId));

    console.log("PACIENTE ELIMINADO");
  } catch (error) {
    console.error("ERROR ELIMINANDO PACIENTE");
    console.error(error);
    throw error;
  }
};
/// modificar

// Función para actualizar paciente
export const updatePatient = async (patientId, data) => {
  try {
    const docRef = doc(db, "patients", patientId);
    await updateDoc(docRef, data);
    console.log("PACIENTE ACTUALIZADO CORRECTAMENTE");
  } catch (error) {
    console.error("ERROR ACTUALIZANDO PACIENTE:", error);
    throw error;
  }
};
////
// Obtener evoluciones
export const getUpdatesByPatient = async (patientId) => {
  try {
    const q = query(
      collection(db, "updates"),
      where("patientId", "==", patientId)
    );

    const snapshot = await getDocs(q);

    return snapshot.docs.map((documento) => ({
      id: documento.id,
      ...documento.data()
    }));
  } catch (error) {
    console.error("ERROR getUpdatesByPatient");
    console.error(error);
    return [];
  }
};

// Agregar evolución
export const addUpdate = async (update) => {
  try {
    console.log("=================================");
    console.log("INTENTANDO GUARDAR UPDATE");
    console.log(update);

    const docRef = await addDoc(
      collection(db, "updates"),
      {
        ...update,
        fecha: new Date().toISOString()
      }
    );

    console.log("GUARDADO CORRECTAMENTE");
    console.log(docRef.id);

    return docRef;
  } catch (error) {
    console.error("ERROR FIREBASE");
    console.error(error);
    throw error;
  }
};