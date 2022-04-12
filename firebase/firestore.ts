import {
  DocumentSnapshot,
  DocumentReference,
  DocumentData,
  getFirestore,
} from "firebase-admin/firestore";
//current service for firebase
import firebaseApp from ".";
import { Room } from "../models";

//get or initialize the fireStore service
const db = firebaseApp.FireStore;

/**
 * @param {string }path Name of the collection
 * @returns The collection
 */

//
export const getRef = (path: string) => {
  return db.collection(path);
};

/**
 * @param {string} path Name of the collection
 * @param {string} id  Name of the document
 * @returns The data of the document if exists or undefined
 */
export const getDoc = (path: string, id: string) => {
  return db
    .collection(path)
    .doc(id)
    .get()
    .then((snapShot) => {
      return snapShot.data();
    })
    .catch((err) => {
      console.log(err);
      return undefined;
    });
};

/**
 * @param {string} path Name of the collection
 * @param {string} id Name of a document
 * @returns All documents inside the collection provided. if a id is set, returns a subcollection inside the document
 */
export const getAllDocs = async (path: string,id?: string): Promise<DocumentData[] | undefined> => {
  try {
    if (id) {
        const data = await new Promise<DocumentData[]>((resolve,reject) => {
            let results: DocumentData[] = [];
            db.collection(path)
            .doc(id)
            .listCollections()
            .then((subCollections) => {
              if(subCollections.length > 0)
              {
                subCollections.forEach((subCollection) => {
                    subCollection
                        .get()
                        .then((array) => {
                            array.docs.forEach((doc) => {
                                results.push(doc.data())
                            });
                            resolve(results);
                        })
                });
              }else{
                reject(`No documents inside the subcollection ${path}/${id}`)
              }
            })
        })
        .catch((err) => {
            console.error(err);
            return undefined
        })
        
        return data;
    } else {
      let results:DocumentData[] = [];
      const data = await new Promise<DocumentData>((resolve,reject) => {
        db.collection(path).listDocuments()
        .then((querySnapShot) => {
            querySnapShot.map((docRef) => {
                docRef.get()
                .then((doc) =>{
                    resolve(doc.data()!)
                }).catch((err) => {
                    reject(err)
                })
            })
        }).catch((err) => {
            reject(err)
        })
      })
      results.push(data)
    //   (await db.collection(path).listDocuments()).map((docRef) => {
    //    docRef.get()
    //       .then((docData) => {
    //           console.log('data', docData.data())
    //           results.push(docData.data()!)
    //       }).catch((err) => {
    //           console.error(err)
    //       })
    //     })
    //     console.log('results', results)
        return results;
    }
  } catch (error) {
    return undefined;
  }
};

export const uploadDoc = async (
  path: string,
  data: any,
  documentId?: string
) => {
  try {
    let document: DocumentData | undefined;
    if (documentId) {
      const ref :DocumentReference = db.collection(path).doc(documentId);
      ref.set(data);
      document = ref.get().then((snapShot) => snapShot.data())
    } else {
      const ref = db.collection(path).doc();
      ref.set(data);
      document = ref.get().then((snapShot) => snapShot.data())
    }
    return document;
  } catch (error) {
    console.log("upload failed - ", error);
    return null;
  }
};

export const roomConverter = {
  toFirestore: (room:Room) => {
      return {
          name: room.name,
          messages:room.messages
          };
  },
  fromFirestore: (snapshot:DocumentSnapshot<FirebaseFirestore.DocumentData>) => {
      const data = snapshot.data() as Room;
      return data;
  }
};

export default db;
