import { collection, addDoc, doc, updateDoc, getDoc, getDocs, deleteDoc } from "firebase/firestore";
import { db } from "../firebase/firebase";

export const addData = async (collectionName: string, dataSet: {}) => {
  try {
    const docRef = await addDoc(collection(db, collectionName), dataSet);
    return { status: true, data: docRef };
  } catch (error) {
    console.log(error);

    return { status: false, data: {} };
  }
};

export const updateData = async (collectionName: string, docId: string, dataSet: {}) => {
  const ref = doc(db, collectionName, docId);

  try {
    await updateDoc(ref, dataSet);
    return { status: true };
  } catch (error) {
    return { status: false };
  }
};

export const getData = async (collectionName: string, docId: string) => {
  const docRef = doc(db, collectionName, docId);
  try {
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return { status: false, data: docSnap.data() };
    } else {
      return { status: false, data: {} };
    }
  } catch (error) {
    return { status: false, data: {} };
  }
};

export const getAllData = async (collectionName: string) => {
  try {
    const docData: any[] = [];
    const querySnapshot = await getDocs(collection(db, collectionName));
    querySnapshot.forEach((doc) => {
      docData.push({ id: doc.id, ...doc.data() });
    });
    return { status: true, data: docData };
  } catch (error) {
    return { status: false, data: [] };
  }
};

export const deleteData = async (collectionName: string, docId: string) => {
  try {
    await deleteDoc(doc(db, collectionName, docId));
    return { status: true };
  } catch (error) {
    return { status: false };
  }
};
